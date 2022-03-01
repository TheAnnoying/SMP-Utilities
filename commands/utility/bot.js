const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const bot = require(`../../config.json`);
const fs = require('fs/promises');
const normalFs = require('fs');
const fn = require("../../functions");

module.exports = {
    name: 'bot',
    aliases: [],
    usage: 'bot <type> <userid>',
    example: '/bot ban 749917031502970910',
    description: 'Ban / Unban someone from using this bot',
    options: {
        defer: false
    },
    permissions: ['Moderator', 'Admin'],
    data: new SlashCommandBuilder()
            .setName('bot')
            .setDescription('Ban / Unban someone from using this bot')
            .setDefaultPermission(false)
            .addSubcommand(subcommand =>
                subcommand.setName("ban")
                .setDescription("Ban a user from using this bot")
                .addUserOption(option => option.setName("member").setDescription("The user you wanna ban from the bot"))
            ).addSubcommand(subcommand =>
                subcommand.setName("unban")
                .setDescription("Unban a user from using this bot")
                .addStringOption(option =>
                    option.setName("member")
                    .setDescription("The user you wanna unban from the bot")
                    .setAutocomplete(true)
                )
            ).addSubcommand(subcommand =>
                    subcommand.setName("bans")
                    .setDescription("View the list of the bot banned users")
            ).addSubcommand(subcommand =>
                subcommand.setName("permissions")
                .setDescription("View the bot's permissions on this server")
            ).addSubcommand(subcommand =>
                subcommand.setName("credits")
                .setDescription("Credits to people who helped make this bot!")
            ).addSubcommand(subcommand =>
                subcommand.setName("news")
                .setDescription("See the latest bot news")
            ),
            async autocomplete(interaction) {
                guildFile = JSON.parse(await fs.readFile(`./moderationFiles/${interaction.guild.id}.json`));

                const focused = interaction.options.getFocused().toLowerCase();

                const respondArray = [];
                const matchingItems = guildFile.banned.filter(user => user.name.toLowerCase().includes(focused) );
                matchingItems.forEach(user => respondArray.push({ name: user.name, value: user.id }) );

                interaction.respond(respondArray);
            },
    async execute(client, message, args) {
        const guildFile = JSON.parse(await fs.readFile(`./moderationFiles/${message.guild.id}.json`));

        let subcmd = message.options.getSubcommand();

        if(subcmd === 'ban'){
            try {
                console.log("sup dawg")
                const warn = {
                    "id":`${message.options.getUser("member").id}`,
                    "name":`${message.options.getUser("member").username}`
                }
                const bannedUser = guildFile.banned.find(user => user.id === message.options.getUser("member").id);
                if(bannedUser) return message.reply({ embeds: [fn.sendError("This user is already bot-banned!")] });

                if(message.options.getUser("member").id === message.member.user.id) return message.reply({ embeds: [fn.sendError("You cannot bot-ban yourself")] });

                if(message.options.getUser("member").id === client.user.id) return message.reply({ embeds: [fn.sendError("You can't bot-ban me")] });

                guildFile.banned.push(warn);
                message.options.getUser("member").send({ embeds: [
                    new Discord.MessageEmbed()
                        .setTitle(`You are bot banned from ${message.guild.name}!`)
                        .setDescription(`This means that you are not able to use any of the bot commands or context menus in ${message.guild.name}.`)
                        .setFooter({
                            text: `${message.member.user.tag} bot banned you, If you feel like this was a mistake please send them a message!`,
                            iconURL: message.member.user.displayAvatarURL({ dynamic: true })
                        })
                        .setColor(bot.errorColor)
                    ]
                }).catch(() => {})
                await fn.saveData(guildFile, message);
                let bannedEmbed = new Discord.MessageEmbed().setTitle(`<:greencheck:914130307362484265> Successfully bot banned ${message.options.getUser("member").username}`).setColor("GREEN")
                return message.reply({ embeds: [bannedEmbed] });
            } catch(err){}
        }
        if(subcmd === 'unban'){
            try {
                const bannedUser = guildFile.banned.find(user => user.id === message.options.getString("member"));
                if(!bannedUser) {
                    message.reply({ embeds: [fn.sendError(`This user (${message.options.getUser("member").username}) is not bot banned`)] });
                } else {
                    guildFile.banned = guildFile.banned.filter(user => user.id !== message.options.getString("member"));
                    await fn.saveData(guildFile, message)
                    message.reply({ embeds: [
                        new Discord.MessageEmbed().setTitle(`<:greencheck:914130307362484265> Succesfully removed ${client.users.cache.get(message.options.getString("member")).username} from the bot bans!`).setColor("GREEN")
                    ]})
                    client.users.cache.get(message.options.getString("member")).send({ embeds: [
                        new Discord.MessageEmbed()
                            .setTitle(`Congratulations! You are now removed from the bot ban list of ${message.guild.name}!`)
                            .setDescription("This means that you are now able to use any of the bot commands or context menus in " + message.guild.name + ".")
                            .setColor("GREEN")
                        ]
                    }).catch(() => {})
                }
            } catch(err){}
        }
        if(subcmd === 'bans'){
            const banList = fn.sendError("There are no bot banned users");
            for(let i = 0; i<guildFile.banned.length; i++) {
                banList.setTitle(`Bot ban list`)
                banList.setColor(bot.accentColor);
                banList.setDescription(" ");
                banList.setAuthor({ name: `${message.guild.name} bans`, iconURL: message.guild.iconURL({ dynamic: true }) })
                banList.addField(`Member #${Math.floor(i+1)}`, `${guildFile.banned[i].name}`)
            };
            message.reply({ embeds: [banList] });
        }
        if(subcmd === 'credits'){
            message.reply({ embeds: [
                new Discord.MessageEmbed().setTitle("Credits")
            .addField(`${client.user.username}`, `Idea and implementation by <@588425966804533421>.
            [Ewan Howell](https://ewanhowell.com) helped with a lot of code parts and also helped making the website, his bot (Wynem) inspired many commands.
            <@675658958383349770> helped setting up slash commands, gave ideas, helped with autocomplete and <@749917031502970910> helped a lot with bugfinding. All the icons by: [JackDotJS](https://github.com/JackDotJS)`).setColor(bot.accentColor)                ]
            });
        }
        if(subcmd === 'permissions'){
            let perms = message.guild.me.permissions.toArray();
            perms = perms.map(perm =>
                perm = perm.replaceAll('_', ' ')
            );
            for(let i = 0; i<perms.length; i++) {
                perms[i] = `${perms[i].toTitleCase()}`
            }
            let botPermissions = new Discord.MessageEmbed()
                .setTitle(`${client.user.username}'s permissions in ${message.guild.name}`)
                .setColor(bot.accentColor);
                if(message.guild.iconURL()) botPermissions.setThumbnail(message.guild.iconURL())
                if(perms.includes("Administrator")){
                    botPermissions.addField("Allowed permissions", "Administrator", true)
                } else {
                    botPermissions.addField('Allowed permissions', perms.join(', \n'), true);
                }


            message.reply({ embeds: [botPermissions] })
        }
        if(subcmd === "news"){
            const channel = await client.channels.cache.get("938053194976743494")
            const messages = await channel.messages.fetch();
            const title = `${client.user.username} news`
            let charcount = title.length;
            const fields = [];
            for(const notice of messages){
                if(!notice[1].content) continue
                const date = `<t:${Math.floor(notice[1].createdAt/1000)}:D>`
                const text = notice[1].content.substring(0, 1024);
                charcount += date.length + text.length;
                if(charcount > 6000) break
                fields.push({ name: date, value: text })
            };
            message.reply({ embeds: [new Discord.MessageEmbed().setTitle(title).setThumbnail(client.user.displayAvatarURL()).addFields(fields).setColor(bot.accentColor) ] })
        }
	}
}
