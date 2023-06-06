const fs = require("fs");
const config = JSON.parse(fs.readFileSync('./config.json'));
module.exports = {
    name: 'category',
    async execute(interaction, client) {
        await interaction.deferUpdate();
        let getter = interaction.message.embeds[0].image.url.split("https://url.com/").join("");
        const id = getter.split('splesh')[1];
        const cid = getter.split('splesh')[0];
        const count = parseInt(interaction.message.embeds[0].fields[2].value.replace(/[^+\d]/g, ""));
        let s = JSON.parse(fs.readFileSync('./settings/category.json'));
        let c = s[cid];
        let p = c.products;
        let product;
        let pn;
        for (let i = 0; i < p.length; i++) {
            if (p[i].value == id) {
                product = p[i];
                pn = i;
            }
        }
        if (product.instances.length < count) { return interaction.editReply(
            {
                embeds: [
                    {
                        title: "Не возможно купить данный товар",
                        description: "Данного товара **нет в нужном вам количестве**!"
                    }
                ],
                components: []
            }
        ); }
        let accounts = JSON.parse(fs.readFileSync('./settings/accounts.json'));
        let aid = -1;
        for (let i = 0; i < accounts.length; i++) {
            if (accounts[i].id == interaction.user.id) {
                aid = i;
            }
        }
        if (aid == -1) { return interaction.editReply(
            {
                embeds: [
                    {
                        title: "Не возможно купить данный товар",
                        description: "У вас **недостаточно средств**!"
                    }
                ],
                components: []
            }
        ); }
        if (accounts[aid].balance < (product.price * count)) { return interaction.editReply(
            {
                embeds: [
                    {
                        title: "Не возможно купить данный товар",
                        description: "У вас **недостаточно средств**!"
                    }
                ],
                components: []
            }
        ); }
        s = JSON.parse(fs.readFileSync('./settings/category.json'));
        c = s[cid];
        p = c.products;
        product = p[pn];

        let buying = "";
        let o = 0;
        for(let i = 0; i < product.instances.length; i += 0) {
            if (o < count) {
                buying += product.instances[i] + "\n";
                product.instances.splice(i, 1);
                o++;
            } else {
                i++;
            }
        }
        if (!buying || o < count) {
            return interaction.editReply(
                {
                    embeds: [
                        {
                            title: "Системная ошибка",
                            description: "Не удалось купить **данный товар**! Возможно его уже купили, или то количество товара которое **вы запросили закончилось**"
                        }
                    ]
                }
            );
        }
        
        
        interaction.user.send(buying);
        interaction.editReply(
            {
                embeds: [
                    {
                        title: "Спасибо за покупку",
                        description: "Вы успешно купили **данный товар**! Сам товар в течении нескольких секунд **будет отправлен** вам **сообщением ниже**!",
                        image: {
                            url: 'https://url.com/' + cid + 'splesh' + product.value,
                        },
                    }
                ],
                components: [
                    {
                        type: 1,
                        components: [
                            {
                                type: 2,
                                label: "Оставить отзыв",
                                emoji: "🏆",
                                style: 5,
                                url: config.feedbackchannel
                            }
                        ]
                    }
                ]
            }
        );
        accounts[aid].balance -= product.price * count;
        accounts[aid].buyings += 1 * count;
        accounts[aid].spended += product.price * count;
        fs.writeFileSync('./settings/accounts.json', JSON.stringify(accounts));
        s[cid].products[pn] = product;
        fs.writeFileSync("./settings/category.json", JSON.stringify(s));
        let log = {
            embeds: [{
                title: "Информация о покупке",
                description: "\nПользователь: **"+ interaction.user.toString() +" | "+ interaction.user.id +"**\nСумма: **"+ product.price +"**\nТовар: **"+ product.name +"**\nВыдано:\n**"+ buying +"**"
            }]
        }
        if (config.autobuyer.enable) {
            const guild = await client.guilds.cache.get(config.autobuyer.guildid);
            if (guild) {
                const member = await guild.members.cache.get(interaction.user.id);
                if (member) {
                    try {
                        await member.roles.add(config.autobuyer.roleid);
                    } catch (err) {
                        log.embeds[0].footer = {
                            text: "Не удалось выдать роль покупателя пользователю!\nПричина: Недостаточно прав для выдачи роли"
                        };
                    }
                } else {
                    log.embeds[0].footer = {
                        text: "Не удалось выдать роль покупателя пользователю!\nПричина: Пользователь не найден на сервере"
                    };
                }
            } else {
                log.embeds[0].footer = {
                    text: "Не удалось выдать роль покупателя пользователю!\nПричина: Сервер указаный в конфиге не найден"
                };
            }
        }
        try {
            const seller = await client.users.fetch(config.owner);
            
            await seller.send(log);
            const perms = config.permissions;
            perms.forEach(async us => {
                if (us.accesslvl >= 4) {
                    const u = await client.users.fetch(us.userid);
                    u.send(log);
                }
            });
        } catch {}
    }
}