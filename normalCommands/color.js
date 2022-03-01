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

module.exports.run = async (client, message, args) => {
    try {
        const bg = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAIAAAACAAQMAAAD58POIAAAABlBMVEXMzMz////TjRV2AAAANElEQVR4XmP4/4PB/g+D/H8G9v8HmP8/YBhWAlAGXGI4CYxG1GhEjcbcaMyNxtxoRA1dAQAGkPwu7vcDswAAAABJRU5ErkJggg==", "base64")
        const color = args[0]
        const output = Color(color)
        if(!color) return message.reply({ embeds: [fn.sendError("You didn't enter any color!") ] });
        let colorEmbed = new Discord.MessageEmbed()
            .setTitle(`Color ${output.hex().toString()}`)
            .addField("Hex", `\`${output.hex()}\``, true)
            .addField("RGB", `\`${output.rgb().array().map(number => Math.round(number * 1000) / 1000).join(", ")}\``, true)
            .addField("RGB Float", `\`${output.rgb().array().map((e, i) => Math.floor(e*1000/(i !== 3 ? 255 : 1))/1000).join(", ")}\``, true)
            .addField("HSL", `\`${output.hsl().array().map(number => Math.round(number * 1000) / 1000).join(", ").toString().replace("hsl","").replace("(", "").replace(")", "").replaceAll("%", "")}\``, true)
            .addField("CMYK", `\`${output.cmyk().round().array().map(number => Math.round(number * 1000) / 1000).join(", ")}\``, true)
            .addField("ANSI256", `\`${Object.values(output.ansi256().object())[0]}\``, true)
            .setThumbnail(`attachment://color.png`)
            .setColor(`${output.hex().replace("#","")}`);
        if(output.isDark() === true){
            colorEmbed.setFooter({ text: `Dark color` });
        } else if(output.isLight() === true) colorEmbed.setFooter({ text: `Light color` });
            message.reply({ files: [
                await makeFile({
                    name: "color.png",
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
        client.channels.cache.get("907641692075728987").send({ embeds: [new Discord.MessageEmbed().setTitle("<:error:859830692518428682> An Error Occurred!").addField(`Caused by:`, `${message.member.user.tag}`).addField(`From the command:`, `${message.commandName}`).addField("From guild:", `${message.guild.name}, (${message.guild.id})`).addField("Error:", `An invalid color! Make sure you entered the correct hex color (Make sure you included the #)`).setColor(bot.errorColor)] });
        console.log(err.message)
        return message.reply({ embeds: [fn.sendError('An invalid color! Make sure you entered the correct hex color (Make sure you included the #)')] });
    };
}

module.exports.config = {
    name: 'color',
    aliases: ["col", "colour"],
}