const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const fs = require('fs/promises');
const bot = require('../config.json');

module.exports = {
    name: 'warn',
    aliases: [],
    usage: 'warn @someone <reason / description >',
    example: '/warn @Froogile You said a curse word',
    description: 'Warn a member',
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
        let subcmd = message.options.getSubcommand();
        if(subcmd === 'list'){
            //Getting the member option from the slash command and making a variable for it.
            let memberOption = message.options.getUser("member");

            //if there's no mentioned option, The variable will just be the user itself.
            if(!memberOption) memberOption = message.member.user;

            //Checking if the user has an account file.
            await fs.access(`./moderationFiles/${memberOption.id}_${message.guild.id}.json`).catch(err => {
                const newObject = {
                    name: `${memberOption.username}`,
                    warnAmount: 0,
                    muted: false,
                    timedout: false,
                    warns: [

                    ]
                };
                fs.writeFile(`./moderationFiles/${memberOption.id}_${message.guild.id}.json`, JSON.stringify(newObject, null, 2))
            });

            //Making a variable for the account so we can edit the account file anywhere in the code.
            const userAcc = JSON.parse(await fs.readFile(`./moderationFiles/${memberOption.id}_${message.guild.id}.json`));

            //Making a Discord embed.
            const warnlist = new Discord.MessageEmbed()
                .setTitle(`<:error:859830692518428682> Error`)
                .setDescription("This member has no warns. (Nice)")
                .setColor(bot.errorColor)
            for(let i = 0; i<userAcc.warns.length; i++) {
                warnlist.setTitle(`Warn list of ${memberOption.username}`)
                warnlist.setColor(bot.accentColor)
                warnlist.setDescription(" ")
                warnlist.setThumbnail(memberOption.displayAvatarURL({ dynamic: true }))
                warnlist.addField(`Warn #${Math.floor(i+1)}`, userAcc.warns[i].warnReason)
                warnlist.addField(`Muted`, userAcc.muted.toString().cap())
                warnlist.addField(`Timed out`, userAcc.timedout.toString().cap())
                warnlist.addField(`Moderator`, `<@${userAcc.warns[i].moderatorId}>\n`)
                warnlist.addField(`Date`, `<t:${userAcc.warns[i].time}:D>`);
                warnlist.addField('=============================================', '\u200b');
            };
            message.reply({ embeds: [warnlist] });

            //Writing the file so that everything we did will be saved.
            await fs.writeFile(`./moderationFiles/${memberOption.id}_${message.guild.id}.json`, JSON.stringify(userAcc, null, 2));
        }
        if(subcmd === 'remove'){
            try {
                //Getting the member option from the slash command and making a variable for it.
                let memberOption = message.options.getUser("member");
                if(!memberOption) memberOption = message.member.user;
                let num = message.options.getNumber("number");
                let invalidNumber = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> Error").setDescription("You've entered an invalid number!").setColor(bot.errorColor);

                if(num.toString().includes("-") || num === 0) {
                    let errChannel = client.channels.cache.get("907641692075728987")
                    let errEmbed = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> An Error Occurred!").addField(`Caused by:`, `${message.member.user.tag}`).addField(`From the command:`, `${message.commandName}`).addField("From guild:", `${message.guild.name}, (${message.guild.id})`).addField("Error:", `You've entered an invalid number!`).setColor(bot.errorColor);
                    errChannel.send({ embeds: [errEmbed] });
                    return message.reply({ embeds: [invalidNumber] });
                }
                let WarnMe = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> Error").setDescription("You can't warn me or remove warns from me!").setColor(bot.errorColor);
                if(memberOption.id === message.client.user.id) {
                    let errChannel = client.channels.cache.get("907641692075728987")
                    let errEmbed = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> An Error Occurred!").addField(`Caused by:`, `${message.member.user.tag}`).addField(`From the command:`, `${message.commandName}`).addField("From guild:", `${message.guild.name}, (${message.guild.id})`).addField("Error:", `You can't warn me or remove warns from me!`).setColor(bot.errorColor);
                    errChannel.send({ embeds: [errEmbed] });
                    return message.reply({ embeds: [WarnMe] });
                }
                //Checking if the user has an account file.
                await fs.access(`./moderationFiles/${memberOption.id}_${message.guild.id}.json`)
                    .catch(err => {
                        let newObject = {
                            name: `${memberOption.username}`,
                            warnAmount: 0,
                            muted: false,
                            timedout: false,
                            warns: [

                            ]
                        };
                        fs.writeFile(`./moderationFiles/${memberOption.id}_${message.guild.id}.json`, JSON.stringify(newObject, null, 2))
                });

                //Making a variable for the account so we can edit the account file anywhere in the code.
                let userAcc = JSON.parse(await fs.readFile(`./moderationFiles/${memberOption.id}_${message.guild.id}.json`));
                let realNum = num-1;
                let warnlist = new Discord.MessageEmbed()
                    .setTitle(`Removed a warn from ${memberOption.username}`)
                    .setThumbnail(memberOption.displayAvatarURL())
                    .addField("Warn Reason", `${userAcc.warns[--num].warnReason}`)
                    .addField("Warn Number", `${num}`)
                    .addField("Moderator", `<@${userAcc.warns[realNum].moderatorId}>`)
                    .addField("Date", `<t:${userAcc.warns[realNum].time}:D>`)
                    .setColor(bot.accentColor);
                message.reply({ embeds: [warnlist] });

                userAcc.warns.splice(realNum, 1)
                //Making a Discord embed.
                
                userAcc.warnAmount -= 1
                //Writing the file so that everything we did will be saved.
                await fs.writeFile(`./moderationFiles/${memberOption.id}_${message.guild.id}.json`, JSON.stringify(userAcc, null, 2));
            } catch (err){
                let errChannel = client.channels.cache.get("907641692075728987")
                let errEmbed = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> An Error Occurred!").addField(`Caused by:`, `${message.member.user.tag}`).addField(`From the command:`, `${message.commandName}`).addField("From guild:", `${message.guild.name}, (${message.guild.id})`).addField("Error:", `This warn probably does not exist!`).setColor(bot.errorColor);
                errChannel.send({ embeds: [errEmbed] });
                const errEmb2 = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> Error").setDescription("This warn probably does not exist!").setColor(bot.errorColor);
                message.reply({ embeds: [errEmb2] });
            }
        }
        if(subcmd === 'add'){
            //Getting the member option from the slash command and making a variable for it.
            let memberOption = message.options.getUser("member");

            let descReason = message.options.getString("reason")

            if(!descReason) descReason = "Unspecified";
            //if there's no mentioned option, The variable will just be the user itself.
            if(memberOption.id === message.member.user.id){
                let warnYourself = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> Error").setDescription("You cannot warn yourself").setColor(bot.errorColor);
                let errChannel = client.channels.cache.get("907641692075728987")
                let errEmbed = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> An Error Occurred!").addField(`Caused by:`, `${message.member.user.tag}`).addField(`From the command:`, `${message.commandName}`).addField("From guild:", `${message.guild.name}, (${message.guild.id})`).addField("Error:", `You cannot warn yourself`).setColor(bot.errorColor);
                errChannel.send({ embeds: [errEmbed] });
                return message.reply({ embeds: [warnYourself] });
            } 
            if(memberOption.bot){
                let warnBot = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> Error").setDescription("You cannot warn bots").setColor(bot.errorColor);
                let errChannel = client.channels.cache.get("907641692075728987")
                let errEmbed = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> An Error Occurred!").addField(`Caused by:`, `${message.member.user.tag}`).addField(`From the command:`, `${message.commandName}`).addField("From guild:", `${message.guild.name}, (${message.guild.id})`).addField("Error:", `You cannot warn bots`).setColor(bot.errorColor);
                errChannel.send({ embeds: [errEmbed] });
                return message.reply({ embeds: [warnBot] });
            }
            const WarnMe = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> Error").setDescription("You can't warn me... Muhaha!").setColor(bot.errorColor);
            if(memberOption.id === message.client.user.id){
                let errChannel = client.channels.cache.get("907641692075728987")
                let errEmbed = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> An Error Occurred!").addField(`Caused by:`, `${message.member.user.tag}`).addField(`From the command:`, `${message.commandName}`).addField("From guild:", `${message.guild.name}, (${message.guild.id})`).addField("Error:", `You can't warn me... Muhaha!`).setColor(bot.errorColor);
                errChannel.send({ embeds: [errEmbed] });
                return message.reply({ embeds: [WarnMe] });
            }
            //Checking if the user has an account file.
            await fs.access(`./moderationFiles/${memberOption.id}_${message.guild.id}.json`).catch(err => {
                const newObject = {
                    name: `${memberOption.username}`,
                    warnAmount: 0,
                    muted: false,
                    timedout: false,
                    warns: [

                    ]
                };
                fs.writeFile(`./moderationFiles/${memberOption.id}_${message.guild.id}.json`, JSON.stringify(newObject, null, 2));
            });

            //Making a variable for the account so we can edit the account file anywhere in the code.
            const userAcc = JSON.parse(await fs.readFile(`./moderationFiles/${memberOption.id}_${message.guild.id}.json`));

            const warn = {
                "warnReason": descReason,
                "time": `${Math.floor(Date.now() / 1000)}`,
                "moderator": `${message.member.user.tag}`,
                "moderatorId": `${message.member.user.id}`
            }
            userAcc.warns.push(warn);
            userAcc.warnAmount++;
            //Making a Discord embed.
            const warnlist = new Discord.MessageEmbed()
                .setTitle(`Warned ${memberOption.username}`)
                .setThumbnail(memberOption.displayAvatarURL({ dynamic: true }))
                .addField("Reason", descReason)
                .addField("Moderator", `<@${message.member.user.id}>`)
                .setColor(bot.accentColor);
            message.reply({ embeds: [warnlist] });

            //Writing the file so that everything we did will be saved.
            await fs.writeFile(`./moderationFiles/${memberOption.id}_${message.guild.id}.json`, JSON.stringify(userAcc, null, 2));
        }
	}
}