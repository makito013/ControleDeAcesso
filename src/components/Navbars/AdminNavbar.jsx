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
import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
import { injectIntl } from "react-intl";
import ReactFlagsSelect from 'react-flags-select';
import '../../assets/scss/bandeira.scss';
import { Redirect } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import {Cookies} from 'react-cookie';
import { encrypt } from "../../utils/crypto.js"
import 'moment/locale/pt-br';
import 'moment/locale/en-ie';
// reactstrap components
import {
  Collapse,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Input,
  NavbarBrand,
  Navbar,
  NavLink,
  Nav,
  Container,
  Modal
} from "reactstrap";
import { runInThisContext } from "vm";

let cookies = new Cookies();

class AdminNavbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapseOpen: false,
      modalSearch: false,
      color: "navbar-transparent",
      redirect: false
    };
    this.logout = this.logout.bind(this);
    this.setIdioma = this.setIdioma.bind(this);
    this.getDefaultIdioma = this.getDefaultIdioma.bind(this);
    this.dicIdiomas = [
      {pais: "BR", idioma: "br"},
      {pais: "US", idioma: "en"}
    ];
  
    //traduz strings
    this.stringTranslate = this.stringTranslate.bind(this);
    }

  stringTranslate(id){
      return this.props.intl.formatMessage({id: id});
  }

  getDefaultIdioma(){
    const idioma = localStorage.getItem("locale");
    let pais = "US";
    this.dicIdiomas.map((prop) =>{
      if (idioma === prop.idioma)
        pais = prop.pais
    })
    return pais;
  }

  setIdioma(pais){
    let idioma = "en";
    this.dicIdiomas.map((prop) =>{
      if (pais == prop.pais)
        idioma = prop.idioma;
    })

    localStorage.setItem("locale",idioma)    
    window.location.reload(); 
    this.props.setLocale(idioma);
    //this.setState({redirect: true})
    //window.location.reload();
  }

  logout = () => {
    sessionStorage.clear();
    cookies.remove(encrypt("token"))
    cookies.remove(encrypt("dokeo"))
    cookies.remove(encrypt("maqCadastrada"))   
    cookies.remove(encrypt("IvNk"))   
    cookies.remove(encrypt("KeyNk"))   
    cookies.remove(encrypt("CodLocalAcesso"))   
    cookies.remove(encrypt("LocalAcessoNome"))  
    window.location.reload()
  };

  componentDidMount() {
    window.addEventListener("resize", this.updateColor);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateColor);
  }
  // function that adds color white/transparent to the navbar on resize (this is for the collapse)
  updateColor = () => {
    if (window.innerWidth < 993 && this.state.collapseOpen) {
      this.setState({
        color: "bg-white"
      });
    } else {
      this.setState({
        color: "navbar-transparent"
      });
    }
  };
  // this function opens and closes the collapse on small devices
  toggleCollapse = () => {
    if (this.state.collapseOpen) {
      this.setState({
        color: "navbar-transparent"
      });
    } else {
      this.setState({
        color: "bg-white"
      });
    }
    this.setState({
      collapseOpen: !this.state.collapseOpen
    });
  };
  // this function is to open the Search modal
  toggleModalSearch = () => {
    this.setState({
      modalSearch: !this.state.modalSearch
    });
  };
  render() {
    const { bgColor, routes, rtlActive, logo } = this.props;
    let logoImg = null;
    let logoText = null;
    logo.imgSrc !== "" ? 
      logoImg = (
        <a
          href={"../../index.html"}
          className="simple-text logo-mini"
          target="_self"
          onClick={this.props.toggleSidebar}
        >
          <div className="logo-img">
            <img src={logo.imgSrc} alt="react-logo" />
          </div>
        </a>
      ) : logoImg = (null);
      logoText = (
        <a
          href={"../../index.html"}
          className="simple-text logo-normal"
          target="_self"
          onClick={this.props.toggleSidebar}
        >
          {logo.text}
        </a>
      );
    return (
      <>   
      <ToastContainer pauseOnVisibilityChange={false} autoClose={5000} hideProgressBar={true} pauseOnHover={false}/>
      {this.state.redirect === true? (<Redirect to={'/pesquisa'}/>) : null}    
        <Navbar
          className={classNames(this.state.color)}
          expand="lg"
          light
        >
          <Container fluid>
            {logo.imgSrc !== "" ? (<>
            <div className="navbar-wrapper">
              <div
                className={classNames("navbar-toggle d-inline", {
                  toggled: this.props.sidebarOpened
                })}
              >
                <button
                  className="navbar-toggler"
                  type="button"
                  onClick={this.props.toggleSidebar}
                >
                  <span className="navbar-toggler-bar bar1" />
                  <span className="navbar-toggler-bar bar2" />
                  <span className="navbar-toggler-bar bar3" />
                </button>
              </div>
              <NavbarBrand style={{marginLeft: "0px"}}>
                <div className="logo" style={{maxWidth: "215px", marginTop: "5px"}}>
                  {logoImg}
                </div>
              </NavbarBrand>
              
            </div>
            </>) : null}
            <button
              aria-expanded={false}
              aria-label="Toggle navigation"
              className="navbar-toggler"
              data-target="#navigation"
              data-toggle="collapse"
              id="navigation"
              type="button"
              onClick={this.toggleCollapse}
            >
              <span className="navbar-toggler-bar navbar-kebab" />
              <span className="navbar-toggler-bar navbar-kebab" />
              <span className="navbar-toggler-bar navbar-kebab" />
            </button>
            <Collapse navbar isOpen={this.state.collapseOpen}>          
              <Nav className="ml-auto" navbar >
                <div style={{paddingTop:"10px", backgroundColor:"#fff", paddingLeft: "10px", borderRadius:"10px 0px 0px 10px"}}>           
                  <ReactFlagsSelect
                  defaultCountry = {this.getDefaultIdioma()}
                  countries={["US", "BR"]}
                  customLabels={{"US":"EN", "BR":"PT-BR"}}
                  onSelect={this.setIdioma}
                  placeholder=""
                  />
                </div>
                <UncontrolledDropdown nav style={{backgroundColor:"#fff", borderRadius:"0px 10px 10px 0px"}}>
                  <DropdownToggle
                    caret
                    color="default"
                    data-toggle="dropdown"
                    nav
                    onClick={e => e.preventDefault()}
                  >
                    <div className="photo">
                      <img alt="..." src={require("../../assets/img/anime3.png")} />
                    </div>
                    <b className="caret d-none d-lg-block d-xl-block" />
                    <p className="d-lg-none">{this.stringTranslate("Navbar.logout")}</p>
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-navbar" right tag="ul">
                    <NavLink tag="li">
                      <DropdownItem className="nav-item">{this.stringTranslate("Navbar.perfil")}</DropdownItem>
                    </NavLink>
                    <NavLink tag="li">
                      <DropdownItem className="nav-item">{this.stringTranslate("Navbar.configuracoes")}</DropdownItem>
                    </NavLink>
                    <DropdownItem divider tag="li" />
                    <NavLink tag="li">
                      <DropdownItem className="nav-item" onClick={this.logout}>{this.stringTranslate("Navbar.sair")}</DropdownItem>
                    </NavLink>
                  </DropdownMenu>
                </UncontrolledDropdown>
                <li className="separator d-lg-none" />
              </Nav>            
            </Collapse>
          </Container>
        </Navbar>
        <Modal
          modalClassName="modal-search"
          isOpen={this.state.modalSearch}
          toggle={this.toggleModalSearch}
        >
          <div className="modal-header">
            <Input id="inlineFormInputGroup" placeholder="SEARCH" type="text" />
            <button
              aria-label="Close"
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={this.toggleModalSearch}
            >
              <i className="tim-icons icon-simple-remove" />
            </button>
          </div>
        </Modal>
      </>
    );
  }
}

export default injectIntl(AdminNavbar);
