const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./config.json'));
module.exports = {
    name: 'balance_add',
    async execute(interaction, client) {
        let sum = parseInt(interaction.fields.fields.get('sum').value.replace(/[^+\d]/g, ""));
        let msg = interaction.message.embeds;
        if (!sum) {
            msg[0].data.footer = {text: "Неверно введена сумма! Попробуйте еще раз!"};
            return interaction.update({ embeds: msg });
        }
        if (sum < config.casino.min || sum > config.casino.max) {
            msg[0].data.footer = {text: "Сумма меньше или больше заданого лимита! Минимум - " + config.casino.min + " RUB | Максимум - " + config.casino.max + " RUB"};
            return interaction.update({ embeds: msg });
        }
        if (msg[0].data.footer) {
            msg[0].data.footer = null;
        }
        msg[0].fields[2].value = "```" + sum + " RUB```";
        return interaction.update({ embeds: msg });
    }
}