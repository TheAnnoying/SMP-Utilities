const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const bot = require(`../../config.json`);

module.exports = {
    name: 'ping',
    aliases: [],
    usage: 'ping',
    example: '/ping',
    description: 'View the bot\'s ping',
    options: {
        defer: true
    },
    data: new SlashCommandBuilder()
            .setName('ping')
            .setDescription('View the bot\'s ping'),
    async execute(client, message, args) {
        const before = Date.now();
        const ping = await message.editReply({ fetchReply: true, embeds: [new Discord.MessageEmbed().setAuthor({ name: "Proccessing", iconURL: 'https://cdn.discordapp.com/emojis/936226298429329489.gif?size=44&quality=lossless' }).setColor(bot.accentColor)] });

        const pms = require('pretty-ms');

        const infoEmbed = new Discord.MessageEmbed().setTitle(`${client.user.username}`).addField(`OS`, `${require("os").platform().replace("win", "Windows")}`, true).setThumbnail(`${client.user.displayAvatarURL({ size: 512, format: 'png' })}`).setImage(`attachment://banner.png`).setColor(bot.accentColor).addField(`Bot uptime`, `${pms(client.uptime)}`, true).addField("API latency", `${client.ws.ping}ms`, true).addField("Bot latency", `${Date.now() - before}ms`, true).addField(`Guild count`, `${client.guilds.cache.size}`, true).addField("All commands", `${client.commands.size}`, true)
        ping.edit({ embeds: [infoEmbed], files: [new Discord.MessageAttachment(`./AllIcons/banners/banner_${client.user.id}.png`, `banner.png`)] });
	}
}
