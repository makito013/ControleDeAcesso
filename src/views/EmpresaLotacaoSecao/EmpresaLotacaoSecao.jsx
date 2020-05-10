import React from "react";
//import Tabela from "../../components/Tabela/Tabela"
import { toast, Slide } from 'react-toastify';



import {postAdonis} from "../../utils/api.js"
import { injectIntl } from "react-intl";

import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Nav,
  
} from "reactstrap";

import {Button,Table, Tooltip,Skeleton} from "antd"
import ModalEmpresa from "./ModalEmpresa";
import ModalLotacao from "./ModalLotacao";
import ModalSecao from "./ModalSecao";

function AcoesEmpresa (props){
  var incluir = 
  <>
    <Tooltip placement="top" title={props.stringTranslate("EmpresaLS.Lotacao.add")} overlayStyle={{fontSize: "12px"}}>
    <i onClick={() => props.toggleLotacao("add", props.dados)} className="far fa-plus ef-pulse-grow" style={{top:"0", marginLeft: "10px", color:"#1d8cf8", cursor:"pointer"}} />
   </Tooltip></>;

  var alterar = 
  <>
    <Tooltip placement="top" title={props.stringTranslate("Botao.Editar")} overlayStyle={{fontSize: "12px"}}>
    <i onClick={() => props.toggle("edit", props.dados)} className="far fa-edit ef-pulse-grow" style={{top:"0", marginLeft: "10px", color:"#E9B000", cursor:"pointer"}} /> 
    </Tooltip>
  </>

  var consultar = 
  <>
    <Tooltip placement="top" title={props.stringTranslate("Botao.Ver")} overlayStyle={{fontSize: "12px"}}>
    <i onClick={() => props.toggle("view", props.dados)} className="far fa-eye ef-pulse-grow" style={{top:"0", marginLeft: "10px", color:"#008F95", cursor:"pointer"}} /> 
    </Tooltip>     
  </>

  var excluir = 
  <>
    <Tooltip placement="top" title={props.stringTranslate("Botao.Excluir")} overlayStyle={{fontSize: "12px"}}>
    <i onClick={() => props.toggle("del", props.dados)} className="far fa-trash-alt ef-pulse-grow" style={{top:"0", marginLeft: "10px", color:"#E24E42", cursor:"pointer"}} />
    </Tooltip>  
  </>
  return (
    <>
    {props.permissoes.incluir ? incluir : null}
    {props.permissoes.consultar ? consultar : null}
    {props.permissoes.alterar ? alterar : null}
    {props.permissoes.excluir ? excluir : null}
    </>
  )
}

function AcoesLotacao (props){
  var incluir = 
  <>
    <Tooltip placement="top" title={props.stringTranslate("EmpresaLS.Secao.add")} overlayStyle={{fontSize: "12px"}}>
    <i onClick={() => props.toggleSecao("add", props.dados)} className="far fa-plus ef-pulse-grow" style={{top:"0", marginLeft: "10px", color:"#1d8cf8", cursor:"pointer"}} />
    </Tooltip>
  </>

  var alterar = 
  <>
    <Tooltip placement="top" title={props.stringTranslate("Botao.Editar")} overlayStyle={{fontSize: "12px"}}>
    <i onClick={() => props.toggle("edit", props.dados)} className="far fa-edit ef-pulse-grow" style={{top:"0", marginLeft: "10px", color:"#E9B000", cursor:"pointer"}} /> 
    </Tooltip>
  </>

  var consultar = 
  <>
    <Tooltip placement="top" title={props.stringTranslate("Botao.Ver")} overlayStyle={{fontSize: "12px"}}>
    <i onClick={() => props.toggle("view", props.dados)} className="far fa-eye ef-pulse-grow" style={{top:"0", marginLeft: "10px", color:"#008F95", cursor:"pointer"}} /> 
    </Tooltip>     
  </>

  var excluir = 
  <>
    <Tooltip placement="top" title={props.stringTranslate("Botao.Excluir")} overlayStyle={{fontSize: "12px"}}>
    <i onClick={() => props.toggle("del", props.dados)} className="far fa-trash-alt ef-pulse-grow" style={{top:"0", marginLeft: "10px", color:"#E24E42", cursor:"pointer"}} />
    </Tooltip>  
  </>
  return(
    <>
    {props.permissoes.incluir ? incluir : null}
    {props.permissoes.consultar ? consultar : null}
    {props.permissoes.alterar ? alterar : null}
    {props.permissoes.excluir ? excluir : null}
    </>
  )
}

