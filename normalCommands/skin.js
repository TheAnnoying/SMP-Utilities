

const Discord = require('discord.js');
const bot = require('../config.json');
const fetch = require('node-fetch');

module.exports.run = async (client, message, args) => {
    try {  
        let mcuser = args[0];
        const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${mcuser}`);
        const data = await response.json();
        const embed = new Discord.MessageEmbed()/*.setTitle(`${mcuser}'s Skin`)*/.setDescription(`[Download](https://mc-heads.net/download/${data.id})`).setImage(`https://mc-heads.net/body/${data.id}/right`).setAuthor({ name: `${mcuser}`, iconURL: `https://crafatar.com/avatars/${data.id}` }).setColor(bot.accentColor);
        message.reply({ embeds: [embed] })
    } catch (err) {
        console.log(err);

        let errEmbed = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> An Error Occurred!").addField(`Caused by:`, `${message.member.user.tag}`).addField(`From the command:`, `${message.commandName}`).addField("From guild:", `${message.guild.name}, (${message.guild.id})`).addField("Error:", `Invalid skin - ${err.message}`).setColor(bot.errorColor);
        client.channels.cache.get("907641692075728987").send({ embeds: [errEmbed] });
        message.reply({ embeds: [fn.sendError("Invalid username!")] });
    }
}

module.exports.config = {
    name: 'skin',
    aliases: ["mcskin", "minecraftskin", "mskin"],
}