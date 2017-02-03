import React from 'react';
import OutcomeRow from './OutcomeRow';
import SimplifiedOutcomeRow from './SimplifiedOutcomeRow';
import {simplifyOutcomes} from '../calculator/fight';

class OutcomeTables extends React.Component {
  render() {
    if (!this.props.outcomes) {
      return (<div className="outcome-tables"></div>);
    }
    return (
      <div className="outcome-tables">
        <h2>Summary</h2>
        <table className="outcome-table table-fill">
          <thead>
            <tr>
              <th>Chance</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {simplifyOutcomes(this.props.outcomes).map((outcome, index) => {
              return <SimplifiedOutcomeRow outcome={outcome} key={index} />
            })}
          </tbody>
        </table>

        <h2>Detailed</h2>
        <table className="outcome-table table-fill">
          <thead>
            <tr>
              <th>Chance</th>
              <th>Winner</th>
              <th>Loser</th>
              <th>Winning Move</th>
              <th>Losing Move</th>
            </tr>
          </thead>
          <tbody>
            {this.props.outcomes.map((outcome, index) => {
              return <OutcomeRow outcome={outcome} key={index} />
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

OutcomeTables.defaultProps = {
};

export default OutcomeTables;
