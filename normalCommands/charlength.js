const Discord = require('discord.js');
const bot = require(`../config.json`);
const fn = require(`../functions`); 
module.exports.run = async(client, message, args) => {
    if(!args[0]) return message.reply({ embeds: [fn.sendError(`Please specify some text`)] });
    args = args.join(" ");
    message.reply({ embeds: [new Discord.MessageEmbed().setColor(bot.accentColor).setDescription(`Your message contains \`${args.length}\` chars.`)] })
}

module.exports.config = {
    name: 'charlength',
    aliases: ["cl"],
}