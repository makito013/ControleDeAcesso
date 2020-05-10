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
import { Button, FormGroup, Label, Input, CustomInput  } from 'reactstrap';
import { post } from "utils/api";
import { toast, Slide } from 'react-toastify';
import { pegaDataHora } from "components/dataHora.jsx"
import { localstorageObjeto } from "utils/Requisicoes";
import { injectIntl } from "react-intl";

const getDirecao = (tipo) => {
  if (tipo!= null){
	  var retorno = tipo.split("_")[1][0];
    return retorno;
  }
}



const getTipo = (tipo) =>{
	/*
	AUTORIZACAO_Residente,        //1- pessoa mora/trabalha no prédio
    AUTORIZACAO_PreAutorizado,    //2- autorizado com um prazo de validade
    // ver DataInicioLiberação, DataFimLiberação, PessoaResponsável
    AUTORIZACAO_PrecisaLiberacao, //3- precisa intervenção do guarda
    AUTORIZACAO_Desativado,       //4- desativado (não pode acessar)
    AUTORIZACAO_ResidentePonto,   //5- residente, bate ponto (segundo jornada)
    AUTORIZACAO_Externo);         //6-externo não residente (e.g.prop.lote)
	*/
	var retorno = tipo.substr(tipo.indexOf('_')+1);
	return retorno;
}





class EmpLotSec extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };

        this.stringTranslate = this.stringTranslate.bind(this);
    }

  
    stringTranslate(id){
      return this.props.intl.formatMessage({id: id});
    }


  render() {    
    return (
      <>      
        <div className="content">
          <Row>
            <Col md="12">
              <Card className="demo-icons" >
                <CardHeader tag="h4">
                {this.stringTranslate("Pesquisa.card.titulo")}                  
                </CardHeader>
                <CardBody className="all-icons" style={{marginRight:"10px"}}>
                  <Row>
                    
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>    
      </>
    );
  }
}


export default injectIntl(EmpLotSec);
