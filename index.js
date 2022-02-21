const Discord = require('discord.js');
const { Client, Collection } = require('discord.js');
const client = new Discord.Client({ intents:
    [
        Discord.Intents.FLAGS.GUILD_MESSAGES, 
        Discord.Intents.FLAGS.GUILDS, 
        Discord.Intents.FLAGS.GUILD_MEMBERS, 
        Discord.Intents.FLAGS.GUILD_PRESENCES,
        Discord.Intents.FLAGS.DIRECT_MESSAGES,
        Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Discord.Intents.FLAGS.DIRECT_MESSAGES,
    ],
    partials:
    [
        'MESSAGE', 
        'CHANNEL', 
        'REACTION'
    ]
});
const { DiscordTogether } = require('discord-together');
client.discordTogether = new DiscordTogether(client);
const fs = require('fs')
const fsp = require('fs/promises')
const bot = require(`./config.json`);
//difflib.getCloseMatches(input, list to find closest from, how many results, set to 0 to never fail)[0]

client.on("ready", async() => {
    const startUp = new Date();
    const startUpDate = new Date().toLocaleDateString();
    const startUpTime = new Date().toLocaleTimeString();
    console.log(`[START UP] Starting up the bot at ${startUpDate}, while the time is ${startUpTime}`);
    console.log(`[DISCORD] Client ready as ${client.user.tag}`);
    setTimeout(() => { 
        console.log(`[CLIENT] Slash commands have been loaded up and no custom prefix has been set.`);
    }, 1500);
    setTimeout(() => {
        console.log(`The ${client.user.username} Bot is online`);
        client.user.setPresence({ activities: [{ name: 'in an SMP!', type: 'PLAYING',}]});
    }, 2000)

    const smpChannel = client.channels.cache.get('885084999496368148');
    const messages = await smpChannel.messages.fetch();
    messages.filter(m => m.author.id === '882604821612482600').first().delete();
        const smpStartupEmbed = new Discord.MessageEmbed()
            .setTitle('<:checkmark2:887686603559010344> SMP Utilites has started up!')
            .addField("Start up", `Starting up the bot at <t:${Math.floor(startUp / 1000)}:D>,
            while the time is  <t:${Math.floor(startUp / 1000)}:T>`)
            .addField("Discord", `Client ready as **${client.user.tag}**`)
            .addField("Client", "Slash commands have been loaded up and no custom prefix has been set.")
            .addField("Bot Info", `Status set as ${client.user.presence.status}`)
            .setColor(bot.accentColor)
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }));
        const smpPinging = new Discord.MessageEmbed().setTitle("<a:pinging:891202470833946635> SMP Utilities is starting up...").setColor(bot.accentColor);
        smpChannel.send({ embeds: [smpPinging] })
        setTimeout(() => {
            smpChannel.messages.fetch({ limit: 1 }).then(messages => {
                let lastMessage = messages.first()
                lastMessage.delete();
            })
            smpChannel.send({ embeds: [smpStartupEmbed] });
        }, 5000);
});


