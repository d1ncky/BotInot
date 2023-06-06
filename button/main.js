module.exports = {
    name: "start",
    async execute(interaction, client, config) {
        let buttons = {
            type: 1,
            components: [
                {
                    type: 2,
                    label: "Магазин",
                    emoji: "🛒",
                    style: 1,
                    custom_id: "shop"
                },
                {
                    type: 2,
                    label: "Профиль",
                    emoji: "👤",
                    style: 1,
                    custom_id: "profile"
                },
                {
                    type: 2,
                    label: "Поддержка",
                    emoji: "🆘",
                    style: 1,
                    custom_id: "help"
                },
                {
                    type: 2,
                    label: "Казино",
                    emoji: "🎰",
                    disabled: config.casino.enable ? false : true,
                    style: 1,
                    custom_id: "casino"
                }
            ]
        };
        if (config.owner == interaction.user.id || config.permissions.find(u => u.userid == interaction.user.id && u.accesslvl > 1)) {
            buttons.components.push(
                {
                    type: 2,
                    label: "Админ панель",
                    emoji: "🤖",
                    style: 1,
                    custom_id: "panel"
                }
            )
        }
        interaction.update({
            files:[],
            embeds: [
                {
                    title: "Меню",
                    description: "Выберите один из пунктов предложеных ниже"
                }
            ],
            components: [buttons]
        });
    }
}