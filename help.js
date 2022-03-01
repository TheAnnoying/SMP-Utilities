const Discord = require('discord.js');
const fs = require('fs');
const bot = require(`./config.json`);

module.exports = {
    autocomplete(client, interaction) {
        const focused = interaction.options.getFocused().toLowerCase();

        const commands = [];
        const respondArray = [];

        const commandFolders = fs.readdirSync('./commands/');
        for (const folder of commandFolders) {
            //TODO Delete the following line if you dont want the categories included in the autocomplete respond
            commands.push(folder);

            const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));

            for (const file of commandFiles) {
                const command = require(`./commands/${folder}/${file}`);
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
    execute(client, interaction, args) {
        const helpEmbed = new Discord.MessageEmbed()
            .setTitle('Help Menu')
            .setAuthor({ name: `${client.user.username}`, iconURL: client.user.displayAvatarURL({ format: 'png' }) })
            .setColor(bot.accentColor);

        if(!args[0]) {
            //TODO Please adjust the fields for each category manually to your likings
            helpEmbed.addField("Context Menus", "All you the commands you can access from context menus")
            helpEmbed.addField("Images", "Some fun image commands")
            helpEmbed.addField("Moderation", "The moderation commands to help keep your server safe!")
            helpEmbed.addField("Utility", "All the fun utility commands that you can use")

            interaction.editReply({ embeds: [helpEmbed], allowedMentions: { repliedUser: false } });
        } else {
            let command = client.commands.get(args[0]) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0]));
            if (command) {
                //client.commands.forEach(command => helpEmbed.addField(command.name.toUpperCase(), command.description, true));

                const helpEmbed = new Discord.MessageEmbed()
                    .setTitle('Help Menu')
                    .setAuthor({ name: `${client.user.username}`, iconURL: client.user.displayAvatarURL({ format: 'png', dynamic: false }) })
                    .setColor(bot.accentColor)
                    .addField(`${command.name.cap()}`, `${command.description}`);

                if(command.usage) helpEmbed.addField('\n**Usage**', command.usage);
                if(command.example) helpEmbed.addField('\n**Example**', command.example);

                interaction.editReply({ embeds: [helpEmbed] });
            } else {
                fs.readdir(`./commands/${args[0]}`, (err, commands) => {
                    if(err) {
                        console.log(`${interaction.member.user.tag} executed non-existent help command/category ${args[0]} in ${interaction.guild.id}`);
                        interaction.editReply(`:warning: That command/category [**${args[0]}**] doesnt exist.`);
                        return;
                    }

                    commands.forEach(commandFile => {
                        commandFile = commandFile.split('.').shift();
                        command = require(`./commands/${args[0]}/${commandFile}`);
                        helpEmbed.addField(command.name.cap(), command.description);
                    });
                    interaction.editReply({ embeds: [helpEmbed] });
                });
            }
        }
    }
}