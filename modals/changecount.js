
module.exports = {
    name: 'balance_add',
    async execute(interaction, client) {
        let count = parseInt(interaction.fields.fields.get('count').value.replace(/[^+\d]/g, ""));
        let msg = interaction.message.embeds;
        if (!count) {
            msg[0].data.footer.text = "Вы указали не верное количество! Попробуйте еще раз";
            return interaction.update({ embeds: msg });
        } else if (count < 1) {
            msg[0].data.footer.text = "Нельзя указать 0 и менее при покупке товаров!";
            return interaction.update({ embeds: msg });
        } else if (count > 10) {
            msg[0].data.footer.text = "Запрещена покупка 11+ товаров!";
            return interaction.update({ embeds: msg });
        }
        msg[0].data.footer.text = "Количество успешно установлено в размере "+ count +" шт.";
        msg[0].fields[2].value = "```" + count + " шт.```";
        return interaction.update({ embeds: msg });
    }
}