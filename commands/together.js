const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const Discord = require('discord.js');
const client = require(`../index.js`);
const bot = require(`../config.json`);
let { DiscordTogether } = require('discord-together');
module.exports = {
    name: 'together',
    aliases: [],
    usage: 'together <channel> <type>',
    example: '/together #vc-1 Youtube',
    description: 'Use the discord together activities',
    data: new SlashCommandBuilder()
            .setName('together')
            .setDescription('Use the discord together activities')
            .addChannelOption(option =>
                option.setName("channel")
                .setDescription("Channel to play the activity on")
                .setRequired(true)  
            ).addStringOption(option =>
                option.setName("activity")
                .setDescription("What activity do you wanna play?")
                .addChoice("Youtube", "youtube")
                .addChoice("Poker", "poker")
                .addChoice("Chess", "chess")
                .addChoice("Checkers in the Park", "checkers")
                .addChoice("Betrayal", "betrayal")
                .addChoice("Fishington.io", "fishing")
                .addChoice("Letter Tile", "lettertile")
                .addChoice("Words Snack", "wordsnack")
                .addChoice("Doodle Crew", "doodlecrew")
                .addChoice("SpellCast", "spellcast")
                .addChoice("Awkword", "awkword")
                .addChoice("Puttparty", "puttparty")
            ),
    async execute(client, message, args) {
        if(message.options.getChannel("channel").type !== 'GUILD_VOICE'){
            let ErrEmbed = new Discord.MessageEmbed().setTitle("<:error:859830692518428682>  Error").setDescription("Please select a voice channel").setColor(bot.errorColor);
            let errChannel = client.channels.cache.get("907641692075728987")
            let errEmbed = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> An Error Occurred!").addField(`Caused by:`, `${message.member.user.tag}`).addField(`From the command:`, `${message.commandName}`).addField("From guild:", `${message.guild.name}, (${message.guild.id})`).addField("Error:", `Please select a voice channel`).setColor(bot.errorColor);
            errChannel.send({ embeds: [errEmbed] });
            return message.reply({ embeds: [ErrEmbed] });
        }
        client.discordTogether.createTogetherCode(message.options.getChannel("channel").id, `${message.options.getString("activity")}`).then(async invite => {
            let activityEmbed = new Discord.MessageEmbed().setTitle(`Press here to start!`).setURL(`${invite.code}`).setColor(bot.accentColor);
            return message.reply({ embeds: [activityEmbed] });
        });

        
	}
}