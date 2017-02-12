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
        <OutcomeTable type="summary" outcomes={simplifyOutcomes(this.props.outcomes)} />
        <OutcomeTable type="detailed" outcomes={this.props.outcomes} />
      </div>
    );
  }
}

OutcomeTables.defaultProps = {
};

export default OutcomeTables;
