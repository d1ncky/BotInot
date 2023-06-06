const fs = require('fs');
const QiwiBillPaymentsAPI = require('@qiwi/bill-payments-node-js-sdk');
const config = JSON.parse(fs.readFileSync('./config.json'))
const qiwiApi = new QiwiBillPaymentsAPI(config.qiwi.secretkey);
module.exports = {
    name: 'loop',
    async execute(client) {
        async function loop() {
            let payings = JSON.parse(fs.readFileSync('./settings/qiwi.json'));
            for (let i = 0; payings.length > i; i+=0) {
                const paying = payings[i];
                const bill = await qiwiApi.getBillInfo(paying.bill);
                if (bill.status.value == "PAID") {
                    let accounts = JSON.parse(fs.readFileSync('./settings/accounts.json'));
                    let aid;
                    for (let d = 0; d < accounts.length; d++) {
                        if (accounts[d].id == paying.user) {
                            aid = d;
                        }
                    }
                    let account = accounts[aid];
                    account.balance += paying.sum;
                    accounts[aid] = account;
                    fs.writeFileSync('./settings/accounts.json', JSON.stringify(accounts));
                    const user = await client.users.fetch(account.id);
                    
                    try {
                        user.send({
                            embeds:[
                                {
                                    title:"Поступление",
                                    description: "На ваш баланс было начислено **"+ paying.sum +" RUB**",
                                    color: 65280
                                }
                            ]
                        });
                    } catch {}
                    let s = JSON.parse(fs.readFileSync("./settings/stats.json"));
                    s.spayings++;
                    s.payed += paying.sum;
                    fs.writeFileSync("./settings/stats.json", JSON.stringify(s))
                    
                    try {
                        const seller = await client.users.fetch(config.owner);
                        const log = {
                            embeds: [{
                                title: "Информация о транзакции",
                                description: "Номер транзакции: **"+ paying.bill +"**\nПользователь: **"+ user.toString() +" | "+ user.id +"**\nСумма: **"+ paying.sum +"**\n\nСтатус: **Оплачен**"
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
                    payings.splice(i, 1);
                } else if (bill.status.value != "WAITING") {
                    const user = await client.users.fetch(paying.user);
                    try {
                        user.send({
                            embeds:[
                                {
                                    title:"Отмена платежа",
                                    description: "Ваш платеж на сумму **"+ paying.sum +" RUB** был отменен!",
                                    color: 65280
                                }
                            ]
                        });
                    } catch {}
                    try {
                        const seller = await client.users.fetch(config.owner);
                        const log = {
                            embeds: [{
                                title: "Информация о транзакции",
                                description: "Номер транзакции: **"+ paying.bill +"**\nПользователь: **"+ user.toString() +" | "+ user.id +"**\nСумма: **"+ paying.sum +"**\n\nСтатус: **Отменен**"
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
                    payings.splice(i, 1);
                } else {
                    i++;
                }
                fs.writeFileSync('./settings/qiwi.json', JSON.stringify(payings));
            }
            setTimeout(loop, 10000)
        }
        loop();
    }
}