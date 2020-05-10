import React from "react";
import BootstrapTreeTable from 'bootstrap-react-treetable';
import ReactDOM from "react-dom";



import {post, postAdonis} from "../../../utils/api.js"
import { injectIntl } from "react-intl";
import Switch from "react-switch";
import InputMask from 'react-input-mask';
import Select from "react-select";
import makeAnimated from "react-select/animated"
import ModalAcionamentoAutomatico from "./ModalAcionamentoAutomatico.jsx"
import Tabela from "../../../components/Tabela/Tabela.jsx";


import {
  CardImg,
  Card,
  CardHeader,
  CardBody,
  Table,
  //CardFooter,
  Row,
  Col,
  Form,
  InputGroupAddon,
  InputGroup,
  InputGroupText,
  Input,
  CustomInput,
  Button,
  UncontrolledTooltip,
  FormGroup,
  Label,
  CardFooter,
} from "reactstrap";
import { func } from "prop-types";
import { toast, Slide } from 'react-toastify';

var moment = require('moment');

function AcoesAgendamento(props){
    return(
        props.editavel ? 
        (<>
        <i id={"editPro"+props.dados.CodAcionamentoProgramado} onClick={() => props.toggle("edit", props.dados)} className="tim-icons icon-pencil" style={{top:"0", paddingLeft: "10px", color:"orange", cursor:"pointer"}} /> 
        <UncontrolledTooltip placement="right" target={"editPro"+props.dados.CodAcionamentoProgramado}>{props.stringTranslate("Botao.Editar")}</UncontrolledTooltip>
        <i id={"viewPro"+props.dados.CodAcionamentoProgramado} onClick={() => props.toggle("view", props.dados)} className="far fa-eye" style={{top:"0", paddingLeft: "10px", color:"black", cursor:"pointer"}} /> 
        <UncontrolledTooltip placement="right" target={"viewPro"+props.dados.CodAcionamentoProgramado}>{props.stringTranslate("Botao.Ver")}</UncontrolledTooltip>
        <i id={"delPro"+props.dados.CodAcionamentoProgramado} onClick={() => props.toggle("del", props.dados)} className="tim-icons icon-trash-simple" style={{top:"0", paddingLeft: "10px", color:"red", cursor:"pointer"}} /> 
        <UncontrolledTooltip placement="right" target={"delPro"+props.dados.CodAcionamentoProgramado}>{props.stringTranslate("Botao.Excluir")}</UncontrolledTooltip>
        </>)
        :
        (<>
        <i id={"viewPro"+props.dados.CodAcionamentoProgramado} onClick={() => props.toggle("view", props.dados)} className="far fa-eye" style={{top:"0", paddingLeft: "10px", color:"black", cursor:"pointer"}} /> 
        <UncontrolledTooltip placement="right" target={"viewPro"+props.dados.CodAcionamentoProgramado}>{props.stringTranslate("Botao.Ver")}</UncontrolledTooltip>
        </>)
    )
}


