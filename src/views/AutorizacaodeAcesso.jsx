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
  Row,
  Col,
  Nav,
  UncontrolledTooltip,
  CardHeader,
  CardBody,
  Card,
} from "reactstrap";
import { Button, FormGroup, Label  } from 'reactstrap';
import { post,postAdonis } from "utils/api";
import { toast, Slide } from 'react-toastify';

import { injectIntl } from "react-intl";
import { Skeleton, TreeSelect, DatePicker, TimePicker, Select,  Input, Spin  } from 'antd';
import br from 'antd/es/date-picker/locale/pt_BR';
import en from 'antd/es/date-picker/locale/en_US';
import {pegaData, pegahorario} from 'components/dataHora'

import SelectTreeViewNeo from 'components/SelectTreeViewNeo/SelectTreeViewNeo';
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


const vazio = {value: "", label: ""};                
class AutorizacaodeAcesso extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        valores: {"pesquisa":"", "categoria":[],"descricao":""},   
          filtrosPage: false,
          modal: false,
          statusModal: "",     
          timePost:[],   
          data: [],
          toggleFiltro: [],
          pessoas: "",
          subCategorias: [], 
          reload: false,
          arvore:"",
          update:false,
          loading: true,
          categorias: [{title: "Aguarde...", value:"", disabled:true}],
          expand:[],
          pesquisou: false,
          loadingAutorizacao: false,
          loadingRevogar: false,

          keys:{
            empresav:[],
            lotacaov:[],
            secaov:[],
            pessoasv:[],
            
          },
          startValue: null,
          endValue: null,
          endOpen: false,
          localselecionado:1,
          locale: sessionStorage.getItem("locale")
      };
    
      this.arrayempresa =  [];
      this.arraylotacao=   [];
      this.arraysecao =    [];
      
      this.valores ={
        diaInicio: moment(),
        diaFim: moment().add(10, "days"),
        horaInicio: moment("00:00", "HH:mm"),
        horaFim: moment("23:59", "HH:mm"),
      };

      this.handleChangeTimeDate = this.handleChangeTimeDate.bind(this);
      this.onToggled = this.onToggled.bind(this);
      this.handleChangeMulti = this.handleChangeMulti.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.onChange = this.onChange.bind(this);
      this.stringTranslate = this.stringTranslate.bind(this);
      this.loadSubCategorias = this.loadSubCategorias.bind(this);
      this.renderOptionsLocaisAcesso = this.renderOptionsLocaisAcesso.bind(this);
      this.index = this.index.bind(this);
      /// CARREGA VALORES EMPRESA / LOACAO / SECAO / LOCAIS ACESSO
      this.empresa = [];
      this.totalempresa=0;
      this.lotacao = [];
      this.secao = [];
      this.locaisAcesso = [];
      this.filhosSecao = [];
      this.index();
      // this.loadCategorias();
      // this.consultaDadosELT();
     //  this.consultaLocaisacesso();
 
      ///-------------------------------------------------------//
      this.loadOptions = this.loadOptions.bind(this);
      this.loadCategorias = this.loadCategorias.bind(this);
      this.filtrosToggle = this.filtrosToggle.bind(this);
      this.preencherOptions = this.preencherOptions.bind(this);
      this.toggle = this.toggle.bind(this);
      this.imprime = this.imprime.bind(this);
      this.pesquisar = this.pesquisar.bind(this);
      this.limparFiltros = this.limparFiltros.bind(this);     
      this.limpaValores = this.limpaValores.bind(this);
      this.renderSelect = this.renderSelect.bind(this);
      this.handleChangeSelect = this.handleChangeSelect.bind(this);
      this.expand = this.expand.bind(this);
      this.expandAtualizar= this.expandAtualizar.bind(this);
      this.setValores =  this.setValores.bind(this);
      this.mostrartodos = this.mostrartodos.bind(this);
   //   this.reloadArvore = this.reloadArvore.bind(this);
      
     // this.onLoadData = this.onLoadData.bind(this);
      /// VALROES INICIAIS DAS VARIAVEIS
      this.state.valores["empresa"] = this.state.valores["lotacao"] = vazio;
      //this.loadCategorias();
      ///---------------------------------------------------------//
  }
  componentWillMount() {
  //  this.setState({locale:this.props.locale})


  }
  index(){
    const bodyAcesso = {
      
      token: sessionStorage.getItem("token")
  
    }
    postAdonis(bodyAcesso,'/Index/AutorizacaoAcesso').then((data) =>{
      var dados = data.dados
      if(data.retorno)
        {
          this.contErro = 0;
          var codigos =[]; 
          var codigosComHistorico =[]; 
         // console.log(dados);
          // dados.listaJornada.forEach((item) =>{ 
          //   if(item.historica === 0)                                              
          //     codigos[item.CodJornada] = item.nome; 

          //   codigosComHistorico[item.CodJornada] = item.nome; 
          // }); 
 
        //  this.setState({jornadas: codigos, jornadasComHistorico: codigosComHistorico, loadingJornadas: false});        
          this.secao = dados.secao;  
          this.lotacao= dados.lotacao;    
          this.empresa = dados.empresa;    
          this.locaisAcesso = data.dados.listaLocaisAcesso;
          this.setState({reload: !this.state.reload,update:true, loading: false}); // para recarregar os valores recebido do servidor para o select
          var arrayPai = [];
          var arrayFilho = [];
          var padrao = [];
           dados.categoria.forEach((item) => { 
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
          this.state.valores["categoria"] = padrao;
          this.setState({categorias: groupedOptions, valores: this.state.valores, loadingCategoria: false}) 
        
        }
      })
    }
    //   if(data.retorno){
    //     console.log(data.dados)
        
    //     this.state.categorias = data.dados.categorias
    //     this.locaisAcesso = data.dados.listaLocaisAcesso;
    //     this.secao = data.dados.secao;
    //     this.lotacao= data.dados.lotacao;
    //     this.empresa = data.dados.empresa;
    //     // .map(props =>{
    //     // //  return([props.CodLocalAcesso, props.Nome]);
    //     //   return{value:props.CodLocalAcesso,label:props.Nome]}
    //     // })

    //     this.setState({reload: !this.state.reload,  categorias:this.state.categorias,loading :false}); // para recarregar os valores recebido do servidor para o select
    //   }else
    //     toast.error(this.stringTranslate("Veiculo.Requisicao.CadastroVeiculo.Erro3"), toastOptions);              
    // });
  //}

  consultaLocaisacesso(){
    const bodyAcesso = {
      cmd: "consultaLocaisAcesso",
      token: sessionStorage.getItem("token"),
      resumido: true
    }
    post(bodyAcesso).then((data) =>{
      if(data.retorno){
        this.locaisAcesso = data.dados.ListaLocaisAcesso;
        
        // .map(props =>{
        // //  return([props.CodLocalAcesso, props.Nome]);
        //   return{value:props.CodLocalAcesso,label:props.Nome]}
        // })

        this.setState({reload: !this.state.reload}); // para recarregar os valores recebido do servidor para o select
      }else
        toast.error(this.stringTranslate("Veiculo.Requisicao.CadastroVeiculo.Erro3"), toastOptions);              
    });
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
        
  consultaDadosELT(){
    const body = {
      "cmd": "listasecaolotacaoempresa",
      "token": sessionStorage.getItem("token"),
    }
    post(body).then((data) =>{
      if(data.retorno){

        this.secao = data.dados.secao;

        this.lotacao= data.dados.lotacao;
    

        this.empresa = data.dados.empresa;

        this.setState({reload: !this.state.reload,update:true}); // para recarregar os valores recebido do servidor para o select
      }else
        toast.error(this.stringTranslate("Veiculo.Requisicao.CadastroVeiculo.Erro3"), toastOptions);            
    });
  }

 
  handleChangeSelect(e, key){
    this.state.valores[key] = e;
    this.setState({valores: this.state.valores})
  }  

  verificaCampos(){
    if(this.valores.diaInicio === null || this.valores.horaInicio === null)
    {
      toast.dismiss();
      toast.warning(this.stringTranslate("Warning.CampoInicio"), toastOptions);
      return 0
    }

    return 1
  }

  autorizar(){
    if(this.verificaCampos() === 0)
      return

    this.setState({loadingAutorizacao: true});
    const body={
      cmd:"autorizacaodeacesso",
      datainicio:pegaData(this.valores.diaInicio),
      horainicio: pegahorario(this.valores.horaInicio),
      datafim: pegaData(this.valores.diaFim),
      horafim: pegahorario(this.valores.horaFim),
      descricao:this.state.valores["descricao"],
      localacesso: this.state.localselecionado,
      itensbusca:this.state.keys,
      token:sessionStorage.getItem("token"),
    }
    postAdonis(body,'/AutorizacaoAcesso/Autorizar').then(lista =>{
    //post(body).then(lista =>{
        this.setState({loadingAutorizacao: false});
        if(lista.error === undefined)
        {
          toast.dismiss();
          toast.success(this.stringTranslate("Sucesso.Autorizacao"), toastOptions);
        }
        else
        {
          toast.dismiss();
          toast.error(this.stringTranslate("Erro.Servidor"), toastOptions);
        }
    }).catch(e => {
        this.setState({loadingAutorizacao: false});
        toast.dismiss();
        toast.error(this.stringTranslate("Erro.Servidor"), toastOptions);
    })
  }

  revogar(){
    this.setState({loadingAutorizacao: true});
    const body={
      cmd:"desautorizacaodeacesso",
      datainicio:pegaData(this.valores.diaInicio),
      horainicio: pegahorario(this.valores.horaInicio),
      datafim: pegaData(this.valores.diaFim),
      horafim: pegahorario(this.valores.horaFim),
      descricao:this.state.valores["descricao"],
      localacesso: this.state.localselecionado,
      itensbusca:this.state.keys,
      token:sessionStorage.getItem("token"),
    }
    postAdonis(body,'/AutorizacaoAcesso/Revogar').then(lista =>{
  //  post(body).then(lista =>{
        this.setState({loadingAutorizacao: false});
        if(lista.error === undefined)
        {
          toast.dismiss();
          toast.success(this.stringTranslate("Sucesso.Revogacao"), toastOptions);
        }
        else
        {
          toast.dismiss();
          toast.error(this.stringTranslate("Erro.Servidor"), toastOptions);
        }
    }).catch(e => {
        this.setState({loadingAutorizacao: false});
        toast.dismiss();
        toast.error(this.stringTranslate("Erro.Servidor"), toastOptions);
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

   //   post(body).then(lista =>{
      postAdonis(body,'/Geral/GerarArvoredePesquisa').then(lista =>{  
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
      });
    }
  }


  onToggled(toggle){

  }



  limparFiltros(){
    this.state.valores = [];
    this.state.valores["tipoProprietario"] = this.preencherOptions("tipoProprietario")[2];
    this.state.valores["tipo"] = this.preencherOptions("tipo")[0];
    this.setState({valores: this.state.valores});
  }

   loadCategorias(){       
    const body={
      cmd:"listacategoria",          
      token: sessionStorage.getItem("token"),
    }
    post(body).then(lista =>{    
      if(lista.error === undefined)
      {      
        // new Promise(resolve => {      
          var arrayPai = [];
          var arrayFilho = [];
          var padrao = [];

          var array = lista.dados.listaCategoria.map((item, key) => { 
              this.totalCategorias++;                           
              if(item.codCategoriaSuperior === undefined)
                  arrayPai.push({value: parseInt(item.codCategoria), title: item.Nome})
              else
                  arrayFilho.push({value: parseInt(item.codCategoria), key: parseInt(item.value), title: item.Nome, pai: parseInt(item.codCategoriaSuperior)})
              padrao.push(parseInt(item.codCategoria))
          })                      
          var groupedOptions = arrayPai.map((item) => {
              var filhos = [];
              arrayFilho.forEach(function(value){
                  if(value.pai === item.value)
                      filhos.push({value: value.value, key: value.value, title: value.title})
              })             

              return {value: item.value, key: item.value, title: item.title, children: filhos};
          })
        //  this.state.valores["categoria"] = padrao;
          this.setState({categorias: groupedOptions})                
        //   resolve(groupedOptions)
        // });     
      }                
      else
      {
        this.state.mensagemErro = this.stringTranslate("Liberacao.erro");
      } 
      
    });
   };

  toggle(status) {
    this.setState({
      modal: !this.state.modal,
      statusModal: status,
    });  
  }

  stringTranslate(id){
    return this.props.intl.formatMessage({id: id});
  }  

  //MARK: OPÇÕES DO SELECT
  preencherOptions(value, pesquisa, idCatAnterior){ 
    var valores = ""
    if(value === "empresa") valores = this.empresa
    else if (value === "lotacao") valores = this.lotacao;
    else if (value === "secao") valores = this.secao;
    else if (value === "tipo") valores = this.tipo
    else if (value === "tipoProprietario") valores = this.tipoProprietario;
    else if (value === "tipoProprietarioModal") valores = this.tipoProprietarioModal;
    else if (value === "locaisAcesso") valores = this.locaisAcesso

    if(valores !== ""){
      var opcoes = [];
      valores.forEach((prop) => {
        if(pesquisa !== undefined && pesquisa !== ""){
          if(prop[0] === pesquisa) opcoes = {value:prop[0],label:prop[1], name: value}
        }
        else{
          if(idCatAnterior !== undefined){
            if(idCatAnterior === prop[2])
              opcoes.push({value:prop[0],label:prop[1], name: value})
          }
          else
            opcoes.push({value:prop[0],label:prop[1], name: value})
        }
           
      })  
       
      return opcoes
    }
    
  }
  //---------------------------------------------------------------------------------------------//

  


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

  filtrosToggle(){
    this.setState({filtrosPage: !this.state.filtrosPage})
  }

  handleChange(e){
    this.state.valores[e.name] = e;
    this.setState({valores: this.state.valores});
  }

  handleChangeTimeDate(e, index){
    this.valores[index] = e;
  }

  handleChangeMulti(e, key){
    if(key === "categorias")
      this.state.valores["subCategorias"] = [];
    
    if(e === null)
      this.state.valores[key] = ""; 
    else
      this.state.valores[key] = e; 
      
    //  this.setState({valores: this.state.valores});
  }

  onChange(e){
    this.state.valores[e.target.name] = e.target.value;
    this.setState({valores: this.state.valores});
  }


  loadOptions (inputValue, callback) {
      
    if(this.state.categorias === ""){
        const body={
          cmd:"listacategoria",          
          token: sessionStorage.getItem("token"),
        }
        post(body).then(lista =>{     
          if(lista.error === undefined)
          {            
            var arrayPai = [];
            var arrayFilho = [];
            var array = lista.dados.listaCategoria.map((item) => {                            
                if(item.codCategoriaSuperior === undefined)
                    arrayPai.push({value: item.codCategoria, label: item.Nome})
                else
                    arrayFilho.push({value: item.codCategoria, label: item.Nome, pai: item.codCategoriaSuperior})                              
            })                  

            var groupedOptions = arrayPai.map((item) => {

                var filhos = [];
                arrayFilho.forEach(function(value){
                    if(value.pai === item.value)
                        filhos.push({value: value.value, label: value.label})
                })             

                return {value: item.value, label: item.label, options: filhos};
            })

            this.setState({categorias: groupedOptions})
            
            if(callback !== undefined)
              callback(arrayPai);                   
          }                
          else
          {
            this.state.mensagemErro = this.stringTranslate("Liberacao.erro");
          } 
        });
    }    
  };


  loadSubCategorias(){    
    var retorno = [{label: "Todos"}];
    
    if(this.state.valores["categorias"] !== undefined && this.state.valores["categorias"] !== null){    
        for(var i = 0; i < this.state.categorias.length; i++){            
            if(this.state.valores["categorias"].value === this.state.categorias[i].value){
                if(this.state.categorias[i].options.length < 1){
                    this.state.valores["subCategorias"] = [{label: "Todos", isFixed: true}];
                    return [{label: "Todos", isFixed: true}];
                }

                retorno.push(this.state.categorias[i].options);
                return this.state.categorias[i].options;
            }
            else if(i === this.state.categorias.length-1){
                return [{label: "Todos", isFixed: true}]
            }
        }
    }
    else
        return [{label: "Selecione uma Categoria", isDisabled: true}]
    

    return retorno
  }

  selectTreeShow(e,index){
    this.state.valores[index]=e;
    this.setState({valores:this.state.valores});     
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


  onLoadData = treenode =>
    new Promise(resolve => {
       resolve();
    })

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

     this.state.keys["empresav"]=empresav.length ===0 ? "":empresav.toString(); 
     this.state.keys["lotacaov"]=lotacaov.length ===0  ? "": lotacaov.toString();
     this.state.keys["secaov"]=secaov.length ===0  ? "":secaov.toString();
     this.state.keys["pessoav"]=pessoav.length ===0  ? "":pessoav.toString();
    }


//MARK: Render Select
  renderSelect(){
    if (this.secao.length !== 0 && this.lotacao.length !== 0 && this.empresa.length !== 0  ){

      return ( <SelectTreeViewNeo mostrartodos={this.mostrartodos} setValores={this.setValores}  arrayempresa={this.empresa} arraylotacao={this.lotacao} expandAtualizar={this.expandAtualizar} arraysecao={this.secao} arrayFilhos={this.filhosSecao} update={this.state.update} pesquisou={this.state.pesquisou} expand={this.expand()}/>)      // return ( <SelectTreeViewNeo treeData={this.state.arvore} arrayempresa={this.empresa} arraylotacao={this.lotacao}  
      //  arraysecao={this.secao} arrayFilhos={this.filhosSecao} update = {this.state.update} pesquisou={this.state.pesquisou} expand={this.state.expand}/>)
    }
    else 
    return null;
  
  }
  
  disabledStartDate = startValue => {
    const { endValue } = this.state;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  disabledEndDate = endValue => {
    const { startValue } = this.state;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  };
  onStartPesquisa = value => {
   
    this.state.valores["pesquisa"] = value.target.value;
    this.setState({
      valores:  this.state.valores
    });
  };
  onStartChange = value => {
    this.onChange('startValue', value);
  };

  onEndChange = value => {
    console.log(value);
    this.onChange('endValue', value);
  };
  onDescricaoChange= value => {
 
    this.state.valores["descricao"] = value.target.value;
    this.setState({
      valores:  this.state.valores
    });
  };
  handleStartOpenChange = open => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  };

  handleEndOpenChange = open => {
    this.setState({ endOpen: open });
  };
   onChangeS(value) {
     this.setState({ localselecionado: value });
   }
  onSearch(val) {
  }


  renderOptionsLocaisAcesso(){
    console.log(this.locaisAcesso)
    var options = this.locaisAcesso.map(props =>{
      //  return([props.CodLocalAcesso, props.Nome]);
        return(<Option value={props.CodLocalAcesso}>{props.Nome}</Option>)
    })
    console.log(options)
    return options
  }
  
  render() {    
    const { startValue, endValue, endOpen } = this.state;   
    var trans =require('antd/es/date-picker/locale/pt_BR'); 
    if (this.state.locale == "br")
        trans = br
    else
    if  (this.state.locale == "en")
      trans = en

 

    const NoOptionsMessage = props => { return ( <div></div> )};

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
                      {this.stringTranslate("Routes.Ajustes2")}  
                  
                </CardHeader>
                <CardBody style={{marginTop: "10px"}}>
                
                
                <Row>
                  <Col md="6">
                    <FormGroup>                      
                      <Label>{this.stringTranslate("Autorizacao.Pesquisa")}</Label>                        
                      <Input 
                        name= "pesquisa" 
                        size="large"
                        value= {this.state.valores["pesquisa"]}
                        onChange={this.onStartPesquisa}
                        onKeyPress={this.onKeyPress}
                        type="TextArea"
                        id="pesquisa" 
                      />                        
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                  <FormGroup> 
                    <Label for="categoria" style={{textTransform: "uppercase"}}>{this.stringTranslate("Label.Categoria")}</Label>  
                    <Spin spinning={this.state.loading}>
                    <TreeSelect     
                      value= {this.state.valores["categoria"]}
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
                  <Col md="2">
                    <Button block color="primary" style={{top: "calc(100% - 54px)", marginBottom: "25px"}} onClick={() => this.pesquisar()}>{this.stringTranslate("Autorizacao.Pesquisar")}</Button>
                  </Col>
                </Row>            


             
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col md="6">
                <Card>
                  <CardBody>  
                  <Spin spinning={this.state.loading}>                        
                    {this.renderSelect()}     
                    </Spin>                  
                  </CardBody>
                </Card>
            </Col>
            <Col md="6">
                <Card >
                  <CardBody>
                    
                      <Row>
                        <Col xl="6" sm="12">  
                        <Label>{this.stringTranslate("Label.DataInicio")}</Label> 
                          <Row>                          
                            <Col xs='7' style={{paddingRight : "3px"}}>
                              <FormGroup>                                
                                <DatePicker
                                  style={{minWidth: "100%"}}
                                  disabledDate={this.disabledStartDate}
                                  format={this.stringTranslate("Format.Date")}
                                  placeholder = {this.stringTranslate("Label.Data")}
                                  onChange={(e) => this.handleChangeTimeDate(e, "diaInicio")}
                                  defaultValue={this.valores.diaInicio}
                                  allowClear = {false}
                                  size="large"
                                />
                              </FormGroup>
                            </Col>
                            <Col xs='5' style={{paddingLeft : "3px"}}>
                              <FormGroup>
                                 <TimePicker 
                                  size="large" 
                                  onChange={(e) => this.handleChangeTimeDate(e, "horaInicio")}
                                  placeholder = {this.stringTranslate("Label.Hora")} 
                                  format={this.stringTranslate("Format.HourNotSecond")} 
                                  style={{width: "100%"}} 
                                  allowClear = {false}
                                  defaultValue={this.valores.horaInicio}
                                /> 
                              </FormGroup>
                            </Col>                         
                          </Row>
                        </Col>
                        <Col xl="6" sm="12">  
                        <Label>{this.stringTranslate("Label.DataFim")}</Label> 
                          <Row>                          
                            <Col xs='7' style={{paddingRight : "3px"}}>
                              <FormGroup>                                
                                <DatePicker
                                  style={{minWidth: "100%"}}
                                  disabledDate={this.disabledStartDate}
                                  format={this.stringTranslate("Format.Date")}
                                  placeholder = {this.stringTranslate("Label.Data")}
                                  onChange={(e) => this.handleChangeTimeDate(e, "diaFim")}
                                  defaultValue={this.valores.diaFim}
                                  allowClear = {false}
                                  size="large"
                                />
                              </FormGroup>
                            </Col>
                            <Col xs='5' style={{paddingLeft : "3px"}}>
                              <FormGroup>
                                 <TimePicker 
                                  placeholder = {this.stringTranslate("Label.Hora")} 
                                  size="large" 
                                  format={this.stringTranslate("Format.HourNotSecond")} 
                                  style={{width: "100%"}} 
                                  allowClear = {false}
                                  onChange={this.handleChangeTimeDate}                                   
                                  defaultValue={this.valores.horaFim}                                  
                                /> 
                              </FormGroup>
                            </Col>                         
                          </Row>
                        </Col>                        
                      </Row>
 
                      <Row>
                        <Col>
                        <Spin spinning={this.state.loading}>    
                          <FormGroup>                      
                            <Label>{this.stringTranslate("Autorizacao.LocalAcesso")}</Label>       
                                                 
                            <Select
                              showSearch
                              style={{ width: "100%", heigth: "80%" }}
                              size="large"
                              onChange={(e)=>this.onChangeS(e)}
                              onSearch={(e)=>this.onSearch(e)}
                              filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                              }
                            >
                              {this.renderOptionsLocaisAcesso()}
                             
                            </Select>                      
                          </FormGroup>
                          </Spin>   
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <FormGroup>                      
                            <Label>{this.stringTranslate("Autorizacao.Descricao")}</Label>      
                            <Input.TextArea onChange={(e) => this.onDescricaoChange(e)} rows={2}/>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col sm="6">    
                          <Spin spinning={this.state.loadingRevogar}>                                     
                            <Button block color="warning" size="large" style={{float:"right", marginLeft:"10px", top: "calc(100% - 48px)", marginBottom: "15px"}} onClick={() => this.revogar()}>{this.stringTranslate("Autorizacao.Revogar")}</Button>
                          </Spin>
                        </Col>
                        <Col sm="6" >    
                          <Spin spinning={this.state.loadingAutorizacao}>                                  
                            <Button block color="primary" size="large" style={{float:"right", marginLeft:"10px", top: "calc(100% - 48px)", marginBottom: "15px"}} onClick={() => this.autorizar()}>{this.stringTranslate("Autorizacao.Autorizar")}</Button>
                          </Spin> 
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

export default injectIntl(AutorizacaodeAcesso);
