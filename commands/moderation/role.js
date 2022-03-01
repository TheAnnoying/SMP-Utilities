const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const bot = require(`../../config.json`);
const fsNormal = require('fs');
const fn = require("../../functions");

module.exports = {
    name: 'role',
    aliases: [],
    usage: 'role <type> @someone <role>',
    example: '/role add @Dophline @Admin',
    description: 'Add/Remove a role from someone',
    options: {
        defer: false
    },
    permissions: ['Moderator', 'Admin'],
    data: new SlashCommandBuilder()
            .setName('role')
            .setDescription('Add/Remove a role from someone')
            .setDefaultPermission(false)
            .addSubcommand(subcommand =>
                subcommand.setName("add")    
                .setDescription("Add a role to someone")
                .addRoleOption(option =>
                    option.setName("role")
                    .setDescription("What role do you wanna remove from the person?")
                    .setRequired(true)
                )
                .addUserOption(option =>
                    option.setName("member")
                    .setDescription("A member who you wanna remove a role from")
                    .setRequired(true)
                ),
            ).addSubcommand(subcommand =>
                subcommand.setName("remove") 
                .setDescription("Remove a role from someone")
                .addRoleOption(option =>
                    option.setName("role")
                    .setDescription("What role do you wanna remove from the person?")
                    .setRequired(true)
                )
                .addUserOption(option =>
                    option.setName("member")
                    .setDescription("A member who you wanna remove a role from")
                    .setRequired(true)
                ),
            ),
    async execute(client, message, args) {
        let subcmd = message.options.getSubcommand();
        let memberoption = await message.options.getMember('member');
        let roleoption = await message.options.getRole('role');

        if(subcmd === 'add'){
            if(memberoption.roles.cache.has(roleoption.id)) return message.reply({ embeds: [fn.sendError("The member already has this role")] });
            try {
                const embed = new Discord.MessageEmbed().setTitle("Role added!").setColor(bot.accentColor).setDescription(`The ${roleoption} role has been added to ${memberoption}!`);
                await memberoption.roles.add(roleoption);
                message.reply({ embeds: [embed] });
            } catch (err) {
                return message.reply({ embeds: [fn.sendError("Error adding the role, either I don't have the \`Manage Roles\` permission or you're trying to add a role to someone with a higher role than mine!")] });
            }
        }
        if(subcmd === 'remove'){
            if(!memberoption.roles.cache.has(roleoption.id)) return message.reply({ embeds: [fn.sendError("The member doesn't have this role, nothing to remove")] });
            try {
                let embed = new Discord.MessageEmbed().setTitle("Role removed!").setColor(accentColor).setDescription(`The ${roleoption} role has been removed from ${memberoption}!`);
                await memberoption.roles.remove(roleoption);
                message.reply({ embeds: [embed] });
            } catch (err) {
                return message.reply({ embeds: [fn.sendError("Error removing the role, either I don't have the \`Manage Roles\` permission or you're trying to remove a role from someone with a higher role than mine!")] });
            }
        }
	}
}