class Programacao extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            modalAcionamento: false,
            headTable: [
                this.stringTranslate("Coletor.pag.programacao.hash"),
                this.stringTranslate("Coletor.pag.programacao.inicio"),
                this.stringTranslate("Coletor.pag.programacao.termino"),
                this.stringTranslate("Coletor.pag.programacao.hora"),
                this.stringTranslate("Coletor.pag.programacao.dispositivo"),
                this.stringTranslate("Coletor.pag.programacao.tempoLigado"),
                this.stringTranslate("Coletor.pag.programacao.tempoDesligado"),
                this.stringTranslate("Coletor.pag.programacao.ciclos"),
                this.stringTranslate("Coletor.pag.programacao.dom"),
                this.stringTranslate("Coletor.pag.programacao.seg"),
                this.stringTranslate("Coletor.pag.programacao.ter"),
                this.stringTranslate("Coletor.pag.programacao.qua"),
                this.stringTranslate("Coletor.pag.programacao.qui"),
                this.stringTranslate("Coletor.pag.programacao.sex"),
                this.stringTranslate("Coletor.pag.programacao.sab"),
                this.stringTranslate("Coletor.pag.programacao.acoes"),
            ],
            dataTable: [],
        }
        this.count = 0;
        this.tipoModal = null;
        this.dadosModal = null;
        this.editavel = this.props.editavel;
        this.atualizaTable = this.atualizaTable.bind(this);
        this.stringTranslate = this.stringTranslate.bind(this);
        this.chamaModalAcionamento = this.chamaModalAcionamento.bind(this);
        this.toggleModalAcionamento = this.toggleModalAcionamento.bind(this)
    }

    componentDidMount(){
        this.atualizaTable();
    }

    stringTranslate(id){
        return this.props.intl.formatMessage({id: id});
    }


    chamaModalAcionamento(tipo, dados){
        this.tipoModal = tipo;
        this.dadosModal = dados;
        this.toggleModalAcionamento();
    }

    toggleModalAcionamento(){
        this.setState({modalAcionamento: !this.state.modalAcionamento});
    }


    atualizaTable(){
        const body = {
          "cmd": "consultaProgramacao",
          "token": sessionStorage.getItem("token"),
          "codColetor": Boolean(this.props.dados) !== false ? this.props.dados.CODCOLETOR : 0,
        }
        postAdonis(body, '/Coletor/Acionamento/Index').then((dato) =>{
          if(dato.error === undefined){
            var data = dato.dados[0];
            var dataTable = [];
            console.log(data);
            var count = 0;
                data.map(prop => {
                    count++;
                    var programacao = {
                        "num": count,
                        "dataInicio": prop.DataInicio ? moment(prop.DataInicio).add(1,'days').format('DD/MM/YYYY') : null,
                        "dataFim": prop.DataFim ? moment(prop.DataFim).add(1,'days').format('DD/MM/YYYY') : null,
                        "hora": prop.Hora,
                        "dispositivo": prop.Dispositivo,
                        "tempoLigado": prop.TempoLigado,
                        "tempoDesligado": prop.TempoDesligado,
                        "ciclos": prop.Ciclos,
                        "dom": prop.DiasSemana[0],
                        "seg": prop.DiasSemana[1],
                        "ter": prop.DiasSemana[2],
                        "qua": prop.DiasSemana[3],
                        "qui": prop.DiasSemana[4],
                        "sex": prop.DiasSemana[5],
                        "sab": prop.DiasSemana[6],
                        "acoes": null,
                    }
                    programacao.acoes = <AcoesAgendamento editavel={this.editavel} stringTranslate={this.stringTranslate} toggle={this.chamaModalAcionamento} dados={prop} atualizaTable={this.atualizaTable} />;
                    dataTable.push(programacao);
                });
        
            this.state.dataTable = dataTable;
            this.setState({dataTable: this.state.dataTable});
          }else{
            toast.error(this.stringTranslate("Error: "+dato.msg), {
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
        });
      }

    render(){
        return(
            <>
            <div>
                <Card>
                    <CardHeader>{this.stringTranslate("Coletor.pag.programacao.titulo")}
                    <Button disabled={!this.editavel} color="link" onClick={()=>this.chamaModalAcionamento("add", this.dadosModal)} style={{float: "right"}}><i className="fad fa-plus-circle"/> {this.stringTranslate("Coletor.pag.programacao.add")}</Button>
                    {/* <ModalAcionamentoAutomatico tipo="edit" />
                    <ModalAcionamentoAutomatico tipo="del" /> */}
                    </CardHeader>
                    <CardBody>
                        {/* <Tabela tableHeader={this.state.headTable} dataTable={this.state.dataTable} /> */}
                        <Table responsive>
                                <thead className="text-primary">
                                    <tr>
                                        {this.state.headTable.map((prop, key) => {
                                            return (
                                                (prop !== null) ?(
                                                <th>{prop}</th>):null
                                            );
                                        })}
                                    </tr>
                                </thead>
                                {this.state.dataTable !== undefined ? (
                                    <tbody>
                                        {this.state.dataTable.map((prop, key) => {
                                            return(
                                                (prop !== null) ?(
                                                    <tr>
                                                        {Object.entries(prop).map((prop, key) => {
                                                            return(
                                                                (prop !== null) ? (
                                                                    <td>{prop[1]}</td>
                                                                ) : null
                                                            )
                                                        })}
                                                    </tr>
                                                ) : null
                                            )
                                        })}
                                    </tbody>) : null
                                }
                        </Table>
                    </CardBody>
                </Card>
                {this.state.modalAcionamento ? (<ModalAcionamentoAutomatico atualizaTable={this.atualizaTable} coletor={this.props.dados.CODCOLETOR} toggle={this.toggleModalAcionamento} isOpened={this.state.modalAcionamento} tipo={this.tipoModal} dados={this.dadosModal} />) : null}
            </div>
            </>
        )
    }
}

export default injectIntl(Programacao);