const fetch = require('node-fetch');
client.on("messageCreate", message => {
    if(message.content === "smputil!log"){
        const guild = client.guilds.cache.get('844156404477853716');

        if(message.guild !== guild) return;

        guild.channels.cache.get('868527929339052062').setName('😀 Members: ' + guild.members.cache.filter(member => !member.user.bot).size);
        guild.channels.cache.get('925774807226802226').setName('🤖 Bots: ' + guild.members.cache.filter(member => member.user.bot).size);
        guild.channels.cache.get('868527844626694144').setName('😆 Total Members: ' + guild.memberCount);

        console.log('Updating Member count...');

    }
    if(message.channel.type === 'DM'){
	if(message.author.id === client.user.id) return;
        const DMLOGS = client.channels.cache.get("916629282204291114");
        const DMEmbed = new Discord.MessageEmbed().setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) }).setColor(bot.accentColor).setDescription(`${message}`).setFooter({ text: `ID: ${message.author.id}` });
        if(message.attachments.size > 0) DMEmbed.setImage(message.attachments.first().url.toString());
        DMLOGS.send({ embeds: [DMEmbed] });
    }
    const pms = require("pretty-ms");
    if(message.content === '<@882604821612482600>' || message.content === '<@!882604821612482600>'){
        const prefixEm = new Discord.MessageEmbed()
        .setTitle("Info").setDescription("Hello :wave:. I am **SMP Utilities**, To use my commands type /help.")
        .addField("Uptime", `${pms(client.uptime)}`, true)
        .addField("Commands", `${client.commands.size}`, true)
        .setImage("https://media.discordapp.net/attachments/844493685244297226/916632591854075925/smputil.png")
        .setColor(bot.accentColor)
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true, format: 'png' }));
        message.reply({ embeds:[ prefixEm] });
    }
});

if(!String.prototype.cap) String.prototype.cap = function(){
    return this[0].toUpperCase() + this.slice(1,this.length).toLowerCase()
};
if(!String.prototype.toTitleCase) String.prototype.toTitleCase = function(){
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()})
}

client.commands = new Discord.Collection();
client.snipes = new Discord.Collection();
//Read ./commands and filter all nonJs files
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    //Require all commandFiles
    const command = require(`./commands/${file}`);
    //Set all commandFiles in ./commands in client.commands collection
    client.commands.set(command.name, command);
}

client.on('interactionCreate', async interaction => {
    if(interaction.isContextMenu()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;
      
        command.execute(client, interaction);
    }
    if(!interaction.isCommand()) return;

    //Add args array for easier use
    //args are like args from messageCreate (They include the group and subcommand if one set)
    const args = [];
    if(interaction.options._group) args.push(interaction.options._group);
    if(interaction.options._subcommand) args.push(interaction.options._subcommand);
    interaction.options._hoistedOptions.forEach(option => {
        if(option.value) args.push(option.value);
    });

    //interaction.reply = interaction.editReply
    interaction.reply = function (content) {
        return interaction.editReply(content);
    }

    

    //Help command
    if (interaction.commandName === 'help') {
        await interaction.deferReply();

        if(!args[0]) {
            console.log(interaction.user.tag + ' executed /help in ' + interaction.guild.name);

            const helpEmbed = new Discord.MessageEmbed()
                .setTitle('Help Menu')
                .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ format: 'png', dynamic: false }) })
                .setColor(bot.accentColor);

                client.commands.forEach(command => helpEmbed.addField(command.name.toUpperCase(), command.description, true));

            const reaply1 = await interaction.reply({
                embeds: [helpEmbed],
                ephemeral: true 
            });
        } else {
            console.log(`${interaction.user.tag} executed /help ${args[0]} in ${interaction.guild.name}`);

            const helpCommand = client.commands.get(args[0]);
            if(!helpCommand) {
                interaction.reply(`:warning: That command [**${args[0]}**] doesnt exist.`);
                return;
            }

            const helpEmbed = new Discord.MessageEmbed()
                .setTitle('Help Menu')
                .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ format: 'png', dynamic: false }) })
                .setColor(bot.accentColor)
                .addField(helpCommand.name.toUpperCase(), helpCommand.description);
            if(helpCommand.usage) helpEmbed.addField('\n**USAGE**', helpCommand.usage);
            if(helpCommand.example) helpEmbed.addField('\n**EXAMPLE**', helpCommand.example);
            if(helpCommand.aliases[0]) helpEmbed.addField('\n**ALIASES**', helpCommand.aliases.join(', '));

            const reaply = await interaction.reply({
                embeds: [helpEmbed],
                ephemeral: true
            });
        }
    } else {

        //Other Commands
        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        await interaction.deferReply();

        command.execute(client, interaction, args);
    }
})

