import * as React from "react";
import { Button } from "reactstrap";
import StripeCheckout from "react-stripe-checkout";
import { SourceType } from "../../../types/enums";

export namespace DonateButton {
  export interface Props {
    email: string;
    amount: string;
    type: SourceType;
    onSubmit: Function;
  }
  export interface State {}
}

export class DonateButton extends React.Component<DonateButton.Props, DonateButton.State> {
  render() {
    const { type, email, amount, onSubmit } = this.props;

    if (!Boolean(email) || !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
      return <Button disabled>Donate</Button>
    }

    if (type == SourceType.CC && !Boolean(amount)) {
      return <Button disabled>Donate</Button>
    }

    switch(type) {
      case SourceType.BITCOIN:
      case SourceType.ETHEREUM:
        return (
          <Button type="button" onClick={() => this.props.onSubmit()}>Donate</Button>
        );

      case SourceType.CC:
        return (
          <StripeCheckout
            stripeKey="pk_test_cQcfj8GqAtWobryPn1Vk6NlA"
            currency="USD"
            name="Donate to Jesus"
            description="Donate to charity and receive Jesus Coin!"
            email={email}
            amount={parseFloat(amount)*100}
            shippingAddress={false}
            billingAddress={false}
            zipCode={false}
            bitcoin={false}
            alipay={false}
            reconfigureOnUpdate={true}
            token={({ id }) => this.props.onSubmit(id)}
          >
            <Button type="button">Donate</Button>
          </StripeCheckout>
        );
    }
  }
};
