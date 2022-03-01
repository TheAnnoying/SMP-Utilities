const Discord = require('discord.js');
const bot = require(`../config.json`);
const fn = require(`../functions`);

module.exports.run = async(client, message, args) => {
    // if(message.member.user.id !== '588425966804533421') return;
    // if(!args[0]) return message.reply({ embeds: [fn.sendError("You must enter a member")] });
    // let target = message.mentions.members.first() || (await message.guild.members.fetch()).find(member => member.displayName.toLowerCase() === args[0].toLowerCase()) || (await message.guild.members.fetch()).find(member => member.user.username.toLowerCase() === args[0].toLowerCase()) || await message.guild.members.fetch(args[0]);

    // if(target.roles.highest.position >= message.member.roles.highest.position) return message.reply({ embeds: [fn.sendError("You cannot delete this member")] });

    // await message.channel.bulkDelete(Array.from(await message.channel.messages.fetch({limit: 10})).filter(message => message[1].member.user.id === target.user.id).splice(0, target.user.id + 1).map(e => e[1]), true);
    // message.delete();
}

module.exports.config = {
    name: 'delete',
    aliases: ["d"],
}