const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const Discord = require('discord.js');
const bot = require(`../../config.json`);
const fn = require(`../../functions`);
module.exports = {
    name: 'skin',
    aliases: [],
    usage: 'skin mcusername',
    example: '/skin TheAnnoying',
    description: 'See the skin of a player',
    options: {
        defer: false
    },
    data: new SlashCommandBuilder()
            .setName('skin')
            .setDescription('See the skin of a player')
            .addStringOption(option =>
                option.setName("mcusername")
                .setDescription("Your Minecraft username")
                .setRequired(true)
            ),
    async execute(client, message, args) {
        try {  
            const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${message.options.getString("mcusername")}`);
            const data = await response.json();
            console.log(data)
            message.reply({ embeds: [new Discord.MessageEmbed().setURL(`https://mc-heads.net/download/${data.id}`).setImage(`https://crafatar.com/renders/body/${data.id}`).setAuthor({ name: `${data.name}`, iconURL: `https://crafatar.com/avatars/${data.id}` }).setColor(bot.accentColor), new Discord.MessageEmbed().setURL(`https://mc-heads.net/download/${data.id}`).setImage(`https://minecraft-api.com/api/skins/${data.name}/body/0.5/0/json`)] });
        } catch (err) {
            message.reply({ embeds: [fn.sendError("Invalid username!")] });
        }
	}
}