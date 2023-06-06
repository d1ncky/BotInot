const fs = require("fs");
module.exports = {
    name: "create_c",
    async execute(interaction, client, config) {
        const name = interaction.fields.fields.get('display_name').value;
        const id = interaction.fields.fields.get('programm_name').value;
        let categorylist = JSON.parse(fs.readFileSync("./settings/category.json"));
        let i = 0;
        while (categorylist.length > i) {
            const c = categorylist[i];
            if (c.value == id) {
                return interaction.update({ 
                    embeds:[
                        {
                            title: "Невозможно создать категорию",
                            description: "Указанное програмное название категории идентично с **" + с.name + "**"
                        }
                    ],
                    ephemeral: true 
                })
            }
            i++;
        }
        if (id == "create_c") {
            return interaction.update({ 
                embeds:[
                    {
                        title: "Невозможно создать категорию",
                        description: "Указанное програмное название категории идентично с **зарезервированым системным знаком**!"
                    }
                ],
                ephemeral: true 
            })
        }
        categorylist.push(
            {
                name: name,
                value: id,
                products: [],
            }
        )
        fs.writeFileSync("./settings/category.json", JSON.stringify(categorylist))
        i = 0;
        let selectmenu = [];
        while (i < categorylist.length) {
            let c = categorylist[i];
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
        interaction.update({
            embeds: [
                {
                    title: "Покупка",
                    description: "Выберите категорию товаров ниже",
                }
            ],
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 3,
                            custom_id: "category",
                            placeholder: "Выберите товар",
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
        });
    }
}