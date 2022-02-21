const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const fs = require('fs/promises');
const bot = require('../config.json');
const ms = require('ms')
module.exports = {
    name: 'timeout',
    aliases: [],
    usage: 'timeout @someone',
    example: '/timeout @BadPerson <length> [reason]',
    description: 'Timeout someone',
    permissions: ['Moderator', 'Admin'],
    data: new SlashCommandBuilder()
            .setName('timeout')
            .setDescription('Timeout someone')
            .setDefaultPermission(false)
            .addUserOption(option =>
                option.setName("member")
                .setDescription("A member to timeout")
                .setRequired(true)
            ).addStringOption(option =>
                option.setName("length")    
                .setDescription("The amount of time you want to put someone in timeout")
                .setRequired(true)
            ).addStringOption(option =>
                option.setName("reason")
                .setDescription("Reason to timeout the member")
                .setRequired(false)
            ),
    async execute(client, message, args) {
        if(message.member.user.id !== '588425966804533421'){
            const notOwner = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> Error").setDescription("Hello there.. this is still a work in progress and only the bot developers can use it! You can use /mute to mute someone.").setColor(bot.errorColor)
            return message.reply({ embeds: [notOwner], ephemeral: true });
        }
        const noMutePerms = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> Error").setDescription('You do not have permissions to use this command').setColor(bot.errorColor)
        if(!message.member.permissions.has(Discord.Permissions.FLAGS.MODERATE_MEMBERS)) {
            let errChannel = client.channels.cache.get("907641692075728987")
            let errEmbed = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> An Error Occurred!").addField(`Caused by:`, `${message.member.user.tag}`).addField(`From the command:`, `${message.commandName}`).addField("From guild:", `${message.guild.name}, (${message.guild.id})`).addField("Error:", `You do not have permissions to use this command`).setColor(bot.errorColor);
            errChannel.send({ embeds: [errEmbed] });
            return message.channel.send({ embeds: [noMutePerms] });
        }
        const botHasNoPerms = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> Error").setDescription("I don't have permission to put people in timeout").setColor(bot.errorColor);
        if(!message.guild.me.permissions.has(Discord.Permissions.FLAGS.MODERATE_MEMBERS)) {
            let errChannel = client.channels.cache.get("907641692075728987")
            let errEmbed = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> An Error Occurred!").addField(`Caused by:`, `${message.member.user.tag}`).addField(`From the command:`, `${message.commandName}`).addField("From guild:", `${message.guild.name}, (${message.guild.id})`).addField("Error:", `I don't have permission to put people in timeout`).setColor(bot.errorColor);
            errChannel.send({ embeds: [errEmbed] });
            return message.channel.send({ embeds: [botHasNoPerms] });
        }
        let memberoption = message.options.getMember("member")
        let reason = message.options.getString("reason") ?? "Unspecified";
        let length = message.options.getString("length");

        const IDisAuthor = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> Error").setDescription("You can't timeout yourself").setColor(bot.errorColor);
        if(memberoption.user.id === message.member.user.id) {
            let errChannel = client.channels.cache.get("907641692075728987")
            let errEmbed = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> An Error Occurred!").addField(`Caused by:`, `${message.member.user.tag}`).addField(`From the command:`, `${message.commandName}`).addField("From guild:", `${message.guild.name}, (${message.guild.id})`).addField("Error:", `You can't timeout yourself`).setColor(bot.errorColor);
            errChannel.send({ embeds: [errEmbed] });
            return message.reply({ embeds: [IDisAuthor] });
        }

        const MuteMe = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> Error").setDescription("You can't timeout me... Muhaha!").setColor(bot.errorColor);
        if(memberoption.user.id === message.client.user.id) {
            let errChannel = client.channels.cache.get("907641692075728987")
            let errEmbed = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> An Error Occurred!").addField(`Caused by:`, `${message.member.user.tag}`).addField(`From the command:`, `${message.commandName}`).addField("From guild:", `${message.guild.name}, (${message.guild.id})`).addField("Error:", `You can't timeout me... Muhaha!`).setColor(bot.errorColor);
            errChannel.send({ embeds: [errEmbed] });
            return message.reply({ embeds: [MuteMe] });
        }
        await fs.access(`./moderationFiles/${memberoption.id}_${message.guild.id}.json`)
            .catch(err => {
                const newObject = {
                    name: `${memberoption.user.username}`,
                    warnAmount: 0,
                    muted: false,
                    timedout: false,
                    warns: [

                    ]
                };
                fs.writeFile(`./moderationFiles/${memberoption.id}_${message.guild.id}.json`, JSON.stringify(newObject, null, 2));
        });
        const target = JSON.parse(await fs.readFile(`./moderationFiles/${memberoption.id}_${message.guild.id}.json`));
        const timeinMS = ms(length);
        const AlreadyMuted = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> Error").setDescription(`${memberoption.displayName} is already in time out!`).setColor(bot.errorColor);
        if(target.timedout === true && memberoption.isCommunicationDisabled() === true) {
            let errChannel = client.channels.cache.get("907641692075728987")
            let errEmbed = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> An Error Occurred!").addField(`Caused by:`, `${message.member.user.tag}`).addField(`From the command:`, `${message.commandName}`).addField("From guild:", `${message.guild.name}, (${message.guild.id})`).addField("Error:", `${memberoption.displayName} is already in time out!`).setColor(bot.errorColor);
            errChannel.send({ embeds: [errEmbed] });
            return message.reply({ embeds: [AlreadyMuted] })
        }

        const wrongtime = new Discord.MessageEmbed().setColor(bot.errorColor).setTitle("<:error:859830692518428682> Error").setDescription(`Sorry I use **s** (seconds), **m** (minutes), **h** (hours), **d** (days), or **w** (weeks). Also make sure that the amount isn't bigger than 28 days!`);
        if(length.includes("-")) return message.reply({ embeds: [wrongtime] });
        if(timeinMS < 10000 || timeinMS > 2419200000) return message.reply({ embeds: [wrongtime] });
        if (
            !length.includes("1") &&
            !length.includes("2") &&
            !length.includes("3") &&
            !length.includes("4") &&
            !length.includes("5") &&
            !length.includes("6") &&
            !length.includes("7") &&
            !length.includes("8") &&
            !length.includes("9")
        ) {
            let errChannel = client.channels.cache.get("907641692075728987")
            let errEmbed = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> An Error Occurred!").addField(`Caused by:`, `${message.member.user.tag}`).addField(`From the command:`, `${message.commandName}`).addField("From guild:", `${message.guild.name}, (${message.guild.id})`).addField("Error:", `Sorry I use **s** (seconds), **m** (minutes), **h** (hours), **d** (days), or **w** (weeks). Also make sure that the amount isn't bigger than 28 days!`).setColor(bot.errorColor);
            errChannel.send({ embeds: [errEmbed] });
            return message.reply({ embeds: [wrongtime] })
        }
        if (
            !length.endsWith("d") &&  
            !length.endsWith("w") &&
            !length.endsWith("m") &&
            !length.endsWith("h") &&
            !length.endsWith("s")
        ) {
            let errChannel = client.channels.cache.get("907641692075728987")
            let errEmbed = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> An Error Occurred!").addField(`Caused by:`, `${message.member.user.tag}`).addField(`From the command:`, `${message.commandName}`).addField("From guild:", `${message.guild.name}, (${message.guild.id})`).addField("Error:", `Sorry I use **s** (seconds), **m** (minutes), **h** (hours), **d** (days), or **w** (weeks). Also make sure that the amount isn't bigger than 28 days!`).setColor(bot.errorColor);
            errChannel.send({ embeds: [errEmbed] });
            return message.reply({ embeds: [wrongtime] })
        }
        
        memberoption.timeout(timeinMS, reason)
        target.timedout = true;
        const em = new Discord.MessageEmbed().setTitle("<:greencheck:914130307362484265> Member was put in timeout").setDescription(`${memberoption.displayName} is now in timeout.`).setColor(bot.accentColor).addField("Length", `${length}`).addField("Reason", `${reason}`)
        message.reply({ embeds: [em] });
        setTimeout(async function () {
            try{
                target.timedout = false;
                await fs.writeFile(`./moderationFiles/${memberoption.id}_${message.guild.id}.json`, JSON.stringify(target, null, 2));
            }catch(err){

            } 
            
        }, timeinMS);
        await fs.writeFile(`./moderationFiles/${memberoption.id}_${message.guild.id}.json`, JSON.stringify(target, null, 2));
	}
}