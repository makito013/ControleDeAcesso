import React from "react";
import BootstrapTreeTable from 'bootstrap-react-treetable';
import ReactDOM from "react-dom";


import { injectIntl } from "react-intl";
import { toast, Slide } from 'react-toastify';
import Select from "react-select";
import makeAnimated from "react-select/animated";
import InputMask from 'react-input-mask';
import { post } from "utils/api";

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

import { Spin } from 'antd';
import { postAdonis } from "../../../utils/api";

var moment = require('moment');

function formataData(data){
    if (data !== null){
        let dataN = data.split("-");
        return(dataN[2]+"/"+dataN[1]+"/"+dataN[0])
    }else{
        return null;
    }
}

function converteOperacaoCheckLista(opcoes){
    let lista = [];
    for (var i = 0, j = opcoes.length; i < j; i++){
        if (opcoes[i] === "*")
            lista.push(i);
    }
    return(lista);
}

function converteOperacaoListaCheck(tam, opcoes){
    let vet = [];
    for (var i = 0, j = tam; i < j; i++){
        vet.push("-");
    }
    for (var i = 0, j = opcoes.length; i < j; i++){
        vet[opcoes[i]] = "*";
    }
    return vet.join("");
}

function SelectDiasSemana(props){
    const [reestricao, setRestricao] = React.useState();
  
    function handleChange(event) {
      setRestricao(event);
      props.onChangeDiasSemana(event);
    }

    const restricoes = [
        props.stringTranslate("Coletor.pag.programacao.dom"),
        props.stringTranslate("Coletor.pag.programacao.seg"),
        props.stringTranslate("Coletor.pag.programacao.ter"),
        props.stringTranslate("Coletor.pag.programacao.qua"),
        props.stringTranslate("Coletor.pag.programacao.qui"),
        props.stringTranslate("Coletor.pag.programacao.sex"),
        props.stringTranslate("Coletor.pag.programacao.sab"),
    ];
  
    const animatedComponents = makeAnimated();
    const options = restricoes.map((prop, key) => {
        return(                
            {value:key,label:prop}
        );
    })

    let valores = [];
    valores = props.value.map((prop) =>{
        return(options[prop]);
    })
  
    return(
      <FormGroup>
          <Label>{props.stringTranslate("Coletor.pag.programacao.acionamento.modal.diasSemana")}</Label>
      <Select  
        defaultValue={valores}
        isDisabled = {!props.editavel}   
        isMulti
        closeMenuOnSelect={false}
        components={animatedComponents}
        options={options}
        placeholder={""}
        onChange={(e) => handleChange(e)}
      />
      </FormGroup>
    )
  }


class ModalAcionamentoAutomatico extends React.Component{
    constructor(props){
        super(props);
        this.state ={
            salvando: false,
            modal: false,
            codigo: this.props.tipo !== "add" ? this.props.dados.CodAcionamentoProgramado : 0,
            dataInicio: this.props.tipo !== "add" ?  moment(this.props.dados.DataInicio).add(1,'days').format('YYYY-MM-DD'): null,
            dataFim: this.props.tipo !== "add" ? moment(this.props.dados.DataFim).add(1,'days').format('YYYY-MM-DD'): null,
            hora: this.props.tipo !== "add" ? this.props.dados.Hora: null,
            tempoLigado: this.props.tipo !== "add" ? this.props.dados.TempoLigado: null,
            tempoDesligado: this.props.tipo !== "add" ? this.props.dados.TempoDesligado: null,
            tempoCiclos: this.props.tipo !== "add" ? this.props.dados.Ciclos: null,
            dispositivo: this.props.tipo !== "add" ? this.props.dados.Dispositivo: null,
            diasSemana: this.props.tipo !== "add" ? converteOperacaoCheckLista(this.props.dados.DiasSemana): [],
        }
        this.toggle = this.toggle.bind(this);
        this.stringTranslate = this.stringTranslate.bind(this);
        this.handleChangeDataInicio = this.handleChangeDataInicio.bind(this);
        this.handleChangeDataFim = this.handleChangeDataFim.bind(this);
        this.handleChangeHora = this.handleChangeHora.bind(this);
        this.handleChangeTempoLigado = this.handleChangeTempoLigado.bind(this);
        this.handleChangeTempoDesligado = this.handleChangeTempoDesligado.bind(this);
        this.handleChangeCiclos = this.handleChangeCiclos.bind(this);
        this.handleChangeDispositivo = this.handleChangeDispositivo.bind(this);
        this.handleChangeDiasSemana = this.handleChangeDiasSemana.bind(this);
        this.handleClickSalvar = this.handleClickSalvar.bind(this);
        this.handleClickRemove = this.handleClickRemove.bind(this);
        this.tipo = this.props.tipo;
        this.editavel = true;
    }

