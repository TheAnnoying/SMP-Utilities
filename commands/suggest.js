const { SlashCommandBuilder, time } = require('@discordjs/builders');
const Discord = require('discord.js');
const bot = require(`../config.json`);

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
        const youSuggested = await message.reply({ embeds: [newEmbed]});
        setTimeout(() => {
            youSuggested.delete()
        }, 10000)
        //A channel variable where the suggestion would be sent to
        const channelthing = message.guild.channels.cache.get("844493685244297226")
        //Getting the bot's suggestion embed as a message and reacting to it
        const botMessage = await channelthing.send({ embeds: [embed] });
        botMessage.react('<:checkmark2:887686603559010344>');
        botMessage.react('<:cross2:887686603881984070>');

        //Reaction Add event from discord.js library
        client.on('messageReactionAdd', async (reaction, user) => {
            //Checking if the user who reacted is a bot, or if the reaction is not from the same guild or if the reaction author is not SMP Utilities then return
            if(user.bot || !reaction.message.guild || !reaction.message.author.id === '882604821612482600') return;
            //If we do have a reaction partial, then we fetch it
            if(reaction.message.partial) await reaction.message.fetch();
            if(reaction.partial) await reaction.fetch();

            //If someone has the admin role and they reacted with cross2 emoji
            if(reaction.message.member.roles.cache.has("844177255193903116") && reaction.emoji.name == 'cross2'){
                const newEmbed3 = new Discord.MessageEmbed().setAuthor({ name: suggestedWho.username, iconURL: suggestedWho.displayAvatarURL({ dynamic: true }) }).setTitle("<:redcross:861832219591835658> This suggestion was declined by an admin").addField("Suggestion", suggestiontest).addField("Declined by", `${user}`).setColor(bot.errorColor);
                return reaction.message.edit({ embeds: [newEmbed3] });
            }
            //If someone has the admin role and they reacted with checkmark2 emoji
            if(reaction.message.member.roles.cache.has("844177255193903116") && reaction.emoji.name == 'checkmark2'){
                const newEmbed2 = new Discord.MessageEmbed().setColor("GREEN").setTitle("<:success:859830498506702848> This suggestion was approved by an admin").addField("Suggestion", suggestiontest).addField(`Approved by`, `${user}`).setAuthor({ name: suggestedWho.username, iconURL: suggestedWho.displayAvatarURL({ dynamic: true }) })

                return reaction.message.edit({ embeds: [newEmbed2]});
            }
        });
	}
} 