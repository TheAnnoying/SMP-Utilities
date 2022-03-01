const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const bot = require(`../../config.json`);
const fn = require("../../functions");

module.exports = {
    name: 'channel',
    aliases: [],
    usage: 'channel <type>',
    example: '/channel slowmode 1s',
    description: 'Lock or set a certain slowmode to a channel',
    options: {
        defer: false
    },
    permissions: ['Moderator', 'Admin'],
    data: new SlashCommandBuilder()
            .setName('channel')
            .setDescription('Lock or set a certain slowmode to a channel')
            .setDefaultPermission(false)
            .addSubcommand(subcommand =>
                subcommand.setName("slowmode")    
                .setDescription("Set a custom slowmode for this channel")
                .addStringOption(option =>
                    option.setName("length")
                    .setDescription("The length you want to set the slowmode to")
                    .setRequired(true)
                )
                .addChannelOption(option =>
                    option.setName("channel")    
                    .setDescription("The channel you want to set the slowmode to")
                    .addChannelTypes([Discord.Constants.ChannelTypes.GUILD_TEXT, Discord.Constants.ChannelTypes.GUILD_NEWS, Discord.Constants.ChannelTypes.GUILD_PUBLIC_THREAD, Discord.Constants.ChannelTypes.GUILD_PRIVATE_THREAD, Discord.Constants.ChannelTypes.GUILD_NEWS_THREAD])
                    .setRequired(false)
                )
            ).addSubcommand(subcommand =>
                subcommand.setName("lock")
                .setDescription("Lock a certain channel")    
                .addChannelOption(option =>
                    option.setName("channel")
                    .addChannelTypes([Discord.Constants.ChannelTypes.GUILD_TEXT, Discord.Constants.ChannelTypes.GUILD_NEWS, Discord.Constants.ChannelTypes.GUILD_PUBLIC_THREAD, Discord.Constants.ChannelTypes.GUILD_PRIVATE_THREAD, Discord.Constants.ChannelTypes.GUILD_NEWS_THREAD])
                    .setDescription("The channel you want to lock")
                )
            ),
    async execute(client, message, args) {
        const channel = message.options.getChannel("channel") ?? message.channel;

        switch(message.options.getSubcommand()) {
            case "slowmode":
                const length = message.options.getString("length");

                const wrongtime = fn.sendError("Sorry I use **s** (seconds), **m** (minutes), **h** (hours), **d** (days), or **w** (weeks)");

                if(length.includes("-")) return message.reply({ embeds: [wrongtime] });
                if (
                    !length.includes("1") &&
                    !length.includes("2") &&
                    !length.includes("3") &&
                    !length.includes("4") &&
                    !length.includes("5") &&
                    !length.includes("6") &&
                    !length.includes("7") &&
                    !length.includes("8") &&
                    !length.includes("9")
                ) {
                    return message.reply({ embeds: [wrongtime] })
                }
                if (
                    !length.endsWith("d") &&  
                    !length.endsWith("w") &&
                    !length.endsWith("m") &&
                    !length.endsWith("h") &&
                    !length.endsWith("s")
                ) {
                    return message.reply({ embeds: [wrongtime] })
                }
                const timer = await ms(time);
                if(!timer) {
                    return message.reply({ embeds: [wrongtime] });
                }
                channel.setRateLimitPerUser(timer);
                message.reply({ embeds: [new Discord.MessageEmbed().setTitle(`Set slowmode to ${length} for ${channel.name}`).setDescription(`Successfully set the slowmode of ${channel.name} to ${length}`).setColor(bot.accentColor)] });
                break;
            case "lock":
                if(!channel) return message.reply({ embeds: [fn.sendError("You need to specify a channel!")] });
                if(!channel.permissionsFor(message.guild.id).has("SEND_MESSAGES")) {
                    channel.permissionOverwrites.edit(message.guild.id, { SEND_MESSAGES: true });
                    return message.reply({ embeds: [new Discord.MessageEmbed().setTitle(`Unlocked ${channel.name}`).setDescription(`Successfully unlocked ${channel.name}`).setColor(bot.accentColor)] });
                }
                channel.permissionOverwrites.edit(message.guild.id, { SEND_MESSAGES: false });
                message.reply({ embeds: [new Discord.MessageEmbed().setTitle(`Locked ${channel.name}`).setDescription(`Successfully locked ${channel.name}`).setColor(bot.accentColor)] });
                break;
            default:
                message.reply({ embeds: [fn.sendError("Invalid subcommand!")] });
                break;
        }
	}
}