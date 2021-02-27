const fs = require('fs');

// Fetch Constructor classes from classes directory
const classFiles = fs.readdirSync('./classes').filter(file => file.endsWith('.js'));
const Classes = {};
for (const file of classFiles) {
  let loadedFile = require(`../classes/${file}`);
	Classes[loadedFile.name] = loadedFile.constructor;
}

//console.log(Classes);

module.exports = Classes