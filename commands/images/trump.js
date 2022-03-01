const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const bot = require(`../../config.json`);
const fn = require('../../functions');
const { Canvas, loadImage } = require('skia-canvas');

module.exports = {
    name: 'trump',
    aliases: [],
    usage: 'trump @someone',
    example: '/trump @someone',
    description: 'Generate an image of someone as trump',
    options: {
        defer: true
    },
    data: new SlashCommandBuilder()
        .setName('trump')
        .setDescription('Generate an image of someone as trump')
        .addUserOption(option =>
            option.setName("member")
            .setDescription("The member you want to make trump")
            .setRequired(true)
        ),
    async execute(client, message, args) {
        const trumpUser = await fn.loadAvatar(message.options.getMember("member"), 1024);

        const img = await loadImage("./AllIcons/banners/trump.png");
        const canvas = new Canvas(img.width, img.height);

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        ctx.drawImage(trumpUser, 873, 141, 700, 700);
        fn.sendProcess(message);
        
        message.editReply({ files: [await fn.makeFile({ name: 'trump.png', canvas })], embeds: [new Discord.MessageEmbed().setFooter({ text: `trump.png | ${img.width} x ${img.height}`}).setImage(`attachment://trump.png`).setColor('#2f3136')] }).then(() => message.channel.send({ content: '5sec'}));
	}
}