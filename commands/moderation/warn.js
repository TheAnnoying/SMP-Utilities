const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const fs = require('fs/promises');
const fn = require('../../functions');
const bot = require('../../config.json');
const fsp = require('fs/promises');

module.exports = {
    name: 'warn',
    aliases: [],
    usage: 'warn @someone <reason / description >',
    example: '/warn @Froogile You said a curse word',
    description: 'Warn a member',
    options: {
        defer: false
    },
    permissions: ['Admin', 'Moderator'],
    data: new SlashCommandBuilder()
            .setName('warn')
            .setDescription('Warn a member')
            .setDefaultPermission(false)
            .addSubcommand(subcommand =>
                subcommand.setName('add')
                .setDescription("Add a warn to a member")    
                .addUserOption(option => 
                    option.setName("member")
                    .setDescription("Member to warn")
                    .setRequired(true)
                ).addStringOption(option =>
                    option.setName("reason")
                    .setDescription("The reason to warn")
                )
            ).addSubcommand(subcommand => 
                subcommand.setName("remove")
                .setDescription("Remove a warn from a member")
                .addUserOption(option => 
                    option.setName("member")
                    .setDescription("Member to remove a warn from")
                    .setRequired(true)
                ).addNumberOption(option =>
                    option.setName("number")
                    .setDescription("The warn number")
                    .setRequired(true)
                )
            ).addSubcommand(subcommand => 
                subcommand.setName("list")    
                .setDescription("Show all the warns a member has")
                .addUserOption(option => 
                    option.setName("member")
                    .setDescription("Member to see the warns of")
                )
            ),
    async execute(client, message, args) {
        let memberOption = message.options.getUser("member");
        if(!memberOption) memberOption = message.member.user;

        await fn.checkForGuildFile(message.guild);
        await fn.checkForUserInGuild(memberOption.id, memberOption.username, message.guild.id);

        const guildFile = JSON.parse(await fs.readFile(`./moderationFiles/${message.guild.id}.json`));
        let subcmd = message.options.getSubcommand();
        if(subcmd === 'list'){
            const warnlist = fn.sendError("This member has no warns. (Nice)");
            for(let i = 0; i<guildFile.users.find(user => user.id === memberOption.id)?.warns.length; i++) {
                warnlist.setTitle(`Warn list of ${memberOption.username}`)
                warnlist.setColor(bot.accentColor)
                warnlist.setDescription("_ _");
                warnlist.setAuthor({ name: `${memberOption.username}`, iconURL: `${memberOption.displayAvatarURL({ dynamic: true })}`})
                warnlist.setThumbnail(memberOption.displayAvatarURL({ dynamic: true }))
                warnlist.addField(`Warn #${Math.floor(i+1)}`, guildFile.users.find(user => user.id === memberOption.id).warns[i].warnReason)
                warnlist.addField(`Moderator`, `<@${guildFile.users.find(user => user.id === memberOption.id).warns[i].moderatorId}>\n`)
                warnlist.addField(`Date`, `<t:${guildFile.users.find(user => user.id === memberOption.id).warns[i].time}:D>`);
                warnlist.addField('=============================================', '\u200b');
            };
            message.reply({ embeds: [warnlist] });
        }
        if(subcmd === 'remove'){
            try {
                let num = message.options.getNumber("number");

                if(num.toString().includes("-") || num === 0) return message.reply({ embeds: [fn.sendError("You've entered an invalid number!")] });
                if(memberOption.id === message.client.user.id) return message.reply({ embeds: [fn.sendError("You can't warn me or remove warns from me!")] });
           
                let realNum = Math.floor(num-1);

                message.reply({ embeds: [new Discord.MessageEmbed().setTitle(`Removed a warn from ${memberOption.username}`).setThumbnail(memberOption.displayAvatarURL()).addField("Warn Reason", `${guildFile.users.find(user => user.id === memberOption.id).warns[--num].warnReason}`).addField("Warn Number", `${Math.floor(num+1)}`).addField("Moderator", `<@${guildFile.users.find(user => user.id === memberOption.id).warns[realNum].moderatorId}>`).addField("Date", `<t:${guildFile.users.find(user => user.id === memberOption.id).warns[realNum].time}:D>`).setColor(bot.accentColor)] });

                let userAcc = guildFile.users.find(user => user.id === memberOption.id)
                userAcc?.warns.splice(realNum, 1)
                
                if(userAcc?.warnAmount) userAcc.warnAmount -= 1
                
                await fn.saveData(guildFile, message);
            } catch (err){
                message.reply({ embeds: [fn.sendError("This warn probably does not exist!")] });
            }
        }
        if(subcmd === 'add'){
            let descReason = message.options.getString("reason") ?? "Unspecified";

            if(memberOption.id === message.member.user.id) return message.reply({ embeds: [fn.sendError("You cannot warn yourself")] });
            if(memberOption.bot) return message.reply({ embeds: [fn.sendError("You cannot warn bots")] });
            if(memberOption.id === message.guild.ownerID) return message.reply({ embeds: [fn.sendError("You can't warn the server owner!")] });
            if(memberOption.id === message.guild.me.id) return message.reply({ embeds: [fn.sendError("You can't warn me!")] });
            
            const warn = {
                "warnReason": descReason,
                "time": `${Math.floor(Date.now() / 1000)}`,
                "moderatorId": `${message.member.user.id}`
            }
            const userAcc = guildFile.users.find(user => user.id === memberOption.id);

            userAcc?.warns.push(warn)
            if(userAcc?.warnAmount) userAcc.warnAmount += 1

            const warnAddEmbed = new Discord.MessageEmbed().setTitle(`Warned ${memberOption.username}`).setThumbnail(memberOption.displayAvatarURL({ dynamic: true })).addField("Reason", descReason).addField("Moderator", `<@${message.member.user.id}>`).setColor(bot.accentColor);
            message.reply({ embeds: [warnAddEmbed] });


            await fn.saveData(guildFile, message);
        }
	}
}