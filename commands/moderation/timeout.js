const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const fs = require('fs/promises');
const fn = require('../../functions');
const bot = require('../../config.json');
const ms = require('ms');
const fsNormal = require('fs');
module.exports = {
    name: 'timeout',
    aliases: [],
    usage: 'timeout @someone',
    example: '/timeout @BadPerson <length> [reason]',
    description: 'Timeout someone',
    options: {
        defer: true
    },
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
        try {    
            if(!message.member.permissions.has(Discord.Permissions.FLAGS.MODERATE_MEMBERS)) return message.channel.send({ embeds: [fn.sendError("You do not have permissions to use this command")] });
            
            if(!message.guild.me.permissions.has(Discord.Permissions.FLAGS.MODERATE_MEMBERS)) return message.channel.send({ embeds: [fn.sendError("I don't have permission to put people in timeout")] });
            
            let memberoption = message.options.getMember("member");
            let reason = message.options.getString("reason") ?? "Unspecified";
            let length = message.options.getString("length");

            if(memberoption.roles.highest.position >= message.guild.me.roles.highest.position) return message.reply({ embeds: [fn.sendError("I can't put this user in timeout")] });
            
            if(memberoption.user.id === message.member.user.id) return message.reply({ embeds: [fn.sendError("You can't timeout yourself")] });

            if(memberoption.user.id === message.client.user.id) return message.reply({ embeds: [fn.sendError("You can't timeout me")] });
            
            await fn.checkForGuildFile(message.guild);
            await fn.checkForUserInGuild(memberoption.id, memberoption.user.username, message.guild.id);

            const target = JSON.parse(await fs.readFile(`./moderationFiles/${message.guild.id}.json`));
            const timeinMS = ms(length);
            if(memberoption.isCommunicationDisabled() === true) return message.reply({ embeds: [fn.sendError(`${memberoption.user.username} is already in time out!`)] });

            if(length.includes("-")) return message.reply({ embeds: [fn.sendError("Sorry I use **s** (seconds), **m** (minutes), **h** (hours), **d** (days), or **w** (weeks). Also make sure that the amount isn't bigger than 28 days!")] });
            if(timeinMS < 10000 || timeinMS > 2419200000) return message.reply({ embeds: [fn.sendError("Sorry I use **s** (seconds), **m** (minutes), **h** (hours), **d** (days), or **w** (weeks). Also make sure that the amount isn't bigger than 28 days!")] });
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
                return message.reply({ embeds: [fn.sendError("Sorry I use **s** (seconds), **m** (minutes), **h** (hours), **d** (days), or **w** (weeks). Also make sure that the amount isn't bigger than 28 days!")] })
            }
            if (
                !length.endsWith("d") &&  
                !length.endsWith("w") &&
                !length.endsWith("m") &&
                !length.endsWith("h") &&
                !length.endsWith("s")
            ) {
                return message.reply({ embeds: [fn.sendError("Sorry I use **s** (seconds), **m** (minutes), **h** (hours), **d** (days), or **w** (weeks). Also make sure that the amount isn't bigger than 28 days!")] })
            }
            
            memberoption.timeout(timeinMS, reason);

            target.users.find(user => user.id === memberoption.id).timedout = true;
            const em = new Discord.MessageEmbed().setTitle("<:greencheck:914130307362484265> Member was put in timeout").setDescription(`${memberoption.displayName} is now in timeout.`).setColor(bot.accentColor).addField("Length", `${length}`).addField("Reason", `${reason}`)
            message.reply({ embeds: [em] });
            setTimeout(async function() {
                try{
                    target.users.find(user => user.id === memberoption.id).timedout = false;
                    await fn.saveData(target, message);
                }catch(err){}
            }, timeinMS);
            await fn.saveData(target, message);
        } catch(err){
            return message.reply({ embeds: [fn.sendError(`${err.message}`)] });
        } 
	}
}