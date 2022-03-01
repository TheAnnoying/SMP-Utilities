const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const bot = require(`../../config.json`);
const fsNormal = require('fs');
const fn = require("../../functions");

module.exports = {
    name: 'kick',
    aliases: [],
    usage: 'kick @someone reason',
    example: '/kick @Froogile Too sweaty',
    description: 'Kick a member from the server',
    options: {
        defer: false
    },
    permissions: ['Moderator', 'Admin'],
    data: new SlashCommandBuilder()
            .setName('kick')
            .setDescription('Kick a member from the server')
            .setDefaultPermission(false)
            .addUserOption(option =>
                option.setName("member")
                .setDescription("Member to kick")
                .setRequired(true)
            ).addStringOption(option =>
                option.setName("reason")
                .setDescription("Reason to kick the member")
                .setRequired(false)
            ),
    async execute(client, message, args) {
        if (!message.member.permissions.has(Discord.Permissions.FLAGS.KICK_MEMBERS)) return message.reply({ embeds: [fn.sendError("You don't have permissions to kick people!")] });
        if (!message.guild.me.permissions.has(Discord.Permissions.FLAGS.KICK_MEMBERS)) return message.reply({ embeds: [fn.sendError("I don't have permission to kick people!")] });

        let target = message.options.getMember('member');

        if(!target.kickable) return message.reply({ embeds: [fn.sendError(`I do not have permissions to kick this certain member (${target.user.username})`)] });

        let reason = message.options.getString('reason') ?? "Unspecified";
        target.kick(reason);

        return message.reply({ embeds: [new Discord.MessageEmbed().setDescription(`Kicked ${target.user.username} for ${reason}`).setColor(bot.accentColor)] });
	}
}