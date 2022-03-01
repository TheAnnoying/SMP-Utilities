const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const fs = require('fs/promises');
const fn = require('../../functions');
const bot = require('../../config.json');

module.exports = {
    name: 'wordblacklist',
    aliases: [],
    usage: 'wordblacklist <add/remove/list> <word>',
    example: '/wordblacklist add Muffin',
    description: 'Add a word to be blacklisted, Meaning members could not say it in chat',
    options: {
        defer: false
    },
    permissions: ['Admin', 'Moderator'],
    data: new SlashCommandBuilder()
            .setName('wordblacklist')
            .setDescription('Add a word to be blacklisted, Meaning members could not say it in chat')
            .setDefaultPermission(false)
            .addSubcommand(subcommand =>
                subcommand.setName("add")    
                .setDescription("Add a word to be blacklisted")
                .addStringOption(option => option.setName("word").setDescription("The word you want to add to the blacklist").setRequired(true))
            ).addSubcommand(subcommand =>
                subcommand.setName("remove")
                .setDescription("Remove a word from the blacklisted")    
                .addStringOption(option => 
                    option.setName("word")
                    .setDescription("The word you want to remove from the blacklist")
                    .setRequired(true)
                )
            ).addSubcommand(subcommand => 
                subcommand.setName("list")    
                .setDescription("Show a list of all the blacklisted words")
            ),
    async execute(client, message, args) {
        const guildFile = JSON.parse(await fs.readFile(`./moderationFiles/${message.guild.id}.json`));

        let subcmd = message.options.getSubcommand();

        if(subcmd === 'add'){
            if(guildFile.blacklistedWords.includes(message.options.getString('word').toLowerCase().replace(" ",""))){
                return message.reply({ embeds: [fn.sendError('This word is already blacklisted')] });
            };
            guildFile.blacklistedWords.push(message.options.getString("word").toLowerCase().replace(" ",""));
            await fn.saveData(guildFile, message);

            message.reply({ embeds: [new Discord.MessageEmbed().setTitle("Added a word to the blacklist!").setDescription(`You have added the word \`${message.options.getString("word")}\` to the blacklist`).setColor(bot.accentColor)], ephemeral: true})
        }

        if(subcmd === 'remove'){
            if(!guildFile.blacklistedWords.includes(message.options.getString('word').toLowerCase().replace(" ",""))) return message.reply({ embeds: [fn.sendError("This word is already NOT in the blacklist")] });
            guildFile.blacklistedWords.splice(guildFile.blacklistedWords.indexOf(message.options.getString("word").toLowerCase().replace(" ","")), 1)

            await fn.saveData(guildFile, message);

            message.reply({ embeds: [new Discord.MessageEmbed().setTitle("Removed a word from the blacklist!").setDescription(`You have removed the word \`${message.options.getString("word")}\` from the blacklist`).setColor(bot.accentColor)], ephemeral: true})

        }

        if(subcmd === 'list'){

            if(guildFile.blacklistedWords.length === 0) return message.reply({ embeds: [fn.sendError("There are no words in the blacklist")] });
            
            const blacklistedWordsEmbed = new Discord.MessageEmbed()
                .setTitle(`The list of blacklisted words on ${message.guild.name}`)
                .setColor(bot.accentColor)
                .setThumbnail(message.guild.iconURL({ dynamic: true }))

                for(let i = 0; i<guildFile.blacklistedWords.length; i++) {
                    blacklistedWordsEmbed.addField(`Word #${Math.floor(i+1)}`, `\`${guildFile.blacklistedWords[i]}\``)
                };

            message.reply({ embeds: [blacklistedWordsEmbed], ephemeral: true });
        }
	}
}