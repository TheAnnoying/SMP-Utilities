const Discord = require('discord.js');
const fetch = require('node-fetch');
const pms = require("pretty-ms");

const difflib = require('difflib');
const fn = require('./functions');

const prefix = 't!'
const helpCommand = require('./help');

const client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MEMBERS,
        Discord.Intents.FLAGS.GUILD_INVITES,
        Discord.Intents.FLAGS.GUILD_PRESENCES,
        Discord.Intents.FLAGS.DIRECT_MESSAGES,
        Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Discord.Intents.FLAGS.GUILD_VOICE_STATES,
        Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Discord.Intents.FLAGS.GUILD_BANS,
    ],
    partials: [
        Discord.Constants.PartialTypes.MESSAGE,
        Discord.Constants.PartialTypes.CHANNEL,
        Discord.Constants.PartialTypes.REACTION,
        Discord.Constants.PartialTypes.USER,
        Discord.Constants.PartialTypes.GUILD_MEMBER,
    ],
    allowedMentions: {
        repliedUser: false
    }
});

const fs = require('fs');
const fsp = require('fs/promises');
const bot = require(`./config.json`);

client.commands = new Discord.Collection();
client.snipes = new Discord.Collection();
client.normalCommands = new Discord.Collection();
client.aliases = new Discord.Collection();

const commandList = [];

fs.readdir("./normalCommands/", (e, f) => {
    if(e) return console.error(e);
    f.forEach(file => {
        if(!file.endsWith(".js")) return;
        let cmd = require(`./normalCommands/${file}`);
        let cmdName = cmd.config.name;
        client.normalCommands.set(cmdName, cmd);
        cmd.config.aliases.forEach(alias => {
            client.aliases.set(alias, cmdName);
        });
        commandList.push(`${cmdName}`);
    });
});

//difflib.getCloseMatches(input, list to find closest from, how many results, set to 0 to never fail)[0]

if(!String.prototype.cap) String.prototype.cap = function(){
    return this[0].toUpperCase() + this.slice(1,this.length).toLowerCase()
};

if(!String.prototype.toTitleCase) String.prototype.toTitleCase = function(){
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()})
};

process.on("unhandledRejection", async error => {
    if(error instanceof Discord.DiscordAPIError){
        client.channels.cache.get("945055234768638002").send({ embeds: [new Discord.MessageEmbed().setTitle("New Discord API Error").setDescription(`${error.message}`).addField("Status", `${error.httpStatus}`).addField("Request", `${error.method.toUpperCase()} ${error.path}`).addField("Data", `${JSON.stringify(error.requestData.json)}`).addField("Stack", `${error.stack}`).setColor(bot.errorColor)]});
        console.log(`Message: ${error.message}`)
        console.log(`Status: ${error.httpStatus}`)
        console.log(`Request: ${error.method.toUpperCase()} ${error.path}`)
        console.log(`Data: ${JSON.stringify(error.requestData.json)}`)
        console.log(`Stack:\n\n${error.stack}`)
    }
    else {
        console.log(error);
    }
});

//Read ./commands and filter all nonJs files
const commandFolders = fs.readdirSync('./commands');
for(const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        //Require all commandFiles
        const command = require(`./commands/${folder}/${file}`);
        //Set all commandFiles in ./commands in client.commands collection
        client.commands.set(command.name, command);
    };
};

let testMode = false;

client.on("ready", async () => {
    client.guilds.cache.forEach(async guild => {
        await fn.checkForGuildFile(guild)
    });

    console.log(`Watching over ${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)} members across guilds!`)
    if(testMode === true) console.log(`Client online`);
    client.user.setPresence({ activities: [{ name: '/help', type: 'LISTENING' }]});

    if(testMode === true) {
        console.log(`
            ████████╗███████╗░█████╗░░█████╗░██╗░░██╗
            ╚══██╔══╝██╔════╝██╔══██╗██╔══██╗██║░░██║
            ░░░██║░░░█████╗░░██║░░██║██║░░╚═╝███████║
            ░░░██║░░░██╔══╝░░██║░░██║██║░░██╗██╔══██║
            ░░░██║░░░███████╗╚█████╔╝╚█████╔╝██║░░██║
            ░░░╚═╝░░░╚══════╝░╚════╝░░╚════╝░╚═╝░░╚═╝
            ░█ There are ${client.commands.size} slash commands, and ${commandList.length} prefixed commands.
            ░█ There are ${JSON.parse(fs.readFileSync(`./bot.json`)).users.length} banned users and the bot is in ${client.guilds.cache.size} guilds.
            ░█ The bot's accent color is ${require(`./config.json`).accentColor.toLowerCase()}, The error color is ${require(`./config.json`).errorColor.toLowerCase()} and the economy color is ${require(`./config.json`).economyColor.toLowerCase()}.
        `);
        // console.log(`
        //     ████████╗███████╗░█████╗░░█████╗░██╗░░██╗  
        //     ╚══██╔══╝██╔════╝██╔══██╗██╔══██╗██║░░██║  
        //     ░░░██║░░░█████╗░░██║░░██║██║░░╚═╝███████║  
        //     ░░░██║░░░██╔══╝░░██║░░██║██║░░██╗██╔══██║  
        //     ░░░██║░░░███████╗╚█████╔╝╚█████╔╝██║░░██║  
        //     ░░░╚═╝░░░╚══════╝░╚════╝░░╚════╝░╚═╝░░╚═╝  
        //     ░░ There are ${client.commands.size} slash commands, and ${commandList.length} prefixed commands.
        //     ██████╗░██╗░░░██╗████████╗  
        //     ██╔══██╗██║░░░██║╚══██╔══╝  
        //     ██████╦╝██║░░░██║░░░██║░░░  
        //     ██╔══██╗██║░░░██║░░░██║░░░  
        //     ██████╦╝╚██████╔╝░░░██║░░░  
        //     ╚═════╝░░╚═════╝░░░░╚═╝░░░  
        //     ░█ There are ${JSON.parse(fs.readFileSync(`./bot.json`)).users.length} banned users and the bot is in ${client.guilds.cache.size} guilds.
        //     ░█████╗░░██████╗░░█████╗░██╗███╗░░██╗
        //     ██╔══██╗██╔════╝░██╔══██╗██║████╗░██║
        //     ███████║██║░░██╗░███████║██║██╔██╗██║
        //     ██╔══██║██║░░╚██╗██╔══██║██║██║╚████║
        //     ██║░░██║╚██████╔╝██║░░██║██║██║░╚███║
        //     ╚═╝░░╚═╝░╚═════╝░╚═╝░░╚═╝╚═╝╚═╝░░╚══╝
        //     ░░ The bot's accent color is ${require(`./config.json`).accentColor.toLowerCase()}, The error color is ${require(`./config.json`).errorColor.toLowerCase()} and the economy color is ${require(`./config.json`).economyColor.toLowerCase()}.
        // `);
    }
});

