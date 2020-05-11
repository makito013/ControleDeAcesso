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
import React, {Component} from "react";
import ReactDOM from "react-dom";
import {Cookies} from 'react-cookie';
import { BrowserRouter , Route, Switch, Redirect } from "react-router-dom";
import { IntlProvider, addLocaleData } from "react-intl";
import registerServiceWorker from "./registerServiceWorker";
import AdminLayout from "./layouts/Admin/Admin.jsx";
import LoginLayout from "./layouts/Admin/Login.jsx";
import "./assets/css/black-dashboard-react.css";
import "./assets/scss/black-dashboard-react.scss";
import "./assets/demo/demo.css";
import "./assets/css/nucleo-icons.css";
import moment from 'moment';
import 'moment/locale/pt-br';
import 'moment/locale/en-ie';
import { CookiesProvider } from 'react-cookie';
import { encrypt } from "./utils/crypto.js"

let cookies = new Cookies();

class Index extends Component{

  constructor(props){
    super(props);
    this.state = {
      locale: "en",
      
    }


    this.linguagens = ["br", "en"]
    this.setLocale = this.setLocale.bind(this);
    this.dicIdiomas = [
      {pais: "BR", idioma: "br"},
      {pais: "US", idioma: "en"}
    ]
  }

  setLocale(area) {
    this.setState({ locale: area });
    //localStorage.setItem(storageKeyLocale, Base64.encode(area));
  }
  
  componentWillMount() {
    
    // this.setNextUrlParam();  
    // this.handleLogout();  

    let storageLocale = localStorage.getItem("locale");
    if (storageLocale !== null) {
      if(this.linguagens.includes(storageLocale) === false)
        storageLocale = "en";
      
      this.setLocale(storageLocale);
      if(storageLocale === "br")
        moment.locale('pt-br');
      else
        moment.locale('en-ie');
      //this.setState({ locale: storageLocale });
    } else {
      // "pt-BR" to "br", matching the file /locale-data/br.js
      let browserLocale = require("browser-locale")();
      let area = "en";
      switch (browserLocale) {
        case "pt-BR":
          area = "br";
          moment.locale('pt-br');
          break;
        default:
          break;
      }
      localStorage.setItem("locale", area);
      this.setLocale(area);
    }
    

  }
  
  render(){
    
    const area = this.state.locale;

    let translation = require("./components/translation/" + area);
    let localeData = require("react-intl/locale-data/" + area);
    addLocaleData(localeData);
    return(  
      <CookiesProvider>
      <IntlProvider locale={translation.locale} messages={translation.messages}>        
        <BrowserRouter basename="">    
          {cookies.get(encrypt("token")) !== undefined ? (              
            <Switch>               
              <Route path="/login" render={props => <LoginLayout />} />
              {/* <Route path="/Cadastro" render={props => <AdminLayout setLocale={this.setLocale} {...props} />} /> */}
              <Route path="/Dokeo" render={props => <AdminLayout setLocale={this.setLocale} page={"dokeo"} {...props} />} />
              <Route path="/Cadastro" render={props => <AdminLayout setLocale={this.setLocale} page={"dokeo"} {...props} />} />
              <Route path="/Ajustes" render={props => <AdminLayout setLocale={this.setLocale} page={"dokeo"} {...props} />} />
              <Route path="/Relatorios" render={props => <AdminLayout setLocale={this.setLocale} page={"dokeo"} {...props} />} />
              <Route path="/portaria" render={props => <AdminLayout setLocale={this.setLocale} page={"portaria"} {...props} />} />
              <Route path="/portaria/pesquisa" render={props => <AdminLayout setLocale={this.setLocale} page={"portaria"} {...props} />} />
              <Route path="/admin/Cadastro" render={props => <AdminLayout setLocale={this.setLocale} page={"dokeo"} {...props} />} />
              <Route path="/admin/Dokeo" render={props => <AdminLayout setLocale={this.setLocale} page={"dokeo"} {...props} />} />                
              <Redirect from="/" to="/login" />
            </Switch>
          ): (
            <>
              <Route path="/login" render={props => <LoginLayout />} />
              <Redirect from="/" to="/login" />
            </>
            )}                             
        </BrowserRouter>      
      </IntlProvider>
      </CookiesProvider>
    );
  }
}

window.addEventListener("load", () => {
  setTimeout(() => {
    ReactDOM.render(<Index />, document.getElementById("root"));
    registerServiceWorker();
  }, 50);
});
