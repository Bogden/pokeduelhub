import React from 'react';
import OutcomeRow from './OutcomeRow';
import SimplifiedOutcomeRow from './SimplifiedOutcomeRow';
import {getMultiChanceOutcomeProbability} from '../calculator/fight';

// OutcomeRowSum



class OutcomeTable extends React.Component {
  constructor() {
    super();
    this.printTotalValue = this.printTotalValue.bind(this);
    this.state = {
      selectedOutcomes: []
    }
  }

  toggleOutcomeRow(outcome) {
    const data = this.state.selectedOutcomes;
    let selectedOutcomes;
    if (!data.includes(outcome)) {
      selectedOutcomes = data.slice();
      selectedOutcomes.push(outcome);
    } else {
      selectedOutcomes = data.filter(value => value !== outcome);
    }
    this.setState({
      selectedOutcomes
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.outcomes !== nextProps.outcomes) {
      this.setState({
        selectedOutcomes: []
      });
    }
  }

  printCombinedTotalHeader() {
    const chances = Math.max(this.props.pokemon1.chances, this.props.pokemon2.chances);
    return chances > 1 ? `Selected (x${chances})` : 'Selected';
  }

  printTotalValue() {
    let probability;
    const selectedOutcomes = this.state.selectedOutcomes;

    if (!selectedOutcomes.length) {
      return;
    }

    if (this.props.pokemon1.chances > 1) {
      probability = getMultiChanceOutcomeProbability({
        multiChancePokemon: this.props.pokemon1,
        enemyPokemon: this.props.pokemon2,
        desiredOutcomes: this.state.selectedOutcomes,
        shouldCombine: this.props.type === 'summary'
      });
    } else if (this.props.pokemon2.chances > 1) {
      probability = getMultiChanceOutcomeProbability({
        multiChancePokemon: this.props.pokemon2,
        enemyPokemon: this.props.pokemon1,
        desiredOutcomes: this.state.selectedOutcomes,
        shouldCombine: this.props.type === 'summary'
      });
    } else {
      probability = selectedOutcomes.reduce((total, outcome) => total + outcome.probability, 0);
    }

    return (probability * 100).toFixed(2) + '%';
  }

  render() {
    const combinedTotalClassName = this.state.selectedOutcomes.length ? 'combined-total-chance expanded' : 'combined-total-chance';
    const combinedTotalChance = this.printTotalValue();
    const combinedTotalHeader = this.printCombinedTotalHeader();

    if (this.props.type === 'detailed') {
      return (
        <div className="outcome-tables">
          <h2>Detailed</h2>
          <table className="outcome-table table-fill">
            <div className={combinedTotalClassName}>
              <div className="combined-total-chance-header">{combinedTotalHeader}</div>
              <div className="combined-total-chance-body">{combinedTotalChance}</div>
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
                  selected={this.state.selectedOutcomes.includes(outcome)}
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
              <div className="combined-total-chance-header">{combinedTotalHeader}</div>
              <div className="combined-total-chance-body">{combinedTotalChance}</div>
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
                  selected={this.state.selectedOutcomes.includes(outcome)}
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
