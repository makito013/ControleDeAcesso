/*!

=========================================================
* Paper Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col
} from "reactstrap";
import { Redirect } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import  CadastroPessoa from "views/CadastroPessoa.jsx";
import { postAdonis } from "utils/api";
import Detalhes from "components/CardList/Detalhes.jsx"
import { toast, Slide } from 'react-toastify';
import { injectIntl } from "react-intl";

class Liberacao extends React.Component {
  //Contrutor
    constructor(props) {      
        super(props);
        //Variaveis do objeto
        this.state = {      
            Id: "",
            dados: null,
            redirect: false,       
            info: [],    
            nome: "",
        };

    this.solicitaDadosPessoa = this.solicitaDadosPessoa.bind(this);
    this.state.Id = this.queryString("id");
    
    if(this.state.Id !== "0")
        this.solicitaDadosPessoa();      
    else
        this.state.nome = this.queryString("nome");
    //Traduz as strings
    this.stringTranslate = this.stringTranslate.bind(this);
}

    stringTranslate(id){
    return this.props.intl.formatMessage({id: id});
    }
    
    

    /////////////////////  Pega valores passados como parametros na URL ///////////////////////
    queryString(parameter) {
        if(typeof(Storage) !== "undefined")
        {
            var retorno = sessionStorage.getItem(parameter);
            console.log(retorno);
            if(retorno === null)
                this.retorno();

            sessionStorage.removeItem(parameter);            
            return retorno;
        } 
        else
        {
            if(this.props.location !== undefined){
                if(this.props.location.search.length > 1)
                {
                    var loc = this.props.location.search.substring(1, this.props.location.search.length);   
                    var param_value = false;   
                    var params = loc.split("&");   
                    for (var i=0; i<params.length;i++) {   
                        var param_name = params[i].substring(0,params[i].indexOf('='));   
                        if (param_name == parameter) {                                          
                            param_value = params[i].substring(params[i].indexOf('=')+1)   
                        }   
                    }   
                    if (param_value) {   
                        return param_value;   
                    }   
                    else {   
                        return undefined;   
                    } 
                }
                else{
                return 0;
                }
            }
            else
                return 0;
        }
        }
        //--------------------------------------------------------------------------------------------//
      

  ////////////////////////////// Requisição post para pegar dados da pessoa ///////////////////////////
  // Usa a variavel diretiva para impedir de fazer varias requisições ao mesmo tempo
  // as requisições vao ordenadas para o servidor, evitando quebra
  solicitaDadosPessoa() {
    let selectedIndex = this.state.Id;   
    
    const token = sessionStorage.getItem("token");
    const body={
        cmd:"pessoacodigo",
        codigo:selectedIndex,
        token:token
    }

    
    postAdonis(body,'/Autorizado/Consulta').then(lista =>{        
        if(lista.error === undefined)
        {
            if(lista.dados !== undefined){ 
                this.state.dados = lista.dados;
                this.setState({dados:lista.dados});
            }                    
        }                
        else
        {
            toast.error(this.stringTranslate("Liberacao.erro"), {
                transition: Slide,
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true
                });

            this.retorno();
        }                    
    });        
  }
  //-------------------------------------------------------------------------------------------------------//

    retorno(){
        this.state.redirect = true;
        this.setState({redirect: this.state.redirect})
    }



  render() {
    if (this.state.redirect) {
        return (
            <>
                <Redirect to={'/admin/pesquisa'} />
            </>);
    }
    else if (this.state.dados !== undefined && this.state.dados !== null){
        return (      
        <>   
        <div className="content">            
            <Row>
                <Col md="12">
            <Card>      
            <Tabs>
            <CardHeader tag="h4">
                {this.stringTranslate("Liberacao.liberacao")}
                
            </CardHeader>
            
            <CardBody style={{marginRight:"10px"}}>               
                <TabList >
                    <Tab>{this.stringTranslate("Liberacao.geral")}</Tab>
                    <Tab>{this.stringTranslate("Liberacao.detalhes")}</Tab>
                    <Tab>{this.stringTranslate("Liberacao.veiculos")}</Tab>
                </TabList>
                <TabPanel className="react-tab__panel-content">  
                    <CadastroPessoa 
                        biometrico={false}
                        data={this.state.dados} 
                        Id={this.state.Id} 
                        coletor={this.state.info.coletores}
                        secao={this.state.info.secao}
                        lotacao={this.state.info.lotacao}
                        empresa={this.state.info.empresa}
                        infopessoa={this.state.info.pessoa}
                    />
                </TabPanel>

                <TabPanel className="react-tab__panel-content">
                    <Detalhes data={this.state.dados} coletores={this.state.info.coletores}/>
                </TabPanel>

                <TabPanel className="react-tab__panel-content"></TabPanel>            
            </CardBody>
            </Tabs>
            </Card>
            </Col>
            </Row>       
        </div>     
        </>
        );
    }
    else if(this.state.Id === "0")
    {
        return (  
            <div className="content">            
            <Row>
                <Col md="12">
                <Card>      
                    <CardHeader tag="h4">
                    {this.stringTranslate("Pesquisa.card.cadastroPessoa")}
                    </CardHeader>
                    <CardBody style={{marginRight:"10px"}}>   
                    <CadastroPessoa biometrico={true} nome={this.state.nome}/>{window.scrollTo( 0, 0 )}
                    </CardBody>
                </Card>
                </Col>
            </Row>    
            </div>
        );
    }
    else{
        return(<></>);
    }
  }
}
export default injectIntl(Liberacao);