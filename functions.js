const fsp = require('fs/promises');
const fsNormal = require('fs')
const twemoji = require('twemoji');
const bot = require(`./config.json`)
const { loadImage } = require('skia-canvas');
const sharp = require('sharp');
const Discord = require(`discord.js`);
const fakeUa = require("fake-useragent");
const fetch = require('node-fetch');

async function checkForGuildFile(guild){
    // details: [
    //     channel,
    //     emoji,
    //     count
    // ]
    await fsp.access(`./moderationFiles/${guild.id}.json`).catch(err => {
        let newObject = {
            name: `${guild.name}`,
            starboard: {
                details: [
                    null,
                    null,
                    null
                ]
            },
            modpingRole: null,
            logs: {
                channel: null,
                types: [

                ]
            },
            banned: [

            ],
            welcomeChannel: null,
            welcomeMessage: null,
            welcomeHexColor: null,
            leaveChannel: null,
            leaveMessage: null,
            leaveHexColor: null,
            tickets: {
                channel: null,
                category: null
            },
            blacklistedWords: [
                "nigg",
                "motherfucker",
                "motherfricker",
                "niga"
            ],
            users: [

            ]
        };
        fsp.writeFile(`./moderationFiles/${guild.id}.json`, JSON.stringify(newObject, null, 2))
    });
};

async function saveData(account, message){
    await fsp.writeFile(`./moderationFiles/${message.guild.id}.json`, JSON.stringify(account, null, 2));
}

const base = "http://translate.google.com/translate_tts"
const languages = {
  "af": "Afrikaans",
  "sq": "Albanian",
  "ar": "Arabic",
  "hy": "Armenian",
  "ca": "Catalan",
  "zh": "Chinese",
  "zh-cn": "Chinese (Mandarin/China)",
  "zh-tw": "Chinese (Mandarin/Taiwan)",
  "zh-yue": "Chinese (Cantonese)",
  "hr": "Croatian",
  "cs": "Czech",
  "da": "Danish",
  "nl": "Dutch",
  "en": "English",
  "en-au": "English (Australia)",
  "en-uk": "English (United Kingdom)",
  "en-us": "English (United States)",
  "eo": "Esperanto",
  "fi": "Finnish",
  "fr": "French",
  "de": "German",
  "el": "Greek",
  "ht": "Haitian Creole",
  "hi": "Hindi",
  "hu": "Hungarian",
  "is": "Icelandic",
  "id": "Indonesian",
  "it": "Italian",
  "ja": "Japanese",
  "ko": "Korean",
  "la": "Latin",
  "lv": "Latvian",
  "mk": "Macedonian",
  "no": "Norwegian",
  "pl": "Polish",
  "pt": "Portuguese",
  "pt-br": "Portuguese (Brazil)",
  "ro": "Romanian",
  "ru": "Russian",
  "sr": "Serbian",
  "sk": "Slovak",
  "es": "Spanish",
  "es-es": "Spanish (Spain)",
  "es-us": "Spanish (United States)",
  "sw": "Swahili",
  "sv": "Swedish",
  "ta": "Tamil",
  "th": "Thai",
  "tr": "Turkish",
  "vi": "Vietnamese",
  "cy": "Welsh",
}

const gTTS = async (text, data = {}) => {
  data.lang ??= "en"
  data.lang = data.lang.toLowerCase()
  if(!text) throw new Error("No text to speak")
  if(!languages[data.lang]) throw new Error(`Language not supported: ${data.lang}`)
  const parts = text.match(/[\s\S]{1,100}(?!\S)/g).map(e => e.trim())
  const buff = Buffer.concat(await Promise.all(parts.map((e, i) => fetch(base + `?ie=UTF-8&tl=${data.lang}&q=${encodeURIComponent(e)}&total=${e.length}&idx=${i}&client=tw-ob&textlen=${e.length}`, {
    headers: {
      "User-Agent": fakeUa()
    }
  }).then(r => r.arrayBuffer()).then(b => Buffer.from(b)))))
  if (data.path) fsNormal.writeFileSync(data.path, buff)
  else return buff
}

function degreesToRadians(deg){
    return deg * Math.PI / 180
};

async function checkForUserInGuild(userid, username, guildid){
    let guildF = JSON.parse(await fsp.readFile(`./moderationFiles/${guildid}.json`));
    if(!guildF.users.find(user => user.id === userid)){
        guildF.users.push({
            name: `${username}`,
            id: `${userid}`,
            warnAmount: 0,
            warns: []
        });
        await fsp.writeFile(`./moderationFiles/${guildid}.json`, JSON.stringify(guildF, null, 2));
    };
};

