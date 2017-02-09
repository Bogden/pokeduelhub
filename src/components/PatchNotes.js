import React from 'react';

const patchNotes = [{
  version: '0.1.3',
  notes: 'Add support for moves like Geomancy'
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
