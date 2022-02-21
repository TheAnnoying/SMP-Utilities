const { SlashCommandBuilder, time } = require('@discordjs/builders');
const Discord = require('discord.js');
const bot = require(`../config.json`);

module.exports = {
    name: 'info',
    aliases: [],
    usage: 'info <type>',
    example: '/info <type>',
    description: 'See information about some things',
    data: new SlashCommandBuilder()
            .setName('info')
            .setDescription('See information about some things')
            .addSubcommand(subcommand =>
                subcommand.setName("user")
                .setDescription("See someone\'s user info")
                .addUserOption(option => 
                    option.setName("member")
                    .setDescription("A Member to see the info of")
                )
            ).addSubcommand(subcommand =>
                subcommand.setName("server")
                .setDescription("See some server information")
            ).addSubcommand(subcommand =>
                subcommand.setName("role")    
                .setDescription("See some role information")
                .addRoleOption(option => option.setName("role").setDescription("A Role to see the info of").setRequired(true))
            ).addSubcommand(subcommand => 
                subcommand.setName("channel")
                .setDescription("See some channel information")
                .addChannelOption(option => option.setName("channel").setDescription("A Channel to see the info of"))
            ),
    async execute(client, message, args, botF) {
        const subcmd = message.options.getSubcommand();
        if(subcmd === 'user'){
            let target = message.options.getMember("member");
            if(!target) target = message.member;
            let stat = target.presence ? target.presence.status : "None";

            await target.user.fetch()
            let banner = target.user.banner ? target.user.bannerURL({
                dynamic: true,
                format: "png",
                size: 4096
            }) : undefined
            //Making another status variable that we will not change and checking if the status is "dnd"
            //If it is dnd we are setting it to Do not disturb so people can read it easly
            if(stat == 'dnd'){stat = 'do not disturb'}
            // if(normalStatus == 'dnd'){stat = '<:DoNotDisturb:900364734593916958> Do not disturb'};
            // if(normalStatus == 'online'){stat = '<:Online:899989297007050772> Online'};
            // if(normalStatus == 'idle'){stat = '<:Idle:900364734702968862> Idle'};
            // if(normalStatus == 'offline'){stat = '<:Offline:900364734589702214> Offline'};
            let mutualGuilds = client.guilds.cache.filter(e => !!e.members.cache.find(e => e.user.id === target.user.id))
            let guildArray = [];
            mutualGuilds.forEach(guild => guildArray.push(guild.name));

            const embed = new Discord.MessageEmbed()
                .setThumbnail(target.displayAvatarURL());
                if(target.presence?.activities?.[0]?.id === 'custom') embed.setDescription(`${target.presence.activities[0].state}`);
                if(target.displayName !== target.user.username) embed.addField("Nickname", `${target.displayName}`, true);
                embed.addField("Discriminator", `#${target.user.discriminator}`, true);
                embed.addField("Status", stat.cap(), true);
                embed.addField("Device", `${Object.keys(target.presence?.clientStatus ?? {"None": true}).map(e => e.toString().toTitleCase()).join(", ").cap()}`, true);
                embed.addField("Created on", `${time(target.user.createdAt, 'D')}`, true);
                embed.addField("Joined on", `<t:${Math.floor(target.joinedTimestamp / 1000)}:D>`, true);
                embed.addField("Roles", `${target.roles.cache.size-1}`, true);
                embed.addField("Top role", target.roles.highest.toString(), true);
                embed.addField("Join position", (Array.from(await message.guild.members.fetch()).sort((a, b) => a[1].joinedTimestamp - b[1].joinedTimestamp).findIndex(e => e[0] === target.user.id)+1).toString(), true)
                if(target.user.accentColor) embed.addField("Accent Color", `#${target.user.accentColor.toString(16)}`, true)
                embed.addField("Mutual servers", `${guildArray.length}`, true)
                embed.setColor(target.roles.highest.color)
                embed.setImage(banner);
                embed.setFooter({ text: `User ID: ${target.user.id}` })
            //Checking if the users highest role is the default color, and if so putting the embed color to be the bots default embed color
            if(target.roles.highest.color == '0') embed.setColor(bot.accentColor)
            //If the user mentioned is a bot, we will add an embed author and a bot thumbnail
            if(target.user.bot){
                embed.setAuthor({ name: target.user.username, iconURL: "https://media.discordapp.net/attachments/844493685244297226/899986928076746762/unknown.png" })
            } else {
                //If the user is just a normal user we will put the title as the users username
                embed.setTitle(`${target.user.username}`)
            }
            if(target.premium) {embed.addField("<:Boost:899989297103527946> Server Boosting?", `True`, true)};
            if(target.premiumSinceTimestamp) embed.addField("<:Boost:899989297103527946> Boosting Since", `<t:${Math.floor(target.premiumSinceTimestamp/1000)}:D>`, true)
        let messageOptionz = {
            embeds: [embed]
        };
        if(target.presence?.activities?.[0]){
            target.presence.activities.forEach(activity => {
                let activityEmbed = new Discord.MessageEmbed();
                activityEmbed.setTitle(`${activity.type.cap()} ${activity.name}`);
                if(activity.type === 'CUSTOM') return;
                if(activity.details) activityEmbed.addField("Details", `${activity.details}`);
                if(activity.state) activityEmbed.addField(`State`, `${activity.state}`);

                activityEmbed.setColor(target.roles.highest.color);
                if(target.roles.highest.color == '0') activityEmbed.setColor(bot.accentColor)
                
                if(activity.assets) activityEmbed.setThumbnail(`https://cdn.discordapp.com/app-assets/${activity.applicationId}/${activity.assets.largeImage}.png`);
                
                messageOptionz.embeds.push(activityEmbed);
            });
        } else {
            return message.reply(messageOptionz);
        }
        message.reply(messageOptionz);
        }
        if(subcmd === 'server'){
            const guild = message.guild;
            const memberCount = guild.memberCount;
            const date = guild.createdAt;
            const timeString = time(date);
            const relative = time(date, 'D');
            const embed1 = new Discord.MessageEmbed();
            embed1.setThumbnail(message.guild.iconURL())
            embed1.addField('Name', `${guild.name}`)
            embed1.setColor(bot.accentColor)
            
            if(guild.bannerURL()) embed1.setImage(guild.bannerURL());
            if(guild.description) embed1.addField("Description -", guild.description)
            embed1.addField("<:ServerOwner:899989297107701820> Owner -", `${await guild.fetchOwner()}`, true)
            embed1.addField("Created at -", `${relative}`, true)
            embed1.addField("<:Members:899989297124479016> Members (Bots included) -", `${memberCount.toLocaleString()}`, true)
            embed1.addField("Stickers -", `${guild.stickers.cache.size}`, true)
            embed1.addField("Roles -", `${guild.roles.cache.size}`, true)
            embed1.addField("😄 Emojis -", `${guild.emojis.cache.size} (Regular: ${guild.emojis.cache.filter((e) => !e.animated).size}, Animated: ${guild.emojis.cache.filter((e) => e.animated).size})`, true)
            embed1.addField("Channels -", `${guild.channels.cache.filter((ch) => ch.type === 'GUILD_TEXT' || ch.type === 'GUILD_VOICE').size}`, true)
            if(guild.channels.cache.filter((ch) => ch.type === 'GUILD_TEXT').size !== 0) embed1.addField("<:ChannelTag:899989297174806578> Text Channels -", `${guild.channels.cache.filter((ch) => ch.type === "GUILD_TEXT").size}`, true)
            if(guild.channels.cache.filter((ch) => ch.type === "GUILD_VOICE").size !== 0) embed1.addField("<:VoiceChannel:900367340158480455> Voice Channels -", `${guild.channels.cache.filter((ch) => ch.type === "GUILD_VOICE").size}`, true)
            if(guild.channels.cache.filter((ch) => ch.type === 'GUILD_NEWS').size !== 0) embed1.addField("News Channels -", `${guild.channels.cache.filter((ch) => ch.type === 'GUILD_NEWS').size}`, true)
            embed1.addField("<:Boost:899989297103527946> Boost Tier -", `Tier ${guild.premiumTier.toString().cap()}`, true)
            embed1.addField("<:Boost:899989297103527946> Boost Count -", `${guild.premiumSubscriptionCount || "0"}`, true)
            embed1.addField("Verification Level -", `${guild.verificationLevel.cap()}`, true);

            return message.reply({ embeds: [embed1] });
        }
        if(subcmd === 'role'){
            let roleVar = message.options.getRole("role");
            let perms = roleVar.permissions.toArray();
            perms = perms.map(perm => 
                perm = perm.replaceAll('_', ' ')
            );
            for(let i = 0; i<perms.length; i++) {
                perms[i] = `${perms[i].toTitleCase()}
                `
            }
            let createdAtRole = Math.floor(roleVar.createdTimestamp / 1000)
            const roleEmbed = new Discord.MessageEmbed().setTitle(`${roleVar.name}`)
            .addField("ID", `${roleVar.id}`, true)
            .addField("Color", `${roleVar.hexColor}`, true)
            .addField("Position", `${roleVar.rawPosition}`, true)
            .addField("Created At", `<t:${createdAtRole}:D>`, true);
            if(roleVar.hoist === true) {
                roleEmbed.addField("Displayed Separately", "True")
            } else {
                roleEmbed.addField("Displayed Separately", "False")
            }

            if(perms.includes("Administrator")) {
                roleEmbed.addField('Permissions', 'Administrator', true);
            } else {
                roleEmbed.addField('Permissions', perms.join(', '), true);
            }
            if(roleVar.color === 0) {
                roleEmbed.setColor(bot.accentColor)
            } else roleEmbed.setColor(roleVar.hexColor);
            
            message.reply({ embeds: [roleEmbed] });
        }
        if(subcmd === 'channel'){
            let channel = message.options.getChannel("channel") ?? message.channel;

            let createdAtChannel = Math.floor(channel.createdTimestamp / 1000);
            const categoryEmbed = new Discord.MessageEmbed().setTitle(`${channel.name}`).addField("ID", `${channel.id}`, true).addField("Category Position", `${Math.floor(channel.position+1)}`, true).setColor(bot.accentColor).addField("Created At", `<t:${createdAtChannel}:D>`, true).addField("Type", "<:folder:914249450799652874> Category");
            const channelsIn = new Discord.MessageEmbed().setTitle("Channels in category").setColor(bot.accentColor);
            

            if(channel.type === 'GUILD_CATEGORY'){
                let dicts = []
                for(const dict of channel.children) {
                    dicts.push(dict[0])
                }
                if(dicts.length === 0){
                    return message.reply({ embeds: [categoryEmbed] });
                }
                channelsIn.setDescription(dicts.map(e => `<#${e}>\n`).toString().replaceAll(',',''))
                return message.reply({ embeds: [categoryEmbed, channelsIn] });
            }
            let lastMessageLink = `https://discord.com/channels/${message.guild.id}/${channel.id}/${channel.lastMessageId}`
            let voiceChannelEmbed = new Discord.MessageEmbed().setTitle(`${channel.name}`).addField("ID", `${channel.id}`, true).setColor(bot.accentColor).addField("Position in category", `${Math.floor(channel.position+1)}`, true).addField("In Category", `${message.guild.channels.cache.get(channel.parentId).name.toString().replace("#","")}`, true).addField("Created At", `<t:${createdAtChannel}:D>`, true);
            if(channel.type === 'GUILD_VOICE') {
                voiceChannelEmbed.addField("Type", "<:VoiceChannel:900367340158480455> Voice", true).setColor(bot.accentColor);
                message.reply({ embeds: [voiceChannelEmbed] });
            }
            const channelEmbed = new Discord.MessageEmbed().setTitle(`${channel.name}`).addField("ID", `${channel.id}`, true).addField("NSFW", `${channel.nsfw.toString().cap()}`, true).addField("Position in category", `${Math.floor(channel.position+1)}`, true).addField("In Category", `${message.guild.channels.cache.get(channel.parentId).name.toString().replace("#","")}`, true).addField("Last message", `[Press here!](${lastMessageLink})`, true).setColor(bot.accentColor).addField("Created At", `<t:${createdAtChannel}:D>`, true);
            
            if(channel.type === 'GUILD_STAGE_VOICE'){
                voiceChannelEmbed.addField("Type", "<:stage:914249451185537094> Stage");
                return message.reply({ embeds: [voiceChannelEmbed] });
            }
            if(channel.type === 'GUILD_PUBLIC_THREAD'){
                channelEmbed.addField("Type", "<:channelthreaded:914249450136928288> Threaded Channel")
                return message.reply({ embeds: [channelEmbed] });
            }
            if(channel.type === 'GUILD_NEWS'){
                channelEmbed.addField("Type", "<:announcement:914249450313097220> News")
                return message.reply({ embeds: [channelEmbed] });
            }
            
            
            if(channel.type === 'GUILD_TEXT') {
                channelEmbed.addField("Type", "<:ChannelTag:899989297174806578> Text", true);
                return message.reply({ embeds: [channelEmbed] });
            }
        }
	}
}