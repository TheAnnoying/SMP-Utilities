const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const bot = require(`../../config.json`);
const fn = require('../../functions');
const { Canvas, loadImage } = require('skia-canvas');

module.exports = {
    name: 'hadouken',
    aliases: [],
    usage: 'hadouken @someone',
    example: '/hadouken @someone',
    description: 'Generate an image of you hadoukening someone',
    options: {
        defer: true
    },
    data: new SlashCommandBuilder()
        .setName('hadouken')
        .setDescription('Generate an image of you hadoukening someone')
        .addUserOption(option =>
            option.setName("member")
            .setDescription("The member you want to hadouken")
            .setRequired(true)
        ),
    async execute(client, message, args) {
        const hadoukener = await fn.loadAvatar(message.member, 128);
        const hadoukenized = await fn.loadAvatar(message.options.getMember("member"), 128);

        const img = await loadImage("./AllIcons/banners/hadouken.png");
        const canvas = new Canvas(img.width, img.height);

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        ctx.drawImage(hadoukener, 440, 508, 128, 128);
        ctx.drawImage(hadoukenized, 1093, 356, 128, 128);
        fn.sendProcess(message);
        message.editReply({ files: [await fn.makeFile({ name: 'hadouken.png', canvas })], embeds: [new Discord.MessageEmbed().setFooter({ text: `hadouken.png | ${img.width} x ${img.height}`}).setImage(`attachment://hadouken.png`).setColor('#2f3136')] }).catch(() => {});
	}
}