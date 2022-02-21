
const { SlashCommandBuilder, ContextMenuCommandBuilder } = require('@discordjs/builders');
const Builders = require("@discordjs/builders");
const Discord = require('discord.js');
const bot = require(`../config.json`);
const translate = require('@iamtraction/google-translate');

module.exports = {
    name: 'translate',
    aliases: [],
    usage: '/translate <text> [to]',
    example: '/translate hola',
    description: 'Translate certain text to almost any language',
    data: new SlashCommandBuilder()
            .setName('translate')
            .setDescription('Translate certain text to almost any language')
            .addStringOption(option => option.setName("text").setDescription("The text you want to translate to English").setRequired(true))
            .addStringOption(option => option.setName("to").setDescription("To language")),
    async execute(client, message, args) {
        const msg = message.options.getString("text");
        const to = message.options.getString("to");
        try {
        if(to){
            let translatedTo = await translate(msg, { to: to })
            console.log(translatedTo)
            let embed = new Discord.MessageEmbed().setDescription(`${translatedTo.text}`).setFooter({ text: `Requested by ${message.member.user.tag}`, iconURL: `${message.member.user.displayAvatarURL()}` }).setColor(bot.accentColor);
            message.reply({ embeds: [embed] });
        } else {
            let translated = await translate(msg, { to: 'en' })
            let embed = new Discord.MessageEmbed().setDescription(`${translated.text}`).setFooter({ text: `Requested by ${message.member.user.tag}`, iconURL: `${message.member.user.displayAvatarURL()}` }).setColor(bot.accentColor);
            message.reply({ embeds: [embed] });
        }
    } catch(err){
        let errEmbed = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> Error").setDescription(`${err.message}`).setFooter({ text: `Requested by ${message.member.user.tag}`, iconURL: `${message.member.user.displayAvatarURL()}` }).setColor(bot.errorColor);
        return message.reply({ embeds: [errEmbed] });
    }
    }
}