function AcoesSecao(props){
  var alterar = 
  <>
    <Tooltip placement="top" title={props.stringTranslate("Botao.Editar")} overlayStyle={{fontSize: "12px"}}>
    <i onClick={() => props.toggle("edit", props.dados)} className="far fa-edit ef-pulse-grow" style={{top:"0", marginLeft: "10px", color:"#E9B000", cursor:"pointer"}} /> 
    </Tooltip>
  </>

  var consultar = 
  <>
    <Tooltip placement="top" title={props.stringTranslate("Botao.Ver")} overlayStyle={{fontSize: "12px"}}>
    <i onClick={() => props.toggle("view", props.dados)} className="far fa-eye ef-pulse-grow" style={{top:"0", marginLeft: "30px", color:"#008F95", cursor:"pointer"}} /> 
    </Tooltip>       
  </>

  var excluir = 
  <>
    <Tooltip placement="top" title={props.stringTranslate("Botao.Excluir")} overlayStyle={{fontSize: "12px"}}>
    <i onClick={() => props.toggle("del", props.dados)} className="far fa-trash-alt ef-pulse-grow" style={{top:"0", marginLeft: "10px", color:"#E24E42", cursor:"pointer"}} />
    </Tooltip>  
  </>
  return(
    <>
    {props.permissoes.consultar ? consultar : null}
    {props.permissoes.alterar ? alterar : null}
    {props.permissoes.excluir ? excluir : null}
    </>
  )
}


