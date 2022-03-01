const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const bot = require(`../../config.json`);
const fn = require('../../functions');
const { Canvas, loadImage } = require('skia-canvas');

module.exports = {
    name: 'hug',
    aliases: [],
    usage: 'hug @someone',
    example: '/hug @someone',
    description: 'Generate an image of you hugging your friends',
    options: {
        defer: true
    },
    data: new SlashCommandBuilder()
        .setName('hug')
        .setDescription('Generate an image of you hugging your friends')
        .addUserOption(option =>
            option.setName("member")
            .setDescription("The member you want to hug")
            .setRequired(true)
        ),
    async execute(client, message, args) {
        let slapped = await fn.loadAvatar(message.options.getMember("member"), 128);
        let slapper = await fn.loadAvatar(message.member, 128);

        const img = await loadImage("./AllIcons/banners/hug.png");
        const canvas = new Canvas(img.width, img.height);

        const ctx = canvas.getContext("2d");

        ctx.drawImage(img, 0, 0);
        ctx.drawImage(slapper, 268, 43, 150, 150);
        ctx.drawImage(slapped, 425, 84, 150, 150);

        fn.sendProcess(message);
        message.editReply({ files: [await fn.makeFile({ name: 'hug.png', canvas })], embeds: [new Discord.MessageEmbed().setImage(`attachment://hug.png`).setFooter({ text: `hug.png | ${img.width} x ${img.height}` }).setColor('#2f3136')] }).catch(() => {});
	}
};