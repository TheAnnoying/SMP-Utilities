const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const Discord = require('discord.js');
const bot = require(`../config.json`);

module.exports = {
    name: 'skin',
    aliases: [],
    usage: 'skin mcusername',
    example: '/skin TheAnnoying',
    description: 'See the skin of a player',
    data: new SlashCommandBuilder()
            .setName('skin')
            .setDescription('See the skin of a player')
            .addStringOption(option =>
                option.setName("mcusername")
                .setDescription("Your Minecraft username")
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
        try {  
            let mcuser = message.options.getString("mcusername")
            const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${mcuser}`);
            const data = await response.json();
            const embed = new Discord.MessageEmbed()/*.setTitle(`${mcuser}'s Skin`)*/.setDescription(`[Download](https://mc-heads.net/download/${data.id})`).setImage(`https://mc-heads.net/body/${data.id}/right`).setAuthor({ name: `${mcuser}`, iconURL: `https://crafatar.com/avatars/${data.id}` }).setColor(bot.accentColor);
            message.reply({ embeds: [embed] })
        } catch (err) {
            console.log(err);
            const sendError = new Discord.MessageEmbed()
            .setTitle("<:error:859830692518428682> Error")
            .setDescription("Invalid username!")
            .setColor(bot.errorColor);
            let errChannel = client.channels.cache.get("907641692075728987")
            let errEmbed = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> An Error Occurred!").addField(`Caused by:`, `${message.member.user.tag}`).addField(`From the command:`, `${message.commandName}`).addField("From guild:", `${message.guild.name}, (${message.guild.id})`).addField("Error:", `Invalid skin - ${err.message}`).setColor(bot.errorColor);
            errChannel.send({ embeds: [errEmbed] });
            message.reply({ embeds: [sendError] });
        }
	}
}