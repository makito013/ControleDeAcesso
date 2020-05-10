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
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";
import { Button, Table } from 'reactstrap';
import { postAdonis } from "utils/api";
import { toast, Slide } from 'react-toastify';
import { injectIntl } from "react-intl";
import { Tooltip, Skeleton } from "antd";
import ModalJornada from "components/Modal/modalJornada.jsx"


const toastOptions = {
  transition: Slide,
  position: "top-center",
  autoClose: 5000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: true
};

class Jornada extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            statusModal: "",
            dadosPeriodos: [],
            dadosModal: [],
            codigo: 0,
            modalConfirme: false,
            idExcluir: 0,
            nomeExcluir: "",
            loading:true
        };
        this.contErro = 0;
        this.listaHorairos = "";
        this.postListaJornada = this.postListaJornada.bind(this);
        this.toggle = this.toggle.bind(this);
        this.toggleConfirme = this.toggleConfirme.bind(this);
        this.stringTranslate = this.stringTranslate.bind(this);

        this.postListaJornada();

        //Permissões de visualização
        this.permissoes = {
          consultar: this.props.operacoes[0] === '*' ? true : false,
          incluir: this.props.operacoes[1] === '*' ? true : false,
          alterar: this.props.operacoes[2] === '*' ? true : false,
          excluir: this.props.operacoes[3] === '*' ? true : false,
        }
    }

    toggle(status, dados, codigo) {
      this.setState({
        modal: !this.state.modal,
        statusModal: status,
        dadosModal: dados,
        codigo: codigo,
      });

      if(status === "sucesso"){
        this.postListaJornada();
      }
        
    }


    toggleConfirme(id, nome) {
      this.setState({
        modalConfirme: !this.state.modalConfirme,
        idExcluir: id,
        nomeExcluir: nome,
      });
    }

  
    stringTranslate(id){
      return this.props.intl.formatMessage({id: id});
    }


    async postListaJornada(){    
      this.setState({loading: true}) ;
      const body={
        cmd:"jornada",
        resumido:false,
        token: sessionStorage.getItem("token"),
      }

      postAdonis(body,"/Jornada").then(lista =>{
        if(lista.error === undefined)
        {
          var dados = [];
          lista.dados.map((item) =>{                                      
            dados[item.CodJornada] = item;
            return [item.CodJornada]; 
            });  

          this.listaHorairos = lista.listaHorarios;
          this.setState({dadosPeriodos: dados, loading:false});
        }
        else
        {
          if(this.contErro++ >= 3){
            this.contErro = 0;
            toast.dismiss();
            toast.error(this.stringTranslate("Erro.Servidor"), toastOptions);
          }            
          else
            this.postListaJornada();          
        }
        
    }).catch((error) => {
      if(this.contErro++ >= 3){
        this.contErro = 0;
        toast.dismiss();
        toast.error(this.stringTranslate("Erro.Servidor"), toastOptions);
      }            
      else
        this.postListaJornada();
    });
  }

  async postExcluirJornada(codigo){     
    const body={    
      codigo: codigo,
      token: sessionStorage.getItem("token"),
    }

    postAdonis(body,"/Jornada/Excluir").then(lista =>{
      if(lista.error === undefined)
      {
        if(lista.retorno === true){           
            toast.dismiss(); 
            toast.success(this.stringTranslate("Horario.Sucesso.ExcluidoHorario"), toastOptions);
            this.postListaJornada();
        }
        else{
            toast.dismiss();
            var mensagem = lista.mensagem === "1" ? this.stringTranslate("Jornada.Erro.JornadaJaVinculado") : lista.mensagem === "2" ? this.stringTranslate("Jornada.Erro.CodigoInexistente") : null;            
            toast.error(mensagem, toastOptions);  
        }
      }
      else
      {
        toast.dismiss();
        toast.error(this.stringTranslate("Erro.Servidor"), toastOptions);
      }
    }).catch((error) => {
        toast.dismiss();
        toast.error(this.stringTranslate("Erro.Servidor"), toastOptions);
    });
  }

  render() {    
    return (
      <>      
        <div className="content">
              <Card >
                <CardHeader tag="h4">
                {this.stringTranslate("Jornada.Titulo")}   
                {this.permissoes.incluir ? <Button color="link" onClick={() => this.toggle("Novo","",0)} style={{float: "right"}}><i className="fad fa-plus-circle"/> {this.stringTranslate("Jornada.Botao.NovaJornada")}</Button> : null}
                </CardHeader>
                <CardBody style={{marginRight:"10px"}}>
                <Skeleton loading={this.state.loading} active>    
                  <Row>
                    <Col>
                    <Table size="sm" responsive hover>
                      <thead>
                        <tr>
                          <th>{this.stringTranslate("Jornada.Tabela.Codigo")}</th>
                          <th>{this.stringTranslate("Jornada.Tabela.Descricao")}</th>
                          <th style={{textAlign:"center", textTransform:"uppercase"}}>{this.stringTranslate("Label.Acoes")}</th>
                        </tr>
                      </thead>
                      <tbody>
                      {this.state.dadosPeriodos.map((prop, key) => {
                        return (
                              <tr>
                              <th scope="row"  style={{textAlign:"center", width: "70px"}}>{key}</th>
                              <td>{prop.Nome}</td>      
                              <td style={{textAlign:"center", width: "150px"}}>
                                {this.permissoes.consultar ? 
                                <Tooltip placement="top" title={this.stringTranslate("Horario.Botao.Ver")} overlayStyle={{fontSize: "12px"}}>
                                <i className="far fa-eye ef-pulse-grow" onClick={() => this.toggle("Ver", prop, 0)} style={{top:"0", marginLeft: "10px", color:"#008F95", cursor:"pointer"}}/>
                                </Tooltip> : null}
                                {this.permissoes.incluir ? 
                                <Tooltip placement="top" title={this.stringTranslate("Jornada.Botao.Copiar")} overlayStyle={{fontSize: "12px"}}>
                                <i className="far fa-copy ef-pulse-grow" onClick={() => this.toggle("Copiar", prop, 0)} style={{top:"0", marginLeft: "10px", color:"#1d8cf8", cursor:"pointer"}}/>
                                </Tooltip> : null}
                                {this.permissoes.alterar ?
                                <Tooltip placement="top" title={this.stringTranslate("Horario.Botao.Editar")} overlayStyle={{fontSize: "12px"}}>
                                <i className="far fa-edit ef-pulse-grow" onClick={() => this.toggle("Editar", prop, key)} style={{top:"0", marginLeft: "10px", color:"#E9B000", cursor:"pointer"}}/>
                                </Tooltip> : null}
                                {this.permissoes.excluir ? 
                                <Tooltip placement="top" title={this.stringTranslate("Horario.Botao.Excluir")} overlayStyle={{fontSize: "12px"}}>
                                <i className="far fa-trash-alt ef-pulse-grow" onClick={() => this.toggleConfirme(key, <><h5>{key} - {prop.Nome}</h5>  </>)} style={{top:"0", marginLeft: "10px", color:"#E24E42", cursor:"pointer"}}/>
                                </Tooltip> : null}
                              </td>
                            </tr>
                          );
                        })}                                                
                      </tbody>
                    </Table>     
                    </Col>        
                  </Row>
                  </Skeleton>
                </CardBody>
              </Card>
          <Modal modalTransition={{timeout:0}} backdropTransition={{timeout:0}}  isOpen={this.state.modalConfirme}>
                    <ModalHeader style={{marginBottom:"0px"}} toggle={() =>this.toggleConfirme()}><h4>{this.stringTranslate("Jornada.Titulo.ExcluirJornada")}</h4></ModalHeader>
                    <ModalBody style={{paddingTop:"0px", paddingBottom:"0px"}}>   
                    {this.stringTranslate("Jornada.Notificacao.Excluir")} {this.state.nomeExcluir}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={() => this.toggleConfirme()}> {this.stringTranslate("Botao.Cancelar")} </Button>
                        <Button color="danger" onClick={() => {this.postExcluirJornada(this.state.idExcluir); this.toggleConfirme()}}>{this.stringTranslate("Botao.Excluir")}</Button>
                    </ModalFooter>
                </Modal>
        </div>  
        {this.state.modal === true ? (<ModalJornada modal={this.state.modal} onclick={this.toggle} data={this.state.dadosModal} horarios={this.listaHorairos} statusModal={this.state.statusModal} codigo={this.state.codigo}/>):null}  
        
      </>
    );
  }
}


export default injectIntl(Jornada);
