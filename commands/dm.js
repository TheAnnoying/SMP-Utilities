const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const bot = require('../config.json');

module.exports = {
    name: 'dm',
    aliases: [],
    usage: 'dm <id> <message>',
    example: '/dm 588425966804533421 hello!',
    description: 'DM a specific user',
    data: new SlashCommandBuilder()
            .setName('dm')
            .setDescription('DM a specific user')
            .addStringOption(option =>
                option.setName("id")    
               .setDescription("The ID of the user you wanna DM")
               .setRequired(true)
            ).addStringOption(option =>
                option.setName("message")
                .setDescription("The message you wanna send to the user")
                .setRequired(true)
            ),
    async execute(client, message, args) {

        if(message.member.user.id !== '588425966804533421'){
            let errorEmbed = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> Error").setDescription("You are not allowed to use this command! Only the bot author can.").setColor(bot.errorColor);
            let errChannel = client.channels.cache.get("907641692075728987")
            let errEmbed = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> An Error Occurred!").addField(`Caused by:`, `${message.member.user.tag}`).addField(`From the command:`, `${message.commandName}`).addField("From guild:", `${message.guild.name}, (${message.guild.id})`).addField("Error:", `You are not allowed to use this command! Only the bot author can.`).setColor(bot.errorColor);
            errChannel.send({ embeds: [errEmbed] });
            return message.reply({ embeds: [errorEmbed] });
        }
        const id = message.options.getString("id");
        const msg = message.options.getString("message");

        let user = client.users.cache.get(id);

        user.send(`${msg}`).catch(err => {
            let errorEmbed = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> Error").setDescription("Couldn't reach user! The ID might be invalid, Or the user doesn't have DM's enabled!").setColor(bot.errorColor);
            let errChannel = client.channels.cache.get("907641692075728987")
            let errEmbed = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> An Error Occurred!").addField(`Caused by:`, `${message.member.user.tag}`).addField(`From the command:`, `${message.commandName}`).addField("From guild:", `${message.guild.name}, (${message.guild.id})`).addField("Error:", `Couldn't reach user! The ID might be invalid, Or the user doesn't have DM's enabled!`).setColor(bot.errorColor);
            errChannel.send({ embeds: [errEmbed] });
            console.log(err);
            return message.reply({ embeds: [errorEmbed] });
        });
        let sentEmbed = new Discord.MessageEmbed().setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }) }).setDescription(msg).setFooter({ text: `Sent to ID: ${id}` }).setColor(bot.accentColor);
        return message.reply({ embeds: [sentEmbed] });

    }
}
