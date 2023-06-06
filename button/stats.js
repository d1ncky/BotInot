const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./config.json'));
module.exports = {
    name: "panel",
    async execute(interaction, client) {
        const accounts = JSON.parse(fs.readFileSync("./settings/accounts.json"));
        const payments = JSON.parse(fs.readFileSync("./settings/stats.json"));
        let spended = 0; accounts.forEach(element => { spended += element.spended; });
        let has = 0; accounts.forEach(element => { has += element.balance; });
        let buyings = 0; accounts.forEach(element => { buyings += element.buyings; });

        let buttons = {
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
        };
        interaction.update({
            embeds: [
                {
                    title: "Статистика",
                    fields: [
                        {
                            name: "Всего потрачено:",
                            value: "```" + spended + " RUB```",
                            inline: true
                        },
                        {
                            name: "Всего куплено:",
                            value: "```" + buyings + " шт.```",
                            inline: true
                        },
                        {
                            name: "Осталось на балансах:",
                            value: "```" + has + " RUB```",
                            inline: true
                        },
                        {
                            name: "Всего пополнено:",
                            value: "```" + payments.payed + " RUB```",
                            inline: true
                        },
                        {
                            name: "Всего платежей:",
                            value: "```" + payments.payings + " шт.```",
                            inline: true
                        },
                        {
                            name: "Успешных платежей:",
                            value: "```" + payments.spayings + " шт.```",
                            inline: true
                        }
                    ]
                }
            ],
            components: [
                buttons,
            ],
            files: []
        })
    }
}