const fs = require('fs');
const util = require('util');

const readFilePromise = util.promisify(fs.readFile);
const writeFilePromise = util.promisify(fs.writeFile);

async function copyFile() {
  try {
    const data = await readFilePromise('example.txt', 'utf8');
    console.log('File content:', data);

    await writeFilePromise('copy.txt', data);
    console.log('File copied successfully!');

  } catch (error) {
    console.error('An error occurred:', error);
  }
}

copyFile();
console.log('This runs immediately!');