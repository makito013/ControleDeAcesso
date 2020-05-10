import React from "react";

// reactstrap components
import {  
  Row,
  Col,
  Collapse,
  Nav,
  UncontrolledTooltip,
  Table,
  CardHeader,
  CardBody,
  CardFooter,
  Card,
  Jumbotron,
  Input
} from "reactstrap";
import { Button, FormGroup, Label, CustomInput  } from 'reactstrap';
import { post, postAdonis } from "utils/api";
import { toast, Slide } from 'react-toastify';

import AsyncSelect from 'react-select/async';
import Select from 'react-select';

import { injectIntl } from "react-intl";
import { Redirect } from "react-router-dom";
import Switch from "react-switch";
import { constants } from "crypto";
import { Tree, Icon, Skeleton, TreeSelect } from 'antd';
import SelectTreeViewNeo from 'components/SelectTreeViewNeo/SelectTreeViewNeo';
import { promises } from "fs";
import { resolve } from "path";
import { reject } from "q";
import { Spin } from "antd"
const {TreeNode} = Tree;
const toastOptions = {
    transition: Slide,
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true
  };

class PermissaoAcessoLocal extends React.Component{
    constructor(props){
        super(props);
        this.state ={
            salvando: false,

            valores:{pesquisa: "",categorias: []},
            locais: [],

            categorias: [],
            local: null,
            pesquisa: null,

            update: false,
            pesquisou: false,

            expand: [],

            keys:{
                empresav:[],
                lotacaov:[],
                secaov:[],
                pessoav:[],
                
              },
            
            checkeds:{local: "", checkeds:[]},
            secoes:[],

            mudouColetor: false,
        }
        this.empresa = [];
        this.lotacao = [];
        this.secao = [];
        this.filhosSecao = [];
        this.selectedKeys = [];
        this.totalCategorias = 0;
        

        this.stringTranslate = this.stringTranslate.bind(this);
        this.atualizaCategorias = this.atualizaCategorias.bind(this);
        this.atualizaLocais = this.atualizaLocais.bind(this);
        this.mostrartodos = this.mostrartodos.bind(this);
        this.consultaDadosELT = this.consultaDadosELT.bind(this);
        this.genTreeNode = this.genTreeNode.bind(this);
        this.pesquisar = this.pesquisar.bind(this);
        this.setValores = this.setValores.bind(this);
        this.expandAtualizar = this.expandAtualizar.bind(this);
        this.expand = this.expand.bind(this);
        this.handleSelectLocal = this.handleSelectLocal.bind(this);
        // this.onPessoas = this.onPessoas.bind(this);
        this.handleClickSalvar = this.handleClickSalvar.bind(this);
        this.setaSecoes = this.setaSecoes.bind(this);
        this.setMudouColetor = this.setMudouColetor.bind(this);
        this.setSelectedKeys = this.setSelectedKeys.bind(this);
    }

    
    stringTranslate(id){
        return this.props.intl.formatMessage({id: id});
    }

    componentDidMount(){
        this.atualizaCategorias();
        this.atualizaLocais();
        this.consultaDadosELT();
    }

    mostrartodos(){
        this.state.valores.pesquisa = "";
        this.filhosSecao=[];
        this.setState({pesquisa:this.state.pesquisa,expand: [], update:false,pesquisou:false});
    }

    limpaValores(campos){

    for(var i = 0; i < campos.length; i++){      
        this.state.valores[campos[i]] = {value: "", label: ""}      
    }
    this.setState({valores: this.state.valores})
    }

