const { MessageEmbed } = require("discord.js");
const config = require('../config.json');
const localization = require('../localization/' + config.localization_file);
const fs = require('fs');
const path = require('path');
const Canvas = require('canvas');
const GIFEncoder = require('gifencoder');


module.exports.info = {
	"title": localization.commands.timelapse.title.replace("<plant_name>", config.plant_name),
	"name": localization.commands.timelapse.name,
	"desc": localization.commands.timelapse.desc.replace("<plant_name>", config.plant_name),
	"color":localization.commands.timelapse.color
}
let folderPath = config.photo_path
folderPath = folderPath.split('/').reverse()
folderPath.splice(0,1)
folderPath = folderPath.reverse().join('/')

if (!fs.existsSync(folderPath)) {
	// Create the folder
	fs.mkdirSync(folderPath, { recursive: true });
	console.log(`Folder '${folderPath}' created successfully.`);
} else {
	console.log(`Folder '${folderPath}' already exists.`);
}

function createGif(timeLimit = 30) {
	// Define the directory path
	const directory = './photoarchive';
	// Define the directory path of the image sequence
	const outputFilePath = `./photos/timelapse_${timeLimit > 0 ? timeLimit : 'all'}.gif`;
	// Get a list of all files in the directory
	const files = fs.readdirSync(directory);
	const filePaths = files.map(file => path.join(directory, file));

	const daysAgo = new Date();
	daysAgo.setDate(daysAgo.getDate() - timeLimit);

	// Filter files modified in last 30 days and sort the files by modification time (oldest to newest)
	const imageFiles = filePaths
		.filter(file => {
			if (timeLimit === 0) return true;
			const stats = fs.statSync(file);
			return stats.mtime > daysAgo;
		})
		.sort((a, b) => {
			const mtimeA = fs.statSync(a).mtime;
			const mtimeB = fs.statSync(b).mtime;
			if (mtimeA === mtimeB) {
				return a.localeCompare(b);
			}
			return mtimeA - mtimeB;
		});
	const width = Math.round(parseInt(config.photo_width) * (config?.gif_scale ?? 0.25));
	const height = Math.round(parseInt(config.photo_height) * (config?.gif_scale ?? 0.25));
	const canvas = Canvas.createCanvas(width, height);
	const ctx = canvas.getContext('2d');

	const encoder = new GIFEncoder(width, height);
	encoder.createReadStream().pipe(fs.createWriteStream(outputFilePath));
	encoder.start();
	encoder.setRepeat(0);
	console.log(config.gif_delay_ms ?? 50)
	encoder.setDelay(config.gif_delay_ms ?? 50);
	encoder.setQuality(10);

	imageFiles.forEach(async (f, i) => {
		const image = await Canvas.loadImage(`./${f}`);
		ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);
		encoder.addFrame(ctx);
		if (i === imageFiles.length - 1) {
			encoder.finish();
			console.log('DEBUG: GIF Generated!')
		}
	})
}
function dateDiffInDays(date1, date2) {
	const oneDay = 1000 * 60 * 60 * 24; // 1 day in milliseconds
	const timeDiff = Math.abs(date2 - date1);
	return Math.floor(timeDiff / oneDay);
}
module.exports.execute = async (client, message, args) => {
	if (args?.length > 0 && args[0] === 'all' && message.member.permissions.has('ADMINISTRATOR')){
		await createGif(0)
		const embed = new MessageEmbed()
			.setTitle(localization.commands.timelapse.all)
			.setColor(this.info.color)
			.setFooter({
				text: message.member.displayName,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
			})
			.setImage("attachment://timelapse_all.gif")
			.setTimestamp();
			message.channel.send({ embeds: [embed], files: [folderPath+'/timelapse_all.gif'] })

		return;
	}
	const embed = new MessageEmbed()
		.setTitle(this.info.title)
		.setColor(this.info.color)
		.setFooter({
			text: message.member.displayName,
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
		})
		.setTimestamp();
	const timelapsePath = './photos/timelapse_30.gif'
	await fs.stat(timelapsePath, async (err, stats) => {
		let currentTimelapseMTime;
		if (err) {
			//no timelapse found
			console.log(`DEBUG: No timelapse found.`);
			await createGif();
			this.execute(client, message)
		} else {
			//photo found
			currentTimelapseMTime = stats.mtime.toISOString();
			console.log(`DEBUG: Timelapse Last Modified: ${stats.mtime}`);
			//send embed message
			let filesToBeUploaded = []
			if (!client.lastTimelapse || dateDiffInDays(new Date(), client.lastTimelapse.mtime) > 1) {
				// Last timelapse expired we need a new one.
				console.log(`DEBUG: Last timelapse expired, creating new one.`);
				await createGif();
				embed.setImage(`attachment://${timelapsePath.split('/').reverse()[0]}`);
				filesToBeUploaded = [timelapsePath]
			} else {
				console.log(`DEBUG: Using timelapse from cache.`);
				embed.setImage(client.lastTimelapse.url)
			}
			message.channel.send({ embeds: [embed], files: filesToBeUploaded })
				.then(message => {
					if (message.embeds[0].image && filesToBeUploaded.length > 0) {
						// Updating last photo data.
						console.log(`DEBUG: Updating lastTimelapse`);
						const picName = message.embeds[0].image.url.match(/[^/\\&\?]+\.\w{3,4}(?=([\?&].*$|$))/);
						client.lastTimelapse = {
							'name': picName[0],
							'url': message.embeds[0].image.url,
							'mtime': currentTimelapseMTime
						}
					}
				});
		}
	});
}
