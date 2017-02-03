import React from 'react';
import get from 'lodash/get';

class OutcomeRow extends React.Component {
  render() {
    const percentage = (this.props.outcome.probability * 100).toFixed(2);
    const winnerName = get(this.props, 'outcome.winningMove.pokemon.name') || get(this.props, 'outcome.moveA.pokemon.name');
    const loserName = get(this.props, 'outcome.losingMove.pokemon.name') || get(this.props, 'outcome.moveB.pokemon.name');
    const winningMoveName = get(this.props, 'outcome.winningMove.name') || get(this.props, 'outcome.moveA.name');
    const losingMoveName = get(this.props, 'outcome.losingMove.name') || get(this.props, 'outcome.moveB.name');
    const tieClass = !!get(this.props, 'outcome.winningMove.name') ? '' : 'outcome-tie';
    return (
      <tr className={tieClass}>
        <td className="chance-data text-center" data-percentage={percentage}>{percentage}%</td>
        <td className="text-center">{winnerName}</td>
        <td className="text-center">{loserName}</td>
        <td className="text-left">{winningMoveName}</td>
        <td className="text-left">{losingMoveName}</td>
      </tr>
    );
  }
}

OutcomeRow.defaultProps = {
};

export default OutcomeRow;
