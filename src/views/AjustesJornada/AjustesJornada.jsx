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
  Nav,
  UncontrolledTooltip,
} from "reactstrap";
import { FormGroup, Label, Input  } from 'reactstrap';
import { postAdonis } from "utils/api";
import InputMask from 'react-input-mask';
import { toast, Slide } from 'react-toastify';
import { injectIntl } from "react-intl";
import { Skeleton, TreeSelect, Spin, Row, Col, Select, Switch, Button } from 'antd';
import SelectTreeViewNeo from '../../components/SelectTreeViewNeo/SelectTreeViewNeo';
import { pegaData } from "../../components/dataHora";
import moment from "moment";

const { Option } = Select;

const toastOptions = {
  transition: Slide,
  position: "top-center",
  autoClose: 5000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: true
};
           
class AjustesJornada extends React.Component {
    constructor(props) {
        super(props);
        this.state = {           
          loading: true,
          loadingCategoria: true,
          loadingJornadas: true,
          jornadas: [],
          jornadasComHistorico: [],
          loadingButtonPesquisar: false,
          loadingButtonAlterar: false,
          update: true,
          autoExpandParent:false,
          expand: [],
          arvore: "",
          pesquisou: false,
          checkedKeys:[],
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
          locale: sessionStorage.getItem("locale")
        };
        this.valores = {"idJornadaAntiga" : "", "idJornada" : "", "indeterminado" : false, "historica": false, "prazo":[moment(), moment().add(1, "months")], "dataInicio" : moment(), "selectJornada": 0};
        this.contErro = 0;
        this.empresa = [];
        this.totalempresa=0;
        this.lotacao = [];
        this.secao = [];
        this.locaisAcesso = [];
        this.filhosSecao = [];        
        this.pesquisar = this.pesquisar.bind(this);
        this.stringTranslate = this.stringTranslate.bind(this);       
        this.reloadArvore = this.reloadArvore.bind(this);
        this.postAlteracaoColetivaJornada = this.postAlteracaoColetivaJornada.bind(this);
        this.handleChangeSelect = this.handleChangeSelect.bind(this);
        this.onChange = this.onChange.bind(this);
        this.renderSelect = this.renderSelect.bind(this);
        this.mostrartodos = this.mostrartodos.bind(this);
        this.expand = this.expand.bind(this);
        this.expandAtualizar= this.expandAtualizar.bind(this);
        this.setValores =  this.setValores.bind(this);
        this.toggleCollapse = this.toggleCollapse.bind(this);
        this.totalCategorias = 0;
        this.postAlteracaoColetivaJornada();
        // this.loadCategorias();
        // this.consultaDadosELT();
        // this.postListaJornada();        
    }

    toggleCollapse(e, index){
      this.valores[index] = e;

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
        if (!isNaN(key))  
        pessoav.push(key);
        else  
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
      this.valores["pesquisa"] = "";

      this.filhosSecao=[];
      this.setState({expand: [], update:false,pesquisou:false});
    }

    stringTranslate(id){
        return this.props.intl.formatMessage({id: id});
    }

    handleChangeSelect(e, key){
      if(key === "selectJornada")
        this.valores["idJornadaAntiga"] = "";

      this.valores[key] = e;      
    }  

    renderSelect(){
        if (this.secao.length !== 0 && this.lotacao.length !== 0 && this.empresa.length !== 0  ){
          return ( <SelectTreeViewNeo mostrartodos={this.mostrartodos} setValores={this.setValores} onPesquisa={this.pesquisar} arrayempresa={this.empresa} arraylotacao={this.lotacao} expandAtualizar={this.expandAtualizar} arraysecao={this.secao} arrayFilhos={this.filhosSecao} update={this.state.update} pesquisou={this.state.pesquisou} expand={this.expand()}/>)      // return ( <SelectTreeViewNeo treeData={this.state.arvore} arrayempresa={this.empresa} arraylotacao={this.lotacao}           
        }
        else 
        return null;
      
      }

    onChange(e){
      this.valores[e.target.name] = e.target.value;
      this.setState({valores: this.valores});
    }


