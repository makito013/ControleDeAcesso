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
import { Table } from 'reactstrap';
import { postAdonis } from "utils/api";
import { toast, Slide } from 'react-toastify';
import { injectIntl } from "react-intl";
import ModalHorario from "components/Modal/modalHorario.jsx"
import {Tooltip, Button, Skeleton} from 'antd'


const toastOptions = {
  transition: Slide,
  position: "top-center",
  autoClose: 5000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: true
};

class Horario extends React.Component {
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
            loading: true,
        };
        this.contErro = 0;
        this.postListaHorarios = this.postListaHorarios.bind(this);
        this.toggle = this.toggle.bind(this);
        this.stringTranslate = this.stringTranslate.bind(this);
        this.toggleConfirme = this.toggleConfirme.bind(this);
        this.postListaHorarios();

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
        this.postListaHorarios();
      }
        
    }
  
    stringTranslate(id){
      return this.props.intl.formatMessage({id: id});
    }

    toggleConfirme(id, nome) {
      this.setState({
        modalConfirme: !this.state.modalConfirme,
        idExcluir: id,
        nomeExcluir: nome,
      });
    }
  //-------------------------- Lista Horario ----------
  postListaHorarios(){     
    this.setState({loading:true});
    const body={
      token: sessionStorage.getItem("token"),
    }
    
    postAdonis(body,"/Horario/Index").then(lista =>{
      if(lista.retorno === true)
      {
        var dados = [];
        lista.dados.map((item) =>{                                      
          dados[item.Codigo] = item.Periodos;
          return [item.Codigo]; 
        });          
        this.contErro = 0;
        this.setState({dadosPeriodos: dados, loading:false});
      }
      else{
        if(this.contErro++ >= 3){
          this.setState({loading:false});
          this.contErro = 0;
          toast.dismiss();
          toast.error(this.stringTranslate("Erro.Servidor"), toastOptions);
        }            
        else
          this.postListaHorarios();         
      }
    }).catch((error) => {
      if(this.contErro++ >= 3){
        this.setState({loading:false});
        this.contErro = 0;
        toast.dismiss();
        toast.error(this.stringTranslate("Erro.Servidor"), toastOptions);
      }            
      else
        this.postListaHorarios();
    }) //Fim Catch       
      //Fim Em caso de Erro tente De Novo
  }
  //--------------------------Fim Lista Horario ----------

  postExcluirHorario(codigo){     
    const body={   
      codigo: codigo,
      token: sessionStorage.getItem("token"),
    }

    postAdonis(body,"/Horario/Excluir").then(lista =>{
      if(lista.error === undefined)
      {
        if(lista.retorno === true){           
          toast.dismiss(); 
          toast.success(this.stringTranslate("Horario.Sucesso.ExcluidoHorario"), toastOptions);

          this.postListaHorarios();
        }        
      }
      else
      {
        if(lista.error == 1){
          toast.dismiss();
          var mensagem = lista.mensagem === "1" ? this.stringTranslate("Horario.Erro.HorarioJaVinculado") : lista.mensagem === "2" ? this.stringTranslate("Horario.Erro.CodigoInexistente") : null;            
          toast.error(mensagem, toastOptions);  
        }
        toast.dismiss();
        toast.error(this.stringTranslate("Horario.Erro.Servidor"), toastOptions);
      }
    });
  }

  render() {    
    return (
      <>      
        <div className="content">
              <Card>
                <CardHeader tag="h4">
                {this.stringTranslate("Horario.Titulo")}    
                {this.permissoes.incluir ? <Button type="link" onClick={() => this.toggle("Novo","",0)} style={{float: "right"}}><i className="fad fa-plus-circle"/> {this.stringTranslate("Horario.Botao.NovoHorario")}</Button> : null}
                </CardHeader>
                <CardBody style={{marginRight:"10px"}}>
                <Skeleton loading={this.state.loading} active>                                                   
                  <Row>
                    <Col>
                      <Table size="sm" responsive hover>
                        <thead>
                          <tr>
                            <th>{this.stringTranslate("Horario.Tabela.Codigo")}</th>
                            <th>{this.stringTranslate("Horario.Tabela.Descricao")}</th>
                            <th style={{textAlign:"center", textTransform:"uppercase"}}>{this.stringTranslate("Label.Acoes")}</th>
                          </tr>
                        </thead>
                        <tbody>
                        {this.state.dadosPeriodos.map((prop, key) => {
                          return (
                                <tr>
                                <th  style={{textAlign:"center", width:"70px"}} scope="row">{key}</th>
                                <td>{prop}</td>      
                                <td style={{textAlign:"center", width: "150px"}}>
                                  {this.permissoes.consultar ? 
                                  <Tooltip placement="top" title={this.stringTranslate("Horario.Botao.Ver")} overlayStyle={{fontSize: "12px"}}>
                                    <i className="far fa-eye ef-pulse-grow" onClick={() => this.toggle("Ver", prop, key)} style={{top:"0", marginLeft: "10px", color:"#008F95", cursor:"pointer"}}/>
                                  </Tooltip> : null}
                                  {this.permissoes.incluir ?
                                  <Tooltip placement="top" title={this.stringTranslate("Horario.Botao.Copiar")} overlayStyle={{fontSize: "12px"}}>
                                    <i className="far fa-copy ef-pulse-grow" onClick={() => this.toggle("Copiar", prop, 0)} style={{top:"0", marginLeft: "10px", color:"#1d8cf8", cursor:"pointer"}}/>
                                  </Tooltip> : null}
                                  {this.permissoes.alterar ? 
                                  <Tooltip placement="top" title={this.stringTranslate("Horario.Botao.Editar")} overlayStyle={{fontSize: "12px"}}>
                                    <i className="far fa-edit ef-pulse-grow" onClick={() => this.toggle("Editar", prop, key)} style={{top:"0", marginLeft: "10px", color:"#E9B000", cursor:"pointer"}}/>
                                  </Tooltip> : null}
                                  {this.permissoes.excluir ?
                                  <Tooltip placement="top" title={this.stringTranslate("Horario.Botao.Excluir")} overlayStyle={{fontSize: "12px"}}>
                                    <i className="far fa-trash-alt ef-pulse-grow" onClick={() => this.toggleConfirme(key, <><h5>{key} - {prop}</h5>  </>)} style={{top:"0", marginLeft: "10px", color:"#E24E42", cursor:"pointer"}}/>
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
                    <ModalHeader style={{marginBottom:"0px"}} toggle={() =>this.toggleConfirme()}><h4>{this.stringTranslate("Horario.Titulo.ExcluirHorario")}</h4></ModalHeader>
                    <ModalBody style={{paddingTop:"0px", paddingBottom:"0px"}}>   
                    {this.stringTranslate("Horario.Notificacao.Excluir")} {this.state.nomeExcluir}
                    </ModalBody>
                    <ModalFooter>
                        <Button type="danger" onClick={() => this.toggleConfirme()}> {this.stringTranslate("Botao.Cancelar")} </Button>
                        <Button type="primary" onClick={() => {this.postExcluirHorario(this.state.idExcluir); this.toggleConfirme()}}>{this.stringTranslate("Botao.Excluir")}</Button>
                    </ModalFooter>
                </Modal>
        </div>  
        {this.state.modal === true ? (<ModalHorario modal={this.state.modal} onclick={this.toggle} data={this.state.dadosModal} statusModal={this.state.statusModal} codigo={this.state.codigo}/>):null}  
        
      </>
    );
  }
}


export default injectIntl(Horario);
