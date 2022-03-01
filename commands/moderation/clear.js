const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const bot = require(`../../config.json`);
const fn = require("../../functions");

module.exports = {
    name: 'clear',
    aliases: [],
    usage: 'clear <amount>',
    example: '/clear 69',
    description: 'Clear a certain amount of messages',
    options: {
        defer: true
    },
    permissions: ['Moderator', 'Admin'],
    data: new SlashCommandBuilder()
            .setName('clear')
            .setDescription('Clear a certain amount of messages')
            .setDefaultPermission(false)
            .addNumberOption(option =>
                option.setName("number")
                .setDescription("Enter a number ranging from 1 - 99")
                .setRequired(true)
            ),
    async execute(client, message, args) {
        try {
            let num = message.options.getNumber('number');
            if((num) < 1) return message.reply({ embeds: [fn.sendError("You cannot enter negative or not a full numbers!")] });
            
            if((num) > 100 || (num) === 100) return message.reply({ embeds: [fn.sendError("The max amount of messages that I can delete is 99 messages")] });
            
            await message.channel.bulkDelete(parseInt(num) + 1, true)
            
            let button = new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setCustomId("del").setLabel("DELETE THIS MESSAGE").setEmoji("🗑️").setStyle("SECONDARY"));
    
            let successEmbed = new Discord.MessageEmbed().setTitle("Success!").setDescription(`Deleted ${num} messages!`).setColor(bot.accentColor);
            if(num === 1) successEmbed.setDescription(`Deleted ${num} message!`);
            
            const confirmMessage = await message.channel.send({ embeds: [successEmbed], components: [button] });
            
            const collector = confirmMessage.createMessageComponentCollector({ componentType: 'BUTTON', time: 60000 });
                collector.on('collect', async button => {
                    try {
                    //Checking if the button pressed is the confirm button
                    const YouAreNotAuthor = new Discord.MessageEmbed().setTitle("Only the command author can use these buttons").setColor(bot.errorColor);
                    if(!button.member.user.id === message.member.user.id){
                        return button.message.reply({ embeds: [YouAreNotAuthor] });
                    } else if(button.customId === 'del'){
                        await button.deferUpdate();
                        button.message.delete()
                    }
                    } catch(err){}
                });
            collector.on('end', collected => {
                try {
                    if(!collected.size) {
                        confirmMessage.delete().catch(() => {});
                    }
                } catch(err){}
            });
        } catch (err) {
            message.followUp({ embeds: [fn.sendError(err.message)] });
            console.log(err)
        }
	}
}