async function createGuildData(guild){
    let newObject = {
        name: `${guild.name}`,
        starboard: {
            details: [
                null,
                null,
                null
            ]
        },
        modpingRole: null,
        logs: {
            channel: null,
            types: [

            ]
        },
        banned: [

        ],
        welcomeChannel: null,
        welcomeMessage: null,
        welcomeHexColor: null,
        leaveChannel: null,
        leaveMessage: null,
        leaveHexColor: null,
        tickets: {
            channel: null,
            category: null
        },
        blacklistedWords: [
            "nigg",
            "motherfucker",
            "motherfricker",
            "niga"
        ],
        users: [

        ]
    };

    fsp.writeFile(`./moderationFiles/${guild.id}.json`, JSON.stringify(newObject, null, 2));
};

async function deleteGuildData(guild){
    fsp.rm(`./moderationFiles/${guild.id}.json`);
};

function webpToBuffer(url){
    fetch(url).then(r => r.arrayBuffer().then(b => sharp(Buffer.from(b)).png().toBuffer().then(s => loadImage(s))))
}

function sendProcess(message){
    message.editReply({ embeds: [new Discord.MessageEmbed().setAuthor({ name: "Proccessing", iconURL: 'https://cdn.discordapp.com/emojis/936226298429329489.gif?size=44&quality=lossless' }).setColor(bot.accentColor)] });
};

async function sendProcessWithoutDefer(message){
    await message.editReply({ embeds: [new Discord.MessageEmbed().setAuthor({ name: "Proccessing", iconURL: 'https://cdn.discordapp.com/emojis/936226298429329489.gif?size=44&quality=lossless' }).setColor(bot.accentColor)] });
};

async function sendLog(guildID, client, embed){
    let guildFile = JSON.parse(await fsp.readFile(`./moderationFiles/${guildID}.json`));

    if(!guildFile.logs.channel) return;
    client.channels.cache.get(guildFile.logs.channel).send({ embeds: [embed] });
}

function isEmoji(emoji){
    const parsed = twemoji.parse(emoji.replace(/"/g, ""));
    if(parsed === emoji) return;
    const matches = parsed.match(/(?<=")https:\/\/twemoji\.maxcdn\.com[^"]+(?=")/);
    if(matches){
      if(parsed.match(/<img/g).length > 1 || parsed.match(/\/>/g).length > 1 || !(parsed.startsWith("<img") && parsed.endsWith("/>"))) return;
      return true;
    };
};

function randInt(num){
    return Math.floor(Math.random()*num);
};

function avatar(member, size = 1024){
    return member.displayAvatarURL({
      format: "png",
      dynamic: true,
      size: size ? size : undefined
    });
};

async function loadAvatar(member, size){
    return await loadImage(avatar(member, size))
}

async function makeFile(data){
    let buffer;
    if(data.stream) buffer = await streamToBuffer(data.stream);
    if(data.buffer) buffer = data.buffer;
    if(data.canvas) buffer = await data.canvas.png;
    if(data.path)   buffer = fs.readFileSync(data.path);
    if(data.url)    buffer = await fetch(data.url).then(e => e.buffer());
    if(data.sharp)  buffer = await data.sharp.png().toBuffer();
    if(data.img)    buffer = await (await imageToCanvas(data.img)).png;
    if(data.canvas) return new Discord.MessageAttachment(buffer, data.name, {
        width: data.canvas.width,
        height: data.canvas.height
    });
    return new Discord.MessageAttachment(buffer, data.name)
};

function drawRotated(ctx, img, x, y, w, h, r){
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(r * Math.PI / 180)
    ctx.drawImage(img, -(w / 2), -(h / 2), w, h)
    ctx.restore()
}

function sendError(description){
    return new Discord.MessageEmbed().setColor(bot.errorColor).setDescription(`${description}`).setAuthor({ iconURL: 'https://images-ext-2.discordapp.net/external/6HgbQ8ajjgJozMXg37BWe53K5YTN3YMVmWC93ioekY8/https/raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/1f6ab.png', name: "Error" })
}

function fromMsToEpoch(ms){
    return Math.floor(ms / 1000);
};

function drawCircle(ctx, x, y, radius, fill, stroke){
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    if(fill) ctx.fill();
    if(stroke) ctx.stroke();
}

function isValidTime(time){
    if(time.includes("s")){
        let timeSplit = time.split("s");
        if(timeSplit[0] < 1) return false;
        return true;
    }
    if(time.includes("m")){
        let timeSplit = time.split("m");
        if(timeSplit[0] < 1) return false;
        return true;
    }
    if(time.includes("h")){
        let timeSplit = time.split("h");
        if(timeSplit[0] < 1) return false;
        return true;
    }
    if(time.includes("d")){
        let timeSplit = time.split("d");
        if(timeSplit[0] < 1) return false;
        return true;
    }
    return false;
}

module.exports = {isValidTime, languages, gTTS, drawCircle, sendProcessWithoutDefer, fromMsToEpoch, sendError, drawRotated, degreesToRadians, checkForGuildFile, checkForUserInGuild, saveData, createGuildData, deleteGuildData, isEmoji, randInt, makeFile, loadAvatar, avatar, sendProcess, sendLog};
