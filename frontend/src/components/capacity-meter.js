import React from 'react';
import './capacity-meter.css';

class CapacityMeter extends React.Component {
    capacityRatio() {
        let fraction = this.props.count / this.props.capacity;

        if (fraction > 1)
            fraction = 1;
        
        return fraction;
    }

    capacityPercentage() {
        return String(this.capacityRatio() * 100) + '%';
    }

    render() {
        let divStyle = {
            width: this.capacityPercentage()
        }

        let capacityStyle = 'capacity-percentage';

        if (this.capacityRatio() > 0.75)
            capacityStyle += ' high-capacity';
        else if (this.capacityRatio() > 0.5)
            capacityStyle += ' medium-capacity';
        else
            capacityStyle += ' low-capacity';

        return (
            <div className='capacity-meter'>
                <div className='capacity-total'>
                    <div className={capacityStyle} style={divStyle}>&nbsp;</div>
                    <div className='capacity-count'>{this.props.count} / {this.props.capacity}</div>
                </div>
            </div>
        );
    }
}

export default CapacityMeter;
