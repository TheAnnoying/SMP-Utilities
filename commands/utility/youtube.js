const { SlashCommandBuilder, ContextMenuCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const bot = require(`../../config.json`);
const fn = require(`../../functions`);
const ytsearch = require('yt-search');

module.exports = {
    name: 'youtube',
    aliases: [],
    usage: '/youtube <title>',
    example: '/youtube Top ten numbers through out one to ten!',
    description: 'Get a certain youtube video',
    options: {
        defer: false
    },
    data: new SlashCommandBuilder()
            .setName('youtube')
            .setDescription('Get a certain youtube video')
            .addStringOption(option => option.setName("title").setDescription("The title of you youtube video you wanna search for").setRequired(true)),
    async execute(client, message, args) {
        const res = await ytsearch(message.options.getString("title")).catch((e) => {
            return message.reply({ embeds: [fn.sendError(`No results were found!`)] });
        });
    
        if (!res.videos[0]) return message.reply({ embeds: [fn.sendError(`No results were found!`)] });

        return message.reply({ content: `${res.videos[0].url}` });
    }
}