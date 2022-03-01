const twemoji = require('twemoji');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const Discord = require('discord.js');
const bot = require(`../../config.json`);
const fs = require(`fs/promises`);
const fn = require(`../../functions`)

module.exports = {
    name: 'starboard',
    aliases: [],
    usage: 'starboard <channel> <emoji> <emoji requirement>',
    example: '/starboard #channel 🤐 3',
    description: 'Configure the starboard',
    options: {
        defer: false
    },
    data: new SlashCommandBuilder()
            .setName('starboard')
            .setDescription('Configure the starboard')
            .addSubcommand(subcommand =>
                subcommand.setName("set")
                .setDescription("Set a starboard system to this server")
                .addChannelOption(option =>
                    option.setName("channel")    
                    .setDescription("The channel you want to use for the starboard")
                    .addChannelTypes([Discord.Constants.ChannelTypes.GUILD_TEXT, Discord.Constants.ChannelTypes.GUILD_NEWS, Discord.Constants.ChannelTypes.GUILD_PUBLIC_THREAD, Discord.Constants.ChannelTypes.GUILD_PRIVATE_THREAD,  Discord.Constants.ChannelTypes.GUILD_NEWS_THREAD])
                    .setRequired(true)
                ).addStringOption(option => 
                    option.setName("emoji")    
                    .setDescription("The emoji you want to be used")
                ).addIntegerOption(option =>
                    option.setName("emoji-requirement")    
                    .setDescription("The amount of emojis required to be added into the starboard")
                    .setRequired(false)
                )
            ).addSubcommand(subcommand =>
                subcommand.setName("remove")    
                .setDescription("Remove the starboard from this server")
            ),
    async execute(client, message, args) {
        let subcmd = message.options.getSubcommand();
        let guildFile = JSON.parse(await fs.readFile(`./moderationFiles/${message.guild.id}.json`));

        if(subcmd === 'set'){
            guildFile.starboard.details[0] = message.options.getChannel('channel').id;

            guildFile.starboard.details[1] = `${message.options.getString("emoji")}`;
            guildFile.starboard.details[2] = message.options.getInteger('emoji-requirement');

            await fn.saveData(guildFile, message);

            return message.reply({ embeds: [
                new Discord.MessageEmbed()
                    .setTitle("Starboard set")
                    .setDescription(`The starboard channel has been set as <#${message.options.getChannel('channel').id}>, with a requirement of \`${message.options.getInteger('emoji-requirement')}\` ${message.options.getString('emoji')}`)
                    .setColor(bot.accentColor)
                ]
            })
        }

        if(subcmd === 'remove'){
            guildFile.starboard.details[0] = null;
            guildFile.starboard.details[1] = null;
            guildFile.starboard.details[2] = null;

            await fn.saveData(guildFile, message);

            return message.reply({ embeds: [new Discord.MessageEmbed().setTitle("Starboard removed!").setDescription("Successfully removed the starboard channel from this guild").setColor(bot.accentColor)]});
        }
	}
}