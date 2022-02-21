const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const moment = require('moment')
const fetch = require('node-fetch');
const bot = require(`../config.json`);

module.exports = {
    name: 'npm',
    aliases: [],
    usage: 'npm <module>',
    example: '/npm ytdl-core',
    description: 'Send information about an npm package from NPMJS.com',
    data: new SlashCommandBuilder()
            .setName('npm')
            .setDescription('Send information about an npm package from NPMJS.com')
            .addStringOption(option =>
                option.setName("module")
                .setDescription("An npm module")
                .setRequired(true)
            ),
    async execute(client, message, args) {
        let query = message.options.getString('module');
        const nosearch = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> Error").setColor(bot.errorColor).setDescription("No search results found")
        const res = await fetch(`https://registry.npmjs.com/${encodeURIComponent(query)}`).catch(err => console.log(err));
        if (res.status === 404) return message.reply({ embeds: [nosearch] });
        const body = await res.json();
        const embed = new Discord.MessageEmbed()
            .setColor(0xde2c2c)
            .setTitle(body.name)
            .setURL(`https://www.npmjs.com/package/${body.name}`)
            .setDescription(body.description || 'No description.')
            .addField('Version', body['dist-tags'].latest, true)
            .addField('License', body.license || 'None', true) 
            .addField('Author', body.author ? body.author.name : '???', true)
            .addField('Creation Date', moment.utc(body.time.created).format('YYYY/MM/DD hh:mm:ss'), true) //When was the initial commit
            .addField('Modification Date', body.time.modified ? moment.utc(body.time.modified).format('YYYY/MM/DD hh:mm:ss') : 'None', true) //Last updated or modified
            .addField('Repository', body.repository ? `[View Here](${body.repository.url.split('+')[1]})` : 'None', true) //Github link
            .addField('Maintainers', body.maintainers.map(user => user.name).join(', ')) //People that have worked and helped make the package
        message.reply({ embeds: [embed] });
	}
}