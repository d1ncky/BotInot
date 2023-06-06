const fs = require('fs');
module.exports = {
    name: "shop",
    async execute(interaction, client, config) {
        await interaction.deferUpdate();
        let category = JSON.parse(fs.readFileSync('./settings/category.json'));
        let i = 0;
        let selectmenu = [];
        while (i < category.length) {
            let c = category[i];
            if (interaction.user.id == config.owner || config.permissions.find(u => u.userid == interaction.user.id && u.accesslvl >= 4)) {
                selectmenu.push(
                    {
                        label: c.name,
                        value: c.value,
                        description: "Програмное название: " + c.value
                    }
                );
            } else {
                selectmenu.push(
                    {
                        label: c.name,
                        value: c.value
                    }
                )
            }
            i++;
        }
        if (interaction.user.id == config.owner || config.permissions.find(u => u.userid == interaction.user.id && u.accesslvl >= 4)) {
            selectmenu.push(
                {
                    label: "Создать категорию",
                    value: "create_c",
                },
                {
                    label: "Удалить категорию",
                    value: "remove_c",
                }
            );
        }
        interaction.editReply({
            embeds: [
                {
                    title: "Покупка",
                    description: "Выберите категорию товаров ниже"
                }
            ],
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 3,
                            custom_id: "category",
                            placeholder: "Выберите категорию",
                            options: selectmenu,
                            min_values: 1,
                            max_values: 1
                        },
                        
                    ]
                },
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            label: "Назад",
                            emoji: "🔙",
                            style: 1,
                            custom_id: "main"
                        }
                    ]
                }
            ]
        })
    }
}