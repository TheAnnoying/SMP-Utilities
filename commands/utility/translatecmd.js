const { SlashCommandBuilder, ContextMenuCommandBuilder } = require('@discordjs/builders');
const Builders = require("@discordjs/builders");
const Discord = require('discord.js');
const bot = require(`../../config.json`);
const translate = require('@iamtraction/google-translate');
const fn = require(`../../functions`);

module.exports = {
    name: 'translate',
    aliases: [],
    usage: '/translate <text> [to]',
    example: '/translate hola',
    description: 'Translate certain text to almost any language',
    options: {
        defer: false
    },
    data: new SlashCommandBuilder()
            .setName('translate')
            .setDescription('Translate certain text to almost any language')
            .addStringOption(option => option.setName("text").setDescription("The text you want to translate to English").setRequired(true))
            .addStringOption(option => option.setName("to").setDescription("To language")),
    async execute(client, message, args) {
        await message.channel.sendTyping().catch(() => {})
        const msg = message.options.getString("text");
        const to = message.options.getString("to");
        try {
        if(to){
            let translatedTo = await translate(msg, { to: to })
            message.reply({ embeds: [new Discord.MessageEmbed().setDescription(`${translatedTo.text}`).setFooter({ text: `Requested by ${message.member.user.tag}`, iconURL: `${message.member.user.displayAvatarURL()}` }).setColor(bot.accentColor)] });
        } else {
            let translated = await translate(msg, { to: 'en' })
            message.reply({ embeds: [new Discord.MessageEmbed().setDescription(`${translated.text}`).setFooter({ text: `Requested by ${message.member.user.tag}`, iconURL: `${message.member.user.displayAvatarURL()}` }).setColor(bot.accentColor)] });
        }
    } catch(err){
        return message.reply({ embeds: [fn.sendError(`${err.message.replaceAll("'", "`")}`)] });
    }
    }
}