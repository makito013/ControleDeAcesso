import React, { Component } from 'react';
import { Button, Row, Col } from 'reactstrap';
import { element } from 'prop-types';
import { red } from '@material-ui/core/colors';

class CheckDedoPM extends Component {
  constructor (props) {
    super(props);

    this.state = { 
      color1:"primary",
      color2:"primary",
      panico:false,
      mestre:false,
    };
    // this.changeColor = this.changeColor.bind(this);
    this.onCheckboxBtnClick = this.onCheckboxBtnClick.bind(this);
  }

  // componentDidMount(){
  //   document.getElementById("1").style.backgroundColor = "primary";
  //   document.getElementById("2").style.backgroundColor = "primary";
  // }

  // changeColor(id){
  //   console.log(document.getElementById(String(id)).style.backgroundColor)
  //   if (document.getElementById(String(id)).style.backgroundColor !== "red")
  //       document.getElementById(String(id)).style.backgroundColor = "red";
  //   else
  //       document.getElementById(String(id)).style.backgroundColor = "primary";
  // }
  onCheckboxBtnClick(selected) {
    if (selected===1) {

      if(this.state.color1 === "primary")
        this.setState({mestre:false,panico:true,color1: "danger",color2: "primary" });
      else this.setState({mestre:false,panico:false, color1: "primary",color2: "primary" });
    }
    else {
      if(this.state.color2 === "primary")
      this.setState({mestre:true,panico:false, color2: "black" ,color1: "primary"});
      else this.setState({mestre:true,panico:false ,color2: "primary", color1: "primary" });
    }
    // this.setState({ cSelected: [...this.state.cSelected] });
  }


  // onCheckboxBtnClick(selected) {
  //   const index = this.state.cSelected.indexOf(selected);
  //   if (index < 0) {
  //     this.state.cSelected.push(selected);
  //   } else {
  //     this.state.cSelected.splice(index, 1);
  //   }
  //   this.changeColor(selected);
  //   console.log()
  //   this.setState({ cSelected: [...this.state.cSelected] });
  //   this.props.panicoMestre(this.state.cSelected);
  // }

  render() {
    return (
      <>  
        <Col>
            <Button id="1" color={this.state.color1} block onClick={() => this.onCheckboxBtnClick(1)} >Pânico</Button>
        </Col>
        <Col>
            <Button id="2" color={this.state.color2} block onClick={() => this.onCheckboxBtnClick(2)} >Mestre</Button>
        </Col>
      </>
    );
  }
}

export default CheckDedoPM;