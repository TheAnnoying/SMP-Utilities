const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const bot = require(`../config.json`);

module.exports = {
    name: 'kick',
    aliases: [],
    usage: 'kick @someone reason',
    example: '/kick @Froogile Too sweaty',
    description: 'Kick a member from the server',
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
        
        if (!message.member.permissions.has(Discord.Permissions.FLAGS.BAN_MEMBERS)) {
            let errChannel = client.channels.cache.get("907641692075728987")
            let errEmbed = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> An Error Occurred!").addField(`Caused by:`, `${message.member.user.tag}`).addField(`From the command:`, `${message.commandName}`).addField("From guild:", `${message.guild.name}, (${message.guild.id})`).addField("Error:", `You don't have permissions to kick people!`).setColor(bot.errorColor);
            errChannel.send({ embeds: [errEmbed] });
            const dontHavePerms = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> Error").setDescription("You don't have permissions to kick people!").setColor(bot.errorColor);
            return message.reply({ embeds: [dontHavePerms] });
        }
        if (!message.guild.me.permissions.has(Discord.Permissions.FLAGS.KICK_MEMBERS)) {
            let errChannel = client.channels.cache.get("907641692075728987")
            let errEmbed = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> An Error Occurred!").addField(`Caused by:`, `${message.member.user.tag}`).addField(`From the command:`, `${message.commandName}`).addField("From guild:", `${message.guild.name}, (${message.guild.id})`).addField("Error:", `**I** don't have permission to kick people!`).setColor(bot.errorColor);
            errChannel.send({ embeds: [errEmbed] });
            const youDontHavePerms = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> Error").setDescription("**I** don't have permission to kick people!").setColor(bot.errorColor);
            return message.reply({ embeds: [youDontHavePerms] });
        }
        let target = message.options.getMember('member');
        const NoKickable = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> Error").setDescription(`I do not have permission to kick this certain member (${target.user.username})`).setColor(bot.errorColor);
        if(!target.kickable) {
            let errChannel = client.channels.cache.get("907641692075728987")
            let errEmbed = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> An Error Occurred!").addField(`Caused by:`, `${message.member.user.tag}`).addField(`From the command:`, `${message.commandName}`).addField("From guild:", `${message.guild.name}, (${message.guild.id})`).addField("Error:", `I do not have permission to kick this certain member [**${target.user.username}**]`).setColor(bot.errorColor);
            errChannel.send({ embeds: [errEmbed] });
            return message.reply({ embeds: [NoKickable] });
        }
        let reason = message.options.getString('reason');
        if (!reason) reason="Unspecified";
        target.kick({
            reason: reason
        });
        const kickEmbed = new Discord.MessageEmbed().setDescription(`Kicked ${target.user.username} for ${reason}`).setColor(bot.errorColor);
        message.reply({ embeds: [kickEmbed] })
	}
}