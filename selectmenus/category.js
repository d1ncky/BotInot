const fs = require("fs");

module.exports = {

    name: 'category',

    async execute(interaction, client, config) {

        const id = interaction.values[0];

        if (id == "create_c") {

            const modal = {

                title: "Создание категории",

                custom_id: "create_c",

                components: [

                    {

                        type: 1,

                        components: [

                            {

                                type: 4,

                                custom_id: "display_name",

                                label: "Название категории (отображаемое)",

                                style: 1,

                                min_length: 1,

                                max_length: 100,

                                placeholder: "Discord Nitro (с гарантией)",

                                required: true

                            }

                        ]

                    },

                    {

                        type: 1,

                        components: [

                            {

                                type: 4,

                                custom_id: "programm_name",

                                label: "Название категории (програмное)",

                                style: 1,

                                min_length: 1,

                                max_length: 100,

                                placeholder: "discordnitro_garant",

                                required: true

                            }

                        ]

                    }

                ]

            }

            interaction.showModal(modal);

        } else if (id == "remove_c") {

            const modal = {

                title: "Удаление категории",

                custom_id: "remove_c",

                components: [

                    {

                        type: 1,

                        components: [

                            {

                                type: 4,

                                custom_id: "programm_name",

                                label: "Название категории (програмное)",

                                style: 1,

                                min_length: 1,

                                max_length: 100,

                                placeholder: "discordnitro_garant",

                                required: true

                            }

                        ]

                    }

                ]

            }

            interaction.showModal(modal);

        } else {

            const categorylist = JSON.parse(fs.readFileSync("./settings/category.json"));

            let c;

            let n;

            for(let i = 0; i < categorylist.length; i++) {

                if (categorylist[i].value == id) {

                    c = categorylist[i];

                    n = i;

                }

            }

            let description = [];

            for(let i = 0; i < c.products.length; i++) {

                const p = c.products[i];

                if (interaction.user.id == config.owner || config.permissions.find(u => u.userid == interaction.user.id && u.accesslvl > 0)) {

                    description.push(`**${p.name}**\nКоличество: **${p.instances.length} шт.**\nЦена: **${p.price} RUB**\nПрограмное название: **${p.value}**`);

                }

                else {

                    description.push(`**${p.name}**\nКоличество: **${p.instances.length} шт.**\nЦена: **${p.price} RUB**`)

                }

            }

            description = description.join('\n\n');

            let selectmenu = [];

            for(let i = 0; i < c.products.length; i++) {

                const p = c.products[i];

                selectmenu.push(

                    {

                        label: p.name,

                        description: `Цена: ${p.price} RUB | Кол-во: ${p.instances.length} шт`,

                        value: n+"splesh"+p.value

                    }

                );

            }

            if (interaction.user.id == config.owner || config.permissions.find(u => u.userid == interaction.user.id && u.accesslvl >= 4)) {

                selectmenu.push(

                    {

                        label: "Создать товар",

                        value: n+"splesh"+"create_product",

                    },

                    {

                        label: "Удалить товар",

                        value: n+"splesh"+"remove_product",

                    },

                    {

                        label: "Добавить товар",

                        value: n+"splesh"+"add_product",

                    }

                );

            }

            if (config.permissions.find(u => u.userid == interaction.user.id && u.accesslvl < 4 && u.accesslvl > 0)) {

                selectmenu.push(

                    {

                        label: "Добавить товар",

                        value: n+"splesh"+"add_product",

                    }

                );

            }

            

            interaction.update({

                embeds: [

                    {

                        title:c.name,

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

}
