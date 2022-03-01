const { SlashCommandBuilder, time } = require('@discordjs/builders');
const Discord = require('discord.js');
const bot = require(`../../config.json`);

module.exports = {
    name: 'suggest',
    aliases: [],
    usage: 'suggest <suggestion>',
    example: '/suggest Add more commands!!!!!!',
    description: 'Suggest anything you want added to the bot!',
    data: new SlashCommandBuilder()
            .setName('suggest')
            .setDescription('Suggest anything you want added to the bot!')
            .addStringOption(option =>
                option.setName("suggestion")
                .setDescription("What do you wanna suggest us?")
                .setRequired(true)
            ),
    async execute(client, message, args) {
        let suggestiontest = message.options.getString('suggestion');
        //Getting who suggested as a variable
        let suggestedWho = message.member.user;
        const embed = new Discord.MessageEmbed().setColor(bot.accentColor).setAuthor({ name: `${suggestedWho.username}`, iconURL: `${suggestedWho.displayAvatarURL({ dynamic: true })}` }).setDescription(suggestiontest);
        
        const newEmbed = new Discord.MessageEmbed().setColor(bot.accentColor).setDescription("Sent your suggestion! Look in <#844493308045950996> to view it!");
        if(message.channel.id !== "844493308045950996"){
            const youSuggested = await message.reply({ embeds: [newEmbed]});
            setTimeout(() => {
                youSuggested.delete()
            }, 10000)
        }
        //A channel variable where the suggestion would be sent to
        const channelthing = message.guild.channels.cache.get("844493308045950996")
        //Getting the bot's suggestion embed as a message and reacting to it
        const botMessage = await channelthing.send({ embeds: [embed] });
        botMessage.react('<:checkmark2:887686603559010344>');
        botMessage.react('<:cross2:887686603881984070>');

        //Reaction Add event from discord.js library
	}
} 