import React from "react";
import {
    Modal,
    ModalHeader,
    ModalBody,
    Input,

    ModalFooter,
    Row,
    Col,
    Label,
    FormGroup,
    Collapse,
    Form,
    FormFeedback,
  } from "reactstrap";

  import AsyncSelect from 'react-select/async';
  import {post, postAdonis} from "../../utils/api.js"
  import { toast, Slide, ToastType  } from 'react-toastify';
  import { injectIntl } from "react-intl";
  import InputMask from 'react-input-mask';
  import ModalCadastroBiometrico from "../../components/Modal/ModalCadastroBiometrico"
  import Webcam from "react-webcam";
  import { TreeSelect, Tooltip, Upload, Icon, Button, Select,Tree, Skeleton,   Table} from 'antd';
  import '../../assets/css/antd.css';
  import moment from 'moment';

  const { Option } = Select;
  const toastOptions = {
    transition: Slide,
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,    
  };

  function cleanMask(string){
    if (Boolean(string) === true){
        let res = "";
        res = string.replace(/[/]/g, "");
        res = res.replace(/-/g, "");
        res = res.replace(/\./g, "");
        return res; 
    }else{
        return null;
    }
}

  class ModalCadastro extends React.Component{
    constructor(props) {
        super(props); 

        this.state = {
           
        };
    }
    
    stringTranslate(id){
        return this.props.intl.formatMessage({id: id});
    }  
    render(){   
        return(
        <>                   
            <Modal fade isOpen={this.props.modal} size="lg" style={{minHeight: "700px", marginTop: "-130px", minWidth: "70%"}}>
            <ModalHeader toggle={() =>this.props.onclick("")}><h4>{this.props.statusModal} {this.stringTranslate("Autorizado.Modal.Titulo")}</h4>            
            </ModalHeader>
                <ModalBody style={{paddingTop: "0px", minHeight: "480px"}}> 
                <Card>
                <CardBody>

                  {this.state.buscando === true ? (<Skeleton />) : (<Table scroll={{x:"700px"}} size="small" columns={this.colunasTabela} dataSource={this.state.dadosTabela} />)}                                    
                </CardBody>
              </Card>
                </ModalBody>
                <ModalFooter>
                    {this.state.steps !== 0 ? (<Button type="warning" style={{width: "100px"}} onClick={() => this.changeStep(this.state.steps-1)}><Icon type="left" /> {this.stringTranslate("Botao.Voltar")}</Button>) : null}
                    {this.state.steps < this.state.quantidadeSteps - 1 ? (<Button type="info" style={{width: "100px"}} onClick={() => this.changeStep(this.state.steps+1)}>{this.stringTranslate("Botao.Avancar")} <Icon type="right" /></Button>) : null}
                    {this.state.steps === this.state.quantidadeSteps - 1 ?  this.visualizar === true ? (<Button type="danger" style={{width: "100px"}} onClick={() =>this.props.onclick("")}>{this.stringTranslate("Botao.Fechar")} <Icon type="close-circle" /></Button>) : (<Button type="primary" style={{width: "100px"}} onClick={this.enviaCadastro}>{this.stringTranslate("Botao.Gravar")} <Icon type="save" /></Button>) : null}
                </ModalFooter>
            </Modal>
        </>
        );
    };
  }
  export default injectIntl(ModalCadastro);