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
import { Route, Switch } from "react-router-dom";
// javascript plugin used to create scrollbars on windows
// core components
import AdminNavbar from "components/Navbars/AdminNavbar.jsx";
import Sidebar from "components/Sidebar/Sidebar.jsx";
//import Sidebar from "components/Sidebar/NewSidebar.jsx";
import { injectIntl } from "react-intl";
import { routes, routesPortaria} from "routes.js";
import logo from "../../assets/img/logo-admin.png"
import logoPortaria from "assets/img/logo-portaria.png";
import { postAdonis } from "utils/api";
import { orange100 } from "material-ui/styles/colors";


class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      routes: [],
      backgroundColor: "white",
      sidebarOpened:
        document.documentElement.className.indexOf("nav-open") !== -1,
      color: "blue",
    };
    this.stringTranslate = this.stringTranslate.bind(this);
    this.getPerfil = this.getPerfil.bind(this);
    this.getRoutes = this.getRoutes.bind(this);
    this.perfil = [];
    if(this.props.page === "dokeo"){
      this.getPerfil(routes);
      //this.state.color = "orange"
    }
    else if(this.props.page === "portaria"){
      this.getRoutes(routesPortaria);
      //this.state.color = "blue"
    }
    console.log(this.props.page)
  }

  stringTranslate(id){
    return this.props.intl.formatMessage({id: id});
  }
  
  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }
  componentWillUnmount() {

  }
  componentDidUpdate(e) {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }
  // this function opens and closes the sidebar on small devices
  toggleSidebar = () => {
    document.documentElement.classList.toggle("nav-open");
    this.setState({ sidebarOpened: !this.state.sidebarOpened });
  };  


  getPerfil (routes)  {
    const body = {
      cmd: 'consultaPerfil',
      token: sessionStorage.getItem('token')
    };
    postAdonis(body, '/PerfisAcesso/ConsultaPerfil').then((data) =>{
      this.perfil = data.dados;
      var res = routes.map((prop, key) => {
        const item = this.perfil.find(element => element.CODITEMHABILITAVELWEB === prop.codItemHabilitavel);
        if (true){////item){
          var operacoes = null
          // if (prop.component){
          //   //operacoes = item.OPERACOES;
          // }
          if (prop.layout === "/admin") {
              return (
                <Route
                  path={prop.layout + prop.path}
                  component={prop.component}
                  key={key}
                  stringTranslate={this.stringTranslate}
                />
              );
          } 
          else if(prop.layout === ""){
            return (
              <Route
                path={prop.layout + prop.path}
                component={prop.component}
              />
            );
          }
          else{  
            return (        
              <Route
                path={prop.layout + prop.path}
                component={() => prop.component("****")}//operacoes)}
                key={key}
                stringTranslate={this.stringTranslate}
              />
            );
          }
        }
        else{
          return null
        }
      })
      this.state.routes = res;
      this.setState({routes: res});
    })
  }

  
  getRoutes = routes => {
    return routes.map((prop, key) => {
      if (prop.layout === "/portaria") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
            stringTranslate={this.stringTranslate}
          />
        );
      } else {
        return null;
      }
    });
  };

  handleBgClick = color => {
    this.setState({ backgroundColor: color });
  };

  getBrandTextPortaria = path => {
    for (let i = 0; i < routesPortaria.length; i++) {
      if (
        this.props.location.pathname.indexOf(
          routesPortaria[i].layout + routesPortaria[i].path
        ) !== -1
      ) {
        return routesPortaria[i].name;
      }
    }
    return "Brand";
  };

  getBrandText = path => {
    for (let i = 0; i < routes.length; i++) {
      const item = this.perfil.find(element => element.CODITEMHABILITAVELWEB === routes[i].codItemHabilitavel);
      if (
        this.props.location.pathname.indexOf(
          routes[i].layout + routes[i].path
        ) !== -1 //&& item
      ) {
        return routes[i].name;
      }
    }
    return "Brand";
  };

  render() {

    return (
      <>
        
        <div className="wrapper">
        <Sidebar
            {...this.props}
            routes={this.props.page === "dokeo" ? routes.filter((rota) => true) : routesPortaria }//{const item = this.perfil.find(element => element.CODITEMHABILITAVELWEB === rota.codItemHabilitavel); return item !== undefined})}
            bgColor={this.state.color}            
            toggleSidebar={this.toggleSidebar}
            collapse={true}
            sistema={this.props.page}
          />
          <div
            className="main-panel"
            ref="mainPanel"
            data={this.state.backgroundColor}
          >
            <AdminNavbar
              setLocale={this.props.setLocale}
              {...this.props}
              brandText={this.props.page === "dokeo" ? this.getBrandText(this.props.location.pathname) :  this.getBrandTextPortaria(this.props.location.pathname)}
              toggleSidebar={this.toggleSidebar}
              sidebarOpened={this.state.sidebarOpened}
              logo={{
                outterLink: "",
                text: "DOKEO",
                imgSrc: this.props.page === "dokeo" ?  logo : logoPortaria
              }}              
            />
            <Switch>
            {this.props.page === "dokeo" ? 
              this.state.routes : 
              this.getRoutes(routesPortaria) }
            </Switch>
            {// we don't want the Footer to be rendered on map page
            //this.props.location.pathname.indexOf("maps") !== -1 ? null : (
              //<Footer fluid />
            //)
          }
          </div>
        </div>
      {/*}  <FixedPlugin
          bgColor={"light"}
          handleBgClick={this.handleBgClick}
            />*/}
      </>
    );
  }
}

export default injectIntl(Admin);