    validaCampo(){
      if(!this.state.keys.empresav.length && !this.state.keys.lotacaov.length && !this.state.keys.pessoav.length && !this.state.keys.secaov.length)
      {
        toast.dismiss();
        toast.warning(this.stringTranslate("Warning.selecionePessoa"), toastOptions);
        return 0;
      }    
      if (!this.valores["idJornada"] || (!this.valores["idJornadaAntiga"] && this.valores["selectJornada"] === 1)){
        toast.dismiss();
        toast.warning(this.stringTranslate("Ajustes.Jornada.Toast.ErroJornada"), toastOptions);
        return 0;
      }
      if((this.state.jornadas[this.valores["idJornada"]] === undefined && this.valores["historica"] === false) ||
        (this.state.jornadasComHistorico[this.valores["idJornada"]] === undefined && this.valores["historica"] === true))
      {
        toast.dismiss();
        toast.warning(this.stringTranslate("Nova Jornada Inválida"), toastOptions);
        return 0;
      }
      if(this.valores["selectJornada"] === 1 && this.state.jornadas[this.valores["idJornadaAntiga"]] === undefined && this.valores["historica"] === false)
      {
        toast.dismiss();
        toast.warning(this.stringTranslate("Jornada a ser alterada inválida"), toastOptions);
        return 0;
      }
      if((this.valores["indeterminado"] === false && this.valores["prazo"] === "") || (this.valores["indeterminado"] === true && this.valores["dataInicio"] === ""))
      {
        toast.dismiss();
        toast.warning(this.stringTranslate("Ajustes.Jornada.Toast.ErroPrazo"), toastOptions);
        return 0;
      } 

      return 1;
      // codigos[item.CodJornada] = item.nome; 

      //       codigosComHistorico[item.CodJornada]
    }


