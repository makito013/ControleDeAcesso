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
  CardFooter,
  
  Collapse,
  Nav,
  UncontrolledTooltip,
} from "reactstrap";
import { FormGroup, Label, Input, CustomInput } from 'reactstrap';
import { Modal } from "antd";
import { post } from "utils/api";
import InputMask from 'react-input-mask';
import { Button, Table } from 'antd';
import { toast, Slide } from 'react-toastify';
import { injectIntl } from "react-intl";
import { Tree, Skeleton, TreeSelect, Spin } from 'antd';
import { Select, Switch, DatePicker, Row, Col } from 'antd';
import SelectTreeViewNeo from '../../components/SelectTreeViewNeo/SelectTreeViewNeo';
import { pegaData } from "../../components/dataHora"
import { callbackify } from "util";
import { postAdonis } from "../../utils/api";
var moment = require('moment');

const { Option } = Select;
const { RangePicker } = DatePicker;
const toastOptions = {
  transition: Slide,
  position: "top-center",
  autoClose: 5000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: true
};

const vazio = {value: "", label: ""};                
class AcessosColetor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          valores: {"idJornadaAntiga" : "", "idJornada" : "", "indeterminado" : false, "historica": false, "prazo":"", "dataInicio" : "", "selectJornada": 0, "historica": false}, 
          categorias: [{title: "Aguarde...", value:"", disabled:true}],
          loading: true,
          loadingCategoria: true,
          loadingJornadas: true,
          loadingLocais: true,
          toggleFiltro:[],
          loadingButtonPesquisar: false,
          loadingButtonAlterar: false,
          update: true,
          autoExpandParent:false,
          expand: [],
          arvore: "",
          pesquisou: false,
          checkedKeys:[],
          locais: [{value: 9999, title: "Todos"}],
          categorias: [{title: "Aguarde...", value:"", disabled:true}],
          keys:{
            empresav:[],
            lotacaov:[],
            secaov:[],
            pessoav:[],
          },          
          startValue: null,
          endValue: null,
          endOpen: false,
          localselecionado:1,
          locale: sessionStorage.getItem("locale"),
          modal: false,
          dadosRelatorio: [],
        };
        this.state.toggleFiltro["visitantes"] = this.state.toggleFiltro["desativados"] = true; 
        this.contErro = 0;
        this.empresa = [];
        this.totalempresa=0;
        this.lotacao = [];
        this.secao = [];
        this.locaisAcesso = [];
        this.filhosSecao = [];        
        this.pesquisar = this.pesquisar.bind(this);
        this.stringTranslate = this.stringTranslate.bind(this);   
        this.loadCategorias = this.loadCategorias.bind(this);   
        this.loadLocais = this.loadLocais.bind(this);  
        this.consultaDadosELT = this.consultaDadosELT.bind(this);
        this.reloadArvore = this.reloadArvore.bind(this);
        this.onLoadData = this.onLoadData.bind(this);
        this.handleChangeSelect = this.handleChangeSelect.bind(this);
        this.onChange = this.onChange.bind(this);
        this.renderSelect = this.renderSelect.bind(this);
        this.mostrartodos = this.mostrartodos.bind(this);
        this.expand = this.expand.bind(this);
        this.expandAtualizar= this.expandAtualizar.bind(this);
        this.setValores =  this.setValores.bind(this);
        this.toggleCollapse = this.toggleCollapse.bind(this);
        this.setModal = this.setModal.bind(this);
        this.totalCategorias = 0;
        this.loadCategorias();
        this.consultaDadosELT(); 
        this.loadLocais();  
        
        this.colunasRelatorio = [
          {
            title: this.stringTranslate("Label.LocalAcesso"),
            dataIndex: "localAcesso",
            key: "localAcesso"
          },
          {
            title: this.stringTranslate("Label.Coletor"),
            dataIndex: "nColetor",
            key: "nColetor",
          },
          {
            title: this.stringTranslate("Label.Direcao"),
            dataIndex: "direcao",
            key: "direcao",
          },
          {
            title: this.stringTranslate("Label.Codigo"+" - "+this.stringTranslate("Label.Pessoa")),
            dataIndex: "pessoa",
            key: "pessoa"
          },
          {
            title: this.stringTranslate("Label.Data"),
            dataIndex: "data",
            key: "data"
          },
          {
            title: this.stringTranslate("Label.Horario"),
            dataIndex: "horario",
            key: "horario"
          }
        ];
    }

    geraRelatorio(){
      const pessoas = {
        "pessoav": this.state.keys.pessoav.toString(),
        "secaov": this.state.keys.secaov.toString(),
        "lotacaov": this.state.keys.lotacaov.toString(),
        "empresav": this.state.keys.empresav.toString(),
      };
      const body = {
        "cmd": "acessosPorColetor",
        "token": sessionStorage.getItem("token"),
        "pessoas": pessoas,
        "locaisAcesso": this.state.valores.locaisAcesso !== undefined ? this.state.valores.locaisAcesso.toString() : null,
        "dataInicio":this.state.valores["prazo"][0] !== undefined ? this.state.valores["prazo"][0].format("DD-MM-YYYY") : null,
        "dataFim":this.state.valores["prazo"][1] !== undefined ? this.state.valores["prazo"][1].format("DD-MM-YYYY") : null,
        "incluirVisitantes":this.state.toggleFiltro.visitantes !== undefined ? this.state.toggleFiltro.visitantes : null,
        "incluirDesativados":this.state.toggleFiltro.desativados !== undefined ? this.state.toggleFiltro.desativados : null,
      };

      postAdonis(body, '/Relatorio/AcessosPorColetor').then((data) =>{
        console.log(data);
        this.state.dadosRelatorio = [];
        data.dados.map((prop) =>{
          const dir = prop.Direcao === 1 ? "Entrada" : "Saida";
         // var dataHora = moment(prop.DataHora, "AAAA-MM-DD hh:mm:ss").format('hh:mm:ss');
          this.state.dadosRelatorio.push(
            {
              key: prop.CodAcesso,
              localAcesso: prop.localAcesso,
              nColetor: prop.numColetor+" - "+prop.coletor,
              direcao: dir,
              pessoa: prop.codPessoa+" - "+prop.pessoa,
              data: moment(prop.DataHora).utc().format('DD-MM-YYYY'),
              horario: moment(prop.DataHora).utc().format('HH:mm:ss')
            }
          )
        })
        this.setState({dadosRelatorio: this.state.dadosRelatorio});
        this.setModal();
      });
    }

    toggleCollapse(e, index){
       this.state.valores[index] = e;
       this.setState({valores: this.state.valores})
    }

    setModal(){
      this.state.modal = !this.state.modal;
      this.setState({modal: this.state.modal});
    }

    expand(){
      return this.state.expand;
    }
    
    expandAtualizar(expand){
      this.setState({expand:expand})
  
    }

    setValores(keys){
      console.log(keys);
      var empresav=[];
      var lotacaov=[];
      var secaov=[];
      var pessoav=[];
      keys.forEach(function (key){
        if (String(key).indexOf("empresa") > 0)
          empresav.push(parseInt(key.replace(/-empresa/gi,"")));
        else
        if (String(key).indexOf("lotacao") > 0)
          lotacaov.push(parseInt(key.replace(/-lotacao/gi,"")));
        else 
        if (String(key).indexOf("secao") > 0)
          secaov.push(parseInt(key.replace(/-secao/gi,"")));
        else 
          pessoav.push(parseInt(key));
      })
      this.state.keys["empresav"]=empresav; 
      this.state.keys["lotacaov"]=lotacaov ;
      this.state.keys["secaov"]=secaov ;
      this.state.keys["pessoav"]=pessoav ;
      console.log(this.state.keys);
    }

    mostrartodos(){
      this.state.valores["pesquisa"] = "";

      this.filhosSecao=[];
      this.setState({valores:this.state.valores,expand: [], update:false,pesquisou:false});
    }
    limpaValores(campos){
  
      for(var i = 0; i < campos.length; i++){      
        this.state.valores[campos[i]] = {value: "", label: ""}      
      }
      this.setState({valores: this.state.valores})
    }

    stringTranslate(id){
        return this.props.intl.formatMessage({id: id});
    }

    handleChangeSelect(e, key){
        if(key === "selectJornada")
            this.state.valores["idJornadaAntiga"] = "";
        else if(key === "locaisAcesso" && e.indexOf(9999) !== -1 ){
            this.state.valores.locaisAcesso = [];
            this.state.locais.map((prop) => { 
                if(prop.value !== 9999)              
                    this.state.valores.locaisAcesso.push(prop.value)
            })
            this.setState({valores: this.state.valores});
            return true;
        }
        this.state.valores[key] = e;
        this.setState({valores: this.state.valores});
    }

    onToggled(toggle){
      this.state.toggleFiltro[toggle] = !this.state.toggleFiltro[toggle];
      this.setState({toggleFiltro: this.state.toggleFiltro});
    }

    renderSelect(){
        if (this.secao.length !== 0 && this.lotacao.length !== 0 && this.empresa.length !== 0  ){
          return ( <SelectTreeViewNeo mostrartodos={this.mostrartodos} setValores={this.setValores} onPesquisa={this.pesquisar} arrayempresa={this.empresa} arraylotacao={this.lotacao} expandAtualizar={this.expandAtualizar} arraysecao={this.secao} arrayFilhos={this.filhosSecao} update={this.state.update} pesquisou={this.state.pesquisou} expand={this.expand()}/>)      // return ( <SelectTreeViewNeo treeData={this.state.arvore} arrayempresa={this.empresa} arraylotacao={this.lotacao}  
          //  arraysecao={this.secao} arrayFilhos={this.filhosSecao} update = {this.state.update} pesquisou={this.state.pesquisou} expand={this.state.expand}/>)
        }
        else 
        return null;
      
      }

    onChange(e){
      this.state.valores[e.target.name] = e.target.value;
      this.setState({valores: this.state.valores});
    }

    loadLocais(){
        let body = {
            cmd: "consultaLocaisAcesso",
            token: sessionStorage.getItem("token"),
        }
        postAdonis(body, '/LocalAcesso/Index').then((data) => {
            if (data.retorno){
                var data = data.dados;
                var dataTable = [{value: 9999, title: "TODOS"}];
                data.map((prop) => {
                    dataTable.push({value: parseInt( prop.CODLOCALACESSO), title: prop.NOME})
                })
                this.state.locais = dataTable;
                this.state.loadingLocais = false;
                this.setState({loadLocais: false});
                //this.setState({locais: this.state.locais, loadLocais: false});
            }else{
                if(this.contErro++ >= 3){
                    this.contErro = 0;
                    toast.dismiss();
                    toast.error(this.stringTranslate("Erro.Servidor"), toastOptions);
                  }            
                  else
                    this.loadLocais() 
              }
        }).catch((error) => {
            if(this.contErro++ >= 3){
              this.contErro = 0;
              toast.dismiss();
              toast.error(this.stringTranslate("Erro.Servidor"), toastOptions);
            }            
            else
              this.loadLocais()
          }) 
    }

    loadCategorias(){       
      const body={
        cmd:"listacategoria",          
        token: sessionStorage.getItem("token"),
      }
      postAdonis(body, '/CategoriaPessoa/Index').then(lista =>{    
        if(lista.error === undefined)
        {      
          // new Promise(resolve => {     
            this.contErro = 0; 
            var arrayPai = [];
            var arrayFilho = [];
            var padrao = [];
            var array = lista.dados.map((item, key) => { 
                this.totalCategorias++;                 
                if(item.codCategoriaSuperior === null)
                    arrayPai.push({value: parseInt(item.codCategoriaPessoa), title: item.Nome})
                else
                    arrayFilho.push({value: parseInt(item.codCategoriaPessoa), key: item.codCategoriaPessoa, title: item.Nome, pai: parseInt(item.codCategoriaSuperior)})    
                    
                padrao.push(parseInt(item.codCategoriaPessoa))            
                
            })                      
            var groupedOptions = arrayPai.map((item) => {
  
                var filhos = [];
                arrayFilho.forEach(function(value){
                    if(value.pai === item.value)
                        filhos.push({value: value.value, key: value.value, title: value.title})
                })             
  
                return {value: item.value, key: item.value, title: item.title, children: filhos};
            })
            this.state.valores["categoria"] = padrao;
            this.state.categorias = groupedOptions;
            this.state.loadingCategoria = false
            //this.setState({categorias: groupedOptions, valores: this.state.valores, loadingCategoria: false})                
             //resolve(groupedOptions)
          // });     
        }                
        else
        {
          if(this.contErro++ >= 3){
            this.contErro = 0;
            toast.dismiss();
            toast.error(this.stringTranslate("Erro.Servidor"), toastOptions);
          }            
          else
            this.loadCategorias()
          
        } 
        
      }).catch((error) => {
        if(this.contErro++ >= 3){
          this.contErro = 0;
          toast.dismiss();
          toast.error(this.stringTranslate("Erro.Servidor"), toastOptions);
        }            
        else
          this.loadCategorias()
      })  
    };
    

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
          this.setState({reload: !this.state.reload,update:true, loading: false}); // para recarregar os valores recebido do servidor para o select
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


    pesquisar(){
      if(this.state.valores["pesquisa"] === ""){
        this.state.update= false;
        this.state.pesquisou = false;
        this.state.expand=[];
        this.filhosSecao =[];
        this.setState({pesquisou:this.state.pesquisou,update: this.state.update,expand: this.state.expand});  
      }
      else
      if((this.state.valores["pesquisa"] !== "") || 
      ((this.state.valores["categoria"] !==undefined) &&
      (this.state.valores["categoria"].length > 0 ))){
        this.setState({loadingButtonPesquisar: true});
        const body={
          cmd:"gerarArvoredePesquisa",
          nome: this.state.valores["pesquisa"],
  
          categoria: this.state.valores["categoria"] !== undefined ? this.state.valores["categoria"].length === this.totalCategorias ? "all" : this.state.valores["categoria"] : null,
          incluirresidente: this.state.valores["incluirresidente"] !== undefined ? this.state.valores["incluirresidente"].value : true,
          incluirpreautorizado: this.state.valores["incluirpreautorizado"] !== undefined ? this.state.valores["incluirpreautorizado"].value : true,
          incluirprecisaliberacao: this.state.toggleFiltro["visitantes"] !== undefined ? this.state.toggleFiltro["visitantes"] : false,
          incluirnaoresidenteautorizado: this.state.valores["incluirnaoresidenteautorizado"] !== undefined ? this.state.valores["incluirnaoresidenteautorizado"].value : true,
          incluirinativos: this.state.toggleFiltro["desativados"] !== undefined ? this.state.toggleFiltro["desativados"] : false,
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

    genTreeNode = (id,title) => {
      // arraylotacao.push({value: parseInt(lotacao.CodLotacao), title: lotacao.Nome,pai: parseInt(lotacao.codEmpresa)})
       return {
         key: id,
         value: id,
         title: title,
         isLeaf: true,         
       };
     };
  
     reloadArvore(){
      var filhosSecaoCopia =this.filhosSecao;
      var pesquisou = this.state.pesquisou; 
      var groupedOptions =[];
       this.arrayempresa.forEach((itemempresa) => {
  
        var filhoslotacao = [];
  
        this.arraylotacao.forEach((valuelotacao) => {
            if(valuelotacao.pai === itemempresa.value){
                var filhos=[];
                  this.arraysecao.forEach(function(valuesecao){
                  
                    if(valuesecao.pai === valuelotacao.value){
                      if (filhosSecaoCopia[valuesecao.value] !== undefined || pesquisou === false){
                        filhos.push({value: valuesecao.value, key: valuesecao.value, title: valuesecao.title,tipo:'secao',disabled:filhosSecaoCopia[valuesecao.value] === undefined ? true: false, children: filhosSecaoCopia[valuesecao.value] === undefined ? "" : filhosSecaoCopia[valuesecao.value] })
                   
                       } 
                      }
                   }) 
                if (filhos.length >0   || pesquisou === false){
                 filhoslotacao.push({value: valuelotacao.value, key: valuelotacao.value, title: valuelotacao.title,children: filhos, tipo:"lotacao"})
                }  
             
            }
        })             
        if (filhoslotacao.length >0  || pesquisou === false){
          groupedOptions.push({value: itemempresa.value, key: itemempresa.value, title: itemempresa.title, children: filhoslotacao,tipo:'empresa'});
        }
  
      })
      //this.state.valores["categoria"] = padrao;
      this.setState({arvore: groupedOptions,update:!this.state.update, loading: false})      
    }

    onExpand = expandedKeys => {
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.setState({
        expand:expandedKeys,
        autoExpandParent: false,
      });
    };
    onLoadData = treenode =>
    new Promise(resolve => {
    const { value,tipo } = treenode.props;
   //    this.setState({arvore:this.state.arvore}); 
       if (tipo === "secao"){
       const body={
         cmd:"gerarArvoredePesquisa",            
         codsecao: value,
         incluirresidente: this.state.valores["incluirresidente"] !== undefined ? this.state.valores["incluirresidente"].value : true,
         incluirpreautorizado: this.state.valores["incluirpreautorizado"] !== undefined ? this.state.valores["incluirpreautorizado"].value : true,
         incluirprecisaliberacao: this.state.toggleFiltro["visitantes"] !== undefined ? this.state.toggleFiltro["visitantes"] : true,
         incluirnaoresidenteautorizado: this.state.valores["incluirnaoresidenteautorizado"] !== undefined ? this.state.valores["incluirnaoresidenteautorizado"].value : true,
         incluirinativos: this.state.toggleFiltro["desativados"] !== undefined ? this.state.toggleFiltro["desativados"] : false,
         qualquerparte: this.state.valores["qualquerparte"] !== undefined ? this.state.valores["qualquerparte"].value : true,
         token:sessionStorage.getItem("token"),
       }
   
   
       new Promise(resolve => {
   
         postAdonis(body, '/Geral/GerarArvoredePesquisa').then(lista =>{     
           if(lista.error === undefined)
           {
             var  ListaPessoas = lista.dados;
             this.filhosSecao[value]=[];
             var array = ListaPessoas.map((item) => {
                
                  this.filhosSecao[value].push(this.genTreeNode(item.codigo,item.nome))
      
               })
                this.reloadArvore();    
           }                
           else
           {
             this.state.mensagemErro = this.stringTranslate("Liberacao.erro");
             this.redirect();
           } 
         });
         resolve();
       });
     }
       resolve();
    })


    selectTreeShow(e,index){
      this.state.valores[index]=e;
      this.setState({valores:this.state.valores});
    }

    onCheck = checkedKeys => {
      this.setState({ checkedKeys });
    };

  render() {    
      
    
    return (
      <>      
      <div className="content">


        <Row type="flex" justify="space-between" align="bottom" gutter={16}>
        
          <Col md={24} sm={24} xs={24}>
            <Card>
              <CardHeader tag="h4"> {this.stringTranslate("AcessosColetor.Card.Title")} </CardHeader>
              <CardBody style={{marginTop: "5px"}}>
              <Row type="flex" justify="space-between" align="bottom" gutter={16}>
                <Col md={12} sm={24} xs={24}>
                  <FormGroup>                      
                    <Label for="pesquisa" style={{textTransform: "uppercase"}}>{this.stringTranslate("Label.Pesquisar")}</Label>                        
                    <Input type="text"
                      name= "pesquisa" 
                      value= {this.state.valores["pesquisa"]}
                      onChange={(e) => this.onChange(e)}
                      onKeyPress={this.onKeyPress}
                      id="pesquisa"
                    />      
                       <Switch 
                            onChange={() => this.onToggled("visitantes")} 
                            checked={this.state.toggleFiltro["visitantes"]}
                            size="small"    
                        /> 
                        <Label style={{marginLeft: "7px", marginRight: "15px"}} onClick={() => this.onToggled("visitantes")}>{this.stringTranslate("Label.Visitantes")}</Label>    
                        <Switch 
                            onChange={() => this.onToggled("desativados")} 
                            checked={this.state.toggleFiltro["desativados"]}
                            size="small"    
                        /> 
                        <Label style={{marginLeft: "7px"}} onClick={() => this.onToggled("desativados")}>{this.stringTranslate("Label.Desativados")}</Label>                                                                                       
                  
                  </FormGroup>
                </Col>
                <Col md={6} sm={24} xs={24}>
                
                  <FormGroup style={{paddingBottom:"25px"}}> 
                    <Label for="categoria" style={{textTransform: "uppercase"}}>{this.stringTranslate("Label.Categoria")}</Label>  
                    <Spin spinning={this.state.loadingCategoria}>
                    <TreeSelect     
                      value= {this.state.valores["categoria"]}
                      allowClear = {true}
                      onChange= {(value) => this.handleChangeSelect(value, "categoria")}
                      treeCheckable= {true}
                      searchPlaceholder= {this.stringTranslate("SelectCategoria")}
                      showSearch= {true}
                      size= "large"
                      style= {{ width: "100%", }}
                      dropdownStyle={{ maxHeight: 400 }}
                      maxTagCount= {0} 
                      maxTagPlaceholder={(e) => this.totalCategorias === e.length ? this.stringTranslate("Botao.Todos") : e.length + " " + this.stringTranslate("Label.Selecionados")}
                      treeData={this.state.categorias}     
                      id="categoria"           
                      showCheckedStrategy = "SHOW_ALL"
                      />
                       </Spin>                    
                    </FormGroup>
                   
                </Col>
                <Col md={6} sm={24} xs={24}>
                    <FormGroup style={{paddingBottom: "25px"}}>
                        <Button block type="primary" loading={this.state.loadingButtonPesquisar} size="large" onClick={() => this.pesquisar()}>{this.stringTranslate("Botao.Pesquisar" )}</Button>
                    </FormGroup>
                </Col>
              </Row>                       

              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row  type="flex" justify="space-between" align="top" gutter={16}>
          <Col md={12} sm={24} xs={24}>
              <Card style={{maxHeight:"500px",overflow: 'auto', paddingTop: "10px"}}>
                <CardBody>
                  <Skeleton loading={this.state.loading} active>
                  {this.renderSelect()}                  
                  </Skeleton>
                </CardBody>
              </Card>
          </Col>

          <Col md={12} sm={24} xs={24}>
              <Card>                
                <CardBody>                  
                    <Row>
                        <Col>
                            <FormGroup> 
                                <Label for="locais" >{this.stringTranslate("Label.LocaisAcesso")}</Label>  
                                <Spin spinning={this.state.loadingLocais}>
                                    <TreeSelect     
                                        value= {this.state.valores.locaisAcesso}
                                        onChange= {(value) => this.handleChangeSelect(value, "locaisAcesso")}
                                        allowClear = {true}
                                        treeCheckable= {true}                         
                                        searchPlaceholder= {this.stringTranslate("Label.SelectLocalAcesso")}
                                        showSearch= {false}
                                        size= "large"
                                        style= {{ width: "100%", }}
                                        dropdownStyle={{ maxHeight: 400 }}
                                        maxTagCount= {0} 
                                        maxTagPlaceholder={(e) => e.length > 1 ? e.length + " " + this.stringTranslate("Label.SelectedLocalAcesso+") : e.length + " " + this.stringTranslate("Label.SelectedLocalAcesso")}
                                        treeData={this.state.locais}     
                                        id="locais"           
                                        showCheckedStrategy = "SHOW_ALL"
                                    />
                                </Spin>                    
                            </FormGroup> 
                        </Col>                                    
                    </Row>
                  <Row type="flex"  justify="space-between" align="bottom" gutter={16}>
                    <Col md={14} sm={24} xs={24}>                      
                      <FormGroup>    
                        <Label for="examplePassword">{this.stringTranslate("Ajustes.Jornada.Label.Prazo")}</Label>                  
                        <RangePicker 
                          size="large" 
                          id="prazo" 
                          style={{ width: '100%' }} 
                          placeholder={[this.stringTranslate("Label.DataInicio"), this.stringTranslate("Label.DataFim")]} 
                          value={this.state.valores["prazo"]} 
                          onChange={(e) => this.handleChangeSelect(e, "prazo")} 
                          format="DD-MM-YYYY"
                        />
                      </FormGroup>
                    </Col>                    
                    <Col md={10} sm={24} xs={24}>  
                        <FormGroup>                                             
                            <Button 
                            block 
                            type="primary" 
                            size="large" 
                            style={{textTransform: "uppercase"}} 
                            onClick={() => this.geraRelatorio()}
                            loading={this.state.loadingButtonAlterar}>
                                {this.stringTranslate("Botao.VerImpressao")}                        
                            </Button>                                    
                        </FormGroup>  
                    </Col>
                  </Row>
                </CardBody>
              </Card>
          </Col>
        </Row>
       </div>
       <div>
        <Modal zIndex={1050} cancelButtonProps={{style:{visibility:"hidden"}}} style={{minWidth:"80%"}} onOk={this.setModal} onCancel={this.setModal} visible={this.state.modal} title={this.stringTranslate("AcessosColetor.Card.Title")}>
            <Table scroll={{x:"800px"}} columns={this.colunasRelatorio} dataSource={this.state.dadosRelatorio} />
        </Modal>
        </div>
       </>
    );
  }
}

export default injectIntl(AcessosColetor);
