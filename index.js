const { EmbedBuilder } = require('@discordjs/builders');
const { count, time } = require('console');
const { PermissionsBitField,ActivityType, Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, AttachmentBuilder, InteractionResponse } = require('discord.js');
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
	],
});
const loop1 = require('./looops/lava.js');
const loop2 = require('./looops/qiwi.js');
const loop3 = require('./looops/requests.js');
const mod1 = require('./modals/add_product.js');
const mod2 = require('./modals/balance_add.js');
const mod3 = require('./modals/change_user.js');
const mod4 = require('./modals/create_c.js');
const mod5 = require('./modals/create_product.js');
const mod6 = require('./modals/remove_c.js');
const mod7 = require('./modals/remove_product.js');
const btn1 = require('./buttons/add_balance.js');
const btn2 = require('./buttons/balances.js');
const btn3 = require('./buttons/changemoney.js');
const btn4 = require('./buttons/help.js');
const btn5 = require('./buttons/main.js');
const btn6 = require('./buttons/panel.js');
const btn7 = require('./buttons/profile.js');
const btn8 = require('./buttons/shop.js');
const cmd1 = require('./commands/start.js');
const sel1 = require('./selectmenus/category.js');
const sel2 = require('./selectmenus/products.js');
const request = require('request');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./config.json'));
const QiwiBillPaymentsAPI = require('@qiwi/bill-payments-node-js-sdk');
const qiwiApi = new QiwiBillPaymentsAPI(config.secretkey);
const sleep = ms => new Promise(r => setTimeout(r, ms));




client.on('interactionCreate', async (interaction) => {
	if (interaction.isCommand()) {
		if (interaction.commandName == "start") {
			let cmd = require("./commands/start");
			cmd.execute(interaction, client, config);
		}
	} else if (interaction.isButton()) {
		try {
			let btn = require("./buttons/" + interaction.customId);
			btn.execute(interaction, client, config);
		} catch (err) {
			console.log(err);
			interaction.reply({
				embeds: [
					{
						title: "Ошибка",
						description: "Кнопка **не обнаружена**! Обратитесь к **администратору**!"
					}
				],
				ephemeral: true
			})
		}
	} else if (interaction.isSelectMenu()) {
		try {
			let menu = require("./selectmenus/" + interaction.customId);
			menu.execute(interaction, client, config);
		} catch (err) {
			interaction.reply({
				embeds: [
					{
						title: "Ошибка",
						description: "Меню **не обнаружено**! Обратитесь к **администратору**!"
					}
				],
				ephemeral: true
			})
		}
	}  else if (interaction.isModalSubmit()) {
		let i;
		if (interaction.customId != "create_c" && interaction.customId != "remove_c" && interaction.customId != "change_user" && interaction.customId != "changecount"  && interaction.customId != "setcasinosum" && interaction.customId != "setsum" && interaction.customId != "balance_add") { 
			i = interaction.customId.split('splesh')[1]; 
		} else {
			i = interaction.customId;
		}
		let modal = require("./modals/" + i + ".js");
		modal.execute(interaction, client, config, qiwiApi);
	}
})
request({
	url: "http://194.87.82.50/check_payment/index.php?user=" + config.owner,
}, (err, res, body) => {
	const r = JSON.parse(body);
	if (r.status == 4041) {
		return console.log(r.message);
	} else {
		if (r.expireAt < Date.now() && r.expireAt != 0) return console.log("Ваша подписка на бота закончена, оплатите ее написав Инот#7333!");
		client.login(config.token).then(() => {
			console.log('Бот зашел в сеть под ' + client.user.tag);
			client.user.setActivity('/start в лс', { type: ActivityType.Watching })
			client.application.commands.create({ name: "start", description: "Открыть меню" });
			if (config.paymentsystem == "qiwi") {
				const payings = require('./looops/qiwi');
				payings.execute(client);
			} else if (config.paymentsystem == "lava") {
				const payings = require('./looops/lava');
				payings.execute(client);
			}
			
		}).catch((err) => console.log(err));
	}
})
