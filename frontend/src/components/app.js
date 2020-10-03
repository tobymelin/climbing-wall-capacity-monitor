import React from 'react';
import './app.css';
import CapacityMeter from './capacity-meter.js';
import Card from './card.js';
import Favourite from './favourite.js';
import Storage from '../helpers/storage.js';

class App extends React.Component {
  constructor(props) {
    super(props);

    let lsFavourites = Storage.get('favourites') || [];

    this.state = { wallData: {}, updated: '-', favourites: [...lsFavourites] };
  }

  // Once component has mounted, fetch data from the API and
  // set a timer which refreshes the data every 5 minutes
  componentDidMount() {
    this.fetchData();
    this.timerID = setInterval(() => this.fetchData(), 1000*60*5);
  }
  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  // Helper function for converting an epoch date to HH:MM
  convertDate(epochDate) {
    let date = new Date(epochDate);

    let h = date.getHours().toString().padStart(2, '0');
    let m = date.getMinutes().toString().padStart(2, '0');
    
    return h + ':' + m;
  }

  // Helper function to sort the list based on favourites
  sortFunc(a, b) {
    let aIsFav = (this.state.favourites.indexOf(a) !== -1);
    let bIsFav = (this.state.favourites.indexOf(b) !== -1);

    // If a and b are both favourites (or both not), then
    // sort as usual
    if (aIsFav === bIsFav) {
      if (a > b) {
        return 1;
      }
      if (a < b) {
        return -1;
      }
      return 0;
    }

    // If either a or b (but not both) are favourites, sort
    // accordingly
    if (aIsFav) {
      return -1;
    }
    if (bIsFav) {
      return 1;
    }

    return 0;
  }

  setFavourite(wall) {
    let favIndex = this.state.favourites.indexOf(wall);
    let newFavourites = this.state.favourites;

    if (favIndex === -1) {
      newFavourites.push(wall);
    }
    else {
      newFavourites.splice(favIndex, 1);
    }

    this.setState({ favourites: [...newFavourites] });
    Storage.set('favourites', this.state.favourites);
  }

  render() {
    const walls = Object.keys(this.state.wallData).sort((a, b) => this.sortFunc(a, b));
    let lastUpdatedMessage;

    // Set up a separate Card + CapacityMeter for each climbing wall
    let cards = walls.map((wall) => {
      let favouriteState = false;
      if (this.state.favourites.indexOf(wall) !== -1) {
        favouriteState = true;
      }

      return (
        <Card label={wall} className={favouriteState ? 'favourite' : ''}>
          <CapacityMeter capacity={this.state.wallData[wall].capacity} count={this.state.wallData[wall].count} />
          <Favourite onClick={this.setFavourite.bind(this, wall)} favourite={favouriteState} />
        </Card>
      );
    });

    if (cards.length === 0) {
      lastUpdatedMessage = <div className="error">No data is available at the moment</div>
    }
    else {
      lastUpdatedMessage = <p>Last updated: {this.state.updated}<br/>(Data updates every 10 minutes)</p>
    }
  
    return (
      <div className="App">
        <h1>London Climbing Wall Capacity</h1>
        {lastUpdatedMessage}
        <div className="content">{cards}</div>
        <div className="notes">
          <p><strong>NOTE:</strong> Numbers are as provided by the climbing walls. Depending on check-in/out procedures, this may not be the exact number of climbers at the wall.</p>
          <p><strong>NOTE 2:</strong> This list only includes London-based climbing walls which make their climber counts publicly available.</p>
        </div>
      </div>
    );
  }

  // Fetch data from the API and update the component's state
  // to include the latest data + last refresh time as defined in
  // the JSON object
  fetchData() {
    // Provide fake data if in a development environment
    if (process.env.NODE_ENV === 'development') {
      this.setState({
        wallData: {"The Reach":{"capacity":165,"count":75,"lastUpdate":"Last updated:&nbsp1 min ago (2:58 PM)"},"VauxWest":{"capacity":55,"count":38,"lastUpdate":"Last updated:&nbspnow  (2:59 PM)"},"VauxEast":{"capacity":80,"count":42,"lastUpdate":"Last updated:&nbspnow  (2:59 PM)"},"HarroWall":{"capacity":220,"count":48,"lastUpdate":"Last updated:&nbspnow  (2:59 PM)"},"CroyWall":{"capacity":70,"count":32,"lastUpdate":"Last updated:&nbspnow  (2:59 PM)"},"RavensWall":{"capacity":90,"count":29,"lastUpdate":"Last updated:&nbspnow  (2:59 PM)"},"CanaryWall":{"capacity":43,"count":7,"lastUpdate":"Last updated:&nbspnow  (2:58 PM)"},"Stronghold":{"capacity":50,"count":28,"lastUpdate":"Last updated:&nbsp2 mins ago (2:57 PM)"},"Yonder":{"capacity":68,"count":25,"lastUpdate":"Last updated:&nbsp1 min ago (2:58 PM)"},"Climbing Hangar London":{"capacity":35,"count":15,"lastUpdate":"Last updated:&nbsp1 min ago (2:58 PM)"}},
        updated: this.convertDate(1598623178730)
      });
      return;
    }

    fetch('/api/walls')
      .then(res => res.json())
      .then(res => this.setState({ wallData: res.walls, updated: this.convertDate(res.refreshed) }));
  }
}

export default App;
