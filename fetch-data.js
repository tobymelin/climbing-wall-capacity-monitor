const got = require('got');
const cheerio = require('cheerio');
const config = require('./config');
const moment = require('moment-timezone');


// Data is stored in each widget as an object contained in a 
// <script> tag. This RegEx extracts the object in a format
// that can be parsed by JSON.parse()
//
// eslint-disable-next-line no-control-regex
// const jsonRegEx = new RegExp('var data = ({.*}),[^\n]+};.*', 's');
// const jsonRegEx = new RegExp('var data = ({.*?)(,\s*)*?};.*', 's');
const jsonRegEx = new RegExp('var data = ({.*?};).*', 's');

// eslint-disable-next-line no-control-regex
const timeRegEx = /.* \((.*)\)/


// Function for parsing widget data. Returns a Promise
// which ultimately returns an object with the relevant info
// for a single wall (or all walls owned by a single company
// depending on the widget configuration).
const parseURL = (wallName, dataURL) => {
    return new Promise((resolve, reject) => {
        let wallData = {};

        got(dataURL)
            .then((res) => {
                const $ = cheerio.load(res.body);

                // Find the third <script> tag on the widget website
                var scripts = $('script');
                var jsonData = scripts[2].children[0].data;

                // Rewrite the <script> contents to remove
                // everything but climber count and rewrite it into
                // a format parseable by JSON.parse()
                jsonData = jsonData.replace(jsonRegEx, '$1');
                jsonData = jsonData.replace(/(})?,?\s+};/g, '$1}')
                jsonData = jsonData.replace(/'/g, '"');
                jsonData = JSON.parse(jsonData);

                let label = '';

                for (let wallID of Object.keys(jsonData)) {
                    // Check manual name overrides from config first,
                    // otherwise if wallID hasn't been set properly (wallID === 'AAA'),
                    // then use the wallName from wallKeys, otherwise use the
                    // the counter's configured name.
                    if (wallName in config.wallNameOverrides && wallID in config.wallNameOverrides[wallName]) {
                        label = config.wallNameOverrides[wallName][wallID];
                    }
                    else if (wallID === 'AAA') {
                        label = wallName;
                    }
                    else {
                        label = jsonData[wallID]['subLabel'].replace(' Current Climber Count', '');
                    }

                    // Add info to the wallData object and delete the
                    // subLabel as it's not needed anywhere else
                    wallData[label] = jsonData[wallID];
                    delete wallData[label].subLabel;

                    // Parse time string
                    let timeString = wallData[label].lastUpdate;
                    timeString = timeString.replace(timeRegEx, '$1');

                    let AmPm = timeString.split(' ')[1].toLowerCase();

                    // Counter pages are served using the walls' local
                    // time zone. The current local time is therefore used
                    // as a basis for comparison.
                    let currentTime = moment.tz('Europe/London');
                    let currentAmPm = currentTime.format('a');

                    // Changed from previous definition, times should only
                    // be occurring in the past, i.e. no need to add a day
                    // to the timestamp
                    if (currentAmPm !== AmPm && currentAmPm === 'am') {
                        currentTime = currentTime.subtract(1, 'days');
                    }

                    timeString = currentTime.format('Y-M-D ') + timeString;
                    timeObject = moment.tz(timeString, 'YYYY-MM-DD LT', 'Europe/London');

                    wallData[label].lastUpdate = timeObject.toISOString();
                }

                resolve(wallData);
            })
            .catch((err) => {
                reject(err);
            });
    });
};


// Fetch data for all of the walls in wallKeys.
// Returns a promise which finally returns a
// result containing all of the walls' climber counts.
const fetchWallsData = () => {
    return new Promise((resolve, reject) => {
        let wallData = {};
        let gotPromises = [];

        // Run parseURL() for each key in wallKeys
        // and add all of the resulting promises into a
        // list for later use
        for (let wallName of Object.keys(config.wallKeys)) {
            const dataURL = config.dataURL.replace('{key}', config.wallKeys[wallName]);
        
            // console.log('Fetching data for ' + wallName);
            gotPromises.push(parseURL(wallName, dataURL));            
        }

        // Wait for all of the promises to finish and merge the
        // results into a single object (wallData)
        Promise.all(gotPromises)
            .then((values) => {
                for (let val of values) {
                    Object.assign(wallData, val);
                }
                resolve(wallData);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

module.exports = fetchWallsData;
