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
import { FormGroup, Label, Input, CustomInput  } from 'reactstrap';
import { post,postAdonis } from "utils/api";
import InputMask from 'react-input-mask';
import { toast, Slide } from 'react-toastify';
import { injectIntl } from "react-intl";
import { Tree, Skeleton, TreeSelect, Spin, Table, Modal } from 'antd';
import { Select, Switch, DatePicker, Row, Col } from 'antd';
import { Button } from 'antd';
import SelectTreeViewNeo from '../../components/SelectTreeViewNeo/SelectTreeViewNeo';
import { pegaData } from "../../components/dataHora";
import  moment  from "moment";


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
class TempoPermanencia extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          valores: {"idJornadaAntiga" : "", "idJornada" : "", "indeterminado" : false, "historica": false, "dataInicio" : moment().subtract(30, "days"), "selectJornada": 0, "historica": false, "prazo": [moment().subtract(30, "days"), moment()]}, 
          categorias: [{title: "Aguarde...", value:"", disabled:true}],
          loadingJornadas: true,
          loadingIndex: true,
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
          dadosRelatorio: [],
          toggleFiltro: [],
          modal: false,
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
        this.reloadArvore = this.reloadArvore.bind(this);
        this.onLoadData = this.onLoadData.bind(this);
        this.handleChangeSelect = this.handleChangeSelect.bind(this);
        this.onChange = this.onChange.bind(this);
        this.renderSelect = this.renderSelect.bind(this);
        this.mostrartodos = this.mostrartodos.bind(this);
        this.expand = this.expand.bind(this);
        this.expandAtualizar= this.expandAtualizar.bind(this);
        this.setValores =  this.setValores.bind(this);
        this.gerarRelatorio = this.gerarRelatorio.bind(this);
        this.setModal = this.setModal.bind(this);
        this.abrirRelatorio = this.abrirRelatorio.bind(this);
        this.onToggled = this.onToggled.bind(this);
        this.consultaIndex = this.consultaIndex.bind(this)
        this.totalCategorias = 0;
        this.consultaIndex();    
        
        this.colunasRelatorio = [
        {
            title: this.stringTranslate("Label.Nome"),
            dataIndex: 'nome',
        },
        {
            title: this.stringTranslate("Label.Data"),
            dataIndex: 'data',
        },
        {
            title: this.stringTranslate("Label.Permanencia"),
            dataIndex: 'tempoPermanencia',
        },
        {
            title: this.stringTranslate("Label.LocalAcesso"),
            dataIndex: 'localAcesso',
        },
        {
            title: this.stringTranslate("Label.Entrada")+"1",
            dataIndex: 'entrada1',
        },
        {
            title: this.stringTranslate("Label.Saiu")+"1",
            dataIndex: 'saida1',
        },
        {
            title: this.stringTranslate("Label.Entrada")+"2",
            dataIndex: 'entrada2',
        },
        {
            title: this.stringTranslate("Label.Saiu")+"2",
            dataIndex: 'saida2',
        },
        {
            title: this.stringTranslate("Label.Entrada")+"3",
            dataIndex: 'entrada3',
        },
        {
            title: this.stringTranslate("Label.Saiu")+"3",
            dataIndex: 'saida3',
        },
        {
            title: this.stringTranslate("Label.Entrada")+"4",
            dataIndex: 'entrada4',
        },
        {
            title: this.stringTranslate("Label.Saiu")+"4",
            dataIndex: 'saida4',
        },
        {
            title: this.stringTranslate("Label.Entrada")+"5",
            dataIndex: 'entrada5',
        },
        {
            title: this.stringTranslate("Label.Saiu")+"5",
            dataIndex: 'saida5',
        },
        ];
    }

    abrirRelatorio(){
      this.gerarRelatorio();
      this.setModal();
    }

    // Post Adonis
    consultaIndex() {
      const body = {       
        "token": sessionStorage.getItem("token"),        
      }
      postAdonis(body,"/Index/TempoPermanencia").then((lista) =>{
        console.log(body);
        console.log(lista);
        if (lista.retorno){          
          //------------------Locais Acesso
          var data = lista.LocaisAcesso.dados;
          var dataTable = [{value: 9999, title: "TODOS"}];
          data.map((prop) => {
              dataTable.push({value: parseInt( prop.CodLocalAcesso), title: prop.Nome})
          })
          this.state.locais = dataTable;
          //------------------Fim Locais Acesso
          
          //------------------Categorias
          var arrayPai = [];
          var arrayFilho = [];
          var padrao = [];
          var array = lista.Categoria.dados.map((item, key) => { 
              this.totalCategorias++;                 
              if(item.CodCategoriaSuperior === null)
                  arrayPai.push({value: parseInt(item.CodCategoria), title: item.Nome})
              else
                  arrayFilho.push({value: parseInt(item.CodCategoria), key: parseInt(item.value), title: item.Nome, pai: parseInt(item.CodCategoriaSuperior)})    
                  
              padrao.push(parseInt(item.CodCategoria))            
              
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
          //------------------Fim Categorias

          //------------------Empresa/Lotacao/Secao
           this.secao = lista.EmpresaLotacaoSecao.Secao.dados;  
           this.lotacao= lista.EmpresaLotacaoSecao.Lotacao.dados;    
           this.empresa = lista.EmpresaLotacaoSecao.Empresa.dados;              
          //------------------Fim Empresa/Lotacao/Secao
          this.contErro = 0; 
          this.setState({loadingIndex: false, update:true});                  
        }
        // Em caso de Erro tente De Novo
        else{
          if(this.contErro++ >= 3){
            this.contErro = 0;
            toast.dismiss();
            toast.error(this.stringTranslate("Erro.Servidor"), toastOptions);
          }            
          else
            this.consultaIndex();         
        }
      }).catch((error) => {
          if(this.contErro++ >= 3){
            this.contErro = 0;
            toast.dismiss();
            toast.error(this.stringTranslate("Erro.Servidor"), toastOptions);
          }            
          else
            this.consultaIndex();
        }) //Fim Catch       
        //Fim Em caso de Erro tente De Novo
    }// Fim Consulta Index
    

    gerarRelatorio(){
      if(this.state.valores.prazo === undefined ||
        this.state.valores.prazo[0] === undefined ||
        this.state.valores.prazo[1] === undefined){
          toast.dismiss();
          toast.warning(this.stringTranslate("Warning.dateNull"));
          return;
      }
      if(this.state.valores.locaisAcesso === undefined){
          toast.dismiss();
          toast.warning(this.stringTranslate("Warning.localAcessoNull"));
          return;
      }
      if(this.state.keys.pessoav === undefined &&
        this.state.keys.secaov === undefined &&
        this.state.keys.lotacaov === undefined &&
        this.state.keys.empresav === undefined){
          toast.dismiss();
          toast.warning(this.stringTranslate("Warning.pessoaNull"));
          return;
      }

      

      const body = {
        "cmd": "tempoPermanencia",
        "token": sessionStorage.getItem("token"),
        "dataInicio": this.state.valores.prazo[0].format("YYYY-MM-DD 00:00:00"),
        "dataFim": this.state.valores.prazo[1].format("YYYY-MM-DD 23:59:59"),
        "codLocaisAcesso": this.state.valores.locaisAcesso.toString(),
        "incluirDesativados": this.state.toggleFiltro["desativados"],
        "incluirVisitantes": this.state.toggleFiltro["visitantes"],
        "pessoas":{
          "pessoav": this.state.keys.pessoav.toString(),
          "secaov": this.state.keys.secaov.toString(),
          "lotacaov": this.state.keys.lotacaov.toString(),
          "empresav": this.state.keys.empresav.toString()
        }
      }
      post(body).then((data) =>{
        console.log(body);
        console.log(data);
        if (data.retorno){
          this.state.dadosRelatorio = [];
          data.dados.permanencia.map((prop) =>{
            this.state.dadosRelatorio.push(
              {
                nome: prop.pessoa,
                data: prop.data,
                localAcesso: prop.localAcesso,
                tempoPermanencia: prop.tempoPermanencia,
                entrada1: prop.entrada1 !== undefined ? prop.entrada1 : null,
                saida1: prop.saida1 !== undefined ? prop.saida1 : null,
                entrada2: prop.entrada1 !== undefined ? prop.entrada1 : null,
                saida2: prop.saida2 !== undefined ? prop.saida1 : null,
                entrada3: prop.entrada3 !== undefined ? prop.entrada1 : null,
                saida3: prop.saida3 !== undefined ? prop.saida1 : null,
                entrada4: prop.entrada4 !== undefined ? prop.entrada1 : null,
                saida4: prop.saida4 !== undefined ? prop.saida1 : null,
                entrada5: prop.entrada5 !== undefined ? prop.entrada1 : null,
                saida5: prop.saida5 !== undefined ? prop.saida1 : null,
              }
            );
          })
          this.setState({dadosRelatorio: this.state.dadosRelatorio});
          this.setModal();
        }else{
          toast.error("Error: "+data.mensagem, {
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

    setModal(){
      this.setState({modal: !this.state.modal});
    }

    onToggled(toggle){
      this.state.toggleFiltro[toggle] = !this.state.toggleFiltro[toggle];
      this.setState({toggleFiltro: this.state.toggleFiltro});
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
        if(key === "locaisAcesso" && e.indexOf(9999) !== -1 ){
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
      //this.setState({valores: this.state.valores});
    }


    // MARK: POST ALTERA JORNADA
    async alteraJornada(){      
      if((this.state.valores["indeterminado"] === false && this.state.valores["prazo"] === "") || (this.state.valores["indeterminado"] === true && this.state.valores["dataInicio"] === ""))
      {
        toast.dismiss();
        toast.warning(this.stringTranslate("Ajustes.Jornada.Toast.ErroPrazo"), toastOptions);
        return
      }

      this.setState({loadingButtonAlterar: true});
      var data = this.state.valores["prazo"];
      const body={
        cmd:"alteracaojornada",
        datainicio: this.state.valores["indeterminado"] === false ? pegaData(data[0]._d.toDateString()) : pegaData(this.state.valores["dataInicio"]._d.toDateString()),
        datafim: this.state.valores["indeterminado"] === false ? pegaData(data[1]._d.toDateString()) : "",
        newjornada: this.state.valores["idJornada"],
        oldjornada: this.state.valores["idJornadaAntiga"],
        itensbusca: {
          empresav: this.state.keys.empresav.toString(),
          lotacaov: this.state.keys.lotacaov.toString(),
          pessoav: this.state.keys.pessoav.toString(),
          secaov: this.state.keys.secaov.toString(),
        },
        token: sessionStorage.getItem("token"),
      }
      post(body).then(lista =>{
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
        ((this.state.valores["categoria"] !== undefined) &&
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
        post(body).then(lista =>{     
          this.setState({loadingButtonPesquisar: false});
          if(lista.error === undefined)
          {
            var filhosSecao= lista.dados.ListaPessoas;
            this.state.expand=[];
            this.filhosSecao =[];
             lista.dados.ListaPessoas.forEach((item) => {
              if(this.filhosSecao[item.codSecao] === undefined){
                this.filhosSecao[item.codSecao]= [];
              }
              (this.genTreeNode(item.codigo,item.nome))
              this.filhosSecao[item.codSecao].push(this.genTreeNode(item.codigo,item.nome));
          
              this.state.expand.push((item.codigo));
            })
         //   this.reloadArvore();
            if  (lista.dados.ListaPessoas.length >0){
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
         incluirprecisaliberacao: this.state.valores["incluirprecisaliberacao"] !== undefined ? this.state.valores["incluirprecisaliberacao"].value : true,
         incluirnaoresidenteautorizado: this.state.valores["incluirnaoresidenteautorizado"] !== undefined ? this.state.valores["incluirnaoresidenteautorizado"].value : true,
         incluirinativos: this.state.valores["incluirinativos"] !== undefined ? this.state.valores["incluirinativos"].value : false,
         qualquerparte: this.state.valores["qualquerparte"] !== undefined ? this.state.valores["qualquerparte"].value : true,
         token:sessionStorage.getItem("token"),
       }
   
   
       new Promise(resolve => {
   
         post(body).then(lista =>{     
           if(lista.error === undefined)
           {
             var  ListaPessoas = lista.dados.ListaPessoas;
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
              <CardHeader tag="h4"> {this.stringTranslate("Routes.relatorio8")} </CardHeader>
              <CardBody style={{marginTop: "5px"}}>
              <Row type="flex" justify="space-between" align="bottom" gutter={16}>
                <Col md={12} sm={24} xs={24}>
                  <FormGroup>                      
                    <Label for="pesquisa" style={{textTransform: "uppercase"}}>{this.stringTranslate("Label.Pesquisar")}</Label>                        
                    <Input type="text"
                      name= "pesquisa" 
                      //value= {this.state.valores["pesquisa"]}
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
                    <Spin spinning={this.state.loadingIndex}>
                    <TreeSelect     
                      value= {this.state.valores["categoria"]}
                      allowClear = {true}
                      onChange= {(value) => this.handleChangeSelect(value, "categoria")}
                      treeCheckable= {true}
                      searchPlaceholder= {this.stringTranslate("SelectCategoria")}
                      showSearch= {false}
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
                    <FormGroup style={{paddingBottom:"25px"}}>
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
                  <Skeleton loading={this.state.loadingIndex} active>
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
                                <Spin spinning={this.state.loadingIndex}>
                                    <TreeSelect     
                                        value= {this.state.valores.locaisAcesso}
                                        onChange= {(value) => this.handleChangeSelect(value, "locaisAcesso")}
                                        allowClear = {true}
                                        treeCheckable= {true}                         
                                        searchPlaceholder= {this.stringTranslate("Label.SelectLocalAcesso")}
                                        showSearch= {true}
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
                            onClick={() => this.gerarRelatorio()}
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
            <Table scroll={{x:"2000px"}} columns={this.colunasRelatorio} dataSource={this.state.dadosRelatorio} />
        </Modal>
        </div>
       </>
    );
  }
}

export default injectIntl(TempoPermanencia);
