const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const ms = require('ms');
const bot = require(`../../config.json`);
const fn = require(`../../functions`);

module.exports = {
    name: 'remind',
    aliases: [],
    usage: 'remind <time> <reminder>',
    example: '/remind 30s make lunch',
    description: 'Remind yourself something in a specific time',
    options: {
        defer: false
    },
    data: new SlashCommandBuilder()
            .setName('remind')
            .setDescription('Remind yourself something in a specific time')
            .addStringOption(option =>
                option.setName("time")
                .setDescription("In how much time do you wanna reminded?")
                .setRequired(true)
            ).addStringOption(option =>
                option.setName("reminder")
                .setDescription("What do you wanna remind yourself?")
                .setRequired(true)
            ),
    async execute(client, message, args) {
        try {
            let time = message.options.getString('time');
            let user = message.member.user;
            let reminder = message.options.getString('reminder');
            if(time <= 0) return message.reply({ embeds: [fn.sendError("You have entered an invalid time")] });
            
            const notime = fn.sendError("Please specify the time!");
        
            const wrongtime = fn.sendError("Sorry I use **s** (seconds), **m** (minutes), **h** (hours), **d** (days), or **w** (weeks)");
        
            const reminderembed = fn.sendError("Please tell me what you want to be reminded of");
        
            if (!time) return message.reply({ embeds: [notime] })
            if(time.includes("-")) return message.reply({ embeds: [wrongtime] });
            if (
                !time.includes("1") &&
                !time.includes("2") &&
                !time.includes("3") &&
                !time.includes("4") &&
                !time.includes("5") &&
                !time.includes("6") &&
                !time.includes("7") &&
                !time.includes("8") &&
                !time.includes("9")
            ) {
                return message.reply({ embeds: [wrongtime] })
            }
            if (
                !time.endsWith("d") &&  
                !time.endsWith("w") &&
                !time.endsWith("m") &&
                !time.endsWith("h") &&
                !time.endsWith("s")
            ) {
                return message.reply({ embeds: [wrongtime] })
            }
            if (!reminder) return message.reply({ embeds: [reminderembed] });
            
            const remindertime = new Discord.MessageEmbed()
                .setTitle("Reminder has been set")
                .addField("Length", time)
                .addField("Reminder", reminder)
                .setColor(bot.accentColor);
        
            message.reply({ embeds: [remindertime] })
        
            const reminderdm = new Discord.MessageEmbed()
                .setColor(bot.accentColor)
                .setTitle(`Reminder:`)
                .setDescription(`${reminder}`);  
                
                const timer = await ms(time);
                if(!timer) {
                    return message.reply({ embeds: [wrongtime] });
                }
                setTimeout(async function () {
                    try{
        
                    await message.editReply({ content: `<@${message.member.user.id}>`, embeds: [reminderdm] });
                    await message.member.user.send({ content: `<@${message.member.user.id}>`, embeds: [reminderdm] });
                    console.log(ms)
                    }catch(err){
        
                    } 
                    
                }, timer);
        } catch (err) {
            message.reply({ embeds: [fn.sendError(`${err.message}`)] });
        }
	}
}