    stringTranslate(id){
        return this.props.intl.formatMessage({id: id});
    }

    toggle(){
        this.setState({modal: !this.state.modal});
    }

    handleChangeDataInicio(event){
        this.setState({dataInicio: event.target.value})
    }
    handleChangeDataFim(event){
        this.setState({dataFim: event.target.value})
    }
    handleChangeHora(event){
        this.setState({hora: event.target.value})
    }
    handleChangeTempoLigado(event){
        this.setState({tempoLigado: event.target.value})
    }
    handleChangeTempoDesligado(event){
        this.setState({tempoDesligado: event.target.value})
    }
    handleChangeCiclos(event){
        this.setState({tempoCiclos: event.target.value})
    }
    handleChangeDispositivo(event){
        this.setState({dispositivo: event.target.value})
    }
    handleChangeDiasSemana(event){
        if (event !== null)
            this.setState({diasSemana: event.map((prop) => {return (prop.value) } ) } );
        else
            this.setState({diasSemana: []});
    }

    handleClickSalvar(){
        const body = {
            "cmd": "incluirProgramacao",
            "token": sessionStorage.getItem("token"),
            "codigo": this.state.codigo,
            "dataInicio": moment(this.state.dataInicio).format('YYYY-MM-DD'),
            "dataFim": moment(this.state.dataFim).format('YYYY-MM-DD'),
            "horario": this.state.hora,
            "ciclos": this.state.tempoCiclos,
            "tempoLigado": this.state.tempoLigado,
            "tempoDesligado": this.state.tempoDesligado,
            "dispositivo": this.state.dispositivo,
            "diasSemana": converteOperacaoListaCheck(7, this.state.diasSemana),
            "coletor": this.props.coletor,
        }
        postAdonis(body, '/Coletor/Acionamento/Salvar').then((data)=>{
            this.setState({salvando: true});
            if (data.error === undefined && data.retorno){
                console.log(body);
                console.log(data);
                this.props.atualizaTable();
                this.props.toggle();
                toast.success(data.mensagem, {
                    transition: Slide,
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    pauseOnVisibilityChange: false
                    });  
            }else{
                toast.error(this.stringTranslate("Error: "+data.mensagem), {
                  transition: Slide,
                  position: "top-center",
                  autoClose: 5000,
                  hideProgressBar: true,
                  closeOnClick: true,
                  pauseOnHover: false,
                  draggable: true,
                  pauseOnVisibilityChange: false
                  });    
              }
              this.setState({salvando: false})
        })
    }
    handleClickRemove(){
        const body = {
            "cmd": "excluirProgramacao",
            "token": sessionStorage.getItem("token"),
            "codigo": this.state.codigo,
        }
        postAdonis(body, '/Coletor/Acionamento/Excluir').then((data) => {
            if (data.error === undefined){
                console.log(data);
                this.props.atualizaTable();
                this.props.toggle();
                toast.success(data.mensagem, {
                    transition: Slide,
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    pauseOnVisibilityChange: false
                    });  
            }else{
                toast.error(this.stringTranslate("Error: "+data.msg), {
                  transition: Slide,
                  position: "top-center",
                  autoClose: 5000,
                  hideProgressBar: true,
                  closeOnClick: true,
                  pauseOnHover: false,
                  draggable: true,
                  pauseOnVisibilityChange: false
                  });    
              }
            
        })
    }
                    
                    

