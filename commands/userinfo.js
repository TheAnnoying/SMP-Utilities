
const { SlashCommandBuilder, ContextMenuCommandBuilder, time } = require('@discordjs/builders');
const Builders = require("@discordjs/builders");
const Discord = require('discord.js');
const bot = require(`../config.json`);

module.exports = {
    name: 'User Information',
    aliases: [],
    usage: 'null',
    example: 'null',
    description: 'Show info about a user',
    data: new ContextMenuCommandBuilder()
            .setName('User Information')
            .setType(2),
    async execute(client, message, args) {
        let target = await message.guild.members.cache.get(message.targetId);
            //Getting when the user was created and using discord.js/builders time function to make it into a Discord timestamp
            const createdAtDate = target.user.createdAt;
            const createdAtTimestamp = time(createdAtDate, 'D');        

            //Checking the user's status as a variable
            let device = Object.getOwnPropertyNames(target.presence.clientStatus).toString();
            //Making the status's first letter be a capital letter
            stat = target.presence.status;
            device = device.cap()
            //Making another status variable that we will not change and checking if the status is "dnd"
            let normalStatus = target.presence.status;
            //If it is dnd we are setting it to Do not disturb so people can read it easly
            if(normalStatus == 'dnd'){stat = '<:DoNotDisturb:900364734593916958> Do not disturb'};
            if(normalStatus == 'online'){stat = '<:Online:899989297007050772> Online'};
            if(normalStatus == 'idle'){stat = '<:Idle:900364734702968862> Idle'};
            if(normalStatus == 'offline'){stat = '<:Offline:900364734589702214> Offline'};
            let test = Math.floor(target.joinedTimestamp / 1000)
            const embed = new Discord.MessageEmbed()
                .setThumbnail(target.displayAvatarURL())
                .addField("Nickname", `${target.displayName}`, true)
                .addField("Discriminator", `<:ChannelTag:899989297174806578>${target.user.discriminator}`, true)
                .addField("ID", `${target.user.id}`, true)
                .addField("Status", stat, true)
                .addField("Device", `<:Device:899989297095127050> ${device}`, true)
                .addField("Created on", `${createdAtTimestamp}`, true)
                .addField("Joined on", `<t:${test}:D>`, true)
                .addField("Roles", `${target.roles.cache.size-1}`, true)
                .addField("Top role", target.roles.highest.toString(), true)
                .setColor(target.roles.highest.color);
            //Checking if the users highest role is the default color, and if so putting the embed color to be the bots default embed color
            if(target.roles.highest.color == '0') embed.setColor(bot.accentColor)
            //If the user mentioned is a bot, we will add an embed author and a bot thumbnail
            if(target.user.bot){
                embed.setAuthor({ name: target.user.username, iconURL: "https://media.discordapp.net/attachments/844493685244297226/899986928076746762/unknown.png" })
            } else {
                //If the user is just a normal user we will put the title as the users username
                embed.setTitle(`${target.user.username}`)
            }
            if(target.premium) {embed.addField("<:Boost:899989297103527946> Server Boosting?", `True`, true)} else {embed.addField("<:Boost:899989297103527946> Server Boosting?", "False", true)}
        let messageOptionz = {
            embeds: [embed]
        };
        if(target.presence.activities[0]){
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
}