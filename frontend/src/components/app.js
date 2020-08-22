import React from 'react';
import './app.css';
import CapacityMeter from './capacity-meter.js';
import Card from './card.js';


class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { wallData: {}, updated: '-' };
  }

  componentDidMount() {
    this.fetchData();
    this.timerID = setInterval(() => this.fetchData(), 1000*60*5);
  }
  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  convertDate(epochDate) {
    let date = new Date(epochDate);

    let h = date.getHours();
    h = (h < 10) ? '0' + h.toString() : h.toString();

    let m = date.getMinutes();
    m = (m < 10) ? '0' + m.toString() : m.toString();
    
    return h + ':' + m;
  }

  render() {
    const walls = Object.keys(this.state.wallData).sort();

    let cards = walls.map((wall) => {
      return (
        <Card label={wall}>
          <CapacityMeter capacity={this.state.wallData[wall].capacity} count={this.state.wallData[wall].count} />
        </Card>
      );
    });
  
    return (
      <div className="App">
        <h1>London Climbing Wall Capacity</h1>
        <p>Last updated: {this.state.updated}<br/>(Data updates every 15 minutes)</p>
        <div className="content">{cards}</div>
        <p><strong>NOTE:</strong> Numbers are as provided by the climbing walls. Depending on check-in/out procedures, this may not be the exact number of climbers at the wall.</p>
        <p><strong>NOTE 2:</strong> This list only includes London-based climbing walls which make their climber counts publicly available.</p>
      </div>
    );
  }

  fetchData() {
    fetch('/api/walls')
      .then(res => res.json())
      .then(res => this.setState({ wallData: res.walls, updated: this.convertDate(res.refreshed) }));
  }
}

export default App;
