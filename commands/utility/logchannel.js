const fn = require(`../../functions`);
const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const Discord = require('discord.js');
const bot = require(`../../config.json`);
const fsp = require(`fs/promises`);

module.exports = {
    name: 'logchannel',
    aliases: [],
    usage: 'logchannel #channel',
    example: '/logchannel #channel',
    description: 'Set a log channel that will log specific events that happen in the server',
    options: {
        defer: true
    },
    data: new SlashCommandBuilder()
            .setName('logchannel')
            .setDescription('Set a log channel that will log specific events that happen in the server')
            .addSubcommand(subcommand =>
                subcommand.setName("set")    
                .setDescription("Set a channel to have the logs in")
                .addChannelOption(option =>
                    option.setName("channel")    
                    .setDescription("The channel you want the logs to be sent in")
                    .addChannelTypes([Discord.Constants.ChannelTypes.GUILD_TEXT, Discord.Constants.ChannelTypes.GUILD_NEWS, Discord.Constants.ChannelTypes.GUILD_PUBLIC_THREAD, Discord.Constants.ChannelTypes.GUILD_PRIVATE_THREAD, Discord.Constants.ChannelTypes.GUILD_NEWS_THREAD])
                    .setRequired(true)
                )
            ).addSubcommand(subcommand =>
                subcommand.setName("remove")    
                .setDescription("Remove all the logs")
            ),
    async execute(client, message, args) {
        let subcmd = message.options.getSubcommand();
        let guildFile = JSON.parse(await fsp.readFile(`./moderationFiles/${message.guild.id}.json`));

        if(subcmd === 'set'){
            guildFile.logs.channel = null;
            guildFile.logs.types = [];
            await fn.saveData(guildFile, message);
            
            const selectmenu = await message.editReply({ embeds: [new Discord.MessageEmbed().setTitle("Selection started").setDescription("Please select any type of event you want to log").setColor(bot.accentColor)], components: [new Discord.MessageActionRow().addComponents(new Discord.MessageSelectMenu().setCustomId('log').setMinValues(1).setMaxValues(13).setPlaceholder(`Select in each type of event you want to be logged in!`).addOptions([{label: 'Channel creation/deletion',description: 'Log when channels are being created and deleted',value: '0',},{label: 'Emoji create/delete',description: 'Log when emojis get created or deleted',value: '1',},{label: 'Member bans/unbans', description: 'Log when a member gets banned.', value: '2',},{label: 'Member joins/leaves',description: 'Log when a member joins or leaves the server',value: '3',},{label: 'Guild events',description: 'Log when an event gets added or removed',value: '4',},{label: 'Invites',description: 'Log when someone creates or deletes a guild or channel invite',value: '5',},{label: 'Message events',description: 'Log when someone edits a message, deletes a message.',value: '6',},{label: 'Role creation/deletion',description: 'Log when someone creates or deletes a role',value: '7',},{label: 'Stage instance creation/deletion',description: 'Log when a stage instance creates or deletes',value: '8',},{label: 'Sticker creation/deletion',description: 'Log when a sticker gets created or deleted',value: '9',},{label: 'Thread creation/deletion',description: 'Log when a thread gets created or delete',value: '10',},{label: 'Voice channel joins/leaves',description: 'Log when someone joins a voice channel or leaves a voice channel',value: '11',},{label: 'Role add/remove',description: 'Log when a role gets added or removed from a member',value: '12',}]),)] });
            const collector = selectmenu.createMessageComponentCollector({ componentType: 'SELECT_MENU', time: 60000, max: 1 });
            collector.on('collect', async menu => {
                if(menu.customId === 'log' && menu.member.user.id === message.member.user.id) {
                    guildFile.logs.channel = `${message.options.getChannel("channel").id}`;
                    menu.values.forEach(value => {
                        guildFile.logs.types.push(value);
                    });

                    menu.reply({ embeds: [new Discord.MessageEmbed().setTitle(`Successfully added the logging system`).setDescription(`Added the logging system to this server on the channel <#${message.options.getChannel("channel").id}>`).setColor(bot.accentColor)] })
                    await fn.saveData(guildFile, message);
                };
            });
            collector.on('end', collected => {
                if(!collected.size) selectmenu.delete().catch(() => {});
            });   
        };

        if(subcmd === 'remove'){
            guildFile.logs.channel = null;
            guildFile.logs.types = [];

            message.editReply({ embeds: [new Discord.MessageEmbed().setTitle("Sucessfully removed the logging system").setColor(bot.accentColor)] })
            await fn.saveData(guildFile, message)
        };

        await fn.saveData(guildFile, message);
	}
}