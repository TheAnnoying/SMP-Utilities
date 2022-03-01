const Discord = require('discord.js');
const bot = require(`../config.json`);

module.exports.run = async(client, message, args) => {
    if(message.member.user.id !== '588425966804533421') return;
    message.reply({ files: [`./moderationFiles/${message.guild.id}.json`] });
}

module.exports.config = {
    name: 'viewguild',
    aliases: ["vg"],
}
