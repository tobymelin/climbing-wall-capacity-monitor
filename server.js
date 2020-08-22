const express = require('express');
const fetchData = require('./fetch-data');

const app = express();

let wallData = {};
let refreshed = new Date();

const timeString = (dateObject) => {
    let h = dateObject.getHours();
    h = (h < 10) ? '0' + h.toString() : h.toString();

    let m = dateObject.getMinutes();
    m = (m < 10) ? '0' + m.toString() : m.toString();
    
    return h + ':' + m;
};

const refreshData = () => {
    console.log('[' + timeString(new Date()) + '] Refreshing data');

    fetchData()
        .then((res) => {
            refreshed = new Date();
            console.log('[' + timeString(refreshed) + '] Done!');
            wallData = res;
        })
        .catch((err) => {
            console.log(err);
        });
};

// Instantly refresh climbing wall data and refresh every 15 minutes.
refreshData();
setInterval(refreshData, 1000*60*15);

app.use(express.json());
app.get('/api/walls', (req, res) => {
    res.send({walls: wallData, refreshed: timeString(refreshed)});
});

if (!module.parent) {
    app.listen(3030);
}
