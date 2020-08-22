import React from 'react';
import './card.css';

class Card extends React.Component {
    render() {
        let label;

        if (this.props.label) {
            label = (
                <div className='card-label'>
                    <p>{this.props.label}</p>
                </div>
            );
        }

        return (
            <div className='card'>
                {label}
                {this.props.children}
            </div>
        );
    }
}

export default Card;
