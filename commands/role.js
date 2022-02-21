const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const bot = require(`../config.json`);
module.exports = {
    name: 'role',
    aliases: [],
    usage: 'role <type> @someone <role>',
    example: '/role add @Dophline @Admin',
    description: 'Add/Remove a role from someone',
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

        let subcmd = message.options.getSubcommand();
        let memberoption = await message.options.getMember('member');
        let roleoption = await message.options.getRole('role');

        if(subcmd === 'add'){
            const embed2 = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> Error").setDescription("Member already has this role").setColor(bot.errorColor);
            if(memberoption.roles.cache.has(roleoption.id)) return message.reply({ embeds: [embed2] });
            try {
                const embed = new Discord.MessageEmbed().setTitle("Role added!").setColor(bot.accentColor).setDescription(`The ${roleoption} role has been added to ${memberoption}!`);
                await memberoption.roles.add(roleoption);
                message.reply({ embeds: [embed] });
            } catch (err) {
                let errChannel = client.channels.cache.get("907641692075728987")
            let errEmbed = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> An Error Occurred!").addField(`Caused by:`, `${message.member.user.tag}`).addField(`From the command:`, `${message.commandName}`).addField("From guild:", `${message.guild.name}, (${message.guild.id})`).addField("Error:", `Error adding the roles!`).setColor(bot.errorColor);
            errChannel.send({ embeds: [errEmbed] });
                const errorEmbed = new Discord.MessageEmbed()
                    .setTitle("<:error:859830692518428682> Error").setDescription("Error adding the roles!")
                    .setColor(bot.errorColor);
                return message.reply({ embeds: [errorEmbed] });
            }
        }
        if(subcmd === 'remove'){
            let embed2 = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> Error").setDescription("Member already DOESN'T have this role").setColor(bot.errorColor);
            if(!memberoption.roles.cache.has(roleoption.id)) {
                let errChannel = client.channels.cache.get("907641692075728987")
                let errEmbed = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> An Error Occurred!").addField(`Caused by:`, `${message.member.user.tag}`).addField(`From the command:`, `${message.commandName}`).addField("From guild:", `${message.guild.name}, (${message.guild.id})`).addField("Error:", `Member already DOESN'T have this role`).setColor(bot.errorColor);
                errChannel.send({ embeds: [errEmbed] });
                return message.reply({ embeds: [embed2] });
            }
            try {
                let embed = new Discord.MessageEmbed().setTitle("Role removed!").setColor(accentColor).setDescription(`The ${roleoption} role has been removed from ${memberoption}!`);
                await memberoption.roles.remove(roleoption);
                message.reply({ embeds: [embed] });
            } catch (err) {
                let errorEmbed = new Discord.MessageEmbed()
                    .setTitle("<:error:859830692518428682> Error").setDescription("Error removing the roles!")
                    .setColor(bot.errorColor);
                    let errChannel = client.channels.cache.get("907641692075728987")
                    let errEmbed = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> An Error Occurred!").addField(`Caused by:`, `${message.member.user.tag}`).addField(`From the command:`, `${message.commandName}`).addField("From guild:", `${message.guild.name}, (${message.guild.id})`).addField("Error:", `Error removing the roles!`).setColor(bot.errorColor);
                    errChannel.send({ embeds: [errEmbed] });
                return message.reply({ embeds: [errorEmbed] });
            }
        }
	}
}