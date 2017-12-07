import * as React from "react";
import { Card, CardTitle, CardText, Form, FormGroup, Label, Container, Row, Col, Input, Button } from "reactstrap";
import StripeCheckout from "react-stripe-checkout";
import CurrencyInput from "react-currency-input";
import { SourceType } from "../../../types/enums";
import { Donation } from "../../../entity";
import { DonateButton } from "./DonateButton";

export enum PayFormStatus {
  EDITING,
  EDITING_ERROR,
  SUCCESS
}

export namespace PayForm {
  export interface Props {}
  export interface State {
    status: PayFormStatus;
    email: string;
    type: SourceType;
    id: string;
    amount: string;
    firstName: string;
    lastName: string;
    country: string;
    state: string;
  }
}

export class PayForm extends React.Component<PayForm.Props, PayForm.State> {
  constructor(props) {
    super(props);

    this.state = {
      status: PayFormStatus.EDITING,
      email: "",
      type: SourceType.CC,
      id: "",
      amount: "",
      firstName: "",
      lastName: "",
      country: "",
      state: ""
    };
  }

  render() {
    const { status } = this.state;

    if (status === PayFormStatus.SUCCESS) {
      return (
        <Card body outline color="success">
          <CardTitle>Donation processing!</CardTitle>
          <CardText>
          Your donation has been accepted and is being processed.
          Please check your email for instructions on how to receive your Jesus Coins.
          </CardText>
        </Card>
      );
    }

    const { type, amount, email } = this.state;
    let typeFields = null;

    switch(type) {
      case SourceType.BITCOIN:
      case SourceType.ETHEREUM:
      typeFields = (
        <FormGroup row>
          <Col sm={3}>
            Address
          </Col>
          <Col>
            <Input type="text" name="id" id="id" value={this.state.id} onChange={e => this.setState({ id: e.target.value })} />
          </Col>
        </FormGroup>
      );
      break;

      case SourceType.CC:
      typeFields = (
        <FormGroup row>
          <Col sm={3}>
            Donation Amount
          </Col>
          <Col>
            <CurrencyInput className="form-control" value={this.state.amount} onChangeEvent={e => this.setState({ amount: e.target.value })} />
          </Col>
        </FormGroup>
      );
      break;
    }

    return (
      <Form onSubmit={this.handleOnSubmit}>
        <Container fluid>
          <FormGroup row>
            <Col sm={3}>Email</Col>
            <Col>
              <Input type="email" id="email" name="email" value={this.state.email} onChange={e => this.setState({ email: e.target.value })} />
            </Col>
          </FormGroup>
        </Container>
        <Container fluid>
          <FormGroup row>
            <Col>
              <Label check>
                <Input type="radio" id="type" name="type" checked={type == SourceType.BITCOIN} onChange={e => this.setState({ type: SourceType.BITCOIN })} />
                {" "}
                Bitcoin
              </Label>
            </Col>
            <Col>
              <Label check>
                <Input type="radio" id="type" name="type" checked={type == SourceType.ETHEREUM} onChange={e => this.setState({ type: SourceType.ETHEREUM })} />
                {" "}
                Ethereum
              </Label>
            </Col>
            <Col>
              <Label check>
                <Input type="radio" id="type" name="type" checked={type == SourceType.CC} onChange={e => this.setState({ type: SourceType.CC })} />
                {" "}
                Credit Card
              </Label>
            </Col>
          </FormGroup>
          {typeFields}
        </Container>
        <Container fluid>
          <FormGroup row>
            <Col sm={3}>First Name</Col>
            <Col>
              <Input type="text" id="firstname" name="firstname" value={this.state.firstName} onChange={e => this.setState({ firstName: e.target.value })} />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col sm={3}>Last Name</Col>
            <Col>
              <Input type="text" id="lastname" name="lastname" value={this.state.lastName} onChange={e => this.setState({ lastName: e.target.value })} />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col sm={3}>Country</Col>
            <Col>
              <Input type="text" id="lastname" name="lastname" value={this.state.country} onChange={e => this.setState({ country: e.target.value })} />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col sm={3}>State</Col>
            <Col>
              <Input type="text" id="lastname" name="lastname" value={this.state.state} onChange={e => this.setState({ state: e.target.value })} />
            </Col>
          </FormGroup>
        </Container>
        <DonateButton type={type} email={email} amount={amount} onSubmit={type === SourceType.CC ? this.submit : this.submitCoin} />
      </Form>
    );
  }

  handleOnSubmit = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  submit = async (id: string) => {
    let { type, email } = this.state;
    let headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-SourceType", "application/x-www-form-urlencoded; charset=UTF-8");
    let body = new URLSearchParams();
    body.append("type", type.toFixed(0));
    body.append("id", id);
    body.append("email", email);

    let response = await fetch("/donate", {
      method: "POST",
      headers: headers,
      body: body
    });

    if (response.ok) {
      this.setState({ status: PayFormStatus.SUCCESS })
    } else {
      this.setState({ status: PayFormStatus.EDITING_ERROR })
    }
  }

  submitCoin = async () => {
    return this.submit(this.state.id);
  };
};
