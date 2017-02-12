import React from 'react';
import get from 'lodash/get';

class SimplifiedOutcomeRow extends React.Component {
  render() {
    const percentage = (this.props.outcome.probability * 100).toFixed(2);
    const winnerName = get(this.props, 'outcome.winningMove.pokemon.name') || get(this.props, 'outcome.moveA.pokemon.name');
    const loserName = get(this.props, 'outcome.losingMove.pokemon.name') || get(this.props, 'outcome.moveB.pokemon.name');
    const action = get(this.props, 'outcome.winningMove.action') || 'ties';
    const className = this.props.selected ? ' outcome-selected' : '';
    return (
      <tr className={className} onClick={this.props.toggleOutcomeRow} >
        <td className="chance-data text-center" data-percentage={percentage}>{percentage}%</td>
        <td className="text-left">{winnerName} {action} {loserName}</td>
      </tr>
    );
  }
}

SimplifiedOutcomeRow.defaultProps = {
};

export default SimplifiedOutcomeRow;
