const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const Discord = require('discord.js');
const client = require(`../../index.js`);
const bot = require(`../../config.json`);
const fn = require(`../../functions`);
const types = {
  betrayal: "773336526917861400",
  checkers: "832013003968348200",
  chess: "832012774040141894",
  fishington: "814288819477020702",
  letterleague: "879863686565621790",
  pokernight: "755827207812677713",
  sketchheads: "902271654783242291",
  spellcast: "852509694341283871",
  wordsnacks: "879863976006127627",
  youtube: "880218394199220334",
  ocho: "832025144389533716"
}

module.exports = {
    name: 'together',
    aliases: [],
    usage: 'together <channel> <type>',
    example: '/together #vc-1 Youtube',
    description: 'Use the discord together activities',
    options: {
        defer: false
    },
    data: new SlashCommandBuilder()
            .setName('together')
            .setDescription('Use the discord together activities')
            .addChannelOption(option =>
                option.setName("channel")
                .setDescription("Channel to play the activity on")
                .setRequired(true)
                .addChannelType(Discord.Constants.ChannelTypes.GUILD_VOICE)
            ).addStringOption(option =>
                option.setName("activity")
                .setDescription("What activity do you wanna play?")
                .addChoice("Betrayal", "betrayal")
                .addChoice("Checkers In The Park", "checkers")
                .addChoice("Chess In The Park", "chess")
                .addChoice("Fishington.io", "fishington")   
                .addChoice("Letter League", "letterleague")
                .addChoice("Ocho", "ocho")
                .addChoice("Poker Night", "pokernight")
                .addChoice("Sketchheads", "sketchheads")
                .addChoice("Spellcast", "spellcast")
                .addChoice("Wordsnacks", "wordsnacks")
                .addChoice("YouTube", "youtube")
            ),
    async execute(client, message, args) {
        if(message.options.getChannel("channel").type !== 'GUILD_VOICE') return message.reply({ embeds: [fn.sendError("Please select a voice channel")] });
        const data = await fetch(`https://discord.com/api/v8/channels/${message.options.getChannel("channel").id}/invites`, {
            method: "POST",
            body: JSON.stringify({
              max_age: 86400,
              max_uses: 0,
              target_application_id: types[message.options.getString("activity")],
              target_type: 2,
              temporary: false,
              validate: null
            }),
            headers: {
              Authorization: `Bot ${bot.token}`,
              "Content-Type": "application/json"
            }
          }).then(e => e.json())
          if(!data.code) return message.reply({ embeds: [fn.sendError("I dont have permissions to create together activities")] })
          message.reply({ embeds: [new Discord.MessageEmbed().setTitle("Press here to start!").setURL(`https://discord.gg/${data.code}`).setColor(bot.accentColor) ] });
	}
}