const fs = require('fs');
module.exports = {
    name: "change_money",
    async execute(interaction, client) {
        const modal = {
            title: "Изменение баланса пользователя",
            custom_id: "change_user",
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 4,
                            custom_id: "userid",
                            label: "Id пользователя",
                            style: 1,
                            min_length: 1,
                            max_length: 100,
                            placeholder: "629697284237426698",
                            required: true
                        }
                    ]
                }
            ]
        }
        interaction.showModal(modal);
    }
}