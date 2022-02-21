const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const bot = require(`../config.json`);

module.exports = {
    name: 'ban',
    aliases: [],
    usage: 'ban @someone reason',
    example: '/ban @Thundertomy Such a cute cat',
    description: 'Ban a member from the server',
    permissions: ['Moderator', 'Admin'],
    data: new SlashCommandBuilder()
            .setName('ban')
            .setDescription('Ban a member from the server')
            .setDefaultPermission(false)
            .addUserOption(option =>
                option.setName("member")
                .setDescription("Member to ban")
                .setRequired(true)
            ).addStringOption(option =>
                option.setName("reason")
                .setDescription("Reason to ban the member")
                .setRequired(true)
            ),
    async execute(client, message, args) {

        if(message.channel.id === '903719800507879485'){
            const useADiffEmbed = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> Error").setColor(bot.errorColor);
            const useADiff = await message.reply({ embeds: [useADiffEmbed] });
            useADiff.react("<:use_a_different_channel:907302334470713384>");
            client.on('messageReactionAdd', async (reaction, user) => {
                //Checking if the user who reacted is a bot, or if the reaction is not from the same guild or if the reaction author is not SMP Utilities then return
                if(user.bot || !reaction.message.guild) return;
                //If we do have a reaction partial, then we fetch it
                if(reaction.message.partial) await reaction.message.fetch();
                if(reaction.partial) await reaction.fetch();
                useADiff.delete(); 
            });
            return; 
        };

        if (!message.member.permissions.has(Discord.Permissions.FLAGS.BAN_MEMBERS)) {
            let errChannel = client.channels.cache.get("907641692075728987")
            let errEmbed = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> An Error Occurred!").addField(`Caused by:`, `${message.member.user.tag}`).addField(`From the command:`, `${message.commandName}`).addField("From guild:", `${message.guild.name}, (${message.guild.id})`).addField("Error:", `You don't have permissions to ban people!`).setColor(bot.errorColor);
            errChannel.send({ embeds: [errEmbed] });
            const dontHavePerms = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> Error").setDescription("You don't have permissions to ban people!").setColor(bot.errorColor);
            return message.reply({ embeds: [dontHavePerms] });
        }
        if (!message.guild.me.permissions.has(Discord.Permissions.FLAGS.KICK_MEMBERS)) {
            let errChannel = client.channels.cache.get("907641692075728987")
            let errEmbed = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> An Error Occurred!").addField(`Caused by:`, `${message.member.user.tag}`).addField(`From the command:`, `${message.commandName}`).addField("From guild:", `${message.guild.name}, (${message.guild.id})`).addField("Error:", `Hey, **I** don't have permmision to ban people!`).setColor(bot.errorColor);
            errChannel.send({ embeds: [errEmbed] });
            const youDontHavePerms = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> Error").setDescription("**I** don't have permission to ban people!").setColor(bot.errorColor);
            return message.reply({ embeds: [youDontHavePerms] });
        }
        let target = message.options.getMember('member');
        const NoBannable = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> Error").setDescription(`I do not have permission to ban this certain member (${target.user.username})`).setColor(bot.errorColor);
        if(!target.bannable) {
            let errChannel = client.channels.cache.get("907641692075728987")
            let errEmbed = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> An Error Occurred!").addField(`Caused by:`, `${message.member.user.tag}`).addField(`From the command:`, `${message.commandName}`).addField("From guild:", `${message.guild.name}, (${message.guild.id})`).addField("Error:", `I do not have permission to ban this certain member [**${target.user.username}**]`).setColor(bot.errorColor);
            errChannel.send({ embeds: [errEmbed] });
            return message.reply({ embeds: [NoBannable] });
        }
        let reason = message.options.getString('reason');
        if (!reason) reason="Unspecified";
        console.log(target)
        target.ban({
            reason: reason
        });
        const kickEmbed = new Discord.MessageEmbed().setDescription(`Banned ${target.user.username} for ${reason}`).setColor(bot.accentColor);
        message.reply({ embeds: [kickEmbed] });
        console.log(`${message.member.user.username} banned ${target.username}`);
	}
}