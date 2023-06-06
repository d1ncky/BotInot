const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./config.json'));
module.exports = {
    name: "panel",
    async execute(interaction, client) {
        let buttons = {
            type: 1,
            components: [
                {
                    type: 2,
                    label: "Балансы",
                    emoji: "📄",
                    style: 1,
                    custom_id: "balances"
                },
                {
                    type: 2,
                    label: "Статистика",
                    emoji: "📈",
                    style: 1,
                    custom_id: "stats"
                },
                {
                    type: 2,
                    label: "Изменить",
                    emoji: "🪙",
                    style: 1,
                    custom_id: "changemoney",
                    disabled: config.permissions.find(u => u.userid == interaction.user.id && u.accesslvl >= 3) || interaction.user.id == config.owner ? false : true
                },
                {
                    type: 2,
                    label: "Назад",
                    emoji: "🔙",
                    style: 1,
                    custom_id: "main"
                }
            ]
        };
        let buttons1 = {
            type: 1,
            components: [
                {
                    type: 2,
                    label: "Опасные функции",
                    emoji: "☠️",
                    style: 1,
                    custom_id: "danger",
                    disabled: config.permissions.find(u => u.userid == interaction.user.id && u.accesslvl == 5) || interaction.user.id == config.owner ? false : true
                }
            ]
        };
        interaction.update({
            embeds: [
                {
                    title: "Панель администратора",
                    description: "Нажмите на кнопки ниже чтобы взаймодействовать!"
                }
            ],
            components: [
                buttons,
                buttons1
            ],
            files: []
        })
    }
}