client.on("guildMemberAdd", (member) => {
    const guild = client.guilds.cache.get('844156404477853716');

    if(member.guild !== guild) return;

    guild.channels.cache.get('868527929339052062').setName('😀 Members: ' + guild.members.cache.filter(member => !member.user.bot).size);
    guild.channels.cache.get('925774807226802226').setName('🤖 Bots: ' + guild.members.cache.filter(member => member.user.bot).size);
    guild.channels.cache.get('868527844626694144').setName('😆 Total Members: ' + guild.memberCount);

    console.log('Updating Member count...');

    guild.channels.cache.get("864905470199332894").send(`Hey <@${member.user.id}>, welcome to the **Smp Bot Support Server**! 👋
    If you have any questions with <@712759741528408064>, feel free to ask them in <#844156578386149426>`)
});

client.on("guildMemberUpdate", async (oldMember, newMember) => {
    if(!oldMember.pending && newMember.pending) {
        let welcomerole = member.guild.roles.cache.find(role => role.id === '844493763988422676');

        member.roles.add(welcomerole);
    }
	if(newMember.communicationDisabledUntil && !oldMember.communicationDisabledUntil){
        if(!fs.existsSync(`./moderationFiles/${newMember.user.id}_${newMember.guild.id}.json`)){
            const timeoutAdded = {
                name: `${newMember.user.username}`,
                warnAmount: 0,
                muted: false,
                timedout: true,
                warns: [

                ]
            };
            fsp.writeFile(`./moderationFiles/${newMember.user.id}_${newMember.guild.id}.json`, JSON.stringify(timeoutAdded, null, 2));
        };
        let target = JSON.parse(await fsp.readFile(`./moderationFiles/${newMember.user.id}_${newMember.guild.id}.json`));

        if(target.timedout === false){
            target.timedout = true;
        }
        await fsp.writeFile(`./moderationFiles/${newMember.user.id}_${newMember.guild.id}.json`, JSON.stringify(target, null, 2));
    }
    if(oldMember.communicationDisabledUntil && !newMember.communicationDisabledUntil){
        if(!fs.existsSync(`./moderationFiles/${newMember.user.id}_${newMember.guild.id}.json`)){
            const timeoutRemoved = {
                name: `${newMember.user.username}`,
                warnAmount: 0,
                muted: false,
                timedout: false,
                warns: [

                ]
            };
            fsp.writeFile(`./moderationFiles/${newMember.user.id}_${newMember.guild.id}.json`, JSON.stringify(timeoutRemoved, null, 2));
        };
        let target = JSON.parse(await fsp.readFile(`./moderationFiles/${newMember.user.id}_${newMember.guild.id}.json`));
        if(target.timedout = true){
            target.timedout = false;
            await fsp.writeFile(`./moderationFiles/${newMember.user.id}_${newMember.guild.id}.json`, JSON.stringify(target, null, 2));
        }
        await fsp.writeFile(`./moderationFiles/${newMember.user.id}_${newMember.guild.id}.json`, JSON.stringify(target, null, 2));
    }
});

client.on("guildMemberRemove", (member) => {
    const guild = client.guilds.cache.get('844156404477853716');

    if(member.guild !== guild) return;

    guild.channels.cache.get('868527929339052062').setName('😀 Members: ' + guild.members.cache.filter(member => !member.user.bot).size);
    guild.channels.cache.get('925774807226802226').setName('🤖 Bots: ' + guild.members.cache.filter(member => member.user.bot).size);
    guild.channels.cache.get('868527844626694144').setName('😆 Total Members: ' + guild.memberCount);

    console.log('Updating Member count...');

});
client.on("messageDelete", (message) => {
    let snipes = client.snipes.get(message.channel.id) || [];
    if(snipes.length > 5) snipes = snipes.slice(0, 4)
    snipes.unshift({
        msg: message,
        image: message.attachments.first()?.proxyURL || null,
    });
    client.snipes.set(message.channel.id, snipes);
});
client.login(bot.token);
