import React from 'react';

const tips = [
  'You can click the green pokeball to edit move size and damage',
  'Moves with special effects are not yet handled, and are treated as normal moves',
  'Not all pokemon are entered yet. If you\'d like to help, email pokeduelhub@gmail.com',
  'Pokemon evolved in battle gain +10 damage and +1 star per move. Coming soon!',
  'Try to use at least one 3 MP Pokemon unless your deck has a specific strategy in mind',
  'Beware of Shuppet, Gastly, Haunter, and other pokemon with Infiltrator or Soar! They can move through your pokemon',
  'If you check Use Teams, you can set up to 6 pokemon per team to compare them',
  'Want to report a bug or suggest a feature? Email pokeduelhub@gmail.com'
];

class Tip extends React.Component {
  constructor() {
    super();
    this.nextTip = this.nextTip.bind(this);
    this.state = {
      index: Math.floor(Math.random() * tips.length)
    }
  }

  nextTip() {
    let index = Math.floor(Math.random() * tips.length);
    this.setState({index});
  }

  render() {
    return (
      <div className="tip">
        <div className="tip-text">Tip: {tips[this.state.index]}</div>
        <div className="next-tip" onClick={this.nextTip}>Next Tip</div>
      </div>
    );
  }
}

Tip.defaultProps = {
};

export default Tip;
