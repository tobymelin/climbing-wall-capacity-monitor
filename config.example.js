export const wallKeys = {
    'Wall 1': '123',
    'Wall 2': '456'
}

export const dataURL = 'https://example.com/{key}'

export const maintenanceMode = false;
export const maintenanceMessage = 'Dashboard will be back online once London climbing walls open up again.';

// Used to manually replace wall names if not correctly set by the wall
export const wallNameOverrides = {
    'wallName': {
        'wallID1': 'Manual name here',
        'wallID2': 'Another manual name'
    },
    'wallName2': {
        'wallID1': 'And a third one'
    }
}

const config = {
  wallKeys,
  dataURL,
  maintenanceMode,
  maintenanceMessage,
  wallNameOverrides,
}

export default config

