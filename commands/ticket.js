const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const Discord = require('discord.js');
const bot = require(`../config.json`);

module.exports = {
    name: 'ticket',
    aliases: [],
    usage: 'ticket',
    example: '/ticket',
    description: 'Open a ticket for support',
    data: new SlashCommandBuilder()
            .setName('ticket')
            .setDescription('Open a ticket for support'),
    async execute(client, message, args) {
        const Embed = new Discord.MessageEmbed().setAuthor({ name: "Smp Support Server Tickets", iconURL: message.guild.iconURL({ dynamic: true }) }).setDescription("Open a ticket to get direct support if you have specific issues").setColor(bot.accentColor);
        const Buttons = new Discord.MessageActionRow();
        Buttons.addComponents(new Discord.MessageButton().setCustomId("user").setLabel("User Report").setStyle("PRIMARY"), new Discord.MessageButton().setCustomId('bug').setLabel("Bug Report").setStyle("SECONDARY"), new Discord.MessageButton().setCustomId("other").setLabel("Other Issue").setStyle("SUCCESS"));

        await message.reply({ embeds: [Embed], components: [Buttons] });


	}
}