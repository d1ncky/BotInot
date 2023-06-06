const { AttachmentBuilder } = require('discord.js');
const fs = require('fs');
module.exports = {
    name: "panel",
    async execute(interaction, client) {
        try {
            const seller = await client.users.fetch(config.owner);
            const log = {
                embeds: [{
                    title: "Информация о удалении платежей",
                    description: "Удалил: " + interaction.user.toString()
                }],
                files:[new AttachmentBuilder('./settings/qiwi.json'), new AttachmentBuilder('./settings/lava.json')],
            }
            await seller.send(log);
            const perms = config.permissions;
            perms.forEach(async us => {
                if (us.accesslvl >= 4) {
                    const u = await client.users.fetch(us.userid);
                    u.send(log);
                }
            });
        } catch (err) {console.log(err)}
        await interaction.update({
            embeds: [
                {
                    title: "Все активные транзакции очищены",
                    description: "Все транзакции **удалены**!\nФайлик с транзакциями **предоставлен выше**s!"
                }
            ],
            files:[new AttachmentBuilder('./settings/qiwi.json'), new AttachmentBuilder('./settings/lava.json')],
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            label: "Назад",
                            emoji: "🔙",
                            style: 1,
                            custom_id: "danger"
                        }
                    ]
                }
            ]
        })
        fs.writeFileSync('./settings/lava.json', '[]');
        fs.writeFileSync('./settings/qiwi.json', '[]');
    }
}