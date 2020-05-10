import React from "react";
import Tabela from "../../components/Tabela/Tabela"

import {Button, Tooltip} from "antd"
import {post, postAdonis} from "../../utils/api.js"
import { injectIntl } from "react-intl";
import { toast, Slide } from 'react-toastify';
import PagLocaisAcesso from "./PagLocaisAcesso.jsx";
import PagColetor from "./PagColetor.jsx";

import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Nav,
} from "reactstrap";

function validaBooleanString(string){
    if (string === "False" || string === "false" || string === "F" || string === "f")
        return false;
    else
        return true;
}


function AcoesLocal(props){
    return(
    <>
        {props.permissoes.incluir ?
        <Tooltip placement="top" title={props.stringTranslate("Coletor.Coletor.add")} overlayStyle={{fontSize: "12px"}}>
            <i onClick={() => props.toggleColetor("add", props.dados)} className="far fa-plus ef-pulse-grow" style={{top:"0", marginLeft: "10px", color:"#1d8cf8", cursor:"pointer"}} />
        </Tooltip> : null}
        {props.permissoes.consultar ?
        <Tooltip placement="top" title={props.stringTranslate("Botao.Ver")} overlayStyle={{fontSize: "12px"}}>
            <i onClick={() => props.toggle("view", props.dados)} className="far fa-eye ef-pulse-grow" style={{top:"0", marginLeft: "10px", color:"#008F95", cursor:"pointer"}} /> 
        </Tooltip> : null}
        {props.permissoes.alterar ?
        <Tooltip placement="top" title={props.stringTranslate("Botao.Editar")} overlayStyle={{fontSize: "12px"}}>
            <i onClick={() => props.toggle("edit", props.dados)} className="far fa-edit ef-pulse-grow" style={{top:"0", marginLeft: "10px", color:"#E9B000", cursor:"pointer"}} /> 
        </Tooltip> : null}
        {props.permissoes.excluir ?
        <Tooltip placement="top" title={props.stringTranslate("Botao.Excluir")} overlayStyle={{fontSize: "12px"}}>
            <i onClick={() => props.toggle("del", props.dados)} className="far fa-trash-alt ef-pulse-grow" style={{top:"0", marginLeft: "10px", color:"#E24E42", cursor:"pointer"}} />
        </Tooltip> : null}
    </>    
    )
}

function AcoesColetor(props){
    return(
        <>
        {props.permissoes.consultar ?
        <Tooltip placement="top" title={props.stringTranslate("Botao.Ver")} overlayStyle={{fontSize: "12px"}}>
            <i onClick={() => props.toggle("view", props.dados)} className="far fa-eye ef-pulse-grow" style={{top:"0", marginLeft: "30px", color:"#008F95", cursor:"pointer"}} /> 
        </Tooltip> : null}
        {props.permissoes.alterar ?
        <Tooltip placement="top" title={props.stringTranslate("Botao.Editar")} overlayStyle={{fontSize: "12px"}}>
            <i onClick={() => props.toggle("edit", props.dados)} className="far fa-edit ef-pulse-grow" style={{top:"0", marginLeft: "10px", color:"#E9B000", cursor:"pointer"}} /> 
        </Tooltip> : null}
        {props.permissoes.excluir ?
        <Tooltip placement="top" title={props.stringTranslate("Botao.Excluir")} overlayStyle={{fontSize: "12px"}}>
            <i onClick={() => props.toggle("del", props.dados)} className="far fa-trash-alt ef-pulse-grow" style={{top:"0", marginLeft: "10px", color:"#E24E42", cursor:"pointer"}} />
        </Tooltip> : null}
    </>
    )
}