/*----------BOT PERSONAL LOGS-----------*/
client.on("guildCreate", async guild => {
    await fn.createGuildData(guild);
    const JoinEmb = new Discord.MessageEmbed().setTitle("Joined new guild!").addField("Guild Info", `Guild Name: ${guild.name}\n Guild ID: ${guild.id}\n Guild MemberCount: ${guild.memberCount}`).setFooter({ text: `Bot is now on ${client.guilds.cache.size} servers!` }).setColor("YELLOW")
    if(guild.iconURL()) JoinEmb.setThumbnail(`${guild.iconURL()}`);
    client.channels.cache.get("945055252468613192").send({ embeds: [JoinEmb] });

    const attachment = new Discord.MessageAttachment(`./AllIcons/banners/banner_${client.user.id}.png`, `banner.png`)
    const prefixEm = new Discord.MessageEmbed().setTitle(`Thank you for inviting ${client.user.username}!`).setDescription("Use /help for more command info. I work on slash commands and I am a private bot (for now).").addField("Uptime", `${pms(client.uptime)}`, true).addField("Guilds", `${client.guilds.cache.size}`, true).addField("Commands", `${client.commands.size}`, true).setImage(`attachment://banner.png`).setColor(bot.accentColor).setThumbnail(client.user.displayAvatarURL({ dynamic: true, format: 'png' }));
    guild.channels.cache.find(channel => channel.type === 'GUILD_TEXT' && channel.permissionsFor(guild.me).has(Discord.Permissions.FLAGS.SEND_MESSAGES)).send({ embeds: [prefixEm], files: [attachment] });
});

client.on("guildDelete", async guild => {
    await fn.deleteGuildData(guild);
    const LeaveEmb = new Discord.MessageEmbed().setTitle("Left a guild!").addField("Guild Info", `Guild Name: __${guild.name}__
    Guild ID: __${guild.id}__
    Guild Member Count: __${guild.memberCount}__`
    ).setFooter({ text: `Bot is now on ${client.guilds.cache.size} servers!` }).setColor("RED")
    if(guild.iconURL()) LeaveEmb.setThumbnail(`${guild.iconURL()}`)
    client.channels.cache.get("945055252468613192").send({ embeds: [LeaveEmb] });
});
/*--------------------------------------*/


