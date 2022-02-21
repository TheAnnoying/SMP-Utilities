const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const ms = require('ms');
const bot = require(`../config.json`);

module.exports = {
    name: 'remind',
    aliases: [],
    usage: 'remind <time> <reminder>',
    example: '/remind 30s make lunch',
    description: 'Remind yourself something in a specific time',
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
            if(time <= 0){
                let errChannel = client.channels.cache.get("907641692075728987")
                    let errEmbed = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> An Error Occurred!").addField(`Caused by:`, `${message.member.user.tag}`).addField(`From the command:`, `${message.commandName}`).addField("From guild:", `${message.guild.name}, (${message.guild.id})`).addField("Error:", `Invalid time.`).setColor(bot.errorColor);
                    errChannel.send({ embeds: [errEmbed] });
                const invalidtime = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> Error").setDescription("Invalid time.").setColor(bot.errorColor);
                return message.reply({ embeds: [invalidtime] });
            }
            const notime = new Discord.MessageEmbed()
                    .setColor(bot.errorColor)
                    .setTitle("<:error:859830692518428682> Error")
                    .setAuthor({ name: `Please specify the time!` });
        
            const wrongtime = new Discord.MessageEmbed()
                .setColor(bot.errorColor)
                .setTitle("<:error:859830692518428682> Error")
                .setDescription(`Sorry I use **d** (days), **m** (minutes), **h** (hours), or **s** (seconds)`);
        
            const reminderembed = new Discord.MessageEmbed()
                .setColor(bot.errorColor)
                .setTitle("<:error:859830692518428682> Error")
                .setDescription(`Please tell me what you want to be reminded of`);
        
            if (!time) return message.reply({ embeds: [notime] })
            if(time.includes("-")) return message.reply({ embeds: [wrongtime] });
            if (
                !time.endsWith("d") &&   
                !time.endsWith("m") &&
                !time.endsWith("h") &&
                !time.endsWith("s")
            ) {
                let errChannel = client.channels.cache.get("907641692075728987")
                    let errEmbed = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> An Error Occurred!").addField(`Caused by:`, `${message.member.user.tag}`).addField(`From the command:`, `${message.commandName}`).addField("From guild:", `${message.guild.name}, (${message.guild.id})`).addField("Error:", `Sorry I use **d** (days), **m** (months), **h** (hours), or **s** (seconds)`).setColor(bot.errorColor);
                    errChannel.send({ embeds: [errEmbed] });
                return message.reply({ embeds: [wrongtime] })
            }
            if (!reminder) return message.reply({ embeds: [reminderembed] });
            
            const remindertime = new Discord.MessageEmbed()
                .setTitle("Reminder has been set")
                .addField("Length", time)
                .addField("Reminder", reminder)
                .setColor(bot.accentColor)
        
            message.reply({ embeds: [remindertime] })
        
            const reminderdm = new Discord.MessageEmbed()
                .setColor(bot.accentColor)
                .setTitle(`Reminder:`)
                .setDescription(`${reminder}`)  
                
                const timer = await ms(time);
                if(!timer) {
                    let errChannel = client.channels.cache.get("907641692075728987")
                    let errEmbed = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> An Error Occurred!").addField(`Caused by:`, `${message.member.user.tag}`).addField(`From the command:`, `${message.commandName}`).addField("From guild:", `${message.guild.name}, (${message.guild.id})`).addField("Error:", `Sorry I use **d** (days), **m** (months), **h** (hours), or **s** (seconds)`).setColor(bot.errorColor);
                    errChannel.send({ embeds: [errEmbed] });
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
            let errChannel = client.channels.cache.get("907641692075728987")
                    let errEmbed = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> An Error Occurred!").addField(`Caused by:`, `${message.member.user.tag}`).addField(`From the command:`, `${message.commandName}`).addField("From guild:", `${message.guild.name}, (${message.guild.id})`).addField("Error:", `${err.message}`).setColor(bot.errorColor);
                    errChannel.send({ embeds: [errEmbed] });
            const errorEmbed = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> Error").setDescription(err.message).setColor(bot.errorColor);
            message.reply({ embeds: [errorEmbed] });
        }
	}
}