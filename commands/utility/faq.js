const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

const bot = require(`../../config.json`);
module.exports = {
    name: 'faq',
    aliases: [],
    usage: 'faq <question>',
    example: '/faq Connecting with aternos or minehut',
    description: 'Answers for frequently asked questions',
    data: new SlashCommandBuilder()
            .setName('faq')
            .setDescription('Answers for frequently asked questions')
            .addStringOption(option =>
                option.setName("question")
                .setDescription("Your question")
                .setRequired(true)
                .addChoice("Connecting with Aternos or Minehut", "connecting_with_aternos")
                .addChoice("Will the bot steal my data?", "bot_security")
                .addChoice("Can I support your work?", "support")
            ),
    async execute(client, message, args) {
        let question1 = message.options.getString("question");
        if(question1 === 'connecting_with_aternos'){
            const WorkingWithAternos = new Discord.MessageEmbed()
                .setTitle("<:aternos:887775868242501683> Connecting With Aternos or Minehut")
                .setDescription(`Connecting our bot with **Aternos** or **Minehut** servers is currently **not possible**.
                This is because both server hosts don't support ftp or additional ports for plugins (which are needed however to connect with our bot).`)
                .setColor(bot.accentColor)
                .addField("If you have a paid server, you will most likely be able to connect using ftp or the plugin.", '\u200b')
                .addField("But there's a solution?!", `We are currently working on a solution for this problem as there are lots of people wanting to connect their aternos or minehut server with out bot. However, this is in very early development and we cannot give any specific dates or schedule.`)
                .addField("\u200b", "**Idea for a question?** Use \`/suggest\` in <#844493308045950996>");
            message.reply({ embeds: [WorkingWithAternos] });
        }

        if(question1 === 'bot_security'){
            const securityembed = new Discord.MessageEmbed()
                .setTitle("⛔ Will the bot steal my data?")
                .setDescription('All data we get from you (`/connect`, `/chatchannel`) will only be saved **temporarily** in a private and safe place, to which only the Bot Managers have access to. This data is needed in order for most commands to be executed correctly.')
                .addField("How can I delete my saved data?", 'Use `/disconnect` for the corresponding connections to delete all of your saved data (forever). In addition, the bot deletes all stored server data after being kicked or removed from the server. In addition will the bot delete all ftp and rcon data as soon as it gets kicked or banned.')
                .addField("How can I trust you?", `- The code of our bot is open source and you can always find it in @Lianecx#6444's **[Github Repository](https://github.com/Lianecx/Smp-Minecraft-Bot)**.
        - Our bot is verified by Discord (the checkmark next to our bot indicates this), which means our bot follows all Discord safety standards and ToS.
        - For further information please read our **[Privacy Policy](https://github.com/Lianecx/Minecraft-SMP-Bot/blob/main/PRIVACY.md)**`).setColor(bot.accentColor)
                .addField("\u200b", "**Idea for a question?** Use `/suggest` in <#844493308045950996>");

            message.reply({ embeds: [securityembed] })
        }

        if(question1 === 'support'){
            const supportEmbed = new Discord.MessageEmbed().setTitle("🪄 Can I support your work?").setDescription(`**Yes! You can support us in many ways.**
            - The easiest way to support us, is by simply **using the bot.**
            It helps our bot grow and gives us motivation to continue developing the bot.
            
            - You can also **suggest ideas** for new commands, features and other things in <#844493308045950996> using \`/suggest\`.
            
            - The third way to support us is by **[donating](https://donatebot.io/checkout/844156404477853716)**. 
            Donating helps us bring out new and bigger features **more frequently** and will give you various **rewards**:
                   - Access to the <@883644973109620756> (access to new features early)
                   - Exclusive <@&878578541745283092> role
                   - Access to an exclusive chat
                   - (You can also suggest rewards in <#844493308045950996> with \`/suggest\`)`)
            .setColor(bot.accentColor)
            .addField("\u200b", "**Idea for a question?** Use \`/suggest\` in <#844493308045950996>");

            message.reply({ embeds: [supportEmbed] })
        }
    }
}
