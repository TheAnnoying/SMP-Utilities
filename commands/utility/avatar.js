const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const bot = require(`../../config.json`);

module.exports = {
    name: 'avatar',
    aliases: [],
    usage: 'avatar @someone',
    example: '/avatar @Dophline',
    description: 'Get the profile picture of someone',
    options: {
        defer: false
    },
    data: new SlashCommandBuilder()
            .setName('avatar')
            .setDescription('Get the profile picture of someone')
            .addUserOption(option =>
                option.setName("user")
                .setDescription("A user that I'll get an avatar from. (NOT REQUIRED)")
                .setRequired(false)
            ).addBooleanOption(option =>
                option.setName("guildicon")
                .setDescription("Do you wanna see the guild's icon? (NOT REQUIRED)")
            ),
    async execute(client, message, args) {
        let boolean = message.options.getBoolean('guildicon')
        if(boolean === true){
            if(!message.guild.iconURL) return message.reply({ embeds: [fn.sendError("This guild has no icon!")] })
            return message.reply({ embeds:[new Discord.MessageEmbed().setTitle(`${message.guild.name}'s Icon:`).setDescription(`[16x](${message.guild.iconURL({ size: 16, dynamic: true, format: 'png' })}), [32x](${message.guild.iconURL({ size: 32, dynamic: true, format: 'png' })}), [64x](${message.guild.iconURL({ size: 64, dynamic: true, format: 'png' })}), [128x](${message.guild.iconURL({ size: 128, dynamic: true, format: 'png' })}), [256x](${message.guild.iconURL({ size: 256, dynamic: true, format: 'png' })}), [512x](${message.guild.iconURL({ size: 512, dynamic: true, format: 'png' })}), [1024x](${message.guild.iconURL({ size: 1024, dynamic: true, format: 'png' })})`).setImage(message.guild.iconURL({ size: 1024, format: 'png', dynamic: true })).setColor(bot.accentColor).setFooter({ text: "This is a guild icon!" })] });
        }
        let avatarUser = message.options.getUser('user');
        if(!avatarUser) avatarUser = message.member.user;
        let member = await message.guild.members.fetch(avatarUser.id);

        const serverAvatar = member.avatarURL({ format: "png", dynamic: true, size: 1024 });
        
        
        const userAvatarEmbed = new Discord.MessageEmbed()
            .setTitle(`${avatarUser.username}'s Avatar:`)
            .setDescription(`[16x](${avatarUser.displayAvatarURL({ size: 16, dynamic: true, format: 'png' })}), [32x](${avatarUser.displayAvatarURL({ size: 32, dynamic: true, format: 'png' })}), [64x](${avatarUser.displayAvatarURL({ size: 64, dynamic: true, format: 'png' })}), [128x](${avatarUser.displayAvatarURL({ size: 128, dynamic: true, format: 'png' })}), [256x](${avatarUser.displayAvatarURL({ size: 256, dynamic: true, format: 'png' })}), [512x](${avatarUser.displayAvatarURL({ size: 512, dynamic: true, format: 'png' })}), [1024x](${avatarUser.displayAvatarURL({ size: 1024, dynamic: true, format: 'png' })})`)
            .setImage(avatarUser.displayAvatarURL({ size: 1024, format: 'png', dynamic: true }))
            .setColor(bot.accentColor)
            .setFooter({ text: "This is a user avatar!" });

        const guildAvatarEmbed = new Discord.MessageEmbed()
            .setTitle(`${avatarUser.username}'s Avatar:`)
            .setDescription(`[16x](${member.displayAvatarURL({ size: 16, dynamic: true, format: 'png' })}), [32x](${member.displayAvatarURL({ size: 32, dynamic: true, format: 'png' })}), [64x](${member.displayAvatarURL({ size: 64, dynamic: true, format: 'png' })}), [128x](${member.displayAvatarURL({ size: 128, dynamic: true, format: 'png' })}), [256x](${member.displayAvatarURL({ size: 256, dynamic: true, format: 'png' })}), [512x](${member.displayAvatarURL({ size: 512, dynamic: true, format: 'png' })}), [1024x](${member.displayAvatarURL({ size: 1024, dynamic: true, format: 'png' })})`)
            .setImage(member.displayAvatarURL({ size: 1024, format: 'png', dynamic: true }))
            .setColor(bot.accentColor)
            .setFooter({ text: "This is a guild avatar!" });

        if(!serverAvatar) {
            console.log("Used the non-serverAvatar (user avatar)")
            message.reply({ embeds: [userAvatarEmbed] });
        }
        if(serverAvatar){
            console.log("Used the serverAvatar")
            message.reply({ embeds: [userAvatarEmbed, guildAvatarEmbed] });
        }
	}
}