// Express server used to serve up an API which returns a JSON object
// containing the latest climber counts as provided by the
// RockGymPro widgets.
//
const express = require('express');
const fetchData = require('./fetch-data');

const app = express();

// Global variables used to build the JSON response
let wallData = {};
let refreshed = Date.now();
let hitCounter = 0;

// Helper function for converting an epoch date to HH:MM
const timeString = (epochDate) => {
    let date = new Date(epochDate);

    let h = date.getHours();
    h = (h < 10) ? '0' + h.toString() : h.toString();

    let m = date.getMinutes();
    m = (m < 10) ? '0' + m.toString() : m.toString();
    
    return h + ':' + m;
};

// Fetch data 
const refreshData = () => {
    console.log('[' + timeString(Date.now()) + '] Refreshing data');

    fetchData()
        .then((res) => {
            refreshed = Date.now();
            console.log('[' + timeString(refreshed) + '] Done!');
            wallData = res;
        })
        .catch((err) => {
            console.log(err);
        });
};

// Instantly refresh climbing wall data on start
// and set a timer to run refreshData() every 10 minutes.
refreshData();
setInterval(refreshData, 1000*60*10);

// Set up the API to respond to queries to /api/walls.
// Returns the entire list of climbing walls and the time
// the data was last refreshed
app.use(express.json());
app.get('/api/walls', (req, res) => {
    // Super simple hit tracker out of curiosity
    hitCounter += 1;
    if (hitCounter % 10) { 
        console.log('[' + timeString(Date.now()) + '] ' + hitCounter + ' page hits')
    }

    res.send({walls: wallData, refreshed: refreshed});
});

if (!module.parent) {
    app.listen(3030);
}
