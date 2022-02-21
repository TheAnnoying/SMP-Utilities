const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const Discord = require('discord.js');
const bot = require(`../config.json`);
const moment = require('moment');

module.exports = {
    name: 'snipe',
    aliases: [],
    usage: 'snipe <amount>',
    example: '/snipe 3',
    description: 'Get messages that were deleted!',
    permissions: ['Moderator', 'Admin'],
    data: new SlashCommandBuilder()
            .setName('snipe')
            .setDescription('Get messages that were deleted!')
            .addNumberOption(option => option.setName("number").setDescription("Number of snipe you wanna see").setRequired(true)),
    async execute(client, message, args) {
        const snipes = client.snipes.get(message.channel.id);
        let noSnipes = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> Error").setDescription("No recent messages were deleted").setColor(bot.errorColor);
        if(!snipes) return message.reply({ embeds: [noSnipes] });

        const snipe = message.options.getNumber("number")-1;
        const target = snipes[snipe]
        let thereisOnly1 = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> Error").setDescription(`There is only **${snipes.length}** message! Nothing else to delete.`).setColor(bot.errorColor);
        if(snipes.length === 1 && !target) return message.reply({ embeds: [thereisOnly1] });
        let snipesLength = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> Error").setDescription(`There are only **${snipes.length}** messages! Nothing else to delete.`)
        if(!target) return message.reply({ embeds: [snipesLength] });
        
try {
        const { msg, image } = target;

        console.log(msg)
        let embed = new Discord.MessageEmbed().setAuthor({ name: msg.author.username, iconURL: msg.author.displayAvatarURL() })
        .setImage(image)
        .setDescription(msg.content)
        .setColor(bot.accentColor);
        message.reply({
            embeds: [embed]
        })
    } catch (err){
        let errEmbed = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> Error").setDescription(`${err.message}`).setColor(bot.errorColor);
        message.reply({ embeds: [errEmbed] });
    }
	}
}