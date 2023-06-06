const fs = require("fs");
const config = JSON.parse(fs.readFileSync('./config.json'));
module.exports = {
    name: 'change',
    async execute(interaction, client) {
        const modal = {
            title: "Изменение количества желаемого товара",
            custom_id: "changecount",
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 4,
                            custom_id: "count",
                            label: "Количество (10 - максимум)",
                            style: 1,
                            min_length: 1,
                            max_length: 2,
                            placeholder: "5",
                            required: true
                        }
                    ]
                }
            ]
        }
        interaction.showModal(modal);
    }
}