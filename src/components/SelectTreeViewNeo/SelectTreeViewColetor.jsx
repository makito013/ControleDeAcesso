import React from "react";
import { post } from "utils/api";
import { Label } from 'reactstrap';
import {Button, Tree, Skeleton, Switch} from 'antd';
import { injectIntl } from "react-intl";

class SelectTreeViewNeo extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            value: undefined,
            arvore: [],
            loading:true,
             update: this.props.update,
             expandedKeys: [] ,
             autoExpandParent: true,
             checkedKeys: [],
             selectedKeys: [],
            pesquisou:false,
            mostrartodos: false,
            valores:"",
            // expand:this.props.expand,

             

        };
        this.arraydetodos=[];
        this.filhos =[];
        this.reloadArvore();
    }

    pesquisa(expand)
    {
      this.setState({ checkedKeys:expand, selectedKeys: expand,autoExpandParent: true});
    }

    genTreeNode = (id,title,filhos) => {
        // arraylotacao.push({value: parseInt(lotacao.CodLotacao), title: lotacao.Nome,pai: parseInt(lotacao.codEmpresa)})
         return {
           value: id,
           key: id,
           title: title,
           children: filhos,
           isLeaf:true
         };
    };
     
   
      onChange = value => {

        this.setState({ value });
      };
    

    stringTranslate(id){
      return this.props.intl.formatMessage({id: id});
  }
    reloadArvore(){
     var temfilhocarregado=false;
    this.arraydetodos=[];
      //console.log( this.props.arraysecao);
      var filhosSecaoCopia= []
        if (this.props.arrayFilhos.length > 0 ){
          filhosSecaoCopia=this.props.arrayFilhos;
        }
        else {
        var filhosSecaoCopia =this.filhos;
       }
        var pesquisou= this.props.pesquisou;
        var groupedOptions =[];
        this.props.arrayempresa.forEach((itemempresa) => {
    
          var filhoslotacao = [];
          this.props.arraylotacao.forEach((valuelotacao) => {
              if(valuelotacao.codEmpresa === itemempresa.CodEmpresa){
                
                  var filhos=[];
                    this.props.arraysecao.forEach(function(valuesecao){
                    
                      if(valuesecao.codLotacao === valuelotacao.CodLotacao){
                        if (filhosSecaoCopia[valuesecao.CodSecao] !== undefined || pesquisou === false){
                          filhos.push({value: valuesecao.CodSecao, key: valuesecao.CodSecao+'-secao', title: valuesecao.Nome,tipo:'secao' ,disabled:filhosSecaoCopia[valuesecao.value] === undefined ? false: false, children: filhosSecaoCopia[valuesecao.CodSecao] === undefined ? "" : filhosSecaoCopia[valuesecao.CodSecao] });
                         if (filhosSecaoCopia[valuesecao.CodSecao] !== undefined)
                          temfilhocarregado=true;
                        }
                       }
                     }); 
                     if (filhos.length >0   || pesquisou=== false)
                         filhoslotacao.push({value: valuelotacao.CodLotacao, key: valuelotacao.CodLotacao+'-lotacao', title: valuelotacao.Nome,children: filhos, tipo:"lotacao"})  
              }
          })             
          if (filhoslotacao.length >0  || pesquisou === false)
          {
            this.arraydetodos.push(itemempresa.CodEmpresa+'-empresa')
            groupedOptions.push({value: itemempresa.CodEmpresa, key: itemempresa.CodEmpresa+'-empresa', title: itemempresa.Nome, children: filhoslotacao,tipo:'empresa'});
          }
        })
      this.state.expandedKeys=  this.props.expand != [] ? this.props.expand :this.state.expandedKeys; 
      this.state.arvore =groupedOptions;
      this.state.mostrartodos=!temfilhocarregado;
   
      this.state.loading = false;
    }  
    onLoadData = treenode =>

    new Promise(resolve => {
    const { value,tipo } = treenode.props;
       if (tipo === "secao" && this.props.expand.length === 0  ){
       const body={
         cmd:"gerarArvoredePesquisa", 
         codsecao: value,
         incluirresidente: this.state.valores["incluirresidente"] !== undefined ? this.state.valores["incluirresidente"].value : true,
         incluirpreautorizado: this.state.valores["incluirpreautorizado"] !== undefined ? this.state.valores["incluirpreautorizado"].value : true,
         incluirprecisaliberacao: this.state.valores["incluirprecisaliberacao"] !== undefined ? this.state.valores["incluirprecisaliberacao"].value : false,
         incluirnaoresidenteautorizado: this.state.valores["incluirnaoresidenteautorizado"] !== undefined ? this.state.valores["incluirnaoresidenteautorizado"].value : true,
         incluirinativos: this.state.valores["incluirinativos"] !== undefined ? this.state.valores["incluirinativos"].value : false,
         qualquerparte: this.state.valores["qualquerparte"] !== undefined ? this.state.valores["qualquerparte"].value : true,

         token:sessionStorage.getItem("token"),
       }
       
       var terminado = false;
       new Promise(resolve => {
   
        post(body).then(lista =>{     
          if(lista.error === undefined)
          {
            var  ListaPessoas = lista.dados.ListaPessoas;
           
            //bmthis.filhos = []
            this.filhos[value]=[];
             ListaPessoas.forEach((item) => {
               
                 this.filhos[value].push(this.genTreeNode(item.codigo,item.nome))
     
              })
              console.log(lista.dados);
              console.log(this.filhos[value]);
               this.setState({loading:!this.state.loading})
          }                
          else
          {
            this.state.mensagemErro = this.stringTranslate("Liberacao.erro");
          } 
        });
        terminado = true;
        resolve();
      })
      var interval = setInterval(() => {
        if(terminado === true){          
          clearInterval(interval)
          resolve();
        }
          
      }, 100)
     }   
     else
      resolve(); 
    })
    
    mostrartodos(e){
      
      this.state.mostrartodos= e;
      this.filhos= [];
      if (e === true)
        this.props.mostrartodos();

      this.setState({checkedKeys: this.arraydetodos});  

    }
    onExpand = expandedKeys => {
      this.props.expandAtualizar([]);
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.setState({
        expandedKeys,
        autoExpandParent: false,
      });
    };
  
    onCheck = (checkedKeys, e) => {
      console.log('e', e);
      this.props.setValores(checkedKeys);
      this.setState({ checkedKeys });

    };
  
    onSelect = (selectedKeys, info) => {
      this.setState({ selectedKeys });
    };
    render() {
     
        const { treeData } = this.state;
        this.reloadArvore()

        return (
          <>
          <Button type="link"size="large" onClick={()=>this.setState({checkedKeys:this.arraydetodos})}> {this.stringTranslate("SelectTree.MarcarTodos")}</Button>
          <Button type="link"size="large" onClick={()=>this.setState({checkedKeys:[]})}>{this.stringTranslate("SelectTree.DesmarcarTodos")}</Button>
             {/* <Switch size="small"  checked = {this.state.mostrartodos} onChange={(e) => this.mostrartodos(e)} style={{verticalAlign: "super"}}/> <Label style={{marginLeft: "7px"}} style={{marginTop: "5px"}} > Mostrar todos</Label>  */}
         
          <Tree
            checkable 
            autoExpandParent= { this.state.autoExpandParent }
  
        //   defaultExpandAll = { this.state.expandedKeys> 0 ? true :true}
          //  expandedKeys={ this.state.expandedKeys}
         
            onCheck={this.onCheck}
            checkedKeys={ this.state.checkedKeys}
            onSelect={this.onSelect}
             selectedKeys={ this.state.selectedKeys}
            style={{ width: 300 }}
           
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          
            onExpand={this.onExpand}
            loadData={this.onLoadData}
            treeData={this.state.arvore}
          />
          
          </>
      
        );
      } 
      

}

export default injectIntl(SelectTreeViewNeo);