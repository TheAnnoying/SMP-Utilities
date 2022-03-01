
const { SlashCommandBuilder, ContextMenuCommandBuilder } = require('@discordjs/builders');
const Builders = require("@discordjs/builders");
const Discord = require('discord.js');
const bot = require(`../../config.json`);
const fn = require("../../functions");

module.exports = {
    name: 'Server Status Stats',
    aliases: [],
    usage: 'null',
    example: 'null',
    description: 'Show the amount of users online in our guild',
    options: {
        defer: false
    },
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
        

        let color = Math.max(onlineCount, idleCount, dndCount, invisCount);
        if(onlineCount === color) color = 'GREEN';
        if(dndCount === color) color = 'RED';
        if(invisCount === color) color = 'GREY';
        if(idleCount === color) color = 'ORANGE';

        message.reply({ embeds: [
                new Discord.MessageEmbed()
                .setTitle("Server Status Stats")
                .setDescription(`<:Online:899989297007050772> ${onlineCount} user${onlineCount === 1 ? "" : "s"} ${onlineCount === 1 ? "is" : "are"} online,
                <:Idle:900364734702968862> ${idleCount} user${idleCount === 1 ? "" : "s"} ${idleCount === 1 ? "is" : "are"} idle,
                <:DoNotDisturb:900364734593916958> ${dndCount} user${dndCount === 1 ? "" : "s"} want you to not disturb them,
                <:Offline:900364734589702214> ${invisCount} user${invisCount === 1 ? "" : "s"} ${invisCount === 1 ? "is" : "are"} offline.`)
                .setColor(`${color}`)
            ]
        });
    }
}