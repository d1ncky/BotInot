const fs = require("fs");
module.exports = {
    name: 'remove_product',
    async execute(interaction, client, config) {
        await interaction.deferUpdate();
        const val = interaction.fields.fields.get('programm_name').value;
        let categorylist = JSON.parse(fs.readFileSync("./settings/category.json"));
        let n = -1;
        for (let i = 0; i < categorylist.length; i++) {
            if (categorylist[i].value == val) {
                n = i;
            }
        }
        if (n == -1) return interaction.update(
            {
                embeds: [
                    {
                        title: "Не удалось удалить категорию",
                        description: "Не удалось найти категорию по програмному имени!"

                    }
                ]
            }
        );
        categorylist.splice(n, 1);
        fs.writeFileSync("./settings/category.json", JSON.stringify(categorylist));
        let category = JSON.parse(fs.readFileSync('./settings/category.json'));
        let i = 0;
        let selectmenu = [];
        while (i < category.length) {
            let c = category[i];
            if (interaction.user.id == config.owner) {
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
        if (interaction.user.id == config.owner) {
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