    consultaDadosELT(){
        const body = {
            "cmd": "listasecaolotacaoempresa",
            "token": sessionStorage.getItem("token"),
        }
        postAdonis(body, '/Empresa/Lista').then((data) =>{        
            if(data.retorno){  
                this.secao = data.dados.secao;  
                this.lotacao= data.dados.lotacao;    
                this.empresa = data.dados.empresa;    
                this.setState({reload: !this.state.reload,update:true}); // para recarregar os valores recebido do servidor para o select
            }else{
                if(this.contErro++ >= 3){
                    this.contErro = 0;
                    toast.dismiss();
                    toast.error(this.stringTranslate("Erro.Servidor"), toastOptions);
                }            
                else
                    this.consultaDadosELT()         
            } 
          
        }).catch((error) => {
            if(this.contErro++ >= 3){
                this.contErro = 0;
                toast.dismiss();
                toast.error(this.stringTranslate("Erro.Servidor"), toastOptions);
            }            
            else
                this.consultaDadosELT()
        })
    }

    genTreeNode = (id,title) => {
        return {
          key: id,
          value: id,
          title: title,
          isLeaf: false,
          
        };
    };

    pesquisar(){
        if(this.state.valores["pesquisa"] === ""){
            this.state.update= false;
            this.state.pesquisou = false;
            this.state.expand=[];
            this.filhosSecao =[];
            this.setState({pesquisou:this.state.pesquisou,update: this.state.update,expand: this.state.expand});  
        }
        else if((this.state.valores["pesquisa"] !== "") || 
        ((this.state.valores["categoria"] !==undefined) &&
        (this.state.valores["categoria"].length > 0 ))){
            this.setState({loadingButtonPesquisar: true});
            const body={
                    cmd:"gerarArvoredePesquisa",
                    nome: this.state.valores["pesquisa"],
            
                    categoria: this.state.valores["categoria"] !== undefined ? this.state.valores["categoria"].length === this.totalCategorias ? "all" : this.state.valores["categoria"] : null,
                    incluirresidente: this.state.valores["incluirresidente"] !== undefined ? this.state.valores["incluirresidente"].value : true,
                    incluirpreautorizado: this.state.valores["incluirpreautorizado"] !== undefined ? this.state.valores["incluirpreautorizado"].value : true,
                    incluirprecisaliberacao: this.state.valores["incluirprecisaliberacao"] !== undefined ? this.state.valores["incluirprecisaliberacao"].value : false,
                    incluirnaoresidenteautorizado: this.state.valores["incluirnaoresidenteautorizado"] !== undefined ? this.state.valores["incluirnaoresidenteautorizado"].value : true,
                    incluirinativos: this.state.valores["incluirinativos"] !== undefined ? this.state.valores["incluirinativos"].value : false,
                    qualquerparte: this.state.valores["qualquerparte"] !== undefined ? this.state.valores["qualquerparte"].value : false,
                    token:sessionStorage.getItem("token"),
            }
          postAdonis(body, '/Geral/GerarArvoredePesquisa').then(lista =>{     
            this.setState({loadingButtonPesquisar: false});
            if(lista.error === undefined)
            {
                var filhosSecao= lista.dados;
                this.state.expand=[];
                this.filhosSecao =[];
                lista.dados.forEach((item) => {
                    if(this.filhosSecao[item.codSecao] === undefined){
                        this.filhosSecao[item.codSecao]= [];
                    }
                    (this.genTreeNode(item.codigo,item.nome))
                    this.filhosSecao[item.codSecao].push(this.genTreeNode(item.codigo,item.nome));
                
                    this.state.expand.push((item.codigo));
                })
                //   this.reloadArvore();
                if  (lista.dados.length >0){
                    this.state.update= true;
                    this.state.pesquisou = true;
                }
                else 
                {
                    this.state.update= false;
                    this.state.pesquisou = false;
                }
    
                this.setState({pesquisou:this.state.pesquisou,update: this.state.update,expand: this.state.expand});            
            }                
            else
            {
                this.state.mensagemErro = this.stringTranslate("Liberacao.erro");
                this.redirect();
            } 
            }).catch(e => {
                this.setState({loadingButtonPesquisar: false});
            })
        }
    }

    setValores(keys){
        console.log(keys);
        var empresav=[];
        var lotacaov=[];
        var secaov=[];
        var pessoav=[];
        keys.forEach(function (key){
            if (key.indexOf("empresa") > 0)
                empresav.push(parseInt(key.replace(/-empresa/gi,"")));
            else if (key.indexOf("lotacao") > 0)
                lotacaov.push(parseInt(key.replace(/-lotacao/gi,"")));
            else if (key.indexOf("secao") > 0)
                secaov.push(parseInt(key.replace(/-secao/gi,"")));
            else 
                pessoav.push(parseInt(key));
        })
        this.state.keys["empresav"]=empresav.length ===0 ? "":empresav.toString(); 
        this.state.keys["lotacaov"]=lotacaov.length ===0  ? "": lotacaov.toString();
        this.state.keys["secaov"]=secaov.length ===0  ? "":secaov.toString();
        this.state.keys["pessoav"]=pessoav.length ===0  ? "":pessoav.toString();
    }
    

    atualizaLocais(){
        let body1 = {
            "cmd": "consultaLocaisAcesso",
            "token": sessionStorage.getItem("token"),
        }
        postAdonis(body1, '/LocalAcesso/Index').then((data1) => {
            if (data1.error === undefined){
                var data = data1.dados;
                var dataTable = [];
                var localAcesso;
                data.map((prop) => {
                    localAcesso = {
                        "codLocal": prop.CODLOCALACESSO,
                        "nome": prop.NOME,
                    }
                    dataTable.push(localAcesso);
                })
                this.state.locais = dataTable;
                this.setState({locais: this.state.locais});
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
    }

    atualizaCategorias(){
        const body = {
            "cmd": "listacategoria",
            "token": sessionStorage.getItem("token"),
        }
        postAdonis(body, '/CategoriaPessoa/Index').then((dato) =>{
            if (dato.error === undefined){
                var data = dato;
                var dataTable = [];
                var filhos = [];
                var pai = [];
                var todos = [];
                data.dados.map((categoria) =>{
                    if(Boolean(categoria.codCategoriaSuperior) === false)
                        pai.push(categoria);
                    else{
                        var filho = {
                            "pai": categoria.codCategoriaSuperior,
                            "title": categoria.Nome,
                            "value": categoria.codCategoriaPessoa,
                            "key": categoria.codCategoriaPessoa,
                        };
                        filhos.push(filho);
                    }
                    todos.push(categoria.codCategoriaPessoa);
                    this.totalCategorias ++;
                });
                pai.map((categoria) =>{
                    var mFilhos = [];
                    for(var i = 0, j = filhos.length; i < j; i++){
                        if (filhos[i].pai === categoria.codCategoriaPessoa)
                            mFilhos.push(filhos[i]);
                    }
                    var obj = {
                        "title": categoria.Nome,
                        "value": categoria.codCategoriaPessoa,
                        "children": mFilhos,
                        "key": categoria.codCategoriaPessoa,
                    }
                    dataTable.push(obj);
                })
                this.state.valores["categoria"] = todos;
                this.state.categorias = dataTable;
                this.setState({categorias: this.state.categorias});
            }else{
                toast.error("Error: "+dato.msg, {
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

    expandAtualizar(expand){
        this.setState({expand:expand})
    }

    expand(){
        return this.state.expand;
    }

    onStartPesquisa = value => {
        this.state.valores["pesquisa"] = value.target.value;
        this.setState({
          valores:  this.state.valores
        });
    };

    handleChangeSelect(e, key){
        this.state.valores[key] = e;
        this.setState({valores: this.state.valores})
    }  

    handleSelectLocal(selectedKeys, e){
       this.state.mudouColetor = false;
       this.selectedKeys = selectedKeys;
       if (this.selectedKeys){
        const body = {
                "cmd": "consultaPermissaoLocais",
                "token": sessionStorage.getItem("token"),
                "codLocal": selectedKeys,
            }
            postAdonis(body, '/PermissaoAcessoLocal/Consultar').then((data) => {
                if (data.error === undefined){
                    var data1 = data.dados;
                    // var checkedsAux = [];
                    // for (var i = 0, j = data1.length; i < j; i ++){
                    //     checkedsAux.push(data1[i].CODSECAO+"-secao");
                    //     for (var k = 0, l = this.state.secoes.length; k < l; k++){
                    //         if (data1[i].CODSECAO === parseInt(this.state.secoes[k].value)){
                    //             checkedsAux.pop();
                    //             for (var m = 0, n = this.state.secoes[k].children.length; m < n; m++){
                    //                 for (var o = 0, p = this.state.checkeds.checkeds.length; o < p; o++){
                    //                     if (this.state.secoes[k].children[m].value === this.state.checkeds.checkeds[o]){
                    //                         checkedsAux.push(this.state.secoes[k].children[m].value)
                    //                     }
                    //                 }
                    //             }
                    //         }
                    //     }
                    // }
                    var checkedsAux1 = data1.map((prop) => String(prop.CODSECAO)+'-secao');
                    this.state.checkeds.local = selectedKeys[0];
                    this.state.checkeds.checkeds = checkedsAux1;
                    this.setState({checkeds: this.state.checkeds});
                }else{
                    toast.error(data.msg, {
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
    }

    setaSecoes(secoes){
        if (secoes !== this.state.secoes)
            this.state.secoes = secoes;
    }

    setMudouColetor(val){
        this.state.mudouColetor = val;
    }

    handleClickSalvar(){
        if (!this.selectedKey){
            this.state.salvando = true;
            this.setState({salvando: this.state.salvando});
            const body = {
                cmd: "gravaPermissaoLocais",
                token: sessionStorage.getItem("token"),
                codLocal: this.selectedKeys,
                itensbusca: {
                    empresav: this.state.keys.empresav.toString(),
                    lotacaov: this.state.keys.lotacaov.toString(),
                    pessoav: this.state.keys.pessoav.toString(),
                    secaov: this.state.keys.secaov.toString(),
                },
            }
            postAdonis(body, '/PermissaoAcessoLocal/Gravar').then((data) =>{
                if (data.error === undefined && data.dados.error === undefined){
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
                    var msg = data.msg === undefined ? data.dados.error : data.msg;
                    toast.error("Error: "+msg, {
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
                this.state.salvando = false;
                this.setState({salvando: this.state.salvando});
            })
        }else{
            var msg = this.stringTranslate("Erro.FaltaColetor");
            toast.error("Error: "+msg, {
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
    }

    // onPessoas(sel){
    //     let local = this.selectedKeys[0];
    //     return new Promise((resolve, reject) =>{
    //         const body = {
    //             "cmd": "consultaPermissaoLocaisPessoa",
    //             "token": sessionStorage.getItem("token"),
    //             "codLocal": local,
    //             "codSecao": sel,
    //         }
    //         post(body).then((data) =>{
    //             resolve({checked: data.dados.Pessoas, secao: sel});
    //         })
    //     })
    // }

    setSelectedKeys(val){
        this.state.checkeds.checkeds = val;
        this.setState({checkeds : this.state.checkeds});
    }

    render(){
        return(<>
            <div className="content">
                <Row>
                    <Col>
                        <Card>
                            <CardHeader>
                                {/* <Nav 
                                onClick={this.imprime}
                                block 
                                id="impressaoV"
                                className="fad fa-print" 
                                style={{ color:"grey", 
                                background:"transparent", 
                                fontSize:"20px",
                                margin:"8px 12px 0 12px", 
                                padding:"0", 
                                maxWidth:"fit-content",
                                float: "right",
                                cursor: "pointer"}} />
                                <UncontrolledTooltip placement="top" target="impressaoV">       
                                {this.stringTranslate("Autorizado.Pesquisar.Imprimir")}
                                </UncontrolledTooltip>     */}
                                {this.stringTranslate("Routes.Ajustes3")}  
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col md="6">
                                        <FormGroup>                      
                                        <Label>{this.stringTranslate("Veiculo.Pesquisar")}</Label>                        
                                        <Input type="text"
                                            name= "pesquisa" 
                                            size="large"
                                            value= {this.state.valores["pesquisa"]}
                                            onChange={this.onStartPesquisa}
                                            type="TextArea"
                                            id="pesquisa"
                                        />                        
                                        </FormGroup>
                                    </Col>
                                    <Col md={4}> 
                                        <FormGroup> 
                                        <Label for="categoria">{this.stringTranslate("Autorizado.Modal.Categoria")}</Label>  
                                        <TreeSelect     
                                            value= {this.state.valores["categoria"]}
                                            onChange= {(value) => this.handleChangeSelect(value, "categoria")}
                                            treeCheckable= {true}
                                            searchPlaceholder= 'Selecione um Valor'
                                            showSearch= {true}
                                            size= "large"
                                            style= {{ width: "100%", }}
                                            dropdownStyle={{ maxHeight: 220, overflow: 'auto' }}
                                            maxTagCount= {0}
                                            maxTagPlaceholder={(e) => this.totalCategorias === e.length ? this.stringTranslate("Botao.Todos") : e.length + " " + this.stringTranslate("Label.Selecionados")}
                                            treeData={this.state.categorias}     
                                            id="categoria"
                                            showCheckedStrategy = "SHOW_ALL"           
                                            />                        
                                        </FormGroup>
                                    </Col>
                                    <Col md="2">
                                        <Button block color="primary" style={{float:"right", marginLeft:"10px", top: "23px"}} onClick={() => this.pesquisar()}>{this.stringTranslate("PermissaoLocal.pesquisar")}</Button>
                                    </Col>
                                </Row>            
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Card style={{maxHeight:"500px",overflow: 'auto', marginTop: "20px", paddingTop: "10px"}}>
                            <CardBody>     
                                <SelectTreeViewNeo 
                                setSelectedKeys={this.setSelectedKeys} 
                                setMudouColetor={this.setMudouColetor} 
                                mudouColetor={this.state.mudouColetor} 
                                setaSecoes={this.setaSecoes} 
                                checkeds={this.state.checkeds} 
                                mostrartodos={this.mostrartodos} 
                                setValores={this.setValores} 
                                onPesquisa={this.pesquisar} 
                                arrayempresa={this.empresa} 
                                arraylotacao={this.lotacao} 
                                expandAtualizar={this.expandAtualizar} 
                                arraysecao={this.secao} 
                                arrayFilhos={this.filhosSecao} 
                                update={this.state.update} 
                                pesquisou={this.state.pesquisou}
                                expand={this.expand}
                                codigosCarregados={this.state.checkeds.checkeds}/>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col>
                        <Card style={{maxHeight:"500px",overflow: 'auto', marginTop: "20px", paddingTop: "10px"}}>
                        <CardHeader>{this.stringTranslate("PermissaoLocal.locais.titulo")}</CardHeader>
                            <CardBody>   
                                <TreeSelect     
                                    onChange= {this.handleSelectLocal}
                                    showSearch= {true}
                                    size= "large"
                                    style= {{ minWidth: "100%"}}
                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }} 
                                >  
                                    {this.state.locais.map((prop) =>{
                                        return(
                                        <TreeNode value={prop.codLocal} title={prop.nome} key={prop.codLocal}></TreeNode>
                                        )
                                    })}
                                </TreeSelect>
                            </CardBody>
                            <CardFooter>
                                <Spin spinning={this.state.salvando} delay={0}> 
                                    <Button color="primary" onClick={this.handleClickSalvar} block>{this.stringTranslate("PermissaoLocal.els.salvar")}</Button>
                                </Spin>
                            </CardFooter>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>)
    }
}

export default injectIntl(PermissaoAcessoLocal);