const fs = require('fs');

// Fetch Constructor classes from classes directory
const classFiles = fs.readdirSync('./classes').filter(file => file.endsWith('.js'));
const Classes = {};
for (const file of classFiles) {
  console.log(`[HANDLER]`.bgMagenta.white + ` loading ` + `[${file}]`.magenta);
  let loadedFile = require(`../classes/${file}`);

  // if file exports an array of constructors
  if (loadedFile.length) loadedFile.forEach((constructor, index, arr) => Classes[constructor.name] = arr[index].constructor );
  else Classes[loadedFile.name] = loadedFile.constructor;

  console.log(`[HANDLER]`.bgMagenta.white + ` loaded ` + `[${file}]`.magenta + ` successfully!`);
}

module.exports = Classes