class LocaisAcessoColetor extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            dataTable: [],
            tableHeader: [
                this.stringTranslate("Coletor.table.head.nome"),
                this.stringTranslate("Coletor.table.head.computador"),
                this.stringTranslate("Label.Acoes"),
            ],
            pagAtual: 0,
            editavel: true,
            modalLocais: false,
            modalColetor: false,
        }
        this.tipoModal = null;
        this.dadosModal = null;
        this.pagRender = null;
        this.onClickLine = this.onClickLine.bind(this);
        this.stringTranslate = this.stringTranslate.bind(this);
        this.alteraPagina = this.alteraPagina.bind(this);
        this.atualizaTable = this.atualizaTable.bind(this);
        this.chamaModalLocais = this.chamaModalLocais.bind(this);
        this.toggleModalLocais = this.toggleModalLocais.bind(this);
        this.chamaModalColetor = this.chamaModalColetor.bind(this);
        this.toggleModalColetor = this.toggleModalColetor.bind(this);
        this.setCabecalho = this.setCabecalho.bind(this);
        this.imprime = this.imprime.bind(this);

        //Permissões de visualização
        this.permissoes = {
            consultar: this.props.operacoes[0] === '*' ? true : false,
            incluir: this.props.operacoes[1] === '*' ? true : false,
            alterar: this.props.operacoes[2] === '*' ? true : false,
            excluir: this.props.operacoes[3] === '*' ? true : false,
        }
    }

    setCabecalho(){
        var cabecalho = null;
        this.imprime(cabecalho);
        }

    imprime(cabecalho){
        if (cabecalho !== null)
            var conteudo = cabecalho + document.getElementById("table").innerHTML;
        else
            var conteudo = document.getElementById("table").innerHTML;
        var telaImpressao = window.open();
        telaImpressao.document.write(conteudo);
        telaImpressao.window.print();
        telaImpressao.window.close();
    }

    chamaModalLocais(tipo, dados){
        this.tipoModal = tipo;
        this.dadosModal = dados;
        this.toggleModalLocais();
    }

    toggleModalLocais(){
        this.setState({modalLocais: !this.state.modalLocais});
    }

    chamaModalColetor(tipo, dados){
        this.tipoModal = tipo;
        this.dadosModal = dados;
        this.toggleModalColetor();
    }

    toggleModalColetor(){
        this.setState({modalColetor: !this.state.modalColetor});
    }

    atualizaTable(){
        var coletores = [];
        let body = {
            "cmd": "consultaColetores",
            "token": sessionStorage.getItem("token"),
            "soAtivo": false,
        }
        postAdonis(body, '/Coletor/Index').then((dato) => {
            if (dato.erro === undefined){
                var data = dato.dados;
                console.log(data);
                var coletor;
                data.map((prop) => {
                    prop.Ativo = prop.Flags[4] === '*' ? "true": "false";
                    prop.TemDispositivoTeclado = prop.Flags[12] === '*' ? "true": "false";
                    prop.TemDispositivoCartao = prop.Flags[14] === '*' ? "true": "false";
                    prop.UsaBiometria = prop.Flags[10] === '*' ? "true": "false";
                    prop.AutoConfigIPUmaVez = prop.Flags[20] === '*' ? "true": "false";
                    prop.TipoLeitorCartao1 = parseInt(prop.Flags[5]);
                    prop.TipoLeitorCartao2 = parseInt(prop.Flags[6]);
                    prop.TipoLeitorCartao3 = parseInt(prop.Flags[22]);
                    prop.DirecoesCartao1 = prop.Flags[7];
                    prop.DirecoesCartao2 = prop.Flags[8];
                    prop.DirecoesCartao3 = prop.Flags[23];
                    prop.LongaDistanciaCartao1 = prop.Flags[24] === '*' ? "true": "false";
                    prop.LongaDistanciaCartao2 = prop.Flags[25] === '*' ? "true": "false";
                    prop.LongaDistanciaCartao3 = prop.Flags[26] === '*' ? "true": "false";
                    prop.LeitorNaUrna = prop.Flags[21] === '*' ? "true": "false";
                    prop.ModeloPictograma = prop.Flags[1];
                    prop.DigitacaoComoSenha = prop.Flags[0] === '*' ? "true": "false";
                    prop.usaAntenaTCP = prop.Flags[0] === '*' ? "true": "false";
                    coletor = {
                        "codLocalAcesso": prop.CODLOCALACESSO,
                        "codColetor": prop.CODCOLETOR,
                        "data": {
                            "nome": null,
                            "nomeComputador": prop.NUMERO,
                            "acoes": null,
                        },
                        "child": [],
                        "key": prop.CODCOLETOR,
                    }
                    coletor.data.nome = validaBooleanString(prop.Ativo) === true ? <><i class="fad fa-check" style={{color:"green"}} /> {prop.NOME}</> : <><i class="fad fa-check" style={{color:"grey"}} /> {prop.NOME} </> ;
                    coletor.data.acoes = <><AcoesColetor permissoes={this.permissoes} stringTranslate={this.stringTranslate} toggle={this.chamaModalColetor} dados={prop} /></>
                    coletores.push(coletor);
                })
                //this.state.dataTable = dataTable;
                //this.setState({dataTable: this.state.dataTable});
                let body1 = {
                    "cmd": "consultaLocaisAcesso",
                    "token": sessionStorage.getItem("token"),
                }
                postAdonis(body1, '/LocalAcesso/Index').then((data1) => {
                    if (data1.error === undefined){
                        var data = data1.dados;
                        console.log(data);
                        var dataTable = [];
                        var localAcesso;
                        data.map((prop) => {
                            var mColetores = [];
                            for (var i = 0, j = coletores.length; i < j; i++){
                                if (coletores[i].codLocalAcesso === prop.CODLOCALACESSO){
                                    mColetores.push(coletores[i]);
                                }
                            }
                            localAcesso = {
                                "codLocal": prop.CODLOCALACESSO,
                                "data": {
                                    "nome": prop.NOME,
                                    "nomeComputador": prop.NOMECOMPUTADOR,
                                    "acoes": null,
                                },
                                "child": mColetores,
                                "key": prop.CODLOCALACESSO,
                            }
                            let dados = prop;
                            dados.filhos = mColetores;
                            localAcesso.data.acoes = <><AcoesLocal permissoes={this.permissoes} stringTranslate={this.stringTranslate} toggleColetor={this.chamaModalColetor} toggle={this.chamaModalLocais} dados={dados} /></>
                            dataTable.push(localAcesso);
                        })
                        this.state.dataTable = dataTable;
                        this.setState({dataTable: this.state.dataTable});
                    }else{
                        toast.error(this.stringTranslate("Error: "+data1.msg), {
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
            }else{
                console.log(dato);
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
        })

    }

    componentDidMount(){
        this.atualizaTable();
    }

    stringTranslate(id){
        return this.props.intl.formatMessage({id: id});
    }

    onClickLine(){

    }

    alteraPagina(pagDestino, editavel = true){
        this.setState({pagAtual: pagDestino});
        this.setState({editavel: editavel});
    }

    render(){
        return(
        <>
            <div className="content">
                <Card>
                <CardHeader tag="h4">
                  {this.permissoes.incluir ? <Button type="link" onClick={() => this.chamaModalLocais("add", this.dadosModal)} style={{float: "right"}}><i className="fad fa-plus-circle"/>{this.stringTranslate("Coletor.addLocal")}</Button> : null}            
                  <Tooltip placement="top" title={this.stringTranslate("Coletor.imprimirPag")} overlayStyle={{fontSize: "12px"}}> 
                  <Nav 
                    onClick={this.setCabecalho}
                    block 
                    id="impressaoV"
                    className="fad fa-print" 
                    style={{ color:"grey", 
                    background:"transparent", 
                    fontSize:"20px",
                    margin:"5px 5px 0 5px", 
                    padding:"0", 
                    maxWidth:"fit-content",
                    float: "right",
                    cursor: "pointer"}} />
                  </Tooltip>
                  {this.stringTranslate("Coletor.titulo")}  
                </CardHeader>   
                    <CardBody style={{marginTop:"10px"}}>
                    <Row>
                    <Col>
                        <div id = "table">
                        <Tabela onClickLine={this.onClickLine} tableHeader={this.state.tableHeader} dataTable={this.state.dataTable} />
                        </div>
                        </Col>
                        </Row> 
                    </CardBody>
                </Card>
            </div>
            {this.state.modalLocais ? (<PagLocaisAcesso atualizaTable={this.atualizaTable} toggle={this.toggleModalLocais} isOpened={this.state.modalLocais} tipo={this.tipoModal} dados={this.dadosModal} />) : null}
            {this.state.modalColetor ? (<PagColetor atualizaTable={this.atualizaTable} toggle={this.toggleModalColetor} isOpened={this.state.modalColetor} tipo={this.tipoModal} dados={this.dadosModal} />) : null}
        </>
        );
    }
}

export default injectIntl(LocaisAcessoColetor);