const { AttachmentBuilder } = require('discord.js');
const fs = require('fs');
module.exports = {
    name: "panel",
    async execute(interaction, client) {
        try {
            const seller = await client.users.fetch(config.owner);
            const log = {
                embeds: [{
                    title: "Информация о удалении категорий",
                    description: "Удалил: " + interaction.user.toString()
                }],
                files:[new AttachmentBuilder('./settings/category.json')],
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
                    title: "Все балансы категории очищены",
                    description: "Все категории **удалены**!\nФайлик с бекапами прошлых категорий **предоставлен выше**s!"
                }
            ],
            files:[new AttachmentBuilder('./settings/category.json')],
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
        fs.writeFileSync('./settings/category.json', '[]');
    }
}