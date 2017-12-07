import * as React from "react";
import { Container, Row, Col, Input, UncontrolledAlert } from "reactstrap";
import { PayForm } from "./PayForm";

export namespace Website {
  export interface Props {}
  export interface State {}
}

export class Website extends React.Component<Website.Props, Website.State> {
  render() {
    return (
      <div>
        <section>
          <Container>
            <Row>
              <Col>
                <PayForm />
              </Col>
            </Row>
          </Container>
        </section>
        <section>
          <Container>
            <Row>
              <Col>Bearded</Col>
              <Col>Six Pack</Col>
              <Col>Charitable</Col>
            </Row>
          </Container>
        </section>
      </div>
    );
  }
}
