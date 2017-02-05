import React from 'react';
import PokemonPicker from './PokemonPicker';

class SimplifiedOutcomeRow extends React.Component {
  constructor() {
    super();
    this.selectPicker = this.selectPicker.bind(this);
    this.state = {
      selectedPicker1: 0,
      selectedPicker2: 0
    }
  }

  selectPicker(teamNumber, pickerNumber) {
    const stateUpdate = {};
    stateUpdate['selectedPicker' + teamNumber] = pickerNumber;
    this.setState(stateUpdate);
  }

  render() {
    if (this.props.useTeams) {
      return (
        <div className="configuration">
          <div className="team-picker">
            <h3>Team 1</h3>
            {this.props.team1.map((pokemon, index) => {
              return (
                <PokemonPicker
                  notifyPokemonUpdate={this.props.notifyPokemonUpdate.bind(this.props.notifyPokemonUpdate, 1, index, pokemon)}
                  pokemon={pokemon}
                  selected={this.state.selectedPicker1 === index}
                  selectPicker={this.selectPicker.bind(this, 1, index)}
                  pickPokemon={this.props.pickPokemon.bind(this, 1, index)}
                  index={index}
                  key={index}
                />
              );
            })}
          </div>

          <div className="versus-sign">VS</div>

          <div className="team-picker">
            <h3>Team 2</h3>
            {this.props.team2.map((pokemon, index) => {
              return (
                <PokemonPicker
                  notifyPokemonUpdate={this.props.notifyPokemonUpdate.bind(this.props.notifyPokemonUpdate, 2, index, pokemon)}
                  pokemon={pokemon}
                  selected={this.state.selectedPicker2 === index}
                  selectPicker={this.selectPicker.bind(this, 2, index)}
                  pickPokemon={this.props.pickPokemon.bind(this, 2, index)}
                  index={index}
                  key={index}
                />
              );
            })}
          </div>
        </div>
      );
    } else {
      return (
        <div className="configuration">
          <PokemonPicker
            notifyPokemonUpdate={this.props.notifyPokemonUpdate.bind(this.props.notifyPokemonUpdate, 1, 0, this.props.team1[0])}
            pokemon={this.props.team1[0]}
            selected="true"
            pickPokemon={this.props.pickPokemon.bind(this, 1, 0)}
            index="0" />

          <div className="versus-sign">VS</div>

          <PokemonPicker
            notifyPokemonUpdate={this.props.notifyPokemonUpdate.bind(this.props.notifyPokemonUpdate, 2, 0, this.props.team2[0])}
            pokemon={this.props.team2[0]}
            selected="true"
            pickPokemon={this.props.pickPokemon.bind(this, 2, 0)}
            index="1" />
        </div>
      );
    }
  }
}

SimplifiedOutcomeRow.defaultProps = {
};

export default SimplifiedOutcomeRow;
