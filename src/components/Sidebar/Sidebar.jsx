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


//////////////////////////////////////////// USAR NavbarToggler PARA FAZER O MENU SUMIR //////////////////////////////////////////
import React from "react";
import { NavLink, Link } from "react-router-dom";
// nodejs library to set properties for components
import { PropTypes } from "prop-types";
import { injectIntl } from "react-intl";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
import { ToastContainer } from 'react-toastify';

// reactstrap components
import { Nav, Collapse  } from "reactstrap";

var ps;

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
        this.activeRoute.bind(this); 
        this.sidebar = React.createRef();
        this.state = {
            amount:'',
            password:"",
            weight: '',
            weightRange: '',
            token: '',
            tooltipOpen: false,
            flag: false,
            collapse: [false],
        };
        this.stringTranslate = this.stringTranslate.bind(this);
        this.toggle = this.toggle.bind(this);
    }

    toggle(item){
      this.state.collapse[item] = !this.state.collapse[item];
      this.setState({ collapse: this.state.collapse });
    }
  
    stringTranslate(id){
      if(id !== undefined)      
      {
        return this.props.intl.formatMessage({id: id});
      }

    }

  // verifies if routeName is the one active (in browser input)
  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  }
  componentDidMount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(this.refs.sidebar, {
        suppressScrollX: true,
        suppressScrollY: false
      });
    }
  }
  componentWillUnmount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps.destroy();
    }
  }
  linkOnClick = () => {
    document.documentElement.classList.remove("nav-open");
  };
  render() {
    const { bgColor, routes, rtlActive, logo } = this.props;
    let logoImg = null;
    let logoText = null;
    if (logo !== undefined) {
      if (logo.outterLink !== undefined) {
        logoImg = (
          <a
            href={logo.outterLink}
            className="simple-text logo-mini"
            target="_blank"
            onClick={this.props.toggleSidebar}
          >
            <div className="logo-img">
              <img src={logo.imgSrc} alt="react-logo" />
            </div>
          </a>
        );
        logoText = (
          <a
            href={logo.outterLink}
            className="simple-text logo-normal"
            target="_blank"
            onClick={this.props.toggleSidebar}
          >
            {logo.text}
          </a>
        );
      } else {
        logoImg = (
          <Link
            to={logo.innerLink}
            className="simple-text logo-mini"
            onClick={this.props.toggleSidebar}
          >
            <div className="logo-img">
              <img src={logo.imgSrc} alt="react-logo" />
            </div>
          </Link>
        );
        logoText = (
          <Link
            to={logo.innerLink}
            className="simple-text logo-normal"
            onClick={this.props.toggleSidebar}
          >
            {logo.text}
          </Link>
        );
      }
    }
    return (
      <div className="sidebar" data={bgColor}>       
        <div className="sidebar-wrapper" ref="sidebar">
        <Nav style={{marginBottom: "30px"}}>
            {routes.map((prop) => {
              return (
                (prop.name !== undefined && prop.layout === "/admin") ? (<li>
                  <span 
                   // to={prop.layout + prop.path}
                    className="nav-link"
                    activeClassName="active" 
                    to={prop.layout + prop.path}                                      
                  >
                    <i className={prop.icon} />
                    <p  style={{fontWeight: "bold"}}>{this.stringTranslate("Routes."+prop.name)}</p> 
                  </span>
                                    
                  <Collapse style={{marginTop: "-10px"}} isOpen="true">
                    {routes.map((prop2) => {
                      return ( 
                        <>  
                          {prop2.layout === prop.path ? (
                          <NavLink
                            to={prop2.layout + prop2.path}                 
                          >
                            <p className="sub-itens">{this.stringTranslate("Routes."+prop2.name)}</p> 
                          </NavLink>
                          ) : null}                                             
                        </>
                      );
                      })}
                  </Collapse>
                
                </li>) : prop.name !== undefined && prop.layout === "/portaria" ? (
                <li
                  className={
                    this.activeRoute(prop.path) +
                    (prop.pro ? " active-pro" : "")
                  }
                >
                  <NavLink
                    to={prop.layout + prop.path}
                    className="nav-link"
                    activeClassName="active"
                    onClick={this.props.toggleSidebar}
                  >
                    <i className={prop.icon} />
                    <p style={{fontWeight: "400"}}>{this.stringTranslate("Routes."+prop.name)}</p>
                  </NavLink>
                </li>): null                         
              );
            })}
          </Nav>
        </div>
      </div>
    );
  }
}

Sidebar.defaultProps = {
  rtlActive: false,
  bgColor: "blue",
  routes: [{}]
};

Sidebar.propTypes = {
  // if true, then instead of the routes[i].name, routes[i].rtlName will be rendered
  // insde the links of this component
  rtlActive: PropTypes.bool,
  bgColor: PropTypes.oneOf(["primary", "blue", "green", "orange"]),
  routes: PropTypes.arrayOf(PropTypes.object),
  logo: PropTypes.shape({
    // innerLink is for links that will direct the user within the app
    // it will be rendered as <Link to="...">...</Link> tag
    innerLink: PropTypes.string,
    // outterLink is for links that will direct the user outside the app
    // it will be rendered as simple <a href="...">...</a> tag
    outterLink: PropTypes.string,
    // the text of the logo
    text: PropTypes.node,
    // the image src of the logo
    imgSrc: PropTypes.string
  })
};

export default injectIntl(Sidebar);
