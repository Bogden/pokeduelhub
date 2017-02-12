import React from 'react';
import OutcomeRow from './OutcomeRow';
import SimplifiedOutcomeRow from './SimplifiedOutcomeRow';

// OutcomeRowSum



class OutcomeTable extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedOutcomeRows: [],
      total: 0
    }
  }

  toggleOutcomeRow(outcome) {
    const data = this.state.selectedOutcomeRows;
    let selectedOutcomeRows;
    if (!data.includes(outcome)) {
      selectedOutcomeRows = data.slice();
      selectedOutcomeRows.push(outcome);
    } else {
      selectedOutcomeRows = data.filter(value => value !== outcome);
    }
    this.setState({
      selectedOutcomeRows,
      total: selectedOutcomeRows.reduce((total, outcome) => total + outcome.probability, 0)
    });
  }

  render() {
    let combinedTotalClassName = this.state.total ? 'combined-total-chance expanded' : 'combined-total-chance';

    if (this.props.type === 'detailed') {
      return (
        <div className="outcome-tables">
          <h2>Detailed</h2>
          <table className="outcome-table table-fill">
            <div className={combinedTotalClassName}>
              <div className="combined-total-chance-header">Selected</div>
              <div className="combined-total-chance-body">{(this.state.total * 100).toFixed(2)}%</div>
            </div>
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
                return <OutcomeRow
                  outcome={outcome}
                  key={index}
                  selected={this.state.selectedOutcomeRows.includes(outcome)}
                  toggleOutcomeRow={this.toggleOutcomeRow.bind(this, outcome)}
                />
              })}
            </tbody>
          </table>
        </div>
      )
    } else {
      return (
        <div className="outcome-tables">
          <h2>Summary</h2>
          <table className="outcome-table table-fill">
            <div className={combinedTotalClassName}>
              <div className="combined-total-chance-header">Selected</div>
              <div className="combined-total-chance-body">{(this.state.total * 100).toFixed(2)}%</div>
            </div>
            <thead>
              <tr>
                <th>Chance</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {this.props.outcomes.map((outcome, index) => {
                return <SimplifiedOutcomeRow
                  outcome={outcome}
                  key={index}
                  selected={this.state.selectedOutcomeRows.includes(outcome)}
                  toggleOutcomeRow={this.toggleOutcomeRow.bind(this, outcome)}
                />
              })}
            </tbody>
          </table>
        </div>
      );
    }
  }
}

OutcomeTable.defaultProps = {
};

export default OutcomeTable;
