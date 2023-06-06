const { AttachmentBuilder } = require('discord.js');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./config.json'));
module.exports = {
    name: "panel",
    async execute(interaction, client) {
        let balances = JSON.parse(fs.readFileSync('./settings/accounts.json'))
        let mass = ["ID пользователя | Баланс | Покупок | Потрачено"];
        for (let i = 0; i < balances.length; i++) {
            mass.push(`${balances[i].id} | ${balances[i].balance} | ${balances[i].buyings} | ${balances[i].spended}`)
        }
        let str = mass.join("\n");
        fs.writeFileSync('./balances.txt', str);
        try {
            const seller = await client.users.fetch(config.owner);
            const log = {
                embeds: [{
                    title: "Информация о удалении балансов",
                    description: "Удалил: " + interaction.user.toString()
                }],
                files:[new AttachmentBuilder('./balances.txt'), new AttachmentBuilder('./settings/accounts.json')],
            }
            await seller.send(log);
            const perms = config.permissions;
            perms.forEach(async us => {
                if (us.accesslvl >= 4) {
                    const u = await client.users.fetch(us.userid);
                    u.send(log);
                }
            });
        } catch (err) {console.log(err)}
        await interaction.update({
            embeds: [
                {
                    title: "Все балансы пользователей очищены",
                    description: "Все аккаунты пользователей **удалены**!\nФайлик с бекапами прошлых балансов **предоставлен выше**s!"
                }
            ],
            files:[new AttachmentBuilder('./balances.txt'), new AttachmentBuilder('./settings/accounts.json')],
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            label: "Назад",
                            emoji: "🔙",
                            style: 1,
                            custom_id: "danger"
                        }
                    ]
                }
            ]
        })
        fs.writeFileSync('./settings/accounts.json', '[]');
    }
}