const fs = require('fs');
const path = require('path');

const fileDirectory = path.join(__dirname, 'files'); // Directory for storing text files

// Function to create and write text to a file
function writeTextToFile(fileName, text, callback) {
    const filePath = path.join(fileDirectory, fileName);

    fs.writeFile(filePath, text, (err) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, 'File saved successfully.');
        }
    });
}

// Function to read the content of a text file
function readTextFromFile(fileName, callback) {
    const filePath = path.join(fileDirectory, fileName);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, data);
        }
    });
}

// Function to list all available text files
function listFiles() {
    return fs.readdirSync(fileDirectory);
}

module.exports = { writeTextToFile, readTextFromFile, listFiles };
