const Discord = require('discord.js');
const bot = require(`../config.json`);

module.exports.run = async(client, message, args) => {
        args = args.join(" ")
        let avatarUser = message.mentions.members.first() || (await message.guild.members.fetch()).find(member => member.displayName.toLowerCase() === args.toLowerCase()) || (await message.guild.members.fetch()).find(member => member.user.username.toLowerCase() === args.toLowerCase()) || await message.guild.members.fetch(args);

        const serverAvatar = avatarUser.avatarURL({ format: "png", dynamic: true, size: 1024 });
    
        const userAvatarEmbed = new Discord.MessageEmbed()
            .setTitle(`${avatarUser.user.username}'s Avatar:`)
            .setDescription(`[16x](${avatarUser.user.displayAvatarURL({ size: 16, dynamic: true, format: 'png' })}), [32x](${avatarUser.user.displayAvatarURL({ size: 32, dynamic: true, format: 'png' })}), [64x](${avatarUser.user.displayAvatarURL({ size: 64, dynamic: true, format: 'png' })}), [128x](${avatarUser.user.displayAvatarURL({ size: 128, dynamic: true, format: 'png' })}), [256x](${avatarUser.user.displayAvatarURL({ size: 256, dynamic: true, format: 'png' })}), [512x](${avatarUser.user.displayAvatarURL({ size: 512, dynamic: true, format: 'png' })}), [1024x](${avatarUser.user.displayAvatarURL({ size: 1024, dynamic: true, format: 'png' })})`)
            .setImage(avatarUser.user.displayAvatarURL({ size: 1024, format: 'png', dynamic: true }))
            .setColor(bot.accentColor)
            .setFooter({ text: "This is a user avatar!" });

        const guildAvatarEmbed = new Discord.MessageEmbed()
            .setTitle(`${avatarUser.user.username}'s Avatar:`)
            .setDescription(`[16x](${avatarUser.displayAvatarURL({ size: 16, dynamic: true, format: 'png' })}), [32x](${avatarUser.displayAvatarURL({ size: 32, dynamic: true, format: 'png' })}), [64x](${avatarUser.displayAvatarURL({ size: 64, dynamic: true, format: 'png' })}), [128x](${avatarUser.displayAvatarURL({ size: 128, dynamic: true, format: 'png' })}), [256x](${avatarUser.displayAvatarURL({ size: 256, dynamic: true, format: 'png' })}), [512x](${avatarUser.displayAvatarURL({ size: 512, dynamic: true, format: 'png' })}), [1024x](${avatarUser.displayAvatarURL({ size: 1024, dynamic: true, format: 'png' })})`)
            .setImage(avatarUser.displayAvatarURL({ size: 1024, format: 'png', dynamic: true }))
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

module.exports.config = {
    name: 'avatar',
    aliases: ["av"],
}