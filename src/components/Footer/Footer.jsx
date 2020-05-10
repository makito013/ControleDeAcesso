/*!

=========================================================
* Black Dashboard React v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
/*eslint-disable*/
import React from "react";
// used for making the prop types of this component
import PropTypes from "prop-types";
// reactstrap components
import { UncontrolledButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle, Badge, Container } from 'reactstrap';
import { localstorageObjeto } from "utils/Requisicoes";
import { injectIntl } from "react-intl";
import { post } from "utils/api";
import { toast, Slide, ToastContainer } from 'react-toastify';


class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      ArrayValoresColetor: [],
      dropdownOpen: [],
      color: []
    };

    this.acionarColetor = this.acionarColetor.bind(this);
    this.toggleDropDown = this.toggleDropDown.bind(this);

    //Traduz as strings
    this.stringTranslate = this.stringTranslate.bind(this);
  }

  stringTranslate(id){
    return this.props.intl.formatMessage({id: id});
  }

  toggleDropDown(id) {
    this.state.dropdownOpen[id] = !this.state.dropdownOpen[id];
    this.setState({dropdownOpen: this.state.dropdownOpen});
  }

  componentDidMount() {   
    if(sessionStorage.getItem("coletores") != null)
    { 
        this.state.ArrayValoresColetor = localstorageObjeto("coletores");
        this.state.ArrayValoresColetor.sort();
        this.setState({ArrayValoresColetor: this.state.ArrayValoresColetor});
    }
  }

  acionarColetor(coletor, direcao){
    const token = sessionStorage.getItem("token");
      const body={
        cmd:"acionarcoletor",
        numero:coletor,
        direcao:direcao,
        token:token        
    }

    post(body).then(lista =>{
      console.log(lista);
        if(lista.error === undefined)
        {
          toast.success(this.stringTranslate("Layout.toast.coletorAcionado"), {
            transition: Slide,
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            pauseOnVisibilityChange: false
            }); 
        }                
        else
        {
          toast.error(this.stringTranslate("Layout.toast.erroAcionarColetor"), {
            transition: Slide,
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            pauseOnVisibilityChange: false
            }); 
        }              
    });    
  }

  render() {
    return (
      <footer className="footer" style={{zIndex:"1000"}}>
        <Container >
            {this.state.ArrayValoresColetor.map((prop, key) => {               
              return (
                (prop[2] != "") ? (
                <>
               
                  <UncontrolledButtonDropdown direction="up" >
                    <DropdownToggle color="neutral" caret id={prop[1]} style={{padding:"5px 10px 5px 10px", marginTop:"5px", marginBottom:"5px", boxShadow:"0px 0px 10px 0px rgba(0, 0, 0, 0.2)", border:"1px solid darkgray"}}>
                      {prop[2]} {/*<Badge color="warning">  <span className="fas fa-exclamation-triangle"/> </Badge> */}
                    </DropdownToggle>
                    <DropdownMenu name={prop[2]}  setActiveFromChild>
                        <DropdownItem header>{prop[1]}</DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem onClick={event => this.acionarColetor(prop[2], "E")}>{this.stringTranslate("Layout.dropDown.acionarEntrada")}</DropdownItem>
                        <DropdownItem onClick={event => this.acionarColetor(prop[2], "S")}>{this.stringTranslate("Layout.dropDown.acionarSaida")}</DropdownItem>
                    </DropdownMenu>                
                  </UncontrolledButtonDropdown>            
                </>
              ) : (null)
            )})}
        </Container>
      </footer>
    );
  }
}

export default injectIntl(Footer);
