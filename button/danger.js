module.exports = {
    name: "panel",
    async execute(interaction, client) {
        let buttons = {
            type: 1,
            components: [
                {
                    type: 2,
                    label: "Очистить балансы",
                    emoji: "☠️",
                    style: 1,
                    custom_id: "clear_balances"
                },
                {
                    type: 2,
                    label: "Очистить категории",
                    emoji: "☠️",
                    style: 1,
                    custom_id: "clear_category"
                },
                {
                    type: 2,
                    label: "Очистить транзакции",
                    emoji: "☠️",
                    style: 1,
                    custom_id: "clear_payments"
                }
            ]
        };
        let buttons1 = {
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
                    title: "Опасные функции",
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