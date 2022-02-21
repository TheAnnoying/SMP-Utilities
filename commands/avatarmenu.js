const { SlashCommandBuilder, ContextMenuCommandBuilder, time } = require('@discordjs/builders');
const Discord = require('discord.js');
const bot = require(`../config.json`);

module.exports = {
    name: 'Avatar',
    aliases: [],
    usage: 'null',
    example: 'null',
    description: 'Get the profile picture of someone',
    data: new ContextMenuCommandBuilder()
            .setName('Avatar')
            .setType(2),
    async execute(client, message, args) {
        let avatarUser = await message.guild.members.cache.get(message.targetId).user;
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