    render(){
        switch(this.tipo){
            case "add":
               // this.button = <><Button color="link" onClick={this.toggle} style={{float: "right"}}><i className="fad fa-plus-circle"/> {this.stringTranslate("Coletor.pag.programacao.add")}</Button></>;
                break;
            case "edit":
                //this.button = <> <i id={"editAci"} onClick={this.toggle} className="tim-icons icon-pencil" style={{top:"0", paddingLeft: "10px", color:"orange", cursor:"pointer"}} /> 
               // <UncontrolledTooltip placement="top" target={"editAci"}>{this.stringTranslate("EmpresaLS.Empresa.editar")}</UncontrolledTooltip></>;
                break;
            case "view":
                //this.button = <> <i id={"editAci"} onClick={this.toggle} className="far fa-eye" style={{top:"0", paddingLeft: "10px", color:"orange", cursor:"pointer"}} /> 
                //<UncontrolledTooltip placement="top" target={"editAci"}>{this.stringTranslate("EmpresaLS.Empresa.editar")}</UncontrolledTooltip></>;
                this.editavel = false;
                break;
            case "del":
                this.handleClickRemove();
                return(null);
                break;
            default:
                this.button = null;
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
                {/* {this.button} */}
                <Modal isOpen={this.props.isOpened} style={{minWidth:"70%"}}>
                    <ModalHeader toggle={this.props.toggle}>
                        {this.stringTranslate("Coletor.pag.programacao.titulo")}
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Label>{this.stringTranslate("Coletor.pag.programacao.inicio")}</Label>
                                    <Input value={this.state.dataInicio} onChange={this.handleChangeDataInicio} disabled={!this.editavel} type="date" />
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <Label>{this.stringTranslate("Coletor.pag.programacao.termino")}</Label>
                                    <Input value={this.state.dataFim} onChange={this.handleChangeDataFim} disabled={!this.editavel} type="date" />
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <Label>{this.stringTranslate("Coletor.pag.programacao.hora")}</Label>
                                    <Input defaultValue={this.state.hora} onChange={this.handleChangeHora} disabled={!this.editavel} step={1} type="time" />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Label>{this.stringTranslate("Coletor.pag.programacao.tempoLigado")}</Label>
                                    <Input value={this.state.tempoLigado} onChange={this.handleChangeTempoLigado} disabled={!this.editavel} type="text"
                                    mask="9999999999999999999" maskChar={null}
                                    tag={InputMask}
                                    ></Input>
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <Label>{this.stringTranslate("Coletor.pag.programacao.tempoDesligado")}</Label>
                                    <Input value={this.state.tempoDesligado} onChange={this.handleChangeTempoDesligado} disabled={!this.editavel} type="text"
                                    mask="9999999999999999999" maskChar={null}
                                    tag={InputMask}
                                    ></Input>
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <Label>{this.stringTranslate("Coletor.pag.programacao.ciclos")}</Label>
                                    <Input value={this.state.tempoCiclos} onChange={this.handleChangeCiclos} disabled={!this.editavel} type="text"
                                    mask="9999999999999999999" maskChar={null}
                                    tag={InputMask}
                                    ></Input>
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <Label>{this.stringTranslate("Coletor.pag.programacao.dispositivo")}</Label>
                                    <Input value={this.state.dispositivo} onChange={this.handleChangeDispositivo} disabled={!this.editavel} type="text"
                                    mask="9999999999999999999" maskChar={null}
                                    tag={InputMask}
                                    ></Input>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <SelectDiasSemana value={this.state.diasSemana} onChangeDiasSemana={this.handleChangeDiasSemana} stringTranslate={this.stringTranslate} editavel={this.editavel} />
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

export default injectIntl(ModalAcionamentoAutomatico);