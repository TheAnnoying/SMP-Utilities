const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const bot = require(`../config.json`);

module.exports = {
    name: 'credits',
    aliases: [],
    usage: 'credits',
    example: '/credits',
    description: 'All the credits of the people who helped',
    data: new SlashCommandBuilder()
            .setName('credits')
            .setDescription('All the credits of all the people who helped'),
    execute(client, message, args) {
        const embed = new Discord.MessageEmbed()
            .setTitle("Credits")
            .addField("SMP Utilities", `Idea and implementation by <@588425966804533421>. 
            [Ewan Howell](https://ewanhowell.com) helped with some code parts and his bot (Wynem) inspired many commands. 
            <@675658958383349770> helped setting up slash commands and <@749917031502970910> helped a lot with bugfinding. He also helped me make timestamps`)
            .addField("SMP Economy", `Work in progress!
            Made by <@588425966804533421>`)
            .addField("Minecraft SMP Bot", "Currently developed alone by <@675658958383349770>. \n<@588425966804533421> helped testing and gave suggestions.").setColor(bot.accentColor)
            message.reply({ embeds: [embed] });

	}
}