/*----------------HANDLERS--------------*/
client.on('interactionCreate', async interaction => {
    const guildFile = JSON.parse(await fsp.readFile(`./moderationFiles/${interaction.guild.id}.json`));

    let bannedUser = guildFile.users.find(user => user.id === interaction.member.user.id);
    if(bannedUser) return await interaction.reply({ embeds: [fn.sendError("You are bot-banned.")], ephemeral: true });

    if(interaction.isAutocomplete() && interaction.commandName === 'help') helpCommand.autocomplete(client, interaction);
    if(interaction.isAutocomplete()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        command.autocomplete(interaction);
    };

    if(!interaction.isCommand() && !interaction.isContextMenu() && !interaction.isButton()) return;
    if(interaction.isButton()){
        switch(interaction.customId) {
            case "remove":
                threadFinder = interaction.channel.threads.cache.find(thread => thread.name.split("-").pop() === interaction.member.user.id);
                if(threadFinder) {
                    interaction.reply({ embeds: [new Discord.MessageEmbed().setTitle("Ticket thread deleted").setDescription(`Successfully deleted your ticket thread! #${threadFinder.name}`).setColor(bot.accentColor)], ephemeral: true });
                    return threadFinder.delete();
                } else if(!threadFinder) {
                    return interaction.reply({ embeds: [fn.sendError("You have no ticket thread! Found nothing to delete")] });
                }
                break;
            case "make":
                if(interaction.channel.threads.cache.find(thread => thread.name.split("-").pop() === interaction.member.user.id)) return interaction.reply({ embeds: [fn.sendError("You already have a ticket open!")], ephemeral: true });

                interaction.channel.threads.create({ name: `${interaction.member.user.tag}-${interaction.member.user.id}` }).then(async(thread) => {
                    const Buttons = new Discord.MessageActionRow().addComponents(
                        new Discord.MessageButton()
                            .setCustomId("lock")
                            .setLabel("Lock")
                            .setStyle("SECONDARY")
                            .setEmoji("🔒"),
                        new Discord.MessageButton()
                            .setCustomId("unlock")
                            .setLabel("Unlock")
                            .setStyle("SECONDARY")
                            .setEmoji("🔓"),
                    );
                    
                    let description = ``
                    if(interaction.member.displayName === interaction.member.user.username) {
                        description = `<@${interaction.member.user.id}> has created a ticket. Here you can tell staff your issues and problems.`
                    } else {
                        description = `<@${interaction.member.user.id}> (${message.member.user.username}) has created a ticket. Here you can tell staff your issues and problems.`;
                    }
        
                    thread.send({ embeds: [new Discord.MessageEmbed().setTitle("Ticket created!").setDescription(description).setColor(bot.accentColor)], components: [Buttons] });
                    interaction.reply({ embeds: [new Discord.MessageEmbed().setTitle("Ticket created!").setColor(bot.accentColor).setDescription(`Your ticket has been created over at: <#${client.channels.cache.get(thread.id).id}>`)], ephemeral: true });
                });
            case "lock":
                if(!interaction.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_CHANNELS) || !interaction.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_MESSAGES)) return;

                if(!interaction.channel.isThread()) return;
                if(interaction.channel.locked === true) return interaction.reply({ embeds: [fn.sendError("This ticket has already been closed! You cannot lock it")], ephemeral: true })

                interaction.reply({ embeds: [new Discord.MessageEmbed().setTitle("Ticket locked").setDescription("This ticked is now locked.").setFooter({ text: `Locked by ${interaction.member.user.tag}`, iconURL: `${interaction.member.user.displayAvatarURL({ dynamic: true })}` }).setColor(bot.accentColor)] });
                interaction.channel.setLocked(true);
                break;
            case "unlock":
                if(!interaction.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_CHANNELS) || !interaction.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_MESSAGES)) return

                if(!interaction.channel.isThread()) return;
                if(interaction.channel.locked === false) return interaction.reply({ embeds: [fn.sendError("This ticket has already unlocked!")], ephemeral: true })

                interaction.reply({ embeds: [new Discord.MessageEmbed().setTitle("Ticket unlocked").setDescription("This ticked is now unlocked.").setColor(bot.accentColor).setFooter({ text: `Unlocked by ${interaction.member.user.tag}`, iconURL: `${interaction.member.user.displayAvatarURL({ dynamic: true })}` })] });
                interaction.channel.setLocked(false);
                break;

            case "removec":
                threadFinder = client.channels.cache.get(interaction.channel.parentId).children.cache.find(thread => thread.name.split("-").pop() === interaction.member.user.id);
                if(threadFinder) {
                    interaction.reply({ embeds: [new Discord.MessageEmbed().setTitle("Ticket thread deleted").setDescription(`Successfully deleted your ticket thread! #${threadFinder.name}`).setColor(bot.accentColor)], ephemeral: true });
                    return threadFinder.delete();
                } else if(!threadFinder) {
                    return interaction.reply({ embeds: [fn.sendError("You have no ticket thread! Found nothing to delete")] });
                }
                break;
        }
        return;
    }
    //args array for easier command use
    //args are like args from messageCreate (They include the group and subcommand if one set)
    const args = [];
    if(interaction.options._group) args.push(interaction.options._group);
    if(interaction.options._subcommand) args.push(interaction.options._subcommand);
    interaction.options._hoistedOptions.forEach(option => {
        if(option.value) args.push(option.value);
    });

    //Help command
    if (interaction.commandName === 'help') {
        await interaction.deferReply();

        helpCommand.execute(client, interaction, args);
    } else {
        //Other Commands
        const command = client.commands.get(interaction.commandName);
        if (!command) return;
        if(interaction.isButton()) return;
        if(command.options?.defer === true) await interaction.deferReply()
        if(command.options?.devOnly === true && interaction.member.user.id !== "588425966804533421") return interaction.reply({ embeds: [fn.sendError("This command is only for developers!")] });
        command.execute(client, interaction, args).catch(err => {
            console.log(err);
            client.channels.cache.get("945055234768638002").send({ embeds: [new Discord.MessageEmbed().setTitle("🚫 An Error Occurred!").addField(`Caused by:`, `${interaction.member.user.tag}`).addField(`From the command:`, `${interaction.commandName}`).addField("From guild:", `${interaction.guild.name}, (${interaction.guild.id})`).addField("Error:", `${err}`).setColor(bot.errorColor)] });
        });
    }
});

