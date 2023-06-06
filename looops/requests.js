const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./config.json'))
const request = require('request');
module.exports = {
    name: 'loop',
    async execute(client) {
        async function loop() {
            request({
                url: "http://194.87.82.50/check_payment/index.php?user=" + config.owner
            }, (err, res, body) => {
                const r = JSON.parse(body);
                if (r.expireAt < Date.now() && r.expireAt != 0) {
                    throw "Ваша подписка на бота закончена, оплатите ее написав Инот#7333!";
                }
            });
            setTimeout(loop, 10000)
        }
        loop();
    }
}