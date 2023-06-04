// İmportlar
import { Client } from "discord.js";
import https from "https";
import "dotenv/config";

// Client ve Değişkenler
const client = new Client({ intents: 3276799 });
const controleChannelId = process.env.ControleChannel;
let controleChannel;

// Client Olayları
client.on("ready", () => {
  controleChannel = client.channels.cache.get(controleChannelId);
  console.log(`${client.user.username} hazır!`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.attachments.size > 0) {
    message.attachments.forEach(async (attachment) => {
      const attachmentURL = attachment.url;
      const attachmentFilename = attachment.name;

      https.get(attachmentURL, (response) => {
        let data = "";
        response.setEncoding("binary");
        response.on("data", (chunk) => {
          data += chunk;
        });
        response.on("end", () => {
          const attachmentBuffer = Buffer.from(data, "binary");
          const attachmentFile = { attachment: attachmentBuffer, name: attachmentFilename };

          sendFileToControleChannel(attachmentFile, attachmentFilename);
        });
      });
    });
  } else {
    const member = message.member;
    const guild = member.guild;
    const invites = await guild.invites.fetch();
    const invite = invites.first();
    const messageContent = message.content;
    const guildName = guild.name;
    const userId = member.user.id;
    const username = member.user.username;
    const discriminator = member.user.discriminator;
    const inviteUrl = invite ? invite.url : "Davet bağlantısı bulunamadı.";
    const Kanal = client.channels.cache.get(message.channel.id)
const messageToSend = `**Sunucu Adı: **${guildName} \n **Kullanıcı ID: **${userId}\n** Mesaj Gönderen:**${username}#${discriminator} **\nKanal İsmi:** ${Kanal.name} **\nSunucu Davet Bağlantısı:** ${inviteUrl} **\nMesaj İçeriği:**${messageContent}`;

    sendTextToControleChannel(messageToSend, messageContent);
  }
});

// Yardımcı Fonksiyonlar
function sendTextToControleChannel(textToSend, errorMessage) {
  controleChannel
    .send(textToSend)
    .then(() => {
      console.log("Mesaj Gönderildi: " + errorMessage);
    })
    .catch((error) => {
      console.error("Mesaj gönderilirken hata oluştu: " + error);
    });
}

function sendFileToControleChannel(fileToSend, errorMessage) {
  controleChannel
    .send({ files: [fileToSend] })
    .then(() => {
      console.log("Dosya gönderildi: " + errorMessage);
    })
    .catch((error) => {
      console.error("Dosya gönderilirken hata oluştu: " + error);
    });
}

// Ana Fonksiyon
client.login(process.env.token);
