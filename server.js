const express = require('express');
const fetchData = require('./fetch-data');

const app = express();

let wallData = {};
let refreshed = Date.now();

const timeString = (dateObject) => {
    let date = new Date(dateObject);

    let h = date.getHours();
    h = (h < 10) ? '0' + h.toString() : h.toString();

    let m = date.getMinutes();
    m = (m < 10) ? '0' + m.toString() : m.toString();
    
    return h + ':' + m;
};

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

// Instantly refresh climbing wall data and refresh every 15 minutes.
refreshData();
setInterval(refreshData, 1000*60*15);

app.use(express.json());
app.get('/api/walls', (req, res) => {
    res.send({walls: wallData, refreshed: refreshed});
});

if (!module.parent) {
    app.listen(3030);
}
