const QiwiBillPaymentsAPI = require('@qiwi/bill-payments-node-js-sdk');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./config.json'));
const qiwiApi = new QiwiBillPaymentsAPI(config.secretkey);
module.exports = {
    name: 'balance_add',
    async execute(interaction, client) {
        let newbalance = parseInt(interaction.message.embeds[0].fields[2].value.replace(/[^+\d]/g, ""));
        let userid = interaction.message.embeds[0].fields[0].value.replace(/[^+\d]/g, "");
        let accounts = JSON.parse(fs.readFileSync('./settings/accounts.json'));
        let acc_i = -1;
        for (let i = 0; i < accounts.length; i++) {
            let account = accounts[i];
            if (account.id == userid) {
                acc_i = i;
                break;
            }
        }
        accounts[acc_i].balance += newbalance;
        fs.writeFileSync('./settings/accounts.json', JSON.stringify(accounts));
        try {
            const u = await client.users.fetch(userid);
            const log = {
                embeds: [{
                    title: "Вам изменили баланс",
                    description: interaction.user.toString() + " выдал вам **"+ newbalance +" RUB**! Теперь у вас **" + accounts[acc_i].balance + " RUB**"
                }]
            }
            await u.send(log);
        } catch {}
        try {
            const seller = await client.users.fetch(config.owner);
            const log = {
                embeds: [{
                    title: "Информация о смене баланса",
                    description: "Сменил: " + interaction.user.toString() + "\nПользователь: **<@!"+ userid +"> | "+ userid +"**\nНовый баланс: **"+ accounts[acc_i].balance +" RUB**\nДействие: **Добавил "+ newbalance +" RUB**"
                }]
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
        interaction.update({
            embeds: [
                {
                    title:"Обновление баланса аккаунта",
                    description: "Пользователю <@!" + userid + "> было **успешно** выдано **"+ newbalance +" RUB**"
                }
            ],
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            label: "Назад",
                            emoji: "🔙",
                            style: 1,
                            custom_id: "panel"
                        }
                    ]
                }
            ]
        });
    }
}
