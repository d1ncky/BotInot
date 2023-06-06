const QiwiBillPaymentsAPI = require('@qiwi/bill-payments-node-js-sdk');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./config.json'));
const qiwiApi = new QiwiBillPaymentsAPI(config.secretkey);
module.exports = {
    name: 'balance_add',
    async execute(interaction, client) {
        let userid = interaction.fields.fields.get('userid').value;
        let accounts = JSON.parse(fs.readFileSync('./settings/accounts.json'));
        let acc_i = -1;
        for (let i = 0; i < accounts.length; i++) {
            let account = accounts[i];
            if (account.id == userid) {
                acc_i = i;
                break;
            }
        }
        if (acc_i == -1) return interaction.reply({ embeds: [{title:"Ошибка", description: "Аккаунт не зарегистрирован **в системе**! Попросите человека зайти в профиль!"}] });
        
        interaction.update({
            embeds: [
                {
                    title:"Обновление баланса аккаунта",
                    fields: [
                        {
                            name: "Пользователь",
                            value: "<@"+ userid +">",
                            inline: true
                        },
                        {
                            name: "Баланс",
                            value: "```"+ accounts[acc_i].balance +" RUB```",
                            inline: true
                        },
                        {
                            name: "Сумма",
                            value: "```0 RUB```",
                            inline: true
                        }
                    ],
                    footer: {
                        text: "Выберите действие с помощью кнопок ниже чтобы продолжить."
                    }
                }
            ],
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            label: "Добавить",
                            emoji: "➕",
                            style: 1,
                            custom_id: "addb"
                        },
                        {
                            type: 2,
                            label: "Установить",
                            emoji: "♻️",
                            style: 1,
                            custom_id: "setb"
                        },
                        {
                            type: 2,
                            label: "Забрать",
                            emoji: "➖",
                            style: 1,
                            custom_id: "delb"
                        }
                    ]
                },
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            label: "Выбрать сумму",
                            emoji: "💱",
                            style: 1,
                            custom_id: "setsum"
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
                            custom_id: "panel"
                        }
                    ]
                }
            ]
        });
    }
}