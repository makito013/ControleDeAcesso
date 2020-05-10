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
import { Button, FormGroup, Label, Input, CustomInput  } from 'reactstrap';
import { post } from "utils/api";
import { toast, Slide } from 'react-toastify';
import { injectIntl } from "react-intl";
import { Tree, Skeleton, TreeSelect, Spin } from 'antd';

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
class AjustesJornada extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          valores: [], 
          categorias: [{title: "Aguarde...", value:"", disabled:true}],
          loading: true,
          loadingCategoria: true
        };
        this.arrayempresa =  [];
        this.arraylotacao=   [];
        this.arraysecao =    [];
        this.filhosSecao=    [];
        this.stringTranslate = this.stringTranslate.bind(this);   
        this.loadCategorias = this.loadCategorias.bind(this);     
        this.consultaDadosELT = this.consultaDadosELT.bind(this);
        this.reloadArvore = this.reloadArvore.bind(this);
        this.onLoadData = this.onLoadData.bind(this);
        this.consultaDadosELT();
        this.loadCategorias();
    }

    stringTranslate(id){
        return this.props.intl.formatMessage({id: id});
    }


    loadCategorias(){       
      const body={
        cmd:"listacategoria",          
        token: sessionStorage.getItem("token"),
      }
      post(body).then(lista =>{    
        console.log(lista) 
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
            this.state.valores["categoria"] = padrao;
            this.setState({categorias: groupedOptions, valores: this.state.valores, loadingCategoria: false})                
            console.log(this.state.valores["categoria"])
          //   resolve(groupedOptions)
          // });     
        }                
        else
        {
          this.state.mensagemErro = this.stringTranslate("Liberacao.erro");
        } 
        
      });
    };

    consultaDadosELT(){
      const body = {
        "cmd": "listasecaolotacaoempresa",
        "token": sessionStorage.getItem("token"),
      }
      post(body).then((data) =>{
        if(data.retorno){
  
          this.secao = data.dados.secao;
          this.secao.forEach(secao =>{
            this.arraysecao.push({value: parseInt(secao.CodSecao),  title: secao.Nome, pai: parseInt(secao.codLotacao)})    
           
           
          })
          this.lotacao= data.dados.lotacao;
          this.lotacao.forEach(lotacao => {
            this.arraylotacao.push({value: parseInt(lotacao.CodLotacao), title: lotacao.Nome,pai: parseInt(lotacao.codEmpresa)})
        
          });
  
          this.empresa = data.dados.empresa;
          this.empresa.forEach(empresa => {
            this.arrayempresa.push({value: parseInt(empresa.CodEmpresa), title: empresa.Nome})  
          });
          console.log(this.empresa);
         this.reloadArvore(); 
  
          this.setState({reload: !this.state.reload}); // para recarregar os valores recebido do servidor para o select
        }else
          toast.error(this.stringTranslate("Veiculo.Requisicao.CadastroVeiculo.Erro3"), toastOptions);            
      });
  
        const bodyAcesso = {
          cmd: "consultaLocaisAcesso",
          token: sessionStorage.getItem("token"),
          resumido: true
        }
        post(bodyAcesso).then((data) =>{
          if(data.retorno){
            this.locaisAcesso = data.dados.ListaLocaisAcesso.map(props =>{
              return([props.CodLocalAcesso, props.Nome]);
            })
  
            this.setState({reload: !this.state.reload}); // para recarregar os valores recebido do servidor para o select
          }else
            toast.error(this.stringTranslate("Veiculo.Requisicao.CadastroVeiculo.Erro3"), toastOptions);              
        });
      
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
      var groupedOptions = this.arrayempresa.map((itemempresa) => {
  
        var filhoslotacao = [];
  
        this.arraylotacao.forEach((valuelotacao) => {
            if(valuelotacao.pai === itemempresa.value){
                var filhos=[];
                  this.arraysecao.forEach(function(valuesecao){
                  
                    if(valuesecao.pai === valuelotacao.value){
                        filhos.push({value: valuesecao.value, key: valuesecao.value, title: valuesecao.title,tipo:'secao', children: filhosSecaoCopia[valuesecao.value] === undefined ? "" : filhosSecaoCopia[valuesecao.value] })
                    }
                   }) 
                filhoslotacao.push({value: valuelotacao.value, key: valuelotacao.value, title: valuelotacao.title,children: filhos, tipo:"lotacao"})  
            }
        })             
  
        return {value: itemempresa.value, key: itemempresa.value, title: itemempresa.title, children: filhoslotacao,tipo:'empresa'};
      })

      this.setState({arvore: groupedOptions,update:!this.state.update, loading: false})      
    } 

    onLoadData = treenode =>
    new Promise(resolve => {
    const { value,tipo } = treenode.props;
        console.log(treenode.props);
       // console.log(this.state.arvore);
       this.setState({arvore:this.state.arvore}); 
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
           console.log(lista);
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
                    {this.stringTranslate("Autorizado.Card.Titulos")}  
                
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
                    <Label for="categoria">{this.stringTranslate("Autorizado.Modal.Categoria")}</Label>  
                    <Spin spinning={this.state.loadingCategoria}>
                    <TreeSelect     
                      value= {this.state.valores["categoria"]}
                      onChange= {(value) => this.handleChangeSelect(value, "categoria")}
                      treeCheckable= {true}
                      searchPlaceholder= 'Selecione um Valor'
                      showSearch= {false}
                      size= "large"
                      style= {{ width: "100%", }}
                      dropdownStyle={{ maxHeight: 220, overflow: 'auto' }}
                      maxTagCount= {2} 
                      treeData={this.state.categorias}     
                      id="categoria"             
                      />    
                       </Spin>                    
                    </FormGroup>
                   
                </Col>
                <Col md="2">
                  <Button block color="primary" style={{float:"right", marginLeft:"10px", top: "23px"}} onClick={() => this.pesquisar()}>PESQUISAR</Button>
                </Col>
              </Row>            


              {/* <SelectTreeViewNeo treeData={this.state.arvore} arrayempresa={this.empresa} arraylotacao={this.lotacao} arraysecao = {this.secao} update = {this.state.update}/> */}               

              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col md="6">
              <Card style={{maxHeight:"500px",overflow: 'auto', marginTop: "20px", paddingTop: "10px"}}>
                <CardBody>
                  <Skeleton loading={this.state.loading} active>
                    <Tree    
                      checkable 
                      value= {this.state.valores["els"]}
                      onChange= {(value) => this.selectTreeShow(value, "els")}                   
                      style= {{
                        width: "100%",
                      }}                      
                      loadData={(value)=>this.onLoadData(value)}
                      treeData={this.state.arvore}                        
                    />               
                  </Skeleton>
                </CardBody>
              </Card>
          </Col>

          <Col md="6">
              <Card style={{maxHeight:"500px",overflow: 'auto', marginTop: "20px", paddingTop: "10px"}}>
                <CardBody>
                  <Skeleton loading={this.state.loading} active>
                    <Tree    
                      checkable 
                      value= {this.state.valores["els"]}
                      onChange= {(value) => this.selectTreeShow(value, "els")}                   
                      style= {{
                        width: "100%",
                      }}                      
                      loadData={(value)=>this.onLoadData(value)}
                      treeData={this.state.arvore}                        
                    />               
                  </Skeleton>
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
