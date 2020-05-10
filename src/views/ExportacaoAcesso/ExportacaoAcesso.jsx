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
  Row,
  Col,
  Collapse,
  Nav,
  UncontrolledTooltip,
} from "reactstrap";
import { FormGroup, Label, Input, CustomInput  } from 'reactstrap';
import { post, postAdonis } from "utils/api";
import InputMask from 'react-input-mask';
import { toast, Slide } from 'react-toastify';
import { injectIntl } from "react-intl";
import { Tree, Skeleton, TreeSelect, Spin } from 'antd';
import { Select, Switch, DatePicker, Result  } from 'antd';
import { Button } from 'antd';
import SelectTreeViewNeo from '../../components/SelectTreeViewNeo/SelectTreeViewNeo';
import { pegaData } from '../../components/dataHora'
import moment from 'moment';

const ButtonGroup = Button.Group;
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
class exportacaoAcesso extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          valores: {"tipo": 0, "periodo": [moment().subtract(1, 'month'), moment()]}, 
          categorias: [{title: "Aguarde...", value:"", disabled:true}],
          loading: true,
          loadingCategoria: true,
          loadingLayout: true,
          layout: [],
          loadingButtonPesquisar: false,
          loadingButtonExportar: false,
          update: true,
          expand: [],
          arvore: "",
          pesquisou: false,
          categorias: [{title: "Aguarde...", value:"", disabled:true}],
          loadingExportar: false,
          keys:{
            empresav:[],
            lotacaov:[],
            secaov:[],
            pessoav:[],
          },    
        };
        this.totalCategorias = 0;
        this.contErro = 0;
        this.empresa =   [];
        this.lotacao=    [];
        this.secao =     [];
        this.filhosSecao=     [];
        this.renderSelect = this.renderSelect.bind(this);
        this.pesquisar = this.pesquisar.bind(this);
        this.stringTranslate = this.stringTranslate.bind(this);   
        this.loadCategorias = this.loadCategorias.bind(this);     
        this.consultaDadosELT = this.consultaDadosELT.bind(this);
        this.handleChangeSelect = this.handleChangeSelect.bind(this);
        this.onChange = this.onChange.bind(this);
        this.mostrartodos = this.mostrartodos.bind(this);
        this.expand = this.expand.bind(this);
        this.expandAtualizar= this.expandAtualizar.bind(this);
        this.setValores =  this.setValores.bind(this);
        this.exportarAcesso = this.exportarAcesso.bind(this);
        this.listaLayout = this.listaLayout.bind(this);
        this.consultaDadosELT();
        this.loadCategorias(); 
        this.listaLayout();    
    }

    stringTranslate(id){
        return this.props.intl.formatMessage({id: id});
    }

    //MARK: Exportar Acesso
    exportarAcesso(){
      
      var valores = this.state.keys.pessoav.length + this.state.keys.empresav.length + this.state.keys.lotacaov.length + this.state.keys.secaov.length;

      if(this.state.valores["idLayout"] === undefined || this.state.valores["periodo"] === undefined ){
        toast.dismiss();
        toast.warning(this.stringTranslate("Warning.todosOsCampos"), toastOptions);
        return;
      }
      else if(valores < 1){
        toast.dismiss();
        toast.warning(this.stringTranslate("Warning.selecionePessoa"), toastOptions);
        return;
      }
      this.setState({loadingExportar: true});
      var data= this.state.valores["periodo"];
      var name= "Access_" + moment().format("DDMMYYY_HHmmss")
      const body = {
        cmd: 'exportarAcessos',
        dataInicio: pegaData(data[0]),
        dataFim:  pegaData(data[1]), 
        layout: this.state.valores["idLayout"],
        pessoas: {
          empresav: this.state.keys.empresav.toString(),
          lotacaov: this.state.keys.lotacaov.toString(),
          pessoav: this.state.keys.pessoav.toString(),
          secaov: this.state.keys.secaov.toString(),
        },
        nomeArquivo: name,
        token: sessionStorage.getItem("token")
      }
      postAdonis(body, '/ExportaAcesso').then(lista =>{
        if(lista.erro === undefined)
        {
          //window.open('http://desenv600/dokeo/AcessExport/'+name+".txt");
          // console.log(lista);
          // window.open('http://' + window.location.href.split('/')[2] + '/dokeo/AcessExport/'+name+".txt");
          //window.open('http://' + window.location.href.split('/')[2] + '/DokPortaria/AcessExport/'+name+".txt");
          const a = document.createElement('a');
          a.href = URL.createObjectURL(new Blob([lista], { type: "text/plain;charset=utf-8" }));
          a.download = (name+".txt") || 'download';
          const clickHandler = () => {
            setTimeout(() => {
              URL.revokeObjectURL(a.href);
              a.removeEventListener('click', clickHandler);
            }, 150);
          };
          a.addEventListener('click', clickHandler, false);
          a.click();
          this.setState({loadingExportar: false});
        }  
        else
        {
          toast.dismiss();          
          toast.error(this.stringTranslate("Erro.Servidor"), toastOptions);
          this.setState({loadingExportar: false});
        }                   
      }).catch(e => {
          console.log(e);
          toast.dismiss();          
          toast.error(this.stringTranslate("Erro.Servidor"), toastOptions);
          this.setState({loadingExportar: false});
      })
    }
    //---------------------------------------------------------

    //MARK: Lista Layout
    listaLayout(){
      const body = {
        cmd: 'listaFormatosColeta',
        token: sessionStorage.getItem("token")
      }
      postAdonis(body, '/Geral/FormatosColeta').then(lista =>{    
        if(lista.error === undefined)
        {      
          this.contErro = 0;
          this.state.layout = lista.dados;
          this.setState({loadingLayout: false, layout: this.state.layout})   
        }  
        else
        {
          if(this.contErro++ >= 3){
            this.contErro = 0;
            toast.dismiss();
            toast.error(this.stringTranslate("Erro.Servidor"), toastOptions);
          }            
          else
            this.listaLayout()
        }                   
      }).catch((error) => {
        if(this.contErro++ >= 3){
          this.contErro = 0;
          toast.dismiss();
          toast.error(this.stringTranslate("Erro.Servidor"), toastOptions);
        }            
        else
          this.listaLayout()
      }) 
    }
    //--------------------------------------------------

    limpaValores(campos){
  
      for(var i = 0; i < campos.length; i++){      
        this.state.valores[campos[i]] = {value: "", label: ""}      
      }
      this.setState({valores: this.state.valores})
    }

    handleChangeSelect(e, key){
      if(key === "tipo")
        this.state.valores["idLayout"] = undefined;

      this.state.valores[key] = e;
      this.setState({valores: this.state.valores})
    } 

    expand(){
      return this.state.expand;
    }
    
    expandAtualizar(expand){
      this.setState({expand:expand})
  
    }

    setValores(keys){
      var empresav=[];
      var lotacaov=[];
      var secaov=[];
      var pessoav=[];
        keys.forEach(function (key){
        if (key.indexOf("empresa") > 0)
        empresav.push(parseInt(key.replace(/-empresa/gi,"")));
        else
        if (key.indexOf("lotacao") > 0)
        lotacaov.push(parseInt(key.replace(/-lotacao/gi,"")));
        else 
        if (key.indexOf("secao") > 0)
        secaov.push(parseInt(key.replace(/-secao/gi,"")));
        else 
        pessoav.push(parseInt(key));
      
      })
      this.state.keys["empresav"]=empresav; 
      this.state.keys["lotacaov"]=lotacaov ;
      this.state.keys["secaov"]=secaov ;
      this.state.keys["pessoav"]=pessoav ;
    }
    
    mostrartodos(){
      this.state.valores["pesquisa"] = "";
      this.filhosSecao=[];
      this.setState({valores:this.state.valores,expand: [], update:false,pesquisou:false});
    }

    onChange(e){
      this.state.valores[e.target.name] = e.target.value;
      this.setState({valores: this.state.valores});
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
                if(item.codCategoriaSuperior === undefined)
                    arrayPai.push({value: parseInt(item.codCategoriaPessoa), title: item.Nome})
                else
                    arrayFilho.push({value: parseInt(item.codCategoriaPessoa), key: parseInt(item.codCategoriaPessoa), title: item.Nome, pai: parseInt(item.codCategoriaSuperior)})    
                    
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
  
          categoria: this.state.valores["categoria"] !== undefined ? this.state.valores["categoria"].toString() : null,
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

    //MARK: Reder Select
    renderSelect(){
      if (this.secao.length !== 0 && this.lotacao.length !== 0 && this.empresa.length !== 0  ){
        return ( <SelectTreeViewNeo mostrartodos={this.mostrartodos} setValores={this.setValores}  arrayempresa={this.empresa} arraylotacao={this.lotacao} expandAtualizar={this.expandAtualizar} arraysecao={this.secao} arrayFilhos={this.filhosSecao} update={this.state.update} pesquisou={this.state.pesquisou} expand={this.expand()}/>)      // return ( <SelectTreeViewNeo treeData={this.state.arvore} arrayempresa={this.empresa} arraylotacao={this.lotacao}  
        //  arraysecao={this.secao} arrayFilhos={this.filhosSecao} update = {this.state.update} pesquisou={this.state.pesquisou} expand={this.state.expand}/>)
      }
      else 
        return null;
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



  render() {    
      
    
    return (
      <>      
      <div className="content">


        <Row>
        
          <Col md="12">
            <Card>
              <CardHeader tag="h4">
                             
                <Nav 
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
                  </UncontrolledTooltip>    
                    {this.stringTranslate("Ajustes.ExportarAcesso.Card.Titulos")}
                
              </CardHeader>
              <CardBody style={{marginTop: "5px"}}>
              
              
              <Row>
                <Col md="6">
                  <FormGroup>                      
                    <Label>{this.stringTranslate("Veiculo.Pesquisar")}</Label>                        
                    <Input type="text"
                      name= "pesquisa" 
                      value= {this.state.valores["pesquisa"]}
                      onChange={(e) => this.onChange(e)}
                      onKeyPress={this.onKeyPress}
                      id="textBox"
                    />                        
                  </FormGroup>
                </Col>
                <Col md={4}>
                
                  <FormGroup> 
                    <Label for="categoria" style={{textTransform: "uppercase"}}>{this.stringTranslate("Label.Categoria")}</Label> 
                    <Spin spinning={this.state.loadingCategoria}>
                    <TreeSelect     
                      value= {this.state.valores["categoria"]}
                      onChange= {(value) => this.handleChangeSelect(value, "categoria")}
                      treeCheckable= {true}
                      searchPlaceholder= {this.stringTranslate("SelectCategoria")}
                      showSearch= {false}
                      size= "large"
                      style= {{ width: "100%", }}
                      dropdownStyle={{ maxHeight: 400, overflow: 'hidden' }}
                      maxTagCount= {0} 
                      maxTagPlaceholder={(e) => this.totalCategorias === e.length ? this.stringTranslate("Label.Todas") + " " + this.stringTranslate("Label.asCategorias"): e.length + " " + this.stringTranslate("Label.Categoria") + " " + this.stringTranslate("Label.Selecionadas") }
                      treeData={this.state.categorias}     
                      id="categoria"  
                      showCheckedStrategy = "SHOW_ALL"
                      />    
                       </Spin>                    
                    </FormGroup>
                   
                </Col>
                <Col md="2">
                  <Button block type="primary" loading={this.state.loadingButtonPesquisar} size="large" style={{float:"right", padding:"0", top: "calc(100% - 49px)", marginBottom: "15px"}} onClick={() => this.pesquisar()}>PESQUISAR</Button>
                </Col>
              </Row>                         
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>      
          <Col md="6">
              <Card style={{maxHeight:"500px",overflow: 'auto', paddingTop: "10px"}}>
                <CardBody>
                  <Skeleton loading={this.state.loading} active>
                  {this.renderSelect()}          
                  </Skeleton>
                </CardBody>
              </Card>
          </Col>

          <Col md="6">
              <Card>
                <CardHeader tag="h4">
                  Dados Para Exportação de Acesso
                </CardHeader>
                <CardBody>
                <Row style={{marginTop: "15px"}}>
                    <Col md="6">                    
                    <FormGroup>    
                    <Label for="formato">Tipo</Label>  
                        <Select                            
                        style={{ width: '100%' }}
                        placeholder=""
                        size="large"    
                        id="formato"
                        value={this.state.valores["tipo"]}                  
                        onChange={(e) => this.handleChangeSelect(e, "tipo")}               
                        >
                            <Option value={0}>Configurados</Option>   
                            <Option value={1}>Específicos</Option>                         
                        </Select>
                    </FormGroup>                                      
                    </Col> 
                    <Col md="6">                      
                        <FormGroup>    
                        <Label for="periodo">Período</Label>                               
                            <RangePicker size="large" id="periodo" value={this.state.valores["periodo"]} onChange={(e) => this.handleChangeSelect(e, "periodo")} style={{ width: '100%' }} placeholder={["Data Inicio", "Data Fim"]} format={this.stringTranslate("Format.Date")}/>
                        </FormGroup>
                        </Col>
                </Row>

                    <Row>
                        <Col md="8">
                        {this.state.valores["tipo"] ===  0? (
                        <FormGroup>
                            <Label for="formato">Formato</Label>
                            <Spin spinning={this.state.loadingLayout}>
                            <Select                            
                              style={{ width: '100%' }}
                              placeholder="Selecione um Formato"
                              size="large"
                              id="formato"
                              value={this.state.valores["idLayout"]}
                              onChange={e => this.handleChangeSelect(e, "idLayout")}
                            >
                              {this.state.layout.map((prop) => {
                                return(
                                  <Option value={prop.cod}>{prop.nome}</Option>
                              )})}
                            </Select>
                          </Spin>
                        </FormGroup>
                        ) : (
                        <FormGroup>
                            <Label for="formato">Formato</Label>
                            <Spin spinning={this.state.loadingLayout}>
                            <Select
                              style={{ width: '100%' }}
                              placeholder="Selecione uma Layout"
                              size="large"
                              id="formato"
                              value={this.state.valores["idLayout"]}
                              onChange={e => this.handleChangeSelect(e, "idLayout")}
                            >
                              <Option value="Senior">Senior</Option>
                            </Select>
                          </Spin>
                        </FormGroup>)}

                        </Col> 
                        <Col md="4">
                                <Button block type="primary"  loading={this.state.loadingExportar} size="large" style={{padding:"0", top: "calc(100% - 48px)", marginBottom: "15px"}} onClick={() => this.exportarAcesso()}>EXPORTAR</Button>
                        </Col>
                        
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

export default injectIntl(exportacaoAcesso);