    // MARK: POST ALTERA JORNADA
    alteraJornada(){  
      if(!this.validaCampo())
         return;
            
      this.setState({loadingButtonAlterar: true});
      var data = this.valores["prazo"];
      const body={
        cmd:"alteracaojornada",
        datainicio: this.valores["indeterminado"] === false ? pegaData(data[0]._d.toDateString()) : pegaData(this.valores["dataInicio"]._d.toDateString()),
        datafim: this.valores["indeterminado"] === false ? pegaData(data[1]._d.toDateString()) : "",
        newjornada: this.valores["idJornada"],
        oldjornada: this.valores["idJornadaAntiga"],
        itensbusca: {
          empresav: this.state.keys.empresav,
          lotacaov: this.state.keys.lotacaov,
          pessoav: this.state.keys.pessoav,
          secaov: this.state.keys.secaov
        },
        token: sessionStorage.getItem("token"),
      }
      postAdonis(body, '/Ajustes/AjustesJornada').then(lista =>{
        this.setState({loadingButtonAlterar: false});
        if(lista.error === undefined) {
          if(lista.retorno === true){
            toast.dismiss();
            toast.success(this.stringTranslate("Sucesso.JornadaSalva"), toastOptions);  
          }
        }
        else {
          toast.dismiss();
          toast.error(this.stringTranslate("Erro.Servidor"), toastOptions);                    
        }                                
     }).catch((error) => {
        this.setState({loadingButtonAlterar: false});
        toast.dismiss();
        toast.error(this.stringTranslate("Erro.Servidor"), toastOptions);                  
    })};
    //----------------------------------------------------------------------------
    postAlteracaoColetivaJornada(){
      const body={
        cmd:"jornada",     
        resumido: true, 
        token: sessionStorage.getItem("token"),
      }
  
      postAdonis(body,'/Index/AlteracaoColetivadeJornada').then(dados =>{
        if(dados.retorno)
        {
          this.contErro = 0;
          var codigos =[]; 
          var codigosComHistorico =[]; 
          dados.listaJornada.forEach((item) =>{ 
            if(item.historica === 0)                                              
              codigos[item.CodJornada] = item.nome; 

            codigosComHistorico[item.CodJornada] = item.nome; 
          }); 
 
          this.setState({jornadas: codigos, jornadasComHistorico: codigosComHistorico, loadingJornadas: false});        
          this.secao = dados.secao;  
          this.lotacao= dados.lotacao;    
          this.empresa = dados.empresa;    
          this.setState({reload: !this.state.reload,update:true, loading: false}); // para recarregar os valores recebido do servidor para o select
          var arrayPai = [];
          var arrayFilho = [];
          var padrao = [];
          dados.listaCategoria.forEach((item) => { 
            this.totalCategorias++;                 
            if(item.codCategoriaSuperior === undefined || item.codCategoriaSuperior === null )
              arrayPai.push({value: parseInt(item.codCategoriaPessoa), title: item.Nome})
            else
              arrayFilho.push({value: parseInt(item.codCategoriaPessoa), key: parseInt(item.value), title: item.Nome, pai: parseInt(item.codCategoriaSuperior)})    
            
            padrao.push((item.codCategoriaPessoa))                        
          })                      
          var groupedOptions = arrayPai.map((item) => {

              var filhos = [];
              arrayFilho.forEach(function(value){
                  if(value.pai === item.value)
                      filhos.push({value: value.value, key: value.value, title: value.title})
              })             

              return {value: item.value, key: item.value, title: item.title, children: filhos};
          })
          this.valores["categoria"] = padrao;
          this.setState({categorias: groupedOptions, loadingCategoria: false}) 
        
        }
      })
    }
    // MARK: POST LISTA JORNADA  
  
    
    pesquisar(){
      if(this.valores["pesquisa"] === ""){
        this.state.update= false;
        this.state.pesquisou = false;
        this.state.expand=[];
        this.filhosSecao =[];
        this.setState({pesquisou:this.state.pesquisou,update: this.state.update,expand: this.state.expand});  
      }
      else
      if((this.valores["pesquisa"] !== "") || 
      ((this.valores["categoria"] !==undefined) &&
      (this.valores["categoria"].length > 0 ))){
        this.setState({loadingButtonPesquisar: true});
        const body={
          cmd:"gerarArvoredePesquisa",
          nome: this.valores["pesquisa"],
  
          categoria: this.valores["categoria"] !== undefined ? this.valores["categoria"]: null,
          incluirresidente: this.valores["incluirresidente"] !== undefined ? this.valores["incluirresidente"].value : true,
          incluirpreautorizado: this.valores["incluirpreautorizado"] !== undefined ? this.valores["incluirpreautorizado"].value : true,
          incluirprecisaliberacao: this.valores["incluirprecisaliberacao"] !== undefined ? this.valores["incluirprecisaliberacao"].value : false,
          incluirnaoresidenteautorizado: this.valores["incluirnaoresidenteautorizado"] !== undefined ? this.valores["incluirnaoresidenteautorizado"].value : true,
          incluirinativos: this.valores["incluirinativos"] !== undefined ? this.valores["incluirinativos"].value : false,
          qualquerparte: this.valores["qualquerparte"] !== undefined ? this.valores["qualquerparte"].value : false,
          token:sessionStorage.getItem("token"),
        }
        //post(body).then(lista =>{  
        postAdonis(body,'/Geral/GerarArvoredePesquisa').then(lista =>{    
          this.setState({loadingButtonPesquisar: false});
          if(lista.error === undefined)
          {
           // var filhosSecao= lista.dados;
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
           // this.redirect();
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
    

    selectTreeShow(e,index){
      this.valores[index]=e;
    }

    onCheck = checkedKeys => {
      this.setState({ checkedKeys });
    };

  render() {    
      
    
    return (
      <>      
      <div className="content">


        <Row type="flex" justify="space-between">
        
          <Col md={24} sm={24} xs={24}>
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
                    {this.stringTranslate("Ajustes.Jornada.Card.Titulos")}
                
              </CardHeader>
              <CardBody style={{marginTop: "5px"}}>
              
              
              <Row type="flex"  justify="space-between" align="bottom" gutter={16}>
                <Col md={12} sm={24} xs={24}>
                  <FormGroup>                      
                    <Label for="pesquisa" style={{textTransform: "uppercase"}}>{this.stringTranslate("Label.Pesquisar")}</Label>                        
                    <Input type="text"
                      name= "pesquisa" 
                      defaultValue= {this.valores["pesquisa"]}
                      onChange={(e) => this.onChange(e)}
                      onKeyPress={this.onKeyPress}
                      id="pesquisa"
                    />                        
                  </FormGroup>
                </Col>
                <Col md={6} sm={24} xs={24}>
                
                  <FormGroup> 
                    <Label for="categoria" style={{textTransform: "uppercase"}}>{this.stringTranslate("Label.Categoria")}</Label>  
                    <Spin spinning={this.state.loadingCategoria}>
                    <TreeSelect     
                      value= {this.valores["categoria"]}
                      onChange= {(value) => this.handleChangeSelect(value, "categoria")}
                      treeCheckable= {true}
                      searchPlaceholder= {this.stringTranslate("SelectCategoria")}
                      showSearch= {false}
                      size= "large"
                      style= {{ width: "100%", }}
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto'}}
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
                  <FormGroup>     
                    <Button block type="primary" loading={this.state.loadingButtonPesquisar} size="large"  onClick={() => this.pesquisar()}>{this.stringTranslate("Botao.Pesquisar" )}</Button>
                  </FormGroup>     
                </Col>
              </Row>                       

              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row type="flex" justify="space-between" align="top" gutter={16}>
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
                <CardHeader tag="h4">
                {this.stringTranslate("Ajustes.Jornada.Label.AlteraçãoJornada")}
                </CardHeader>
                <CardBody>
                    <Label for="examplePassword">{this.stringTranslate("Ajustes.Jornada.Label.NovaJornada")}</Label>
                    <Row>
                      <Col xs={4} style={{paddingRight: '5px'}}>
                        <Spin spinning={this.state.loadingJornadas}> 
                          <Input
                            type="text"
                            name="idJornada"
                            value={this.valores["idJornada"]}
                            id="idJornada"
                            style={{padding: "10px 5px 10px 5px", textAlign: "center"}}
                            onChange={e => {this.onChange(e); this.setState({true:true})}}
                            mask="999" tag={InputMask}
                            maskChar={null}
                          />
                        </Spin>
                      </Col>
                      <Col xs={20}  style={{paddingLeft: '5px'}}>
                        <Spin spinning={this.state.loadingJornadas}> 
                          <Select                            
                            style={{ width: '100%' }}
                            placeholder="Selecione uma Jornada"
                            size="large" 
                            value={this.valores["idJornada"]}
                            onChange={e => {this.handleChangeSelect(e, "idJornada") ; this.setState({true:true})}}        
                          >
                            {this.valores["historica"] === false ?
                              this.state.jornadas.map((prop,key) => {
                                return(
                                  <Option value={key.toString()}>{prop}</Option>
                              )})
                          : this.state.jornadasComHistorico.map((prop,key) => {
                            return(
                              <Option value={key.toString()}>{prop}</Option>
                          )})}
                                                    
                          </Select>
                          </Spin>
                          <Switch size="small" onChange={(e) => this.toggleCollapse(e, "historica")} defaultChecked={this.valores["historica"]} /> <Label style={{marginLeft: "7px"}} onClick={() => this.toggleCollapse(!this.valores["historica"], "historica")} > {this.stringTranslate("Ajustes.Jornada.Switch.MostrarHistoricas")}</Label> 
                      </Col>                                       
                    </Row>

                  <Row type="flex"  justify="space-between" align="bottom" gutter={16}>
                    <Col md={24} sm={24} xs={24}>
                    <FormGroup>
                    <Label >{this.stringTranslate("Ajustes.Jornada.Label.JornadasASeremAlteradas")}</Label>
                    <Select                            
                      style={{ width: '100%' }}
                      placeholder=""
                      size="large"                          
                      defaultValue={this.valores["selectJornada"]}
                      onChange={e => {this.handleChangeSelect(e, "selectJornada"); this.setState({true:true})}}        
                    >
                        <Option value={0}>{this.stringTranslate("Ajustes.Jornada.Select.Option1")}</Option>       
                        <Option value={1}>{this.stringTranslate("Ajustes.Jornada.Select.Option2")}</Option>                  
                    </Select>
                    </FormGroup>
                    </Col>
                  </Row>
                  { this.valores["selectJornada"] === 1 ? (
                    <FormGroup>                    
                    <Row>
                      <Col xs={4} style={{paddingRight: '5px'}}>
                      <Spin spinning={this.state.loadingJornadas}> 
                        <Input
                          type="text"
                          name="idJornadaAntiga"
                          value={this.valores["idJornadaAntiga"]}
                          id="idJornadaAntiga"
                          style={{padding: "10px 5px 10px 5px", textAlign: "center"}}
                          onChange={e => {this.onChange(e) ; this.setState({true:true})}}
                          mask="999" tag={InputMask}
                          maskChar={null}
                        />
                        </Spin>
                      </Col>
                      <Col xs={20}  style={{paddingLeft: '5px'}}>
                        <Spin spinning={this.state.loadingJornadas}> 
                          <Select                            
                            style={{ width: '100%' }}
                            placeholder="Selecione uma Jornada"
                            size="large"    
                            value={this.valores["idJornadaAntiga"]}
                            onChange={e => {this.handleChangeSelect(e, "idJornadaAntiga") ; this.setState({true:true})}}        
                          >
                            {this.state.jornadas.map((prop,key) => {
                              return(
                                <Option value={key.toString()}>{prop}</Option>
                            )})}                           
                          </Select>
                          </Spin>
                      </Col>                                       
                    </Row>
                  </FormGroup>
                  ) : null}
                  <Row type="flex"  justify="space-between" align="middle" gutter={16}>                    
                    <Col md={10} sm={24} xs={24}>       
                      <FormGroup>
                        <Button 
                          block 
                          type="primary" 
                          size="large"                           
                          onClick={() => this.alteraJornada()}
                          loading={this.state.loadingButtonAlterar}>
                            { this.state.loadingButtonAlterar === false ? this.stringTranslate("Botao.Alterar") : this.stringTranslate("Botao.Alterando")}                        
                        </Button>                                      
                      </FormGroup>            
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

export default injectIntl(AjustesJornada);
