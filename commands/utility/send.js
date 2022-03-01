const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const bot = require('../../config.json');
const fn = require(`../../functions`);

module.exports = {
    name: 'send',
    aliases: [],
    usage: 'send <type> <id> <message>',
    example: '/send 588425966804533421 hello!',
    description: 'Send a message to a specific channel or user',
    options: {
        defer: false
    },
    permissions: ["Administrator", "Moderator"],
    data: new SlashCommandBuilder()
            .setName('send')
            .setDescription('Send a message to a specific channel or user')
            .setDefaultPermission(false)
            .addSubcommand(subcommand =>
                subcommand.setName("channel")
                .setDescription("Send a message to a specific channel")
                .addStringOption(option => option.setName("id").setRequired(true).setDescription("The ID of the channel to send the message to"))
                .addStringOption(option => option.setName("message").setRequired(true).setDescription("The message to send"))
                .addBooleanOption(option => option.setName("ephemeral").setDescription("If the success message will be ephemeral or not"))
            ).addSubcommand(subcommand =>
                subcommand.setName("user")
                .setDescription("Send a message to a specific user")
                .addStringOption(option => option.setName("id").setRequired(true).setDescription("The ID of the user to send the message to"))
                .addStringOption(option => option.setName("message").setRequired(true).setDescription("The message to send"))
            ),
    async execute(client, message, args) {
        const id = message.options.getString("id");
        const msg = message.options.getString("message");

        if(message.options.getSubcommand() === "channel"){
            const ephem = message.options.getBoolean("ephemeral") ?? false;

            try {
                client.channels.cache.get(id).send(`${msg}`);
            } catch(err) {
                return message.reply({ embeds: [fn.sendError("Could not reach channel, the id might've been invalid or I do not have access to that channel")] });
            }

            return message.reply({ embeds: [new Discord.MessageEmbed().setAuthor({ name: "Success!", iconURL: "https://cdn.discordapp.com/emojis/914130307362484265.webp?size=96&quality=lossless"}).setDescription(`Successfully sent \`${msg}\` to the ${client.channels.cache.get(id).name} channel`).setColor("GREEN")], ephemeral: ephem});
        } else if(message.options.getSubcommand() === "user"){
            try {
                client.users.cache.get(id).send(`${msg}`)
            } catch(err){
                return message.reply({ embeds: [fn.sendError("Could not reach user, the id might've been invalid or their dm's are not enbaled")] });
            }
            return message.reply({ embeds: [new Discord.MessageEmbed().setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 }) }).setDescription(msg).setFooter({ text: `Sent to ID: ${id}` }).setColor(bot.accentColor)], ephemeral: false });
        }
    }
}
