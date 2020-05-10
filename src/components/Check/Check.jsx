import React, { Component } from 'react';
import { Button, Col, Row } from 'reactstrap';

class Check extends Component {
  constructor (props) {
    super(props);

    this.state = { selected: null };

    this.onRadioBtnClick = this.onRadioBtnClick.bind(this);
  }

  onRadioBtnClick(selected) {
    this.setState({ selected: selected });
  }

  render() {
    return (
      <>
          <Col md={6}>
              <Button block color="primary" onClick={() => this.onRadioBtnClick(1)} active={this.state.cSelected === 1}>Polegar</Button>
              <Button block color="primary" onClick={() => this.onRadioBtnClick(2)} active={this.state.cSelected === 2}>Indicador</Button>
              <Button block color="primary" onClick={() => this.onRadioBtnClick(3)} active={this.state.cSelected === 3}>Médio</Button>
              <Button block color="primary" onClick={() => this.onRadioBtnClick(4)} active={this.state.cSelected === 4}>Anelar</Button>
              <Button block color="primary" onClick={() => this.onRadioBtnClick(5)} active={this.state.cSelected === 5}>Mínimo</Button>
          </Col>
          <Col md={6}>
              <Button block color="primary" onClick={() => this.onRadioBtnClick(6)} active={this.state.cSelected === 6}>Polegar</Button>
              <Button block color="primary" onClick={() => this.onRadioBtnClick(7)} active={this.state.cSelected === 7}>Indicador</Button>
              <Button block color="primary" onClick={() => this.onRadioBtnClick(8)} active={this.state.cSelected === 8}>Médio</Button>
              <Button block color="primary" onClick={() => this.onRadioBtnClick(9)} active={this.state.cSelected === 9}>Anelar</Button>
              <Button block color="primary" onClick={() => this.onRadioBtnClick(10)} active={this.state.cSelected === 10}>Mínimo</Button>
          </Col>
      </>
    );
  }
}

export default Check;