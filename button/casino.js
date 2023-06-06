const fs = require("fs");
const config = JSON.parse(fs.readFileSync('./config.json'));
module.exports = {
    name: 'category',
    async execute(interaction, client) {
        await interaction.deferUpdate();
        let accounts = JSON.parse(fs.readFileSync('./settings/accounts.json'));
        let aid = -1;
        for (let i = 0; i < accounts.length; i++) {
            if (accounts[i].id == interaction.user.id) {
                aid = i;
            }
        }
        if (aid == -1) return interaction.editReply(
            {
                embeds: [
                    {
                        title: "Ошибка при входе в казино",
                        description: "Аккаунт **не найден**! Пожалуйста зайдите в **профиль** чтобы создать его!"
                    }
                ],
                components: [
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
            }
        );
        interaction.editReply(
            {
                embeds: [
                    {
                        title: "Казино",
                        fields: [
                            {
                                name: "Вы играете в игру:",
                                value: "```Монетка```",
                                inline: true
                            },
                            {
                                name: "У вас на балансе:",
                                value: "```"+ accounts[aid].balance +" RUB```",
                                inline: true
                            },
                            {
                                name: "Вы поставили:",
                                value: "```" + config.casino.min + " RUB```",
                                inline: true
                            }
                        ],
                        thumbnail: {
                            url: "https://cdn-icons-png.flaticon.com/512/3076/3076839.png"
                        }
                    }
                ],
                components: [
                    {
                        type: 1,
                        components: [
                            {
                                type: 2,
                                label: "Сыграть",
                                emoji: "🎰",
                                style: 1,
                                custom_id: "play"
                            },
                            {
                                type: 2,
                                label: "Изменить сумму",
                                emoji: "💸",
                                style: 1,
                                custom_id: "setcasinosum"
                            }
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
            }
        );
    }
}