client.on("messageCreate", async message => {
    if(message.author.id === client.user.id) return;

    if(JSON.parse(await fsp.readFile(`./moderationFiles/${message.guild.id}.json`)).users.find(user => user.id === message.author.id)) return;
    if(message.channel.type === 'DM'){
        if(message.author.id === client.user.id) return;

        const DMEmbed = new Discord.MessageEmbed().setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true })}).setColor(bot.accentColor).setDescription(`${message}`).setFooter({ text: `ID: ${message.author.id}`});
        if(message.attachments.size > 0) DMEmbed.setImage(message.attachments.first().url.toString());
        client.channels.cache.get("945055242830110760").send({ embeds: [DMEmbed] });
    }
    // let non_caps = 0
    // let caps = 0;
    // for (let x=0; x<message.content.length; x++) {
    //   if (message.content[x].toUpperCase() === message.content[x]) caps++;
    //   else non_caps++;
    // }  
    // const textCaps = (caps / message.content.length) * 100;
    // if (textCaps >= 80) message.delete() 

    let guildFile = JSON.parse(await fsp.readFile(`./moderationFiles/${message.guild.id}.json`));
    if(guildFile.blacklistedWords.length !== 0 && !message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)){
        guildFile.blacklistedWords.forEach(word => {
            if(message.content.toLowerCase().replaceAll(" ","").includes(word)){
                return message.delete().catch(err => {});
            };
        });
    };
    const attachment = new Discord.MessageAttachment(`./AllIcons/banners/banner_${client.user.id}.png`, `banner.png`);

    if(message.content === `<@${client.user.id}>` || message.content === `<@!${client.user.id}>`){
        const prefixEm = new Discord.MessageEmbed()
        .setTitle("Info").setDescription("Use /help for more command info. I work on slash commands and I am a private bot (for now).")
        .addField("Uptime", `${pms(client.uptime)}`, true)
        .addField("Guilds", `${client.guilds.cache.size}`, true)
        .addField("Commands", `${client.commands.size}`, true)
        .setImage(`attachment://banner.png`)
        .setColor(bot.accentColor)
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true, format: 'png' }));
        console.log(message.guild.members.cache.filter(member => member.user.id === client.user.id))
        message.reply({ embeds:[ prefixEm], files: [attachment] });
    }
    if(!message.content.startsWith(prefix) || message.author.bot) return;
    const normalArgs = message.content.slice(prefix.length).trim().split(/ +/g)
    const normalCommand = normalArgs.shift().toLowerCase();

    const normalCmd = client.normalCommands.get(normalCommand) || client.normalCommands.get(client.aliases.get(normalCommand))
    if(!normalCmd) {
        if(message.content === prefix) return;

        const YesButton = new Discord.MessageActionRow().addComponents(
            new Discord.MessageButton().setCustomId("yesbutton").setLabel("Run").setEmoji("<:checkMarkWhite:929450340108091392>").setStyle("SUCCESS"),
            new Discord.MessageButton().setCustomId("nobutton").setLabel("Delete").setEmoji("<:DeleteWhite:929451048995799082>").setStyle("DANGER"),
            new Discord.MessageButton().setCustomId("infobutton").setLabel("Info").setEmoji("<:wrench:929452536337944636>").setStyle("PRIMARY")
        );

        const recommendMessage = await message.channel.send({ components: [YesButton], embeds: [fn.sendError(`Did you mean to execute the command \`${prefix}${difflib.getCloseMatches(normalCommand, commandList, 1, 0)[0]}\`?`) ] });
        //Making a collector that collects when we press the button.
        const collector = recommendMessage.createMessageComponentCollector({ componentType: 'BUTTON', time: 60000 });
        collector.on('collect', async button => {
            if(button.member.user.id !== message.member.user.id && (button.customId !== 'infobutton')){
                await button.deferUpdate({ ephemeral: true });
                button.followUp({ embeds: [new Discord.MessageEmbed().setTitle("You are not the command author").setColor(bot.errorColor)], ephemeral: true });
            }
            if(button.member.user.id !== message.member.user.id && (button.customId === 'infobutton')){
                await button.deferUpdate({ ephemeral: true });
                button.followUp({ embeds: [new Discord.MessageEmbed().setTitle("Not added yet!").setColor(bot.errorColor)], ephemeral: true });
                console.log("Used info")
            }
            //Checking if the button pressed is the confirm button
            if(button.customId === 'yesbutton' && button.member.user.id === message.member.user.id){
                await button.deferUpdate();
                button.message.delete();
                return client.normalCommands.get(difflib.getCloseMatches(normalCommand, commandList, 1, 0)[0]).run(client, message, normalArgs, testMode);
            }
            if(button.customId === 'nobutton' && button.member.user.id === message.member.user.id){
                await button.deferUpdate();
                button.message.delete();
                message.delete();
            }
            if(button.customId === 'infobutton' && button.member.user.id === message.member.user.id){
                await button.deferUpdate({ ephemeral: true });
                button.followUp({ content: "Added soon!", ephemeral: true})
            }
        });
        collector.on('end', collected => {
            if(!collected.size) {recommendMessage.delete(); message.delete();}
        });
    } else {
        try {
            normalCmd.run(client, message, normalArgs, testMode);
        }catch (err){
            return console.error(err)
        }
    }
});

client.on('messageReactionAdd', async (reaction, user) => {
    //Checking if the user who reacted is a bot, or if the reaction is not from the same guild or if the reaction author is not SMP Utilities then return
    if(user.bot || !reaction.message.guild || !reaction.message.author.id === '882604821612482600') return;
    //If we do have a reaction partial, then we fetch it
    if(reaction.message.partial) await reaction.message.fetch();
    if(reaction.partial) await reaction.fetch();
    if(reaction.channel.id !== "844493308045950996") return;
    //If someone has the admin role and they reacted with cross2 emoji
    if(message.guild.members.cache.find(member => member.id === user.id).roles.cache.has("844177255193903116") && reaction.emoji.name == 'cross2'){
        const newEmbed3 = new Discord.MessageEmbed().setAuthor({ name: suggestedWho.username, iconURL: suggestedWho.displayAvatarURL({ dynamic: true }) }).setTitle("<:redcross:861832219591835658> This suggestion was declined by an admin").addField("Suggestion", suggestiontest).addField("Declined by", `${user}`).setColor(bot.errorColor);
        return reaction.message.edit({ embeds: [newEmbed3] });
    }
    //If someone has the admin role and they reacted with checkmark2 emoji
    if(message.guild.members.cache.find(member => member.id === user.id).roles.cache.has("844177255193903116") && reaction.emoji.name == 'checkmark2'){
        const newEmbed2 = new Discord.MessageEmbed().setColor("GREEN").setTitle("<:success:859830498506702848> This suggestion was approved by an admin").addField("Suggestion", suggestiontest).addField(`Approved by`, `${user}`).setAuthor({ name: suggestedWho.username, iconURL: suggestedWho.displayAvatarURL({ dynamic: true }) })

        return reaction.message.edit({ embeds: [newEmbed2]});
    }
});

/*--------------------------------------*/


/*----------------RANDOM----------------*/
client.on("guildMemberUpdate", async (oldMember, newMember) => {
    let guildFile = JSON.parse(await fsp.readFile(`./moderationFiles/${newMember.guild.id}.json`));

    //Check if the member roles updated
    if(oldMember.roles.cache.size !== newMember.roles.cache.size){
        if(!guildFile.logs.types.includes("12")) return;
        //Check for role differences
        oldMember.roles.cache.forEach(async role => {
            if(!newMember.roles.cache.has(role.id)){
                await fn.sendLog(newMember.guild.id, client, new Discord.MessageEmbed().setThumbnail(newMember.displayAvatarURL({ dynamic: true })).setColor("RED").setAuthor({ name: "Role removed", iconURL: `https://cdn.discordapp.com/emojis/947592023219769444.webp?size=96&quality=lossless` }).addField("Role", `<@&${role.id}>`).addField("Member", `${newMember}`).setFooter({ text: `${role.id} - ${newMember.id}`}).setTimestamp(Date.now()));
            }
        }
        );
        newMember.roles.cache.forEach(async role => {
            if(!oldMember.roles.cache.has(role.id)){
                await fn.sendLog(newMember.guild.id, client, new Discord.MessageEmbed().setColor("GREEN").setThumbnail(newMember.displayAvatarURL({ dynamic: true })).setAuthor({ name: "Role added", iconURL: `https://cdn.discordapp.com/emojis/947592219974565939.webp?size=96&quality=lossless` }).addField("Role", `<@&${role.id}>`).addField("Member", `${newMember}`).setFooter({ text: `${role.id} - ${newMember.id}`}).setTimestamp(Date.now()));
            }
        }
        );
    }
});
/*--------------------------------------*/


/*--------------STAR BOARD--------------*/
client.on("messageReactionAdd", async(reacton, user) => {
    let reaction = await reacton.message.fetch();
    if(reaction.member.user.id === client.user.id && reacton._emoji.name === '❌') return reaction.delete();
});
/*--------------------------------------*/


/*---------------BOT LOGS---------------*/
client.on("channelCreate", async(channel) => {
    let guildFile = JSON.parse(await fsp.readFile(`./moderationFiles/${channel.guild.id}.json`));
    
    if(!guildFile.logs.types.includes("0")) return;
    await fn.sendLog(channel.guild.id, client, new Discord.MessageEmbed().setColor("GREEN").setAuthor({ name: "Channel created", iconURL: `https://cdn.discordapp.com/emojis/945401594520956968.webp?size=96&quality=lossless` }).addField("Channel name", `${channel.name}`).addField("Type", `${channel.type.toString().replace("_"," ").toTitleCase()}`).setFooter({ text: `${channel.id}`}).setTimestamp(Date.now()));
});

client.on("channelDelete", async(channel) => {
    let guildFile = JSON.parse(await fsp.readFile(`./moderationFiles/${channel.guild.id}.json`));

    if(channel.id === guildFile.starboard.details[0]){guildFile.starboard.details[0] = null}
    if(channel.id === guildFile.logs.channel){guildFile.logs.channel = null}
    if(channel.id === guildFile.welcomeChannel){guildFile.welcomeChannel = null}
    if(channel.id === guildFile.leaveChannel){guildFile.leaveChannel = null}
    if(channel.id === guildFile.tickets.channel){guildFile.tickets.channel = null}
    await fn.saveData(guildFile, channel);
    
    // if(guildFile.tickets.tickets.find(ticket => ticket.channelId === channel.id)){
    //     guildFile.tickets.tickets.splice(guildFile.tickets.tickets.findIndex(item => item.id === `${channel.id}`), 1)
    //     await fn.saveData(guildFile, channel);
    // }
    if(!guildFile.logs.types.includes("0")) return;
    await fn.sendLog(channel.guild.id, client, new Discord.MessageEmbed().setColor("RED").setAuthor({ name: "Channel deleted", iconURL: `https://cdn.discordapp.com/emojis/945401594843918396.webp?size=96&quality=lossless` }).addField("Channel name", `${channel.name}`).addField("Type", `${channel.type.toString().replace("_"," ").toTitleCase()}`).setFooter({ text: `${channel.id}`}).setTimestamp(Date.now()));
    
});

client.on("emojiCreate", async (emoji) => {
    let guildFile = JSON.parse(await fsp.readFile(`./moderationFiles/${emoji.guild.id}.json`));
    if(!guildFile.logs.types.includes("1")) return;
    await fn.sendLog(emoji.guild.id, client, new Discord.MessageEmbed().setColor("GREEN").setAuthor({ name: "Emoji created", iconURL: `${emoji.url}` }).addField("Emoji", `${emoji}`).addField("Emoji name", `${emoji.name}`).addField("Animated", `${emoji.animated.toString().cap()}`).setFooter({ text: `${emoji.id}`}).setTimestamp(Date.now()));
});

client.on("emojiDelete", async(emoji) => {
    let guildFile = JSON.parse(await fsp.readFile(`./moderationFiles/${emoji.guild.id}.json`));
    if(!guildFile.logs.types.includes("1")) return;
    await fn.sendLog(emoji.guild.id, client, new Discord.MessageEmbed().setColor("RED").setAuthor({ name: "Emoji deleted", iconURL: `${emoji.url}` }).addField("Emoji name", `${emoji.name}`).addField("Animated", `${emoji.animated.toString().cap()}`).setFooter({ text: `${emoji.id}`}).setTimestamp(Date.now()));
});

client.on("guildBanAdd", async(ban) => {
    let guildFile = JSON.parse(await fsp.readFile(`./moderationFiles/${ban.guild.id}.json`));
    if(!guildFile.logs.types.includes("2")) return;
    await fn.sendLog(ban.guild.id, client, new Discord.MessageEmbed().setColor("RED").setAuthor({ name: "Member banned", iconURL: `https://cdn.discordapp.com/emojis/945401594604826654.webp?size=96&quality=lossless` }).addField("Member", `${ban.user}`).setFooter({ text: `${ban.user.id}`}).setTimestamp(Date.now()));
});

