const { registerFont, createCanvas, loadImage } = require('canvas');
const { AttachmentBuilder } = require('discord.js');
const fs = require('fs');
const sharp = require('sharp');
const axios = require('axios');

function make (url) {
    if (url) {
        return url;
    } else {
        return "https://i.imgur.com/1EYe9Li.png"
    }
}
module.exports = {
    name: 'profile',
    async execute(interaction, client, config) {
        await interaction.deferUpdate();
        let accounts = JSON.parse(fs.readFileSync("./settings/accounts.json"));
        let id = -1;
        for (let i = 0; i < accounts.length; i++) {
            if (accounts[i].id == interaction.user.id) {
                id = i;
            }
        }
        if (id == -1) { 
            accounts.push(
                {
                    id: interaction.user.id,
                    balance: 0,
                    spended: 0,
                    buyings: 0
                }
            );
            id = accounts.length-1;
        }
        const account = accounts[id];
        if (config.profile == "text") {
            interaction.editReply({
                embeds: [
                    {
                        title: "Профиль",
                        description: "Информация о вас",
                        fields: [
                            {
                                name: "Баланс аккаунта",
                                value: "```"+ account.balance +" RUB```",
                                inline: true
                            },
                            {
                                name: "Всего потрачено",
                                value: "```"+ account.spended +" RUB```",
                                inline: true
                            },
                            {
                                name: "Куплено товаров",
                                value: "```"+ account.buyings +" шт.```",
                                inline: true
                            }
                        ],
                        thumbnail: {
                            url: `${make(interaction.user.avatarURL())}`
                        }
                    }
                ],
                components: [
                    {
                        type: 1,
                        components: [
                            {
                                type: 2,
                                label: "Пополнить баланс",
                                emoji: "💰",
                                style: 1,
                                custom_id: "add_balance"
                            },
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
        } else if (config.profile == "image") {
            const canvas = createCanvas(1920, 1080);
            const c = canvas.getContext('2d');
            let img = await loadImage('./banner.png');
            const imageResponse = await axios.get(make(interaction.user.avatarURL()), {
                responseType: 'arraybuffer',
            });
            const data = await sharp(imageResponse.data).toFormat('png').toBuffer();
            let avatar = await loadImage(data);
            c.drawImage(img, 0, 0, 1920, 1080)
            c.drawImage(avatar, 31, 373, 520, 520)
            registerFont("./Font.ttf", { family: "RussoOne" });
            c.fillStyle = '#FFFFFF'
            c.font = "80px RussoOne";
            
            c.fillText(account.spended + " RUB", 1425, 570);
            c.fillText(account.balance + " RUB", 1425, 775);
            c.fillText(account.buyings + " шт.", 1425, 975);
            c.textAlign = "center";
            let s = "";
            if (interaction.user.tag.length > 12) {
                s = interaction.user.tag.slice(0, 12) + "..";
            } else {
                s = interaction.user.tag
            }
            c.fillText(s, 1575, 355);
            const buffer = canvas.toBuffer("image/png");
            interaction.editReply({
                embeds:[],
                files: [
                    new AttachmentBuilder(buffer)
                ],
                components: [
                    {
                        type: 1,
                        components: [
                            {
                                type: 2,
                                label: "Пополнить баланс",
                                emoji: "💰",
                                style: 1,
                                custom_id: "add_balance"
                            },
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
        fs.writeFileSync("./settings/accounts.json", JSON.stringify(accounts));
    }
}