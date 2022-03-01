const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const bot = require(`../../config.json`);
const fn = require("../../functions");
const fs = require(`fs/promises`);

module.exports = {
    name: 'tickets',
    aliases: [],
    usage: 'tickets <starting channel>',
    example: '/tickets #ticket-info',
    description: 'Setup which channel you want ticket threads to be in',
    options: {
        defer: false
    },
    data: new SlashCommandBuilder()
            .setName('tickets')
            .setDescription('Setup which channel you want ticket threads to be in')
            .addSubcommand(subcommand =>
                subcommand.setName('set')
                .setDescription('Set the channel for ticket threads')    
                .addChannelOption(option =>
                    option.setName("channel")    
                    .setDescription("The starting channel you want ticket threads to be in")
                    .addChannelTypes([Discord.Constants.ChannelTypes.GUILD_TEXT, Discord.Constants.ChannelTypes.GUILD_NEWS, Discord.Constants.ChannelTypes.GUILD_PUBLIC_THREAD, Discord.Constants.ChannelTypes.GUILD_PRIVATE_THREAD, Discord.Constants.ChannelTypes.GUILD_NEWS_THREAD])
                    .setRequired(true)
                )
            )
            .addSubcommand(subcommand =>
                subcommand.setName("remove")    
                .setDescription("Remove the channel for ticket threads")
            ),
    async execute(client, message, args) {
        const guildFile = JSON.parse(await fs.readFile(`./moderationFiles/${message.guild.id}.json`));
        console.log()
        if(message.options.getSubcommand() === "set") {
            if(guildFile.tickets.channel) await client.channels.cache.get(guildFile.tickets.channel).messages.fetch().then(e => e.find(m => m.author.id === client.user.id && m.embeds[0]?.description === "This channel is now the ticket channel.")).then(d => d.delete());
            
            if(message.guild.premiumSubscriptionCount === 0){
                if(!message.options.getChannel("channel").parentId) {
                    let ticketCategory = await message.guild.channels.create("Tickets", { type: "GUILD_CATEGORY" });
                    message.options.getChannel("channel").setParent(ticketCategory.id);
                }
                guildFile.tickets.category = message.options.getChannel("channel").parentId;
                guildFile.tickets.channel = message.options.getChannel("channel").id;
                const ChannelButtons = new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setCustomId("makec").setLabel("Create a support thread").setStyle("SUCCESS"),new Discord.MessageButton().setCustomId("removec").setLabel("Close your support thread").setStyle("DANGER"));
                message.reply({ embeds: [new Discord.MessageEmbed().setTitle("Successfully set a ticket channel").setDescription(`Successfully set the ticket channel to be #${message.options.getChannel("channel").name}`).setColor(bot.accentColor)] });
                message.options.getChannel("channel").send({ embeds: [new Discord.MessageEmbed().setAuthor({ name: `${message.guild.name} Tickets`, iconURL: `${message.guild.iconURL() ? `${message.guild.iconURL()}` : `${client.user.displayAvatarURL({ dynamic: true })}`}`}).setDescription(`This channel is now the ticket channel.`).setColor(bot.accentColor)], components: [ChannelButtons] });
                return await fn.saveData(guildFile, message);
            } else if(message.guild.premiumSubscriptionCount > 2){
                guildFile.tickets.channel = message.options.getChannel("channel").id;
                const ThreadButtons = new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setCustomId("make").setLabel("Create a support thread").setStyle("SUCCESS"),new Discord.MessageButton().setCustomId("remove").setLabel("Close your support thread").setStyle("DANGER"));
                message.reply({ embeds: [new Discord.MessageEmbed().setTitle("Successfully set a ticket channel").setDescription(`Successfully set the ticket channel to be #${message.options.getChannel("channel").name}`).setColor(bot.accentColor)] });
                message.options.getChannel("channel").send({ embeds: [new Discord.MessageEmbed().setAuthor({ name: `${message.guild.name} Tickets`, iconURL: `${message.guild.iconURL() ? `${message.guild.iconURL()}` : `${client.user.displayAvatarURL({ dynamic: true })}`}`}).setDescription(`This channel is now the ticket channel.`).setColor(bot.accentColor)], components: [ThreadButtons] });
                return await fn.saveData(guildFile, message);
            }
        } else if(message.options.getSubcommand() === "remove"){
            if(guildFile.tickets.channel === null) return message.reply({ embeds: [fn.sendError("You already have no ticket channel! Nothing to remove")] });
            await client.channels.cache.get(guildFile.tickets.channel).messages.fetch().then(e => e.find(m => m.author.id === client.user.id && m.embeds[0]?.description === "This channel is now the ticket channel.")).then(d => d.delete());
            message.reply({ embeds: [new Discord.MessageEmbed().setTitle("Successfully removed ticket channel").setDescription(`Successfully made <#${guildFile.tickets.channel}> no longer a ticket channel!`).setColor(bot.accentColor)] });
            guildFile.tickets.channel = null;
            await fn.saveData(guildFile, message);
        }
	}
}