const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const Discord = require('discord.js');
const bot = require(`../../config.json`);
const fn = require(`../../functions`);
const fsp = require(`fs/promises`);
const Color = require('color');

module.exports = {
    name: 'joinmessage',
    aliases: [],
    usage: 'joinmessage <type> #channel <message> (use {ping} in the message to get the mentioned member, use {name} to get the members username use {tag} to get the discriminator only and use {nametag} to get the name and discriminator)',
    example: '/joinmessage set #welcome Hello {ping}! welcome to our server',
    description: 'Set a welcome message to your server for new members that join',
    options: {
        defer: false
    },
    data: new SlashCommandBuilder()
            .setName('joinmessage')
            .setDescription('Set a welcome message to your server for new members that join')
            .addSubcommand(subcommand =>
                subcommand.setName("set")    
                .setDescription("Set a channel to have the join message in")
                .addChannelOption(option =>
                    option.setName("channel")    
                    .setDescription("The channel you want the join message to be sent in")
                    .addChannelTypes([Discord.Constants.ChannelTypes.GUILD_TEXT, Discord.Constants.ChannelTypes.GUILD_NEWS, Discord.Constants.ChannelTypes.GUILD_PUBLIC_THREAD, Discord.Constants.ChannelTypes.GUILD_PRIVATE_THREAD, Discord.Constants.ChannelTypes.GUILD_NEWS_THREAD])
                    .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName("message")    
                    .setDescription("The message you want to be displayed, use the help subcommand for formatting options")
                    .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName("hexcolor")    
                    .setDescription("The hex color you want the join message to be displayed with")
                    .setRequired(false)
                )
            )
            .addSubcommand(subcommand =>
                subcommand.setName("remove")    
                .setDescription("Completely removes the join message")
            ).addSubcommand(subcommand =>
                subcommand.setName("help")    
                .setDescription("Get formatting help")
            ).addSubcommand(subcommand =>
                subcommand.setName("preview")
                .setDescription("Preview the join message")
            ),
    async execute(client, message, args) {
        let subcmd = message.options.getSubcommand();
        let guildFile = JSON.parse(await fsp.readFile(`./moderationFiles/${message.guild.id}.json`));
        if(subcmd === 'help'){
            return message.reply({ embeds: [
                    new Discord.MessageEmbed()
                        .setTitle("Formatting keywords")
                        .setDescription("The message you want to be displayed when a memebr joins the server, keywords in this message will be replaced when the message is sent.")
                        .addField("{ping}", "Mention the member")
                        .addField("{name}", "The members username")
                        .addField("{tag}", "The members discriminator")
                        .addField("{nametag}", "The members username and discriminator")
                        .setColor(bot.accentColor)
                ]
            });
        }

        if(subcmd === 'set'){
            guildFile.welcomeChannel = message.options.getChannel('channel').id;
            guildFile.welcomeMessage = message.options.getString('message');

            let hexcolor = message.options.getString('hexcolor');
            const output = Color(hexcolor).hex()
            guildFile.welcomeHexColor = output ?? bot.accentColor;
            await fn.saveData(guildFile, message);

            return message.reply({ embeds: [
                new Discord.MessageEmbed()
                    .setTitle("Welcome channel set")
                    .setDescription(`The welcome channel has been set as <#${message.options.getChannel('channel').id}>,`)
                    .setColor(bot.accentColor),
                new Discord.MessageEmbed()
                    .setDescription(`${message.options.getString('message').replaceAll("{ping}", `<@${message.member.user.id}>`).replaceAll("{name}", `${message.member.user.username}`).replaceAll("{tag}", `${message.member.user.discriminator}`).replaceAll("{nametag}", `${message.member.user.tag}`).replaceAll(/\\n/g, "\n")}`)
                    .setColor(guildFile.welcomeHexColor)
                ]
            })
        }

        if(subcmd === 'remove'){
            guildFile.welcomeChannel = null;
            guildFile.welcomeMessage = null;
            guildFile.welcomeHexColor = null;

            await fn.saveData(guildFile, message);

            return message.reply({ embeds: [new Discord.MessageEmbed().setTitle("Welcome channel removed!").setDescription("Successfully removed the welcome channel from this guild").setColor(bot.accentColor)]});
        }

        if(subcmd === 'preview'){
            if(!guildFile.welcomeChannel && !guildFile.welcomeMessage) return message.reply({ embeds: [fn.sendError("There is no welcome channel set for this guild")] });
            return message.reply({ embeds: [
                new Discord.MessageEmbed()
                    .setDescription(`${guildFile.welcomeMessage.replaceAll("{ping}", `<@${message.member.user.id}>`).replaceAll("{name}", `${message.member.user.username}`).replaceAll("{tag}", `${message.member.user.discriminator}`).replaceAll("{nametag}", `${message.member.user.tag}`).replaceAll(/\\n/g, "\n")}`).setFooter({ text: `Message will be sent at #${client.channels.cache.get(guildFile.welcomeChannel).name}` })
                    .setColor(guildFile.welcomeHexColor)
                ]
            });
        }
	}
}