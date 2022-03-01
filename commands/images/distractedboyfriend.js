const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const bot = require(`../../config.json`);
const fn = require('../../functions');
const { Canvas, loadImage } = require('skia-canvas');

module.exports = {
    name: 'distractedboyfriend',
    aliases: [],
    usage: 'distractedboyfriend <beautiful girlfriend> <boyfriend> <girlfriend>',
    example: '/distractedboyfriend @someone @someone @someone',
    description: 'Generate a distracted boyfriend image',
    options: {
        defer: true
    },
    data: new SlashCommandBuilder()
        .setName('distractedboyfriend')
        .setDescription('Get the profile picture of someone')
        .addUserOption(option =>
            option.setName("stranger")
            .setDescription("The beautiful girlfriend that the boyfriend is getting distracting by")
            .setRequired(true)
        ).addUserOption(option =>
            option.setName("boyfriend")
            .setDescription("The boyfriend that gets distracted")
            .setRequired(true)
        ).addUserOption(option =>
            option.setName("girlfriend")
            .setDescription("The girlfriend that walks with the boyfriend")
            .setRequired(true)
        ),
    async execute(client, message, args) {
        const stranger = await fn.loadAvatar(message.options.getMember("stranger"), 128);
        const boyfriend = await fn.loadAvatar(message.options.getMember("boyfriend"), 128);
        const girlfriend = await fn.loadAvatar(message.options.getMember('girlfriend'), 128);

        const img = await loadImage("./AllIcons/banners/distracted.png");
        const canvas = new Canvas(img.width, img.height);

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        ctx.drawImage(stranger, 175, 91, 128, 128);
        ctx.drawImage(girlfriend, 399, 47, 108, 108);
        ctx.drawImage(boyfriend, 627, 118, 94, 94);
        fn.sendProcess(message);
        message.editReply({ files: [await fn.makeFile({ name: 'distract.png', canvas })], embeds: [new Discord.MessageEmbed().setImage(`attachment://distract.png`).setFooter({ text: `distract.png | ${img.width} x ${img.height}` }).setColor('#2f3136')] }).catch(() => {});
	}
};