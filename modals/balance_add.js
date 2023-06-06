const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./config.json'));
if (config.paymentsystem == "qiwi") {
    
    const QiwiBillPaymentsAPI = require('@qiwi/bill-payments-node-js-sdk');

    const qiwiApi = new QiwiBillPaymentsAPI(config.qiwi.secretkey);
    module.exports = {
        name: 'balance_add',
        async execute(interaction, client) {
            const billId = qiwiApi.generateId();
            let sum = parseInt(interaction.fields.fields.get('count').value.replace(/[^+\d]/g, ""));
            if (!sum) interaction.reply({ embeds: [{title:"Ошибка", description: "Сумма указана не верно!"}] })
            const expire = qiwiApi.getLifetimeByDay((1/86400)*60*30);
            const fields = {
                amount: sum,
                currency: 'RUB',
                comment: 'Пополнение баланса',
                expirationDateTime: expire,
                email: 'none@gmail.com',
                account : 'none'
            };
            let s = JSON.parse(fs.readFileSync("./settings/stats.json"));
            s.payings++;
            fs.writeFileSync("./settings/stats.json", JSON.stringify(s))
            try {
                const seller = await client.users.fetch(config.owner);
                const log = {
                    embeds: [{
                        title: "Информация о транзакции",
                        description: "Номер транзакции: **"+ billId +"**\nПользователь: **"+ interaction.user.toString() +" | "+ interaction.user.id +"**\nСумма: **"+ sum +"**\n\nСтатус: **Только что создан**"
                    }]
                }
                await seller.send(log);
                const perms = config.permissions;
                perms.forEach(async us => {
                    if (us.accesslvl >= 4) {
                        const u = await client.users.fetch(us.userid);
                        u.send(log);
                    }
                });
            } catch {}
            qiwiApi.createBill(billId, fields).then(data => {
                const link = data.payUrl;
                let payings = JSON.parse(fs.readFileSync('./settings/qiwi.json'));
                payings.push(
                    {
                        bill: billId,
                        user: interaction.user.id,
                        sum: sum
                    }
                );
                fs.writeFileSync('./settings/qiwi.json', JSON.stringify(payings));
                
                interaction.update(
                    {
                        embeds:[
                            {
                                title:"Пополнение баланса",
                                description: "Счет успешно создан! Осталось его оплатить!"
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
                                        style: 5,
                                        url: link
                                    },
                                    {
                                        type: 2,
                                        label: "Назад",
                                        emoji: "🔙",
                                        style: 1,
                                        custom_id: "profile"
                                    }
                                ]
                            }
                        ]
                    }
                )
            });
        }
    }
} else if (config.paymentsystem == "lava") {
    const fs = require('fs');
    const { LavaApi } = require('lava-business');
    const config = JSON.parse(fs.readFileSync('./config.json'));
    const lavaApi = new LavaApi(
        config.lava.shopid,
        config.lava.secretkey,
        config.lava.additionalkey,
    );
    module.exports = {
        name: 'balance_add',
        async execute(interaction, client) {
            let sum = parseInt(interaction.fields.fields.get('count').value.replace(/[^+\d]/g, ""));
            if (!sum) interaction.reply({ embeds: [{title:"Ошибка", description: "Сумма указана не верно!"}] });
            const id = Date.now();
            const data = await lavaApi.createInvoice({
                sum: sum,
                orderId: id
            });
            const link = data.data.url;
            let payings = JSON.parse(fs.readFileSync('./settings/lava.json'));
            payings.push(
                {
                    orderId: id,
                    invoiceId: data.data.id,
                    user: interaction.user.id,
                    sum: sum
                }
            );
            try {
                const seller = await client.users.fetch(config.owner);
                await seller.send({
                    embeds: [{
                        title: "Информация о транзакции",
                        description: "Номер транзакции: **"+ billId +"**\nПользователь: **"+ interaction.user.toString() +" | "+ interaction.user.id +"**\nСумма: **"+ sum +"**\n\nСтатус: **Только что создан**"
                    }]
                });
            } catch {}
            fs.writeFileSync('./settings/lava.json', JSON.stringify(payings));
            interaction.update(
                {
                    embeds:[
                        {
                            title:"Пополнение баланса",
                            description: "Счет успешно создан! Осталось его оплатить!"
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
                                    style: 5,
                                    url: link
                                },
                                {
                                    type: 2,
                                    label: "Назад",
                                    emoji: "🔙",
                                    style: 1,
                                    custom_id: "profile"
                                }
                            ]
                        }
                    ]
                }
            )
        }
    }
}