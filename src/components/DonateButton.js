import React from 'react';

class SimplifiedOutcomeRow extends React.Component {
  constructor() {
    super();
    this.handleDonateButtonClick = this.handleDonateButtonClick.bind(this);
    this.state = {
      open: false
    }
  }

  handleDonateButtonClick() {
    this.setState({
      open: !this.state.open
    });
  }

  render() {
    const className = `donate ${this.state.open ? 'donate-expanded' : ''}`;
    return (
      <div className={className} onClick={this.handleDonateButtonClick}>
        <div className="donate-button"></div>

        <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
          <input type="hidden" name="cmd" value="_donations" />
          <input type="hidden" name="business" value="pokeduelhub@gmail.com" />
          <input type="hidden" name="lc" value="US" />
          <input type="hidden" name="item_name" value="Coffee for Bogden" />
          <input type="hidden" name="amount" value="3.00" />
          <input type="hidden" name="currency_code" value="USD" />
          <input type="hidden" name="bn" value="PP-DonationsBF:btn_donate_LG.gif:NonHosted" />
          <button type="submit"><span>$3</span> for Coffee</button>
        </form>

        <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
          <input type="hidden" name="cmd" value="_donations" />
          <input type="hidden" name="business" value="pokeduelhub@gmail.com" />
          <input type="hidden" name="lc" value="US" />
          <input type="hidden" name="item_name" value="Dinner for Bogden" />
          <input type="hidden" name="amount" value="10.00" />
          <input type="hidden" name="currency_code" value="USD" />
          <input type="hidden" name="bn" value="PP-DonationsBF:btn_donate_LG.gif:NonHosted" />
          <button type="submit"><span>$10</span> for Dinner</button>
        </form>

        <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
          <input type="hidden" name="cmd" value="_donations" />
          <input type="hidden" name="business" value="pokeduelhub@gmail.com" />
          <input type="hidden" name="lc" value="US" />
          <input type="hidden" name="item_name" value="Poke Duel Hub Website Hosting Fees" />
          <input type="hidden" name="amount" value="25.00" />
          <input type="hidden" name="currency_code" value="USD" />
          <input type="hidden" name="bn" value="PP-DonationsBF:btn_donate_LG.gif:NonHosted" />
          <button type="submit"><span>$25</span> for Server Fees</button>
        </form>

        <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
          <input type="hidden" name="cmd" value="_donations" />
          <input type="hidden" name="business" value="pokeduelhub@gmail.com" />
          <input type="hidden" name="lc" value="US" />
          <input type="hidden" name="item_name" value="Donation for Poke Duel Hub" />
          <input type="hidden" name="currency_code" value="USD" />
          <input type="hidden" name="bn" value="PP-DonationsBF:btn_donate_LG.gif:NonHosted" />
          <button type="submit">Other Amount</button>
        </form>
      </div>
    );
  }
}

SimplifiedOutcomeRow.defaultProps = {
};

export default SimplifiedOutcomeRow;
