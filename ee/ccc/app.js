const fs = require('fs');

// Function to get the current time in a readable format
function getCurrentTime() {
    const now = new Date();
    return now.toLocaleString();
}

// Function to write data to a text file
function writeToTextFile(data) {
    fs.appendFile('log.txt', data + '\n', (err) => {
        if (err) {
            console.error(`Error writing to file: ${err.message}`);
        } else {
            console.log('Data has been written to the file.');
        }
    });
}

// Main function to print current time, active status, and log any errors
function logStatus() {
    const currentTime = getCurrentTime();
    const isActive = true; // You can replace this with your logic to determine the active status

    const status = isActive ? 'Active' : 'Inactive';
    const logMessage = `${currentTime} - Status: ${status}`;

    console.log(logMessage);

    // Write to the text file
    writeToTextFile(logMessage);
    
}

// Set interval to run the main function every 30 seconds (30000 milliseconds)
const interval = 1000;
setInterval(logStatus, interval);