client.on("guildBanRemove", async(ban) => {
    let guildFile = JSON.parse(await fsp.readFile(`./moderationFiles/${ban.guild.id}.json`));
    if(!guildFile.logs.types.includes("2")) return;
    await fn.sendLog(ban.guild.id, client, new Discord.MessageEmbed().setColor("GREEN").setAuthor({ name: "Member unbanned", iconURL: `https://cdn.discordapp.com/emojis/945401596269969550.webp?size=96&quality=lossless` }).addField("Member", `${ban.user}`).setFooter({ text: `${ban.user.id}`}).setTimestamp(Date.now()));
});

client.on("guildMemberAdd", async member => {
    let guildFile = JSON.parse(await fsp.readFile(`./moderationFiles/${member.guild.id}.json`));
    if(guildFile.welcomeChannel && guildFile.welcomeMessage){
        member.guild.channels.cache.get(guildFile.welcomeChannel).send({ embeds: [new Discord.MessageEmbed().setColor(guildFile.welcomeHexColor).setDescription(guildFile.welcomeMessage.replaceAll("{ping}", `<@${member.user.id}>`).replaceAll("{name}", `${member.user.username}`).replaceAll("{tag}", `${member.user.discriminator}`).replaceAll("{nametag}", `${member.user.tag}`).replaceAll(/\\n/g, "\n")) ] });
    }
    if(!guildFile.logs.types.includes("3")) return;
    await fn.sendLog(member.guild.id, client, new Discord.MessageEmbed().setColor("GREEN").setAuthor({ name: "Member joined", iconURL: `https://cdn.discordapp.com/emojis/945401595699552266.webp?size=96&quality=lossless` }).addField("Member", `${member}`).setFooter({ text: `${member.user.id}`}).setTimestamp(Date.now()));
});

client.on("guildMemberRemove", async member => {
    let guildFile = JSON.parse(await fsp.readFile(`./moderationFiles/${member.guild.id}.json`));
    if(guildFile.leaveChannel && guildFile.leaveMessage){
        return member.guild.channels.cache.get(guildFile.leaveChannel).send({
            embeds: [
                new Discord.MessageEmbed()
                    .setDescription(guildFile.leaveMessage.replaceAll("{name}", `${member.user.username}`).replaceAll("{tag}", `${member.user.discriminator}`).replaceAll("{nametag}", `${member.user.tag}`).replaceAll(/\\n/g, "\n"))
                    .setColor(guildFile.leaveHexColor)
                ]
            });
    }
    if(!guildFile.logs.types.includes("3")) return;
    await fn.sendLog(member.guild.id, client, new Discord.MessageEmbed().setColor("RED").setAuthor({ name: "Member left", iconURL: `https://cdn.discordapp.com/emojis/945401595653410836.webp?size=96&quality=lossless` }).addField("Member", `${member}`).setFooter({ text: `${member.user.id}`}).setTimestamp(Date.now()));
});

client.on("guildScheduledEventCreate", async(event) => {
    let guildFile = JSON.parse(await fsp.readFile(`./moderationFiles/${event.guild.id}.json`));
    if(!guildFile.logs.types.includes("4")) return;
    await fn.sendLog(event.guild.id, client, new Discord.MessageEmbed().setColor("GREEN").setDescription(`${event.description}`).setAuthor({ name: "Scheduled event created", iconURL: `https://cdn.discordapp.com/emojis/945401594848092250.webp?size=96&quality=lossless` }).addField("Event name", `${event.name}`).addField("Created by", `<@${event.creatorId}>`).setURL(`${event.url}`).setFooter({ text: `${event.id}`}).setTimestamp(Date.now()));
})

client.on("guildScheduledEventDelete", async(event) => {
    let guildFile = JSON.parse(await fsp.readFile(`./moderationFiles/${event.guild.id}.json`));
    if(!guildFile.logs.types.includes("4")) return;
    await fn.sendLog(event.guild.id, client, new Discord.MessageEmbed().setColor("RED").setDescription(`${event.description}`).setAuthor({ name: "Scheduled event deleted", iconURL: `https://cdn.discordapp.com/emojis/945401596534218762.webp?size=96&quality=lossless` }).addField("Event name", `${event.name}`).addField("Created by", `<@${event.creatorId}>`).setURL(`${event.url}`).setFooter({ text: `${event.id}`}).setTimestamp(Date.now()));
});

client.on("inviteCreate", async(invite) => {
    let guildFile = JSON.parse(await fsp.readFile(`./moderationFiles/${invite.guild.id}.json`));
    if(!guildFile.logs.types.includes("5")) return;
    await fn.sendLog(invite.guild.id, client, new Discord.MessageEmbed().setColor("GREEN").setAuthor({ name: "Invite created", iconURL: `https://cdn.discordapp.com/emojis/945401595645005844.webp?size=96&quality=lossless` }).addField("Invite link", `https://discord.gg/${invite.code}`).addField("Created by", `<@${invite.inviterId}>`).addField("For channel", `<#${invite.channelId}>`).addField("Expires in", `<t:${fn.fromMsToEpoch(invite._expiresTimestamp)}:R>`).setThumbnail(`${client.users.cache.get(invite.inviterId).displayAvatarURL({ format: "png", dynamic: true})}`).setFooter({ text: `${invite.code}`}).setTimestamp(Date.now()));
});

client.on("inviteDelete", async(invite) => {
    let guildFile = JSON.parse(await fsp.readFile(`./moderationFiles/${invite.guild.id}.json`));
    if(!guildFile.logs.types.includes("5")) return;
    await fn.sendLog(invite.guild.id, client, new Discord.MessageEmbed().setColor("RED").setAuthor({ name: "Invite deleted", iconURL: `https://cdn.discordapp.com/emojis/945401595686977536.webp?size=96&quality=lossless` }).addField("Invite link", `https://discord.gg/${invite.code}`).addField("Created by", `<@${invite.inviterId}>`).addField("For channel", `<#${invite.channelId}>`).setThumbnail(`${client.users.cache.get(invite.inviterId).displayAvatarURL({ format: "png", dynamic: true})}`).setFooter({ text: `${invite.id}`}).setTimestamp(Date.now()));
});

client.on("messageDelete", async(message) => {
    let guildFile = JSON.parse(await fsp.readFile(`./moderationFiles/${message.guild.id}.json`));
    if(!guildFile.logs.types.includes("6")) return;
    let embed = new Discord.MessageEmbed().setColor("RED").setAuthor({ name: "Message deleted", iconURL: `https://cdn.discordapp.com/emojis/945401596026687548.webp?size=96&quality=lossless` }).setDescription(`**Messaged by <@${message.member.id}> over at <#${message.channel.id}>**`).setFooter({ text: `${message.id}`}).setTimestamp(Date.now()).setThumbnail(`${message.member.user.displayAvatarURL({ format: "png", dynamic: true})}`)
    if(message.content) embed.addField("Message content", `${message.content}`)
    await fn.sendLog(message.guild.id, client, embed);
});

client.on("messageDeleteBulk", async(messages) => {
    let guildFile = JSON.parse(await fsp.readFile(`./moderationFiles/${messages.first().guild.id}.json`));
    if(!guildFile.logs.types.includes("6")) return;
    await fn.sendLog(messages.first().guild.id, client, new Discord.MessageEmbed().setColor("RED").setAuthor({ name: "Messages cleared", iconURL: `https://cdn.discordapp.com/emojis/945401596026687548.webp?size=96&quality=lossless` }).addField("Channel", `${messages.first().channel}`).addField("Amount", `${messages.size}`).setFooter({ text: `${messages.first().channel.id}`}).setTimestamp(Date.now()));
});

client.on("messageUpdate", async(oldMessage, newMessage) => {
    let guildFile = JSON.parse(await fsp.readFile(`./moderationFiles/${oldMessage.guild.id}.json`));
    if(guildFile.blacklistedWords.length !== 0 && !newMessage.member.permissions.has("MANAGE_MESSAGES")){
        guildFile.blacklistedWords.forEach(word => {
            if(newMessage.content.toLowerCase().replaceAll(" ","").includes(word)){
                return newMessage.delete().catch(err => {});
            };
        });
    };
    if(!guildFile.logs.types.includes("6")) return;
    if(oldMessage.content == newMessage.content) return;
    await fn.sendLog(newMessage.guild.id, client, new Discord.MessageEmbed().setColor("BLURPLE").setAuthor({ name: "Message edited", iconURL: `https://cdn.discordapp.com/emojis/945401594705477692.webp?size=96&quality=lossless` }).addField("Before", `${oldMessage.content}`).addField("After", `${newMessage.content}`).setFooter({ text: `${newMessage.id}`}).setTimestamp(Date.now()).setThumbnail(`${newMessage.member.user.displayAvatarURL({ format: "png", dynamic: true})}`));
});

client.on("roleCreate", async(role) => {
    let guildFile = JSON.parse(await fsp.readFile(`./moderationFiles/${role.guild.id}.json`));
    if(!guildFile.logs.types.includes("7")) return;
    await fn.sendLog(role.guild.id, client, new Discord.MessageEmbed().setColor("GREEN").setAuthor({ name: "Role created", iconURL: `https://cdn.discordapp.com/emojis/945401596274167918.webp?size=96&quality=lossless` }).addField("Role name", `${role.name}`).setFooter({ text: `${role.id}`}).setTimestamp(Date.now()));
});

client.on("roleDelete", async(role) => {
    let guildFile = JSON.parse(await fsp.readFile(`./moderationFiles/${role.guild.id}.json`));
    if(!guildFile.logs.types.includes("7")) return;
    await fn.sendLog(role.guild.id, client, new Discord.MessageEmbed().setColor("RED").setAuthor({ name: "Role deleted", iconURL: `https://cdn.discordapp.com/emojis/945401595963797544.webp?size=96&quality=lossless` }).addField("Role name", `${role.name}`).setFooter({ text: `${role.id}`}).setTimestamp(Date.now()));
});

client.on("stageInstanceCreate", async(stageInstance) => {
    let guildFile = JSON.parse(await fsp.readFile(`./moderationFiles/${stageInstance.guild.id}.json`));
    if(!guildFile.logs.types.includes("8")) return;
    await fn.sendLog(stageInstance.guild.id, client, new Discord.MessageEmbed().setColor("GREEN").setAuthor({ name: "Stage instance created", iconURL: `https://cdn.discordapp.com/emojis/945401596513251439.webp?size=96&quality=lossless` }).addField("Stage instance", `${stageInstance}`).setFooter({ text: `${stageInstance.id}`}).setTimestamp(Date.now()));
});

client.on("stageInstanceDelete", async(stageInstance) => {
    let guildFile = JSON.parse(await fsp.readFile(`./moderationFiles/${stageInstance.guild.id}.json`));
    if(!guildFile.logs.types.includes("8")) return;
    await fn.sendLog(stageInstance.guild.id, client, new Discord.MessageEmbed().setColor("RED").setAuthor({ name: "Stage instance deleted", iconURL: `https://cdn.discordapp.com/emojis/945401596626468884.webp?size=96&quality=lossless` }).addField("Stage instance", `${stageInstance}`).setFooter({ text: `${stageInstance.id}`}).setTimestamp(Date.now()));
});

