
const { SlashCommandBuilder, ContextMenuCommandBuilder } = require('@discordjs/builders');
const Builders = require("@discordjs/builders");
const Discord = require('discord.js');
const bot = require(`../config.json`);
const translate = require('@iamtraction/google-translate');

module.exports = {
    name: 'Translate Message',
    aliases: [],
    usage: 'null',
    example: 'null',
    description: 'Translate messages to english',
    data: new ContextMenuCommandBuilder()
            .setName('Translate Message')
            .setType(3),
    async execute(client, message, args) {
        const msg = await message.channel.messages.fetch(message.targetId)
        const translated = await translate(msg, { to: 'en' });
        message.reply(`[${translated.text}](${msg.url})`);
    }
}