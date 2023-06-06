const QiwiBillPaymentsAPI = require('@qiwi/bill-payments-node-js-sdk');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./config.json'));
const qiwiApi = new QiwiBillPaymentsAPI(config.secretkey);
function randomInteger(min, max) {
    // получить случайное число от (min-0.5) до (max+0.5)
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}
module.exports = {
    name: 'balance_add',
    async execute(interaction, client) {
        let sum = parseInt(interaction.message.embeds[0].fields[2].value.replace(/[^+\d]/g, ""));
        let accounts = JSON.parse(fs.readFileSync('./settings/accounts.json'));
        let acc_i = -1;
        for (let i = 0; i < accounts.length; i++) {
            let account = accounts[i];
            if (account.id == interaction.user.id) {
                acc_i = i;
                break;
            }
        }
        if (accounts[acc_i].balance < sum) {
            return interaction.reply({
                ephemeral: true,
                embeds: [
                    {
                        title: "Недостаточно средств",
                        description: "У вас не хватает средств для игры!"
                    }
                ]
            })
        }
        let rnd = randomInteger(1, 2);
        let msg = interaction.message.embeds;
        if (rnd == 1) {
            accounts[acc_i].balance += Math.floor(sum*config.casino.factor-sum);
            interaction.update(
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
                                    value: "```"+ accounts[acc_i].balance +" RUB```",
                                    inline: true
                                },
                                {
                                    name: "Вы поставили:",
                                    value: msg[0].fields[2].value,
                                    inline: true
                                }
                            ],
                            thumbnail: {
                                url: "https://cdn-icons-png.flaticon.com/512/3076/3076839.png"
                            },
                            footer: {
                                text: "Вы получили " + (sum*config.casino.factor-sum) + " RUB."
                            },
                            color: 65280
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
        } else {
            accounts[acc_i].balance -= Math.floor(sum);
            interaction.update(
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
                                    value: "```"+ accounts[acc_i].balance +" RUB```",
                                    inline: true
                                },
                                {
                                    name: "Вы поставили:",
                                    value: "```" + parseInt(msg[0].fields[2].value.replace(/[^+\d]/g, "")) + " RUB```",
                                    inline: true
                                }
                            ],
                            thumbnail: {
                                url: "https://cdn-icons-png.flaticon.com/512/3076/3076839.png"
                            },
                            color: 16711680,
                            footer: {
                                text: "Вы потеряли " + sum + " RUB."
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
        
        fs.writeFileSync('./settings/accounts.json', JSON.stringify(accounts));
    }
}