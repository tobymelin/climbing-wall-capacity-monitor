import React from 'react';

class Favourite extends React.Component {
    constructor(props) {
        super(props);

        this.state = { favourite: (props.favourite === 'true')};
    }

    returnCharacter() {
        if (this.props.favourite === 'true') {
            return '★';
        }

        return '☆';
    }
    render() {
        return (
            <div className="favourite-marker" onClick={this.props.onClick}>
                {this.returnCharacter()}
            </div>
        );
    }
}

export default Favourite;
