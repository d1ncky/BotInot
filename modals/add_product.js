const fs = require("fs");

module.exports = {

    name: 'add_product',

    async execute(interaction, client, config) {

        const val = interaction.fields.fields.get('programm_name').value;

        const d = interaction.fields.fields.get('products').value;

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

                        title: "Не удалось добавить товар",

                        description: "Не удалось найти товар по програмному имени!"



                    }

                ]

            }

        );

        

        let s = d.split('\n');

        for (let i = 0; i < s.length; i++) {

            if (s[i]) { products[n].instances.push(s[i]); }

        }



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

                    label: "Добавить товар",

                    value: cid+"splesh"+"add_product",

                }

            );

        }

        let msg = {

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

        };

        if (config.embedonadd.enable) {

            const channel = await client.channels.cache.get(config.embedonadd.channel)

            if (channel) {

                let cmsg = config.embedonadd.message;

                cmsg = JSON.stringify(cmsg);

                cmsg = cmsg.replaceAll("%{product}", products[n].name);

                cmsg = cmsg.replaceAll("%{seller}", interaction.user.toString());

                cmsg = cmsg.replaceAll("%{count}", s.length);

                cmsg = JSON.parse(cmsg);

                try {

                    await channel.send(cmsg);

                } catch (err) {

                    msg.embeds[0].footer = {

                        text: "Не удалось отправить оповещение о заливе!\nПричина: Ошибка при отправке сообщения ("+ err.message +")"

                    };

                }

            } else {

                msg.embeds[0].footer = {

                    text: "Не удалось отправить оповещение о заливе!\nПричина: Канал указаный в конфиге не обнаружен"

                };

            }

        }

        interaction.update(msg);

        

    }

}
