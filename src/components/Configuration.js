import React from 'react';
import PokemonPicker from './pokemonPicker/PokemonPicker';

class SimplifiedOutcomeRow extends React.Component {
  constructor() {
    super();
    this.selectPicker = this.selectPicker.bind(this);
    this.state = {
      selectedPicker1: {
        index: 0,
        subMenuOpen: false
      },
      selectedPicker2: {
        index: 0,
        subMenuOpen: false
      }
    }
  }

  toggleSubMenu(teamNumber, pickerNumber) {
    const stateUpdate = {};
    stateUpdate['selectedPicker' + teamNumber] = {
      index: pickerNumber,
      subMenuOpen: !this.state['selectedPicker' + teamNumber].subMenuOpen
    };

    this.toggleSubMenuRequested = true;
    this.setState(stateUpdate, () => {this.toggleSubMenuRequested = false});
  }

  selectPicker(teamNumber, pickerNumber) {
    if (this.state['selectedPicker' + teamNumber].index === pickerNumber) {
      return;
    }

    const stateUpdate = {};
    stateUpdate['selectedPicker' + teamNumber] = {
      index: pickerNumber,
      subMenuOpen: this.toggleSubMenuRequested
    };
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
                  selected={this.state.selectedPicker1.index === index}
                  subMenuOpen={this.state.selectedPicker1.index === index && this.state.selectedPicker1.subMenuOpen}
                  selectPicker={this.selectPicker.bind(this, 1, index)}
                  toggleSubMenu={this.toggleSubMenu.bind(this, 1, index)}
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
                  selected={this.state.selectedPicker2.index === index}
                  subMenuOpen={this.state.selectedPicker2.index === index && this.state.selectedPicker2.subMenuOpen}
                  selectPicker={this.selectPicker.bind(this, 2, index)}
                  toggleSubMenu={this.toggleSubMenu.bind(this, 2, index)}
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
            toggleSubMenu={this.toggleSubMenu.bind(this, 1, 0)}
            subMenuOpen={this.state.selectedPicker1.index === 0 && this.state.selectedPicker1.subMenuOpen}
            pickPokemon={this.props.pickPokemon.bind(this, 1, 0)}
            index="0" />

          <div className="versus-sign">VS</div>

          <PokemonPicker
            notifyPokemonUpdate={this.props.notifyPokemonUpdate.bind(this.props.notifyPokemonUpdate, 2, 0, this.props.team2[0])}
            pokemon={this.props.team2[0]}
            selected="true"
            toggleSubMenu={this.toggleSubMenu.bind(this, 2, 0)}
            subMenuOpen={this.state.selectedPicker2.index === 0 && this.state.selectedPicker2.subMenuOpen}
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