client.on("stickerCreate", async(sticker) => {
    let guildFile = JSON.parse(await fsp.readFile(`./moderationFiles/${sticker.guild.id}.json`));
    if(!guildFile.logs.types.includes("9")) return;
    await fn.sendLog(sticker.guild.id, client, new Discord.MessageEmbed().setColor("GREEN").setAuthor({ name: "Sticker created", iconURL: `https://cdn.discordapp.com/emojis/945401596534202408.webp?size=96&quality=lossless` }).addField("Sticker", `${sticker.name}`).setFooter({ text: `${sticker.id}`}).setTimestamp(Date.now()));
});

client.on("stickerDelete", async(sticker) => {
    let guildFile = JSON.parse(await fsp.readFile(`./moderationFiles/${sticker.guild.id}.json`));
    if(!guildFile.logs.types.includes("9")) return;
    await fn.sendLog(sticker.guild.id, client, new Discord.MessageEmbed().setColor("RED").setAuthor({ name: "Sticker deleted", iconURL: `https://cdn.discordapp.com/emojis/945401596622290964.webp?size=96&quality=lossless` }).addField("Sticker", `${sticker.name}`).setFooter({ text: `${sticker.id}`}).setTimestamp(Date.now()));
});

client.on("threadCreate", async(thread) => {
    let guildFile = JSON.parse(await fsp.readFile(`./moderationFiles/${thread.guild.id}.json`));
    if(!guildFile.logs.types.includes("10")) return;
    await fn.sendLog(thread.guild.id, client, new Discord.MessageEmbed().setColor("GREEN").setAuthor({ name: "Thread created", iconURL: `https://cdn.discordapp.com/emojis/945401594520956968.webp?size=96&quality=lossless` }).addField("Thread", `${thread}`).setFooter({ text: `${thread.id}`}).setTimestamp(Date.now()));
});

client.on("threadDelete", async(thread) => {
    let guildFile = JSON.parse(await fsp.readFile(`./moderationFiles/${thread.guild.id}.json`));
    if(!guildFile.logs.types.includes("10")) return;
    await fn.sendLog(thread.guild.id, client, new Discord.MessageEmbed().setColor("RED").setAuthor({ name: "Thread deleted", iconURL: `https://cdn.discordapp.com/emojis/945401594843918396.webp?size=96&quality=lossless` }).addField("Thread name", `${thread.name}`).setFooter({ text: `${thread.id}`}).setTimestamp(Date.now()));
});

client.on("voiceStateUpdate", async(oldMember, newMember) => {
    let guildFile = JSON.parse(await fsp.readFile(`./moderationFiles/${oldMember.guild.id}.json`));
    if(!guildFile.logs.types.includes("11")) return;
    if(oldMember.channelId === newMember.channelId) return;
    if(oldMember.channelId === null) {
        await fn.sendLog(newMember.guild.id, client, new Discord.MessageEmbed().setColor("GREEN").setAuthor({ name: "Member joined voice channel", iconURL: `https://cdn.discordapp.com/emojis/945403685331169290.webp?size=96&quality=lossless` }).addField("Member", `<@${newMember.id}>`).addField("Channel", `${client.channels.cache.get(newMember.channelId)}`).setFooter({ text: `${newMember.id}`}).setTimestamp(Date.now()).setThumbnail(`${newMember.member.user.displayAvatarURL({ format: "png", dynamic: true })}`));
    }
    if(newMember.channelId === null) {
        await fn.sendLog(newMember.guild.id, client, new Discord.MessageEmbed().setColor("RED").setAuthor({ name: "Member left voice channel", iconURL: `https://cdn.discordapp.com/emojis/945403685331169290.webp?size=96&quality=lossless` }).addField("Member", `<@${newMember.id}>`).addField("Channel", `${client.channels.cache.get(oldMember.channelId)}`).setFooter({ text: `${newMember.id}`}).setTimestamp(Date.now()).setThumbnail(`${newMember.member.user.displayAvatarURL({ format: "png", dynamic: true })}`));
    }
});
/*--------------------------------------*/

client.on("messageReactionAdd", async (reaction, user) => {
    let guildFile = JSON.parse(await fsp.readFile(`./moderationFiles/${reaction.message.guildId}.json`));

    if(guildFile.starboard.details[0] && reaction.emoji.name === guildFile.starboard.details[1] && reaction.message.channel.id !== guildFile.starboard.details[0]){
        await reaction.fetch()
        if(reaction.count >= guildFile.starboard.details[2]){
        try {
            const emoji = await reaction.fetch();
            if(!emoji) throw Error("Unknown Channel")
            const channel = await reaction.message.channel.fetch();
            
            const messages = await channel.messages.fetch({limit: 100})
            let found = false
            for(const prevMessage of messages){
                
                if(prevMessage[1].author.id === client.user.id && prevMessage[1].embeds[0]?.footer?.text?.startsWith("Starboard") && prevMessage[1].embeds[0].footer.text.split(" • ")[1] === message.id){
                    found = true
                
                    if(parseInt(prevMessage[1].content.split(" ")[1]) !== reaction.count) {
                        prevMessage[1].edit({ content: `${reaction.count} ${guildFile.starboard.details[1]}` });
                        console.log(parseInt(prevMessage[1].content.split(" ")[0]))
                    }
                    break;
                }
            }
            if(found === false){
                client.channels.cache.get(guildFile.starboard.details[0]).send({ content: `${reaction.count} ${guildFile.starboard.details[1]} `, embeds: [new Discord.MessageEmbed().setAuthor({ name: `${reaction.message.member.user.username}`, iconURL: `${reaction.message.member.user.displayAvatarURL({ dynamic: true })}` }).setDescription(reaction.message.content).addField("\u200b", `[Jump to message](${reaction.message.url})`).setFooter({ text: `Starboard • ${reaction.message.id}` })] })
            }
        } catch(err){
            if(err.message === "Unknown Channel"){
            // delete starboard
            }else{console.error(err)}
        }
        }
    }
});

client.login(bot.token);
