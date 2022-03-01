const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const bot = require(`../../config.json`);
const fn = require('../../functions');
const { Canvas, loadImage } = require('skia-canvas');

module.exports = {
    name: 'slap',
    aliases: [],
    usage: 'slap @someone',
    example: '/slap @someone',
    description: 'Generate an image of you slapping someone',
    options: {
        defer: true
    },
    data: new SlashCommandBuilder()
        .setName('slap')
        .setDescription('Generate an image of you slapping someone')
        .addUserOption(option =>
            option.setName("member")
            .setDescription("The member you want to slap")
            .setRequired(true)
        ),
    async execute(client, message, args) {
        let slapped = await fn.loadAvatar(message.options.getMember("member"), 128);
        let slapper = await fn.loadAvatar(message.member, 128);

        const img = await loadImage("./AllIcons/banners/slap.png");
        const canvas = new Canvas(img.width, img.height);

        if(message.options.getMember('member').user.id === client.user.id) slapped = [slapper, slapper=slapped][0];

        const ctx = canvas.getContext("2d");

        ctx.drawImage(img, 0, 0);
        ctx.drawImage(slapper, 166, 22, 128, 128);

        fn.drawRotated(ctx, slapped, 368, 180, 128, 128, 35);

        fn.sendProcess(message);
        message.editReply({ files: [await fn.makeFile({ name: 'slap.png', canvas })], embeds: [new Discord.MessageEmbed().setImage(`attachment://slap.png`).setFooter({ text: `slap.png | ${img.width} x ${img.height}` }).setColor('#2f3136')] }).catch(() => {});
	}
};