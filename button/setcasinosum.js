const fs = require('fs');
module.exports = {
    name: "change_money",
    async execute(interaction, client) {
        const modal = {
            title: "Изменение суммы ставки",
            custom_id: "setcasinosum",
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 4,
                            custom_id: "sum",
                            label: "Сумма",
                            style: 1,
                            min_length: 1,
                            max_length: 100,
                            placeholder: "50",
                            required: true
                        }
                    ]
                }
            ]
        }
        interaction.showModal(modal);
    }
}