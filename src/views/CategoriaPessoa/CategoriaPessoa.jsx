import React from "react";
import Tabela from "../../components/Tabela/Tabela"
import ModalCategoriaPessoa from "./ModalCategoriaPessoa"
import { toast, Slide } from 'react-toastify';
import {post,postAdonis} from "../../utils/api.js"
import { injectIntl } from "react-intl";
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Nav,
} from "reactstrap";
import { Tooltip, Button } from "antd";

function AcoesCategoria(props){
    return(
        <>
            {props.permissoes.incluir ?
            <Tooltip placement="top" title={props.stringTranslate("Categoria.Modal.AdicionarSub")} overlayStyle={{fontSize: "12px"}}>
            <i onClick={()=>props.toggle("addSub", props.dados)} className="far fa-plus ef-pulse-grow" style={{top:"0", marginLeft: "10px", color:"#1d8cf8", cursor:"pointer"}} />
            </Tooltip> : null}
            {props.permissoes.consultar ?
            <Tooltip placement="top" title={props.stringTranslate("Botao.Ver")} overlayStyle={{fontSize: "12px"}}>
            <i onClick={()=>props.toggle("view", props.dados)} className="far fa-eye ef-pulse-grow" style={{top:"0", marginLeft: "10px", color:"#008F95", cursor:"pointer"}} /> 
            </Tooltip> : null}
            {props.permissoes.alterar ?  
            <Tooltip placement="top" title={props.stringTranslate("Botao.Editar")} overlayStyle={{fontSize: "12px"}}>
            <i onClick={()=>props.toggle("edit", props.dados)} className="far fa-edit ef-pulse-grow" style={{top:"0", marginLeft: "10px", color:"#E9B000", cursor:"pointer"}} /> 
            </Tooltip> : null}
            {props.permissoes.excluir ? 
            <Tooltip placement="top" title={props.stringTranslate("Botao.Excluir")} overlayStyle={{fontSize: "12px"}}>
            <i onClick={()=>props.toggle("del", props.dados)} className="far fa-trash-alt ef-pulse-grow" style={{top:"0", marginLeft: "10px", color:"#E24E42", cursor:"pointer"}} />
            </Tooltip> : null}

            {/* <ModalCategoriaPessoa atualizaTable={props.atualizaTable} tipo="addSub" dados={props.dados} />
            <ModalCategoriaPessoa atualizaTable={props.atualizaTable} tipo="edit" dados={props.dados} />
            <ModalCategoriaPessoa atualizaTable={props.atualizaTable} tipo="del" dados={props.dados} /> */}
        </>
    )
}

function AcoesSubCategoria(props){
    return(
        <>   
            {props.permissoes.consultar ?
            <Tooltip placement="top" title={props.stringTranslate("Botao.Ver")} overlayStyle={{fontSize: "12px"}}>
            <i onClick={()=>props.toggle("view", props.dados)} className="far fa-eye ef-pulse-grow" style={{top:"0", marginLeft: "30px", color:"#008F95", cursor:"pointer"}} /> 
            </Tooltip> : null}

            {props.permissoes.alterar ?
            <Tooltip placement="top" title={props.stringTranslate("Botao.Editar")} overlayStyle={{fontSize: "12px"}}>
            <i onClick={()=>props.toggle("edit", props.dados)} className="far fa-edit ef-pulse-grow" style={{top:"0", marginLeft: "10px", color:"#E9B000", cursor:"pointer"}} /> 
            </Tooltip> : null} 
            
            {props.permissoes.excluir ?
            <Tooltip placement="top" title={props.stringTranslate("Botao.Excluir")} overlayStyle={{fontSize: "12px"}}>
            <i onClick={()=>props.toggle("del", props.dados)} className="far fa-trash-alt ef-pulse-grow" style={{top:"0", marginLeft: "10px", color:"#E24E42", cursor:"pointer"}} />
            </Tooltip> : null}
        </>
    )
}


class CadastroPessoa extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            dataTable: [],
            tableHeader: ["Nome", "Ações"],
            linhaSelecionada: null,
            modalCategoria: false,
        }
        this.tipo = null;
        this.dadosModal = null;
        this.onClickLine = this.onClickLine.bind(this);
        this.atualizaTable = this.atualizaTable.bind(this);
        this.toggleCategoria = this.toggleCategoria.bind(this);
        this.chamaModalCategoria = this.chamaModalCategoria.bind(this);
        this.stringTranslate = this.stringTranslate.bind(this);
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

    toggleCategoria(){
        this.setState({modalCategoria: !this.state.modalCategoria});
    }
  
    chamaModalCategoria(tipo, dados){
        this.dadosModal = dados;
        this.tipo = tipo;
        this.toggleCategoria();
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
        const body = {
            "cmd": "listacategoria",
            "token": sessionStorage.getItem("token"),
        }
        postAdonis(body,'/CategoriaPessoa/Index').then((dato) =>{
            if (dato.retorno){
                var data = dato;
                var dataTable = [];
                var filhos = [];
                var pai = [];
                data.dados.map((categoria) =>{
                    if(Boolean(categoria.codCategoriaSuperior) === false)
                        pai.push(categoria);
                    else{
                        var filho = {
                            "codCategoriaSuperior": categoria.codCategoriaSuperior,
                            "codCategoriaPessoa": categoria.codCategoriaPessoa,
                            "data":{
                                "nome": categoria.Nome,
                                "acoes": null,
                            },
                            "expand": false,
                            "child": [],
                            "key": categoria.codCategoriaPessoa,
                        };
                        filho.data.acoes = <AcoesSubCategoria permissoes={this.permissoes} toggle={this.chamaModalCategoria} stringTranslate={this.stringTranslate} atualizaTable={this.atualizaTable} dados={filho} />
                        filhos.push(filho);
                    }
                });
                pai.map((categoria) =>{
                    var mFilhos = [];
                    for(var i = 0, j = filhos.length; i < j; i++){
                        if (filhos[i].codCategoriaSuperior === categoria.codCategoriaPessoa)
                            mFilhos.push(filhos[i]);
                    }
                    var obj = {
                        "codCategoriaPessoa": categoria.codCategoriaPessoa,
                        "data":{
                            "nome": categoria.Nome,
                            "acoes": null,
                        },
                        "expand": false,
                        "child": mFilhos,
                        "key": categoria.codCategoriaPessoa,
                    }
                    obj.data.acoes = <AcoesCategoria permissoes={this.permissoes} toggle={this.chamaModalCategoria} stringTranslate={this.stringTranslate} atualizaTable={this.atualizaTable} dados={obj} />;
                    dataTable.push(obj);
                })
                this.setState({dataTable: dataTable});
                console.log(this.state.dataTable);
            }else{
                toast.error("Error: "+dato.mensagem, {
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

    componentDidMount(){
        this.atualizaTable();
    }

    render(){
        return(
            <>
            <div className="content">
                <Card>
                <CardHeader tag="h4">
                  {this.permissoes.incluir ? <Button type="link" onClick={() => this.chamaModalCategoria("add", this.dadosModal)} style={{float: "right"}}><i className="fad fa-plus-circle"/>{this.stringTranslate("Categoria.Modal.AdicionarCategoria")}</Button> : null}            
                  <Tooltip placement="top" title={this.stringTranslate("Categoria.imprimir")} overlayStyle={{fontSize: "12px"}}> 
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
                    {this.stringTranslate("Categoria.titulo")}
                  
                </CardHeader>
                    <CardBody style={{marginTop:"10px"}}>
                    <Row>
                    <Col>
                        <div id="table">
                        <Tabela onClickLine={this.onClickLine} tableHeader={this.state.tableHeader} dataTable={this.state.dataTable} />
                        </div>
                        </Col>
                        </Row>
                    </CardBody>
                </Card>
            </div>
            {this.state.modalCategoria ? <ModalCategoriaPessoa isOpened={this.state.modalCategoria} toggle={this.toggleCategoria} atualizaTable={this.atualizaTable} tipo={this.tipo} dados={this.dadosModal} /> : null}
            </>
        )
    }
}

export default injectIntl(CadastroPessoa);