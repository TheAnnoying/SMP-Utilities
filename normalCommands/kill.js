

const Discord = require('discord.js');
const bot = require('../config.json');
const fetch = require('node-fetch');

module.exports.run = async (client, message, args) => {
    message.reply({ embeds: [new Discord.MessageEmbed().setTitle("Goodbye!").setColor(bot.errorColor)] });
    client.destroy();
    process.exit();
}

module.exports.config = {
    name: 'kill',
    aliases: ["die", "leave", "teatime", "eatime"],
}