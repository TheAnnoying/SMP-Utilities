
const { SlashCommandBuilder, ContextMenuCommandBuilder } = require('@discordjs/builders');
const Builders = require("@discordjs/builders");
const Discord = require('discord.js');
const bot = require(`../config.json`);

module.exports = {
    name: 'Server Status Stats',
    aliases: [],
    usage: 'null',
    example: 'null',
    description: 'Show the amount of users online in our guild',
    data: new ContextMenuCommandBuilder()
            .setName('Server Status Stats')
            .setType(2),
    async execute(client, message, args) {
        const memberCount = message.guild.memberCount;
        let onlineCount = message.guild.presences.cache.filter(e => e.status === "online").size;
        let idleCount = message.guild.presences.cache.filter(e => e.status === "idle").size;
        let dndCount = message.guild.presences.cache.filter(e => e.status === "dnd").size;
        let total = onlineCount + idleCount + dndCount;
        let invisCount = memberCount - total;
        
        const onlineMembers = [];
        message.guild.presences.cache.forEach(presence => {
            if(presence.status === 'online') onlineMembers.push(presence.guild.members.cache.get(presence.userId).user.username); 
        });
        const idleMembers = [];
        message.guild.presences.cache.forEach(presence => {
            if(presence.status === 'idle') idleMembers.push(presence.guild.members.cache.get(presence.userId).user.username); 
        });
        const dndMembers = [];
        message.guild.presences.cache.forEach(presence => {
            if(presence.status === 'dnd') dndMembers.push(presence.guild.members.cache.get(presence.userId).user.username);
            // console.log(presence.guild.members.cache.get(presence.userId).user.username) 
        });

        // let allMembers = [];
        // message.guild.members.fetch().then(members => {
        //     members.forEach(member => {
        //     });   
        // });
        let color = Math.max(onlineCount, idleCount, dndCount, invisCount);
        if(onlineCount === color) color = 'GREEN';
        if(dndCount === color) color = 'RED';
        if(invisCount === color) color = 'GREY';
        if(idleCount === color) color = 'ORANGE';
        let onlineDesc = `<:Online:899989297007050772> ${onlineCount} (${onlineMembers.join(", ")}) users are online,`;
        if(onlineCount === 1) {
            onlineDesc = `<:Online:899989297007050772> ${onlineCount} (${onlineMembers.join(", ")}) user is online,`;
        } else if(onlineCount === 0) {
            onlineDesc = `<:Online:899989297007050772> no users are online,`;
        }
        let idleDesc = `<:Idle:900364734702968862> ${idleCount} (${idleMembers.join(", ")}) users are idle,`;
        if(idleCount === 1) {
            idleDesc = `<:Idle:900364734702968862> ${idleCount} (${idleMembers.join(", ")}) user is idle,`
        } else if(idleCount === 0) {
            idleDesc = `<:Idle:900364734702968862> no users are idle`
        }
        let dndDesc = `<:DoNotDisturb:900364734593916958> ${dndCount} (${dndMembers.join(", ")}) users want you to not disturb them,`;
        if(dndCount === 1) {
            dndDesc = `<:DoNotDisturb:900364734593916958> ${dndCount} (${dndMembers.join(", ")}) user wants you to not disturb them,`
        } else if(dndCount === 0) {
            dndDesc = `<:DoNotDisturb:900364734593916958> no users are on Do Not Disturb,`
        }
        let invisDesc = `and <:Offline:900364734589702214> ${invisCount} users are offline.`;
        if(invisCount === 1) {
            invisDesc = `and <:Offline:900364734589702214> ${invisCount} user is offline.`
        } else if(invisCount === 0) {
            invisDesc = `and <:Offline:900364734589702214> no users are offline.`
        }
        const embed = new Discord.MessageEmbed().setTitle("Server Status Stats").setDescription(`${onlineDesc}
        ${idleDesc}
        ${dndDesc}
        ${invisDesc}`).setColor(`${color}`);
        message.reply({ embeds: [embed] });
    }
}