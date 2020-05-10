import React from "react";
import { postAdonis } from "utils/api";
import { Button, Tree } from 'antd';
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
            halfChecked: [],
            selectedKeys: [],
            pesquisou:false,
            valores:"",
            // expand:this.props.expand,
        };
        this.mostrartodos=false;
        this.arraydetodos=[];
        this.filhosSecao =[];
        this.local = "";
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
           //checkable: false,
           isLeaf:true,
           
         };
    };
     
   
      onChange = value => {

        this.setState({ value });
      };
    

    stringTranslate(id){
      return this.props.intl.formatMessage({id: id});
  }
    reloadArvore(){
      var secoes=[];
      var temfilhocarregado=false;
      this.arraydetodos=[];
      var filhosSecaoCopia= []
        if (this.props.arrayFilhos.length > 0 ){
          filhosSecaoCopia=this.props.arrayFilhos;
        }
        else {
          var filhosSecaoCopia =this.filhosSecao;
        }
        var pesquisou= this.props.pesquisou;
        var groupedOptions =[];

        this.props.arraysecao.forEach((valuesecao) => {
          if (filhosSecaoCopia[valuesecao.CodSecao] !== undefined && this.props.mudouColetor === false){
            secoes.push({value: valuesecao.CodSecao, key: valuesecao.CodSecao+'-secao', title: valuesecao.Nome,tipo:'secao' ,disabled:filhosSecaoCopia[valuesecao.value] === undefined ? false: false, children: filhosSecaoCopia[valuesecao.CodSecao] === undefined ? "" : filhosSecaoCopia[valuesecao.CodSecao] })
            this.props.setMudouColetor(true);
          }
        }); 

        this.props.arrayempresa.forEach((itemempresa) => {
    
          var filhoslotacao = [];
          this.props.arraylotacao.forEach((valuelotacao) => {
              if(valuelotacao.CodEmpresa === itemempresa.CodEmpresa){
                
                var filhos=[];
                this.props.arraysecao.forEach((valuesecao) => {
                    if(valuesecao.CodLotacao === valuelotacao.CodLotacao){
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
      if (Boolean(this.props.setaSecoes) !== false)
                  this.props.setaSecoes(secoes);
	    this.state.expandedKeys=  this.props.expand.length !== 0 ? this.props.expand :this.state.expandedKeys;
      this.state.checkedKeys= this.props.expand.length !== 0  ? this.props.expand :this.state.checkedKeys; 
      this.props.setValores(this.state.checkedKeys);
      this.state.arvore =groupedOptions;
      this.mostrartodos=!temfilhocarregado;
      this.state.loading = false;
      if ((Boolean(this.props.checkeds) !== false && this.props.checkeds.local !== this.local)){// || this.props.checkeds.checkeds !== this.state.checkedKeys){
        this.state.checkedKeys = [];
        this.state.checkedKeys = this.props.checkeds.checkeds;
        this.local = this.props.checkeds.local;
        this.setState({checkedKeys :this.state.checkedKeys})
      }
      
    }
    onLoadData = treenode =>

    new Promise(resolve => {
    const { value,tipo } = treenode.props;
       if (tipo === "secao" && this.props.expand.length === 0  ){
       const body={        
        codsecao: value,
        incluirresidente: this.state.valores["incluirresidente"] !== undefined ? this.state.valores["incluirresidente"].value : true,
        incluirpreautorizado: this.state.valores["incluirpreautorizado"] !== undefined ? this.state.valores["incluirpreautorizado"].value : true,
        incluirprecisaliberacao: this.state.valores["incluirprecisaliberacao"] !== undefined ? this.state.valores["incluirprecisaliberacao"].value : false,
        incluirnaoresidenteautorizado: this.state.valores["incluirnaoresidenteautorizado"] !== undefined ? this.state.valores["incluirnaoresidenteautorizado"].value : true,
        incluirinativos: this.state.valores["incluirinativos"] !== undefined ? this.state.valores["incluirinativos"].value : false,
        qualquerparte: this.state.valores["qualquerparte"] !== undefined ? this.state.valores["qualquerparte"].value : true,
        cmd:"gerarArvoredePesquisa",
        token:sessionStorage.getItem("token"),
       }
       
       var terminado = false;
       new Promise(resolve => {
   
        postAdonis(body,"/Geral/GerarArvoredePesquisa").then(lista =>{  
        // post(body).then(lista =>{     
          if(lista.error === undefined)
          {
            if (Boolean(this.props.onPessoas) === false){
              var  ListaPessoas = lista.dados;
          
              //bmthis.filhosSecao = []
              this.filhosSecao[value]=[];
              ListaPessoas.forEach((item) => {
                this.filhosSecao[value].push(this.genTreeNode(item.codigo,item.nome))
              })
              this.setState({loading:!this.state.loading});
            }else{
              let teste = this.props.onPessoas(value);
              teste.then((checkeds) => {
                var  ListaPessoas = lista.ListaPessoas;
            
                //bmthis.filhosSecao = []
                this.filhosSecao[value]=[];
                ListaPessoas.forEach((item) => {
                  this.filhosSecao[value].push(this.genTreeNode(item.codigo,item.nome))
                })
                for (var i = 0, j = this.state.checkedKeys.length; i < j; i ++){
                  if ((checkeds.secao+"-secao") === this.state.checkedKeys[i]){
                    this.state.checkedKeys.splice(i,1);
                  }
                }
                this.state.checkedKeys = this.state.checkedKeys.concat(checkeds.checked);
                this.setState({checkedKeys: this.state.checkedKeys});
                this.setState({loading:!this.state.loading});
                this.props.setSelectedKeys(this.state.checkedKeys);
              })
            }
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
      
      this.mostrartodos= e;
      this.filhosSecao= [];
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
      var valor = checkedKeys;
      this.props.setValores(valor);
      this.props.expandAtualizar([]);
      this.setState({ checkedKeys: valor, autoExpandParent: false });
      
    };
  
    onSelect = (selectedKeys, info) => {
      this.setState({ selectedKeys });
    };
    render() {
     
        const { treeData } = this.state;
        this.reloadArvore()

        return (
          <>
          <Button type="link"size="large" onClick={()=>this.onCheck(this.arraydetodos)}> {this.stringTranslate("SelectTree.MarcarTodos")}</Button>
          <Button type="link"size="large" onClick={()=>this.onCheck([])}>{this.stringTranslate("SelectTree.DesmarcarTodos")}</Button>
             {/* <Switch size="small"  checked = {this.mostrartodos} onChange={(e) => this.mostrartodos(e)} style={{verticalAlign: "super"}}/> <Label style={{marginLeft: "7px"}} style={{marginTop: "5px"}} > Mostrar todos</Label>  */}
          <Tree
            checkable 
          //  autoExpandParent= { this.state.autoExpandParent }
  
          // defaultExpandAll = { this.state.expandedKeys> 0 ? true :true}
          //  expandedKeys={ this.state.expandedKeys}
         
            onCheck={this.onCheck}
            checkedKeys={this.state.checkedKeys}
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
// incluirresidente: this.state.valores["incluirresidente"] !== undefined ? this.state.valores["incluirresidente"].value : true,
// incluirpreautorizado: this.state.valores["incluirpreautorizado"] !== undefined ? this.state.valores["incluirpreautorizado"].value : true,
// incluirprecisaliberacao: this.state.valores["incluirprecisaliberacao"] !== undefined ? this.state.valores["incluirprecisaliberacao"].value : true,
// incluirnaoresidenteautorizado: this.state.valores["incluirnaoresidenteautorizado"] !== undefined ? this.state.valores["incluirnaoresidenteautorizado"].value : true,
// incluirinativos: this.state.valores["incluirinativos"] !== undefined ? this.state.valores["incluirinativos"].value : false,
// qualquerparte: this.state.valores["qualquerparte"] !== undefined ? this.state.valores["qualquerparte"].value : true,