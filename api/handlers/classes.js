const fs = require('fs');

// Fetch Constructor classes from classes directory
const classFiles = fs.readdirSync('./classes').filter(file => file.endsWith('.js'));
const taku = {};
for (const file of classFiles) {
  let loadedFile = require(`../classes/${file}`);

  // if file exports an array of constructors
  if (loadedFile.length) loadedFile.forEach((constructor, index, arr) => taku[constructor.name] = arr[index].constructor );
  else taku[loadedFile.name] = loadedFile.constructor;
  if (Object.keys(loadedFile).length != 0) console.log(`[HANDLER]`.bgMagenta.white + ` loaded class ` + `[${file}]`.magenta + ` successfully!`);
  else console.log(`[HANDLER]`.bgRed.white + ` class ` + `[${file}]`.red + ` failed!`.red);
} 
 
module.exports = taku