class EmpresaLotacaoSecao extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          loading:true,
            dataTable: [],
            tableHeader: ["Nome", "Número Sigla", "Pública", "Bloco/Apto", "Num Vagas", "Latitude", "Longitude", "Ações"],
            tableHeader2:[{
              title: 'Nome',
              dataIndex: 'Nome',
              key: 'NomeEmpresa'||'NomeLotacao'||'NomeSecao',
              width: '30%',
            },
            {
              title: 'Sigla',
              dataIndex: 'Sigla',
              key: 'Sigla',
            //  width: '12%',
            },
            {
              title: 'Pública',
              dataIndex: 'address',
            //  width: '30%',
              key: 'address',
            },
            {
              title: 'Bloco/Apto',
              dataIndex: 'Bloco',
            //  width: '30%',
              key: 'Bloco',
            },
            {
              title: 'Num Vagas',
              dataIndex: 'NumeroVagas',
          //    width: '30%',
              key: 'NumeroVagas',
            },
            {
              title: 'Latitude',
              dataIndex: 'Latitude',
         //     width: '30%',
              key: 'Latitude',
            },
            {
              title: 'Longitude',
              dataIndex: 'Longitude',
           //   width: '30%',
              key: 'Longitude',
            },
            {
              title: 'Ações',
              dataIndex: 'address',
          //    width: '30%',
              key: 'address',
            },
            {
              title: this.stringTranslate("Label.Acoes"),
                    dataIndex: "actions",
                    key: "actions",
                    width:"140px",
                    align: "center",
                    render: (text, record) => {
                        if (record.NomeEmpresa !== undefined){
                          var empresa={
                              "codEmpresa": record.CodEmpresa,
                              "Numero": record.Numero,
                              "NumeroFolha": record.NumeroFolha,
                              "Nome": record.Nome,
                              "CEI": record.CEI,
                              "CNPJ": record.CGC,
                              "Cnae": record.Cnae,
                              "DiaInicioMes": record.DiaInicioMes,
                              "DiaFimMes": record.DiaFimMes,
                              "NumeroVagas": record.NumeroVagas,
                              "Endereco": record.Endereco,
                              "totVagasUso":record.NumeroEmUso,
                              "data": {
                                "nome": record.Nome,
                                "numeroSigla": record.Numero,
                                "publica": "",
                                "blocoApto": "",
                                "numVaga": record.NumeroVagas,
                                "latitude": record.Latitude,
                                "longitude": record.Longitude,
                                "totVagasUso":record.NumeroEmUso,
                                "acoes": null,
                                
                              },
                          }
                          return (
                                  <AcoesEmpresa permissoes={this.permissoes} toggleLotacao={this.chamaModalLotacao} stringTranslate={this.stringTranslate} toggle={this.chamaModalEmpresa} atualizaTable={this.atualizaTable} dados={empresa} />
                              )

                        }
                        else
                        if (record.NomeLotacao !== undefined){ 
                          var lotacao = {
                            "nomeEmpresa": null,
                            "codEmpresa": record.codEmpresa,
                            "codLotacao": record.CodLotacao,
                            "sigla": record.Sigla,
                            "totVagasUso":record.NumeroEmUso,
                            "data": {
                              "nome": record.Nome,
                              "numeroSigla": record.Sigla,
                              "publica": "",
                              "blocoApto": record.Bloco,
                              "numVaga": record.NumeroVagas,
                              "latitude": record.Latitude,
                              "longitude": record.Longitude,
                              "acoes": null,
                              "totVagasUso":record.NumeroEmUso,
                              
                            },
                          }
                          return (
                          <AcoesLotacao permissoes={this.permissoes} toggleSecao={this.chamaModalSecao} toggle={this.chamaModalLotacao} stringTranslate={this.stringTranslate} atualizaTable={this.atualizaTable} dados={lotacao} />
                          )
                        }
                        else if (record.NomeSecao !== undefined){
                          var secao = {
                            "nomeLotacao": null,
                            "codSecao": record.CodSecao,
                            "codLotacao": record.codLotacao,
                            "sigla": record.Sigla,
                            "totVagasUso":record.NumeroEmUso,
                            "data": {
                              "nome": record.Nome,
                              "numeroSigla": record.Sigla,
                              "publica": "",
                              "blocoApto": record.Apartamento,
                              "numVaga": record.NumeroVagas,
                              "latitude": record.Latitude,
                              "longitude": record.Longitude,
                              "totVagasUso":record.NumeroEmUso,
                              "acoes": null,
                            },
                            }
                            return(
                              <AcoesSecao permissoes={this.permissoes} toggle={this.chamaModalSecao} stringTranslate={this.stringTranslate} atualizaTable={this.atualizaTable} dados={secao} />
                            )
                          }
                        



                        // return(
                         
                        //   record.NomeEmpresa !== undefined?(
                        //     <AcoesEmpresa toggleLotacao={this.chamaModalLotacao} stringTranslate={this.stringTranslate} toggle={this.chamaModalEmpresa} atualizaTable={this.atualizaTable} dados={record} />
                        //   ):
                        //   (record.NomeLotacao !== undefined)?(
                        //     <AcoesLotacao toggleSecao={this.chamaModalSecao} toggle={this.chamaModalLotacao} stringTranslate={this.stringTranslate} atualizaTable={this.atualizaTable} dados={record} />
                        //   )
                        //   :
                        //   (record.NomeSecao !== undefined)?(
                        //     <AcoesSecao toggle={this.chamaModalSecao} stringTranslate={this.stringTranslate} atualizaTable={this.atualizaTable} dados={record} />
                        //   ):null 
                        
                        //)
                    }
            }
          ],

            linhaSelecionada: null,
            numEmpresa: null,
            modalEmpresa: false,
            modalLotacao: false,
            modalSecao: false,
            scroll:{
              y : window.innerWidth,
              x : window.innerHeight,
            }
        }
        this.dadosModal = null;
        this.tipoModal = null;
        this.onClickLine = this.onClickLine.bind(this);
        this.atualizaTable = this.atualizaTable.bind(this);
        this.stringTranslate = this.stringTranslate.bind(this);
        this.setCabecalho = this.setCabecalho.bind(this);
        this.imprime = this.imprime.bind(this);
        this.chamaModalEmpresa = this.chamaModalEmpresa.bind(this);
        this.toggleEmpresa = this.toggleEmpresa.bind(this);
        this.chamaModalLotacao = this.chamaModalLotacao.bind(this);
        this.toggleLotacao = this.toggleLotacao.bind(this);
        this.chamaModalSecao = this.chamaModalSecao.bind(this);
        this.toggleSecao = this.toggleSecao.bind(this);
        
        //Permissões de visualização
        this.permissoes = {
          consultar: this.props.operacoes[0] === '*' ? true : false,
          incluir: this.props.operacoes[1] === '*' ? true : false,
          alterar: this.props.operacoes[2] === '*' ? true : false,
          excluir: this.props.operacoes[3] === '*' ? true : false,
        }
    }

    toggleEmpresa(){
      this.setState({modalEmpresa: !this.state.modalEmpresa});
    }

    chamaModalEmpresa(tipo, dados){
      this.dadosModal = dados;
      this.tipoModal = tipo;
      this.toggleEmpresa();
    }

    toggleLotacao(){
      this.setState({modalLotacao: !this.state.modalLotacao});
    }

    chamaModalLotacao(tipo, dados){
      this.dadosModal = dados;
      this.tipoModal = tipo;
      this.toggleLotacao();
    }
    
    toggleSecao(){
      this.setState({modalSecao: !this.state.modalSecao});
    }

    chamaModalSecao(tipo, dados){
      this.dadosModal = dados;
      this.tipoModal = tipo;
      this.toggleSecao();
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

    stringTranslate(id){
        return this.props.intl.formatMessage({id: id});
    }

    onClickLine(object, level){
        this.setState({linhaSelecionada: object})
    }
    
    atualizaTable(){
      this.setState({loading:true});
      const body = {
        "cmd": "listasecaolotacaoempresa",
        "token": sessionStorage.getItem("token"),
      }
      postAdonis(body,'/Empresa/All').then((data) =>{
        if(data.error === undefined){
      //    this.state.dataTable = data.dados;
          this.setState({dataTable: data.dados.empresa,loading:false});
        }
      })
    }

    componentDidMount(){
        this.atualizaTable();
    }

    render(){
     
      this.state.w = window.innerWidth;
        return(
          <>
            <div className="content">
                <Card width= {this.state.w > 400 ? "50%" : "100%"}>
                <CardHeader tag="h4">
                {this.permissoes.incluir ? <><Button type="link" onClick={() => this.chamaModalEmpresa("add", this.dadosModal)} style={{float: "right"}}><i className="fad fa-plus-circle"/>{this.stringTranslate("EmpresaLS.Empresa.add")}</Button></> : null}               
                  <Tooltip placement="top" title={this.stringTranslate("EmpresaLS.imprimir")} overlayStyle={{fontSize: "12px"}}> 
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
                  {this.stringTranslate("EmpresaLS.titulo")}  
                </CardHeader>                   
                    <CardBody style={{marginTop:"10px"}}>
                    <Row>
                    <Col>
                        {/* <div id="table"> */}
                        <Skeleton loading={this.state.loading} active>       
                        <Table size={"small"}  columns={this.state.tableHeader2} dataSource={this.state.dataTable} scroll = {this.state.scroll} />
                        </Skeleton>  
                        {/* </div> */}
                        </Col>
                        </Row>
                    </CardBody>
                </Card>
            </div>
            {this.state.modalEmpresa ? (<ModalEmpresa numEmpresa={this.state.numEmpresa} toggle={this.toggleEmpresa} isOpened={this.state.modalEmpresa} dados={this.dadosModal} tipo={this.tipoModal} atualizaTable={this.atualizaTable} />): null}
            {this.state.modalLotacao ? (<ModalLotacao toggle={this.toggleLotacao} isOpened={this.state.modalLotacao} dados={this.dadosModal} tipo={this.tipoModal} atualizaTable={this.atualizaTable} />): null}
            {this.state.modalSecao ? (<ModalSecao toggle={this.toggleSecao} isOpened={this.state.modalSecao} dados={this.dadosModal} tipo={this.tipoModal} atualizaTable={this.atualizaTable} />): null}
          </>
        )
    }
}

export default injectIntl(EmpresaLotacaoSecao);