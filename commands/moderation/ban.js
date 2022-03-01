const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const bot = require(`../../config.json`);
const fn = require("../../functions");

module.exports = {
    name: 'ban',
    aliases: [],
    usage: 'ban @someone reason',
    example: '/ban @someone You need to behave!',
    description: 'Ban a member from the server',
    options: {
        defer: true
    },
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
                .setRequired(false)
            ).addStringOption(option =>
                option.setName("delete-messages")    
                .setDescription("How much of their recent message history to delete")
                .addChoice("Don't delete any", "0")
                .addChoice("Previous 24 Hours", "24")
                .addChoice("Previous 7 Days", "7")
            ),
    async execute(client, message, args) {
        if (!message.member.permissions.has(Discord.Permissions.FLAGS.BAN_MEMBERS)) return message.editReply({ embeds: [fn.sendError("You don't have permissions to ban people")] });
        if (!message.guild.me.permissions.has(Discord.Permissions.FLAGS.BAN_MEMBERS)) return message.editReply({ embeds: [fn.sendError("I don't have permission to ban people")] });

        let target = message.options.getMember('member');

        if(!target.bannable) return message.editReply({ embeds: [fn.sendError(`I do not have permission to ban this certain member (${target.user.username})`)] });

        let reason = message.options.getString('reason') ?? "Unspecified";

        let confirmMessage = await message.editReply({ components: [new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setCustomId("return").setLabel("Cancel").setStyle("SECONDARY"),new Discord.MessageButton().setCustomId("ban").setLabel("Ban").setStyle("DANGER"))], embeds: [new Discord.MessageEmbed().setTitle("Are you sure?").setDescription(`Are you sure you wanna ban <@${target.user.id}> (${target.user.username})?\n This means they will not be able to join back unless you unban them and all of their warns will be deleted.`).setColor(bot.errorColor)] });
        const collector = confirmMessage.createMessageComponentCollector({ componentType: 'BUTTON', time: 60000 });
            collector.on('collect', async button => {
                try {
                    if(button.member.user.id !== message.member.user.id){
                        return button.message.reply({ embeds: [new Discord.MessageEmbed().setTitle("Only the command author can use these buttons").setColor(bot.errorColor)], ephemeral: true });
                    } else if(button.customId === 'return'){
                        await button.deferUpdate();
                        button.message.edit({ embeds: [new Discord.MessageEmbed().setTitle("Ban cancelled").setColor(bot.accentColor).setDescription(`Cancelled the ban for <@${target.user.id}>`)], components: [new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setCustomId("return").setLabel("Cancel").setDisabled(true).setStyle("SECONDARY"),new Discord.MessageButton().setCustomId("ban").setLabel("Ban").setStyle("DANGER").setDisabled(true))] })
                    } else if(button.customId === 'ban'){
                        await button.deferUpdate();
                        button.message.edit({ embeds: [new Discord.MessageEmbed().setTitle(`Banned!`).setDescription(`Successfully banned ${target.user.username} (\`${target.user.id}\`) for \`${reason}\``).setColor(bot.accentColor)], components: [new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setCustomId("return").setLabel("Cancel").setDisabled(true).setStyle("SECONDARY"),new Discord.MessageButton().setCustomId("ban").setLabel("Ban").setStyle("DANGER").setDisabled(true))] });
                        target.ban({ reason: reason, days: parseInt(message.options.getString('delete-messages')) });
                    }
                } catch(e) {}
            });
            collector.on('end', collected => {
                try {
                    if(!collected.size) {
                        confirmMessage.edit({ embeds: [new Discord.MessageEmbed().setTitle("Ban cancelled").setColor(bot.accentColor).setDescription(`Cancelled the ban for <@${target.user.id}>, ${message.member.user.username} took too long to respond.`)], components: [new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setCustomId("return").setLabel("Cancel").setDisabled(true).setStyle("SECONDARY"),new Discord.MessageButton().setCustomId("ban").setLabel("Ban").setStyle("DANGER").setDisabled(true))] }).catch(() => {});
                    }
                } catch(err){}
            });
	}
}