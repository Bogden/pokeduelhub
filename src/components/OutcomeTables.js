import React from 'react';
import OutcomeTable from './OutcomeTable';
import {simplifyOutcomes} from '../calculator/fight';

class OutcomeTables extends React.Component {
  render() {
    if (!this.props.outcomes) {
      return (<div className="outcome-tables"></div>);
    }
    return (
      <div className="outcome-tables">
        <OutcomeTable
          type="summary"
          outcomes={simplifyOutcomes(this.props.outcomes)}
          pokemon1={this.props.pokemon1}
          pokemon2={this.props.pokemon2}
        />
        <OutcomeTable
          type="detailed"
          outcomes={this.props.outcomes}
          pokemon1={this.props.pokemon1}
          pokemon2={this.props.pokemon2}
        />
      </div>
    );
  }
}

OutcomeTables.defaultProps = {
};

export default OutcomeTables;
