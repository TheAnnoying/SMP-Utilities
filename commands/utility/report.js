const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const bot = require(`../../config.json`);
const fs = require('fs');
const fn = require(`../../functions`);
module.exports = {
    name: 'report',
    aliases: [],
    usage: 'report <bug> [command]',
    example: '/report bug:Your bot is bad! command:warn',
    description: 'Report a bot bug',
    options: {
        defer: false
    },
    data: new SlashCommandBuilder()
            .setName('report')
            .setDescription('Report a bot bug')
            .addStringOption(option => option.setName("bug").setDescription("A certain bug you want to report").setRequired(true))
            .addStringOption(option => 
                option.setName("command")
                .setDescription("The command the bug is from! (Leave empty if it's a general bug)")
                .setAutocomplete(true)
            ),
            autocomplete(interaction) {
                const focused = interaction.options.getFocused().toLowerCase();
        
                const commands = [];
                const respondArray = [];
        
                const commandFolders = fs.readdirSync('./commands/');
                for (const folder of commandFolders) {
                    //TODO Delete the following line if you dont want the categories included in the autocomplete respond
                    commands.push(folder);
        
                    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
        
                    for (const file of commandFiles) {
                        const command = require(`../../commands/${folder}/${file}`)
                        commands.push(command.name);
                    }
                }
        
                const matchingCommands = commands.filter(command => command.includes(focused));
                if(matchingCommands.length >= 25) matchingCommands.length = 25;
        
                matchingCommands.forEach(command => {
                    respondArray.push({
                        name: command,
                        value: command,
                    });
                });
        
                interaction.respond(respondArray);
            },
    async execute(client, message, args) {
        const bug = message.options.getString("bug");
        const command = message.options.getString("command") ?? 'None';
        
        const errorEmbed = new Discord.MessageEmbed().setTitle("😳 New bug!").setDescription(`${bug}`).addField("From command", `${command}`).setColor(bot.errorColor).setAuthor({ name: `${message.member.user.tag}`, iconURL: `${message.member.user.displayAvatarURL()}` }).setFooter({ text: `${message.guild.name} (${message.guild.id})`, iconURL: `${message.guild.iconURL()}` });
        const owner = client.channels.cache.get("945055266225913917");
        const webhookClient = new Discord.WebhookClient({ url: "https://canary.discord.com/api/webhooks/930022086930481202/l8TK758vUiV6sb-jLQSxl1ytpc3-9yxVVUGP_NatJ9RB5hxNbe6sgjPu4M_Lp0ibcjEB" });
        webhookClient.send({ embeds: [errorEmbed] });
        let successEmbed = new Discord.MessageEmbed().setTitle("<:greencheck:914130307362484265> Success! Thank you for reporting the bug.").setColor(bot.accentColor);
        message.reply({ embeds: [successEmbed], ephemeral: true });
	}
}