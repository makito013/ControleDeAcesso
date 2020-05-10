import React from "react";
import TabelaVisitantesPresentes from 'components/Table/TabelaVisitantesPresentes'
import {
    Button, 
    Modal,
    ModalHeader,
    ModalBody,
    Nav,
    UncontrolledTooltip
  } from "reactstrap";

  import { injectIntl } from "react-intl";


  class ModalVisitantesPresentes extends React.Component{
    
    constructor(props) {
        super(props);
        this.state = {
          modal: false,
          dataTable: null,
        };
        //Função responsável por fazer o modal aparecer na tela
        this.toggle = this.toggle.bind(this);
        //Função que chama buscaDados para os visitantes presentes na API e os envia para a tabela de visitantes presentes
        this.mostraVisitantes = this.mostraVisitantes.bind(this);
        //Traduz as strings
        this.stringTranslate = this.stringTranslate.bind(this);
    }

      stringTranslate(id){
        return this.props.intl.formatMessage({id: id});
      } 
      
      mostraVisitantes(){
        this.props.buscaDados('V');
        this.toggle();
      }

      toggle() {
        this.setState(prevState => ({
          modal: !prevState.modal
        }));
      }

      render(){
        return(
            <div>
              <Nav 
                onClick={this.mostraVisitantes}
                block 
                id="visitantes"
                className="fas fa-user" 
                style={{ color:"black", 
                background:"transparent", 
                fontSize:"20px",
                margin:"0px 12px 0 12px", 
                padding:"0", 
                maxWidth:"fit-content",
                float: "right",
                cursor: "pointer"}} />

              <UncontrolledTooltip placement="top" target="visitantes">       
                {this.stringTranslate("Relatorios.tableVisitantes.botao.visitantesPresentes")}
              </UncontrolledTooltip>  
            {/*<Nav color="primary"  onClick={this.mostraVisitantes} style={{float:"right", fontSize:"14px"}}>
                Visitantes presentes
            </Nav>*/}
            <Modal isOpen={this.state.modal} toggle={this.toggle} style={{minWidth:"80%"}}>
            <ModalHeader toggle={this.toggle}>{this.stringTranslate("Relatorios.tableVisitantes.botao.visitantesPresentes")}</ModalHeader>
                <ModalBody>
                    <TabelaVisitantesPresentes dataTable={this.props.dataTable}/>
                </ModalBody>
            </Modal>
            </div>
        )
      };
  }
  export default injectIntl(ModalVisitantesPresentes);