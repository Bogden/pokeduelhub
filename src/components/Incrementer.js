import React from 'react';

class OutcomeRow extends React.Component {
  render() {
    return (
      <div className="incrementer">
        <div className="incrementer-minus">-</div>
        <input className="sub-menu-input" type="text"/>
        <div className="incrementer-plus">+</div>
      </div>
    );
  }
}

OutcomeRow.defaultProps = {
};

export default OutcomeRow;
