import React from "react";
import BootstrapTreeTable from 'bootstrap-react-treetable';
import ReactDOM from "react-dom";
import Tabela from "../../components/Tabela/Tabela"


import {post,postAdonis} from "../../utils/api.js"
import { injectIntl } from "react-intl";
import { toast, Slide } from 'react-toastify';
import { Spin } from "antd";

import {
  CardImg,
  Card,
  CardHeader,
  CardBody,
  //CardFooter,
  Row,
  Col,
  InputGroupAddon,
  InputGroup,
  InputGroupText,
  Input,
  Button,
  CardFooter,
  Modal,
  ModalHeader,
  ModalFooter,
  ModalBody,
  UncontrolledTooltip,
  FormGroup,
  Label
} from "reactstrap";

class ModalCategoriaPessoas extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            modal: false,
            salvando: false,
            nome: (this.props.tipo !== "add" && this.props.tipo !== "addSub") ? this.props.dados.data.nome : null,
        }
        this.icone = null;
        this.editavel = true;
        this.toggle = this.toggle.bind(this);
        this.handleClickSalvar = this.handleClickSalvar.bind(this);
        this.handleChangeNome = this.handleChangeNome.bind(this);
        this.handleClickDeletar = this.handleClickDeletar.bind(this);
        this.stringTranslate = this.stringTranslate.bind(this);
        this.footer = null;
        this.tipo = this.props.tipo;
    }

    stringTranslate(id){
        return this.props.intl.formatMessage({id: id});
    }

    toggle() {
        this.state.modal = !this.state.modal;
        this.setState(() => ({
            modal: this.state.modal
        }));
    }

    handleChangeNome(event){
        console.log(event.target.value);
        this.setState({nome: event.target.value});
    }

    handleClickDeletar(){
        if (this.tipo === "del"){
            console.log(this.props.dados);
            const body = {
                "cmd": "ExcluirCategoria",
                "token": sessionStorage.getItem("token"),
                "codigo": this.props.dados.codCategoriaPessoa,
            }
            console.log("Aqui");
            postAdonis(body,'/CategoriaPessoa/Excluir').then((data) =>{
          //  post(body).then((data) =>{
                console.log("Aqui");
                if (data.retorno === true){
                    this.props.atualizaTable();
                    this.props.toggle();
                    toast.success(data.msg, {
                        transition: Slide,
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true
                        });
                }else{
                    toast.error("Error "+data.msg, {
                        transition: Slide,
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true
                        });
                }
            })
        }
    }

    handleClickSalvar(){
        this.setState({salvando: true});
        if (this.tipo === "add"){
            const body = {
                "cmd": "IncluirCategoria",
                "token": sessionStorage.getItem("token"),
                "codigo": 0,
                "nome": this.state.nome,
            }
        //    post(body).then((data) =>{
            postAdonis(body,'/CategoriaPessoa/Salvar').then((data) =>{
                if (data.error === undefined){
                    toast.success(data.mensagem, {
                        transition: Slide,
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true
                        });
                        this.props.atualizaTable();
                        this.props.toggle();
                }else{
                    toast.error("Error: "+data.msg, {
                        transition: Slide,
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true
                        });
                }
                this.setState({salvando: false});
            })
        }else if (this.tipo === "addSub"){
            console.log(this.props.dados);
            const body = {
                "cmd": "IncluirCategoria",
                "token": sessionStorage.getItem("token"),
                "codigo": 0,
                "codCategoriaSuperior": this.props.dados.codCategoriaPessoa,
                "nome": this.state.nome,
            }
            
            //post(body).then((data) =>{
            postAdonis(body,'/CategoriaPessoa/Salvar').then((data) =>{
                if (data.error === undefined){
                    toast.success(data.mensagem, {
                        transition: Slide,
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true
                        });
                        this.props.atualizaTable();
                        this.props.toggle();
                }else{
                    toast.error("Error: "+data.msg, {
                        transition: Slide,
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true
                        });
                }
                this.setState({salvando: false});
            })

        }else if (this.tipo === "edit"){
            console.log(this.props.dados)
            const body = {
                "cmd": "IncluirCategoria",
                "token": sessionStorage.getItem("token"),
                "codigo": this.props.dados.codCategoriaPessoa,
                "codCategoriaSuperior": this.props.dados.codCategoriaSuperior,
                "nome": this.state.nome,
            }
            //post(body).then((data) =>{
                postAdonis(body,'/CategoriaPessoa/Salvar').then((data) =>{
                if (data.error === undefined){
                    toast.success(data.mensagem, {
                        transition: Slide,
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true
                        });
                        this.props.atualizaTable();
                        this.props.toggle();
                }else{
                    toast.error("Error: "+data.msg, {
                        transition: Slide,
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true
                        });
                }
                this.setState({salvando: false});
            })
        }
    }

    render(){
        switch(this.tipo){
            case "add":
                //this.icone = <> <Button id="add" onClick={this.toggle} style={{float:"right"}}>{this.stringTranslate("Categoria.Modal.AdicionarCategoria")}</Button></>;
                break;
            case "addSub":
                //this.icone = <> <i id="addSub" onClick={this.toggle} className="tim-icons icon-simple-add" style={{top:"0", paddingLeft: "10px", color:"green", cursor:"pointer"}} />
                //                 <UncontrolledTooltip placement="top" target="addSub">{this.stringTranslate("Categoria.Modal.AdicionarSub")}</UncontrolledTooltip></>;
                break;
            case "view":
                this.editavel = false;
                break;
            case "edit":
                //this.icone = <> <i id="edit" onClick={this.toggle} className="tim-icons icon-pencil" style={{top:"0", paddingLeft: "10px", color:"orange", cursor:"pointer"}} /> 
                //                 <UncontrolledTooltip placement="top" target="edit">{this.stringTranslate("Categoria.Modal.Renomear")}</UncontrolledTooltip></>;
                break;
            case "del":
                //this.icone = <> <i id="del" onClick={this.handleClickDeletar} className="tim-icons icon-trash-simple" style={{top:"0", paddingLeft: "10px", color:"red", cursor:"pointer"}} />
                //                <UncontrolledTooltip placement="top" target="del">{this.stringTranslate("Categoria.Modal.Deletar")}</UncontrolledTooltip></>;
                this.handleClickDeletar();
                return(null);
                break;
            default:
                this.icone = null;
                break;
        }
        if (this.editavel){
            this.footer = <>
            <Row>
                <Col>
                    <Spin spinning={this.state.salvando}>
                        <Button onClick={this.handleClickSalvar} block>{this.stringTranslate("Categoria.Modal.Salvar")}</Button>
                    </Spin>
                </Col>
                <Col>
                    <Button onClick={this.props.toggle} block>{this.stringTranslate("Categoria.Modal.Cancelar")}</Button>
                </Col>
            </Row></>;
        }else{
            this.footer = <>
            <Row>
                <Col>
                    <Button onClick={this.props.toggle} block>{this.stringTranslate("Categoria.Modal.Sair")}</Button>
                </Col>
            </Row>
            </>
        }
        return(
            <>
            <Modal isOpen={this.props.isOpened} style={{minWidth:"75%"}}>
                <ModalHeader toggle={this.props.toggle}>
                {this.stringTranslate("Categoria.Modal.EntreNome")}:
                </ModalHeader>
                <ModalBody>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label>{this.stringTranslate("Categoria.Modal.NomeCategoria")}</Label>
                                <Input onChange={this.handleChangeNome} value={this.state.nome} type="text" disabled={!this.editavel} />
                            </FormGroup>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    {this.footer}
                </ModalFooter>
            </Modal>
            </>
        )
    }
}

export default injectIntl(ModalCategoriaPessoas);