const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const bot = require('../config.json');
const Color = require('color');
const fetch = require('node-fetch');
const sharp = require('sharp');

async function makeFile(data){
    let buffer
    if(data.stream) buffer = await streamToBuffer(data.stream)
    if(data.buffer) buffer = data.buffer
    if(data.canvas) buffer = await data.canvas.png
    if(data.path)   buffer = fs.readFileSync(data.path)
    if(data.url)    buffer = await fetch(data.url).then(e => e.buffer())
    if(data.sharp)  buffer = await data.sharp.png().toBuffer()
    if(data.img)    buffer = await (await imageToCanvas(data.img)).png
    if(data.canvas) return new Discord.MessageAttachment(buffer, data.name, {
        width: data.canvas.width,
        height: data.canvas.height
    });
    return new Discord.MessageAttachment(buffer, data.name)
};
module.exports = {
    name: 'color',
    aliases: [],
    usage: 'deposit <hex color>',
    example: '/color #55dfe',
    description: 'See information on a specific color',
    data: new SlashCommandBuilder()
        .setName('color')
        .setDescription('See information on a specific color')
        .addStringOption(option =>
            option.setName("hex")    
            .setDescription("The hex color you wanna check on")
            .setRequired(true)
        ),
        async execute(client, message, args) {
            try {
                const bg = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAIAAAACAAQMAAAD58POIAAAABlBMVEXMzMz////TjRV2AAAANElEQVR4XmP4/4PB/g+D/H8G9v8HmP8/YBhWAlAGXGI4CYxG1GhEjcbcaMyNxtxoRA1dAQAGkPwu7vcDswAAAABJRU5ErkJggg==", "base64")
                const color = message.options.getString("hex");
                const output = Color(color)
                const response = await fetch(`https://api.popcat.xyz/color/${output.hex().replace("#","")}`);
                const data = await response.json();
                let colorEmbed = new Discord.MessageEmbed()
                    .setTitle(`Color ${data.name}`)
                    .addField("Hex", `\`${output.hex()}\``, true)
                    .addField("RGB", `\`${output.rgb().array().map(number => Math.round(number * 1000) / 1000).join(", ")}\``, true)
                    .addField("RGB Float", `\`${output.rgb().array().map((e, i) => Math.floor(e*1000/(i !== 3 ? 255 : 1))/1000).join(", ")}\``, true)
                    .addField("HSL", `\`${output.hsl().array().map(number => Math.round(number * 1000) / 1000).join(", ").toString().replace("hsl","").replace("(", "").replace(")", "").replaceAll("%", "")}\``, true)
                    .addField("CMYK", `\`${output.cmyk().round().array().map(number => Math.round(number * 1000) / 1000).join(", ")}\``, true)
                    .addField("ANSI256", `\`${Object.values(output.ansi256().object())[0]}\``, true)
                    .setThumbnail(`attachment://image.png`)
                    .setColor(`${output.hex().replace("#","")}`);
                if(output.isDark() === true){
                    colorEmbed.setFooter({ text: `Dark color` });
                } else if(output.isLight() === true) colorEmbed.setFooter({ text: `Light color` });
                message.reply({ files: [
                    await makeFile({
                        name: "image.png",
                        buffer: await sharp(bg).composite([{
                            input: await sharp({
                                create: {
                                    width: 128,
                                    height: 128,
                                    channels: output.rgb().array().length,
                                    background: {
                                        r: output.rgb().array()[0],
                                        g: output.rgb().array()[1],
                                        b: output.rgb().array()[2],
                                        alpha: output.rgb().array()?.[3]
                                    }
                                }
                            }).png().toBuffer()
                        }]).png().toBuffer()
                    })
                ], embeds: [colorEmbed] });
            } catch (err){
                const invalidColor = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> Error").setDescription("An invalid color! Make sure you entered the correct hex color (Make sure you included the #)").setColor(bot.errorColor);
                let errChannel = client.channels.cache.get("907641692075728987")
                let errEmbed = new Discord.MessageEmbed().setTitle("<:error:859830692518428682> An Error Occurred!").addField(`Caused by:`, `${message.member.user.tag}`).addField(`From the command:`, `${message.commandName}`).addField("From guild:", `${message.guild.name}, (${message.guild.id})`).addField("Error:", `An invalid color! Make sure you entered the correct hex color (Make sure you included the #)`).setColor(bot.errorColor);
                errChannel.send({ embeds: [errEmbed] });
                console.log(err.message)
                return message.reply({ embeds: [invalidColor] });
            };
    }
}
