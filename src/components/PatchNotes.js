import React from 'react';

const patchNotes = [{
  version: '0.3.1',
  notes: 'Added Joltik, fixed 0 power white and gold move outcomes'
}, {
  version: '0.3.0',
  notes: 'Going open source! Implemented confusion and the Poliwhirl ability. Added simulation for moves like Water Shuriken vs themselves'
}, {
  version: '0.2.4',
  notes: 'Added 13 more Pokémon'
}, {
  version: '0.2.3',
  notes: 'Handle Counter and Hyper Sonic'
}, {
  version: '0.2.2',
  notes: 'Updated pokemon and added Zekrom/Reshiram'
}, {
  version: '0.2.1',
  notes: 'Bug fixes!'
}, {
  version: '0.2.0',
  notes: 'Added basic plates and status effects. Added multi chance calculations. Added 46 more Pokémon and updated to most recent patch data.'
}, {
  version: '0.1.4',
  notes: 'Added ability to select rows and total them'
}, {
  version: '0.1.3',
  notes: 'Added support for moves like Geomancy'
}, {
  version: '0.1.2',
  notes: 'Added 71 Pokémon for a total of 132. Added calculation for moves like Swords Dance. Fixed bugs.'
}, {
  version: '0.1.1',
  notes: 'Added more Pokémon and fixed multiplier respin moves like Pin Missile'
}, {
  version: '0.1.0',
  notes: 'First public release!'
}];

class SimplifiedOutcomeRow extends React.Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      expanded: false
    };
  }

  handleClick() {
    this.setState({
      expanded: !this.state.expanded
    });
  }

  render() {
    const className = this.state.expanded ? 'patch-notes expanded' : 'patch-notes';

    return (
      <div className={className} onClick={this.handleClick}>
        <div className="version-number">
          {'v' + patchNotes[0].version}
        </div>
        {patchNotes.map(data => {
          return (
            <div className="patch-note" key={data.version}>v{data.version} - {data.notes}</div>
          );
        })}
      </div>
    );
  }
}

SimplifiedOutcomeRow.defaultProps = {
};

export default SimplifiedOutcomeRow;
