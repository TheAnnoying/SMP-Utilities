const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const bot = require(`../../config.json`);
const fn = require(`../../functions`);

module.exports = {
    name: 'tts',
    aliases: [],
    usage: '/tts <text>',
    example: '/tts Hello there',
    description: 'Use text to speech to say something',
    options: {
        defer: true
    },
    data: new SlashCommandBuilder()
            .setName('tts')
            .setDescription('Use text to speech to say something')
            .addStringOption(option => option.setName("text").setDescription("The text you want to turn to speech").setRequired(true))
            .addStringOption(option => option.setName("language").setDescription("The language you want to use").setRequired(false).setAutocomplete(true)),
        async autocomplete(interaction) {
            const focused = interaction.options.getFocused().toLowerCase();
            const respondArray = [];
            const filteredLangs = Object.entries(fn.languages).filter(([langId, langName]) => langId.includes(focused) || langName.includes(focused));
            filteredLangs.forEach(([langId, langName]) => {
                respondArray.push({
                    name: langName,
                    value: langId,
                });
            });
            if(respondArray.length >= 25) respondArray.length = 25;
            interaction.respond(respondArray);
        },
    async execute(client, message, args) {
        if(message.options.getString("text").length === 1000) return message.editReply({ embeds: [fn.sendError(`The text you entered is too long. Please enter a text less than 1000 characters.`) ]});
        const buff = await fn.gTTS(message.options.getString("text"), { lang: message.options.getString("language") });
        message.editReply({ files: [new Discord.MessageAttachment(buff, 'tts.mp3')] })
    }
}