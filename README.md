# London Climbing Wall Monitor

This project is live at [https://tobymelin.com/climbing/](https://tobymelin.com/climbing/).

This Node/React project provides an overview of the current numbers of climbers at all London climbing walls which make this information publicly available.

The back-end is an Express server which parses the latest climber counts every 10 minutes, caches the information and serves it up as an API which returns a JSON response with the format shown below.

The front-end queries the back-end API and provides a quick overview of the data. 

## Back-end Response

The back-end JSON response is in the format shown below;

```json
{
    "walls": {
        "Wall 1": {
            "capacity": 20,
            "count": 5
        },
        "Wall 2": {
            "capacity": 175,
            "count": 84
        }
    },
    "refreshed": "10:00"
}
```

## Setting up the environment

Run `yarn install` in the root directory to install dependencies for the back-end server, and `cd frontend && yarn install` to install dependencies for the front-end.

### config.js

config.js contains private information and is included in .gitignore, but an example config file has been included.

The config file contains two constants;
* `dataURL`, which is the URL which contains information about the current climber counts. `{key}` acts as a placeholder for the climbing wall ID in the URL
* `wallKeys`, which contains key-value pairs of climbing wall names and their associated climbing wall IDs.
  * The keys themselves are only used if the climbing wall counter has left the climbing wall name blank on the counter
  * The values are the IDs which are inserted into the `{key}` part of `dataURL`

## Available Scripts

In the project directory, you can run:

### `yarn dev`

Runs the app in development mode. This starts both the front- and back-end.  
Open [http://localhost:3000](http://localhost:3000) to view the front-end in the browser, and [http://localhost:3030/api/walls](http://localhost:3030/api/walls) to view the back-end api.

The page will reload if you make edits, and the back-end will automatically restart at the same time.  
You will also see any lint errors in the console.

### `yarn client`

Runs the React front-end independently of the back-end API.

### `yarn server`

Runs the back-end API independently of the front-end. The server runs using `nodemon` and will automatically restart after making changes to the code.

### `cd frontend && yarn build`

Builds the app for production to the `build` folder.  
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.  
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
