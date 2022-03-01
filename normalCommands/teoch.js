const Discord = require('discord.js');
const bot = require(`../config.json`);

module.exports.run = async (client, message, args) => {
    const pms = require('pretty-ms');
    message.reply({ embeds: [new Discord.MessageEmbed().setTitle(`${client.user.username}`).addField(`OS`, `${require("os").platform().replace("win", "Windows")}`, true).setThumbnail(`${client.user.displayAvatarURL({ size: 512, format: 'png' })}`).setImage(`attachment://banner.png`).setColor(bot.accentColor).addField(`Bot uptime`, `${pms(client.uptime)}`, true).addField(`Guild count`, `${client.guilds.cache.size}`, true).addField("All commands", `${client.commands.size}`)], files: [new Discord.MessageAttachment(`./AllIcons/banners/banner_${client.user.id}.png`, `banner.png`)] });
}

module.exports.config = {
    name: 'teoch',
    aliases: ["eoch"],
}