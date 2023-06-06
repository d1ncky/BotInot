
module.exports = {
    name: 'balance_add',
    async execute(interaction, client) {
        let sum = parseInt(interaction.fields.fields.get('sum').value.replace(/[^+\d]/g, ""));
        let msg = interaction.message.embeds;
        if (!sum) {
            msg[0].data.footer.text = "Неверно введена сумма! Попробуйте еще раз!";
            return interaction.update({ embeds: msg });
        }
        msg[0].data.footer.text = "Выберите действие с помощью кнопок ниже чтобы продолжить.";
        msg[0].fields[2].value = "```" + sum + " RUB```";
        return interaction.update({ embeds: msg });
    }
}