


import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Table, Row, Col } from 'reactstrap';
import { Redirect } from "react-router-dom";
import { injectIntl } from "react-intl";


class ModalNeo extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
        redirect: false,
        link: "",
      }
      this.clickfalse = this.clickfalse.bind(this);
      //Traduz as strings
      this.stringTranslate = this.stringTranslate.bind(this);
   }

   stringTranslate(id){
   return this.props.intl.formatMessage({id: id});
   }
  
   clickfalse(){
      this.props.setIsDados(false);
   }


   setRedirect(e , codigo,value){
      this.state.index = codigo;
      var redirect = "";
   
   
   if(typeof(Storage) !== "undefined"){
     sessionStorage.setItem("id", this.props.data[1]);
     redirect = "/admin/Liberacao";
   }
   else{
     redirect = "/admin/Liberacao?id=" + this.props.data[1];        
   }

   this.setState({index: this.state.index, link: redirect, redirect: true});
 }


 render() {
   if (this.state.redirect) {
      return <Redirect to={this.state.link} />
    }
   else{
    
      return (
         <>

            <Modal modalTransition={{timeout:0}} backdropTransition={{timeout:0}}  isOpen={this.props.modal} toggle={this.props.onclick} size="lg">
            <ModalHeader toggle={this.props.onclick}><h4>{this.props.data[5]}</h4></ModalHeader>
            <ModalBody>
            <Row>
                  <Col md="4" xs="4">
 
                  {this.props.data[2]!== undefined ? (
                     <img
                        alt="..."
                        className="border-gray"
                        src={"data:image/jpeg;base64, "+ this.props.data[2]}
                      />
                  ):(
                    <img
                        alt="..."
                        className="border-gray"
                        src={require("../../assets/img/default-avatar.png")}
                      />
              
                  )
                  }
 
                  </Col>
                  <Col md="8" xs="8">
                     {console.log(this.props.data)}
                     <Table size="sm">
                     {this.props.data[0] !== undefined && this.props.data[0] !== "" ? (
                     <tr>
                     <th scope="row">{this.stringTranslate("Monitor.modalNeo.registro")}</th>
                     <td>{this.props.data[0]}</td>
                     </tr>) : null}
      
                     {this.props.data[7] !== undefined && this.props.data[7] !== "" ? (
                     <tr>
                        <th scope="row">{this.stringTranslate("Monitor.modalNeo.lotacaoSecao")}</th>
                        <td>{this.props.data[7]}</td>
                     </tr>) : null}

                        {this.props.data[3] !== undefined && this.props.data[3] !== "" ? (
                     <tr>
                        <th scope="row">{this.stringTranslate("Monitor.modalNeo.ultimoAcesso")}</th>
                        <td>{this.props.data[3]} {this.props.data[4]}</td>
                     </tr>) : null}

                        {this.props.data[6] !== undefined && this.props.data[6] !== "" ? (
                     <tr>
                        <th scope="row">{this.stringTranslate("Monitor.modalNeo.direcao")}</th>
                        <td>{this.props.data[6][0] === "E" ? this.stringTranslate("Monitor.modalNeo.entrada") : this.props.data[6][0] === "S" ? 
                                                      this.stringTranslate("Monitor.modalNeo.saida") : this.props.data[6][0] === "T" ? 
                                                      this.stringTranslate("Monitor.modalNeo.tentativa") : "" }</td>
                     </tr>) : null}

                        {this.props.data[10] !== undefined && this.props.data[10] !== "" ? (
                     <tr>
                        <th scope="row">{this.stringTranslate("Monitor.modalNeo.veiculo")}</th>
                        <td>{this.props.data[10]}</td>
                     </tr>) : null}

                        {this.props.data[11] !== undefined && this.props.data[11] !== "" ? (
                     <tr>
                        <th scope="row">{this.stringTranslate("Monitor.modalNeo.placa")}</th>
                        <td>{this.props.data[11]}</td>
                     </tr>) : null}

                        {this.props.data[8] !== undefined && this.props.data[8] !== "" ? (
                     <tr>
                        <th scope="row">{this.stringTranslate("Monitor.modalNeo.coletor")}</th>
                        <td>{this.props.data[8]}</td>
                     </tr>) : null}

                        {this.props.data[9] !== undefined && this.props.data[9] !== "" ? (
                     <tr>
                        <th scope="row">{this.stringTranslate("Monitor.modalNeo.visitou")}</th>
                        <td>{this.props.data[9]}</td>
                     </tr>) : null}

                     {/*///////Última linha///////*/}


                     </Table>
                  </Col>
            </Row>
            </ModalBody>
            <ModalFooter >               
               <Button style={{float:"right"}} color='danger' onClick={this.clickfalse}>{this.stringTranslate("Monitor.modalNeo.botao.cancelar")}</Button>
               <Button style={{float:"right"}} color='success' onClick={event => this.setRedirect()}>{this.stringTranslate("Monitor.modalNeo.botao.liberacao")}</Button>
            </ModalFooter>
            </Modal>
  </>
         )
      }
   }
}
export default injectIntl(ModalNeo);
