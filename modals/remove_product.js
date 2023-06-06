const fs = require("fs");
module.exports = {
    name: 'remove_product',
    async execute(interaction, client, config) {
        const val = interaction.fields.fields.get('programm_name').value;
        const cid = interaction.customId.split('splesh')[0];
        let categorylist = JSON.parse(fs.readFileSync("./settings/category.json"));
        let products = categorylist[cid].products;
        let n = -1;
        for (let i = 0; i < products.length; i++) {
            if (products[i].value == val) {
                n = i;
            }
        }
        if (n == -1) return interaction.update(
            {
                embeds: [
                    {
                        title: "Не удалось удалить товар",
                        description: "Не удалось найти товар по програмному имени!"

                    }
                ]
            }
        );
        products.splice(n, 1);
        categorylist[cid].products = products;
        fs.writeFileSync("./settings/category.json", JSON.stringify(categorylist));
        let description = [];
        for(let i = 0; i < products.length; i++) {
            const p = products[i];
            if (interaction.user.id == config.owner) description.push(`**${p.name}**\nКоличество: **${p.instances.length} шт.**\nЦена:**${p.price} RUB**\nПрограмное название: **${p.value}**`)
            if (interaction.user.id != config.owner) description.push(`**${p.name}**\nКоличество: **${p.instances.length} шт.**\nЦена:**${p.price} RUB**`)
        }
        description = description.join('\n\n');
        let selectmenu = [];
        for(let i = 0; i < products.length; i++) {
            const p = products[i];
            selectmenu.push(
                {
                    label: p.name,
                    description: `Цена: ${p.price} RUB | Кол-во: ${p.instances.length} шт`,
                    value: cid+"splesh"+p.value
                }
            );
        }
        if (interaction.user.id == config.owner) {
            selectmenu.push(
                {
                    label: "Создать товар",
                    value: cid+"splesh"+"create_product",
                },
                {
                    label: "Удалить товар",
                    value: cid+"splesh"+"remove_product",
                },
                {
                    label: "Переместить товар",
                    value: cid+"splesh"+"move_product",
                },
                {
                    label: "Добавить товар",
                    value: cid+"splesh"+"add_product",
                }
            );
        }
        interaction.update({
            embeds: [
                {
                    title:categorylist[cid].name,
                    description: description
                }
            ],
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 3,
                            custom_id: "products",
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
                            custom_id: "shop"
                        }
                    ]
                }
            ]
        });
    }
}