const fn = require(`../../functions`);
const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const Discord = require('discord.js');
const bot = require(`../../config.json`);

module.exports = {
    name: 'meme',
    aliases: [],
    usage: 'meme',
    example: '/meme',
    description: 'Get a random meme from r/memes!',
    options: {
        defer: true
    },
    data: new SlashCommandBuilder()
            .setName("meme")
            .setDescription("Get a random meme from r/memes!"),
    async execute(client, message, args) {

        const { title, url, permalink } = await getMeme();

        let confirmMessage = await message.editReply({ embeds: [new Discord.MessageEmbed().setColor(bot.accentColor).setTitle(title).setURL(`https://www.reddit.com${permalink}`).setImage(url)], components: [new Discord.MessageActionRow().addComponents([new Discord.MessageButton().setStyle('SECONDARY').setLabel('Next').setCustomId('page_forward'), new Discord.MessageButton().setStyle('DANGER').setLabel('Delete').setCustomId('end')])] });
        const collector = confirmMessage.createMessageComponentCollector({ componentType: 'BUTTON', time: 60000 });
            collector.on('collect', async button => {
                if(button.member.user.id !== message.member.user.id){
                    return button.message.reply({ embeds: [new Discord.MessageEmbed().setTitle("Only the command author can use these buttons").setColor(bot.errorColor)], ephemeral: true });
                } else if(button.customId === 'end'){
                    return button.message.delete()
                } else if(button.customId === 'page_forward'){
                    const { title, url, permalink } = await getMeme();
                    button.update({ embeds: [button.message.embeds[0].setTitle(title).setURL(`https://www.reddit.com${permalink}`).setImage(url)] });
                }
            });
            collector.on('end', collected => {
                try {
                    if(!collected.size) {
                        confirmMessage.delete();
                    }
                } catch(err){}
            });

        
        async function getMeme() {
            const req = await require("axios").get('https://www.reddit.com/r/memes/random/.json');
            return req.data[0].data.children[0].data
        }
	}
}