const { AttachmentBuilder } = require('discord.js');
const fs = require('fs');
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
        interaction.update({
            embeds: [
                {
                    title: "Все балансы пользователей",
                    description: "Файлик с балансами **сгенерирован**! Откройте его ниже!"
                }
            ],
            files:[new AttachmentBuilder('./balances.txt')],
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
        })
    }
}