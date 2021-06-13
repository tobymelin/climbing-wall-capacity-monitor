const wallKeys = {
    'Wall 1': '123',
    'Wall 2': '456'
}

const dataURL = 'https://example.com/{key}'

const maintenanceMode = false;
const maintenanceMessage = 'Dashboard will be back online once London climbing walls open up again.';

// Used to manually replace wall names if not correctly set by the wall
const wallNameOverrides = {
    'wallName': {
        'wallID1': 'Manual name here',
        'wallID2': 'Another manual name'
    },
    'wallName2': {
        'wallID1': 'And a third one'
    }
}

module.exports = { wallKeys, dataURL, maintenanceMode, maintenanceMessage, wallNameOverrides }
