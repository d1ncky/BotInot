const config = require('../config.json');
module.exports = {
    name: "help",
    execute(interaction) {
        interaction.reply({
            embeds: [
                {
                    title: config.support.title,
                    description: config.support.description,
                }
            ],
            ephemeral: true
        })
    }
}