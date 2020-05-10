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
import { Button, FormGroup, Label } from 'reactstrap';
import { post } from "utils/api";
import { toast, Slide } from 'react-toastify';
import { injectIntl } from "react-intl";
import ModalCadastro from "./modalCadastro"
import TabelaAutorizados from "./tabelaAutorizados"
import { TreeSelect, Popconfirm, Tooltip, Select, Input } from 'antd';
import '../../assets/css/antd.css';
import { Switch } from 'antd';
import { postAdonis } from "../../utils/api";

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
class CadastroAutorizado extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          valores: [],   
          filtrosPage: false,
          modal: false,
          statusModal: "",     
          timePost:[],   
          data: [],
          toggleFiltro: [],
          categorias: "",
          subCategorias: [], 
          reload: false,
          dadosPeriodos: [],
          key: 0,
      };

      this.Categorias = [];
      this.onToggled = this.onToggled.bind(this);
      this.handleChangeMulti = this.handleChangeMulti.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.onChange = this.onChange.bind(this);
      this.stringTranslate = this.stringTranslate.bind(this);
      /// CARREGA VALORES EMPRESA / LOACAO / SECAO / LOCAIS ACESSO
      this.empresa = [];
      this.lotacao = [];
      this.secao = [];
      this.locaisAcesso = [];
      this.consultaDadosELT();
      this.totalCategorias = 0;
      ///-------------------------------------------------------//
      this.excluirAutorizado = this.excluirAutorizado.bind(this);
      this.loadOptions = this.loadOptions.bind(this);
      this.filtrosToggle = this.filtrosToggle.bind(this);
      this.preencherOptions = this.preencherOptions.bind(this);
      this.toggle = this.toggle.bind(this);
      this.imprime = this.imprime.bind(this);
      this.pesquisar = this.pesquisar.bind(this);
      this.limparFiltros = this.limparFiltros.bind(this);     
      this.limpaValores = this.limpaValores.bind(this);
      /// VALROES INICIAIS DAS VARIAVEIS
      this.state.valores["empresa"] = this.state.valores["lotacao"] = "";
      this.state.toggleFiltro["qualquerParte"] = this.state.toggleFiltro["incluirInativos"] = true;
      this.state.valores["tipo"] = ["PR", "PPA", "V", "EP"];
      this.state.valores["categoria"] = [];
      ///---------------------------------------------------------//      
      this.selectTreeShow = this.selectTreeShow.bind(this);
      this.state.categorias = [{title: "Aguarde...", value:"", disabled:true}]
      this.postListaJornada = this.postListaJornada.bind(this);
      this.loadOptions();
      this.postListaJornada();
      console.log(this.props);

      //Permissões de visualização
      this.permissoes = {
        consultar: this.props.operacoes[0] === '*' ? true : false,
        incluir: this.props.operacoes[1] === '*' ? true : false,
        alterar: this.props.operacoes[2] === '*' ? true : false,
        excluir: this.props.operacoes[3] === '*' ? true : false,
      }
  }

  limpaValores(campos){

    for(var i = 0; i < campos.length; i++){      
      this.state.valores[campos[i]] = "";
    }
    this.setState({valores: this.state.valores})
  }


  async postListaJornada(){     
    const body={
      cmd:"jornada",
      token: sessionStorage.getItem("token"),
    }

    postAdonis(body, '/Jornada').then(lista =>{
      if(lista.error === undefined)
      {
        var codigos= lista.dados.map((item) =>{                                               
          return {value:item.CodJornada, label:item.Nome}; 
          });
        this.setState({dadosPeriodos: codigos});        
      }
      else
      {
        toast.dismiss();
        toast.error(this.stringTranslate("Erro.Servidor"), toastOptions);
      }
      
   });

   
}
        
async consultaDadosELT(){
    const body = {
      "cmd": "listasecaolotacaoempresa",
      "token": sessionStorage.getItem("token"),
    }
    postAdonis(body,'/Empresa/Lista').then((data) =>{
      if(data.retorno){
        this.secao = data.dados.secao.map(props =>{
          return([props.CodSecao, props.Nome, props.CodLotacao]);
        })

        this.lotacao = data.dados.lotacao.map(propl => {
          return([propl.CodLotacao, propl.Nome, propl.CodEmpresa])
        });
        console.log(this.lotacao);
        this.empresa = data.dados.empresa.map(prop => {
          return([prop.CodEmpresa, prop.Nome])
        });

        this.setState({reload: !this.state.reload}); // para recarregar os valores recebido do servidor para o select
      }else
        toast.error(this.stringTranslate("Veiculo.Requisicao.CadastroVeiculo.Erro3"), toastOptions);            
    });

      const bodyAcesso = {
        cmd: "consultaLocaisAcesso",
        token: sessionStorage.getItem("token"),
        resumido: true
      }
      postAdonis(bodyAcesso, '/LocalAcesso/Index').then((data) =>{
        if(data.retorno){
          this.locaisAcesso = data.dados.map(props =>{
            return([props.CODLOCALACESSO, props.NOME]);
          })

          this.setState({reload: !this.state.reload}); // para recarregar os valores recebido do servidor para o select
        }else{
          toast.dismiss();
          toast.error(this.stringTranslate("Erro.Servidor"), toastOptions);
        }
                     
      });
    
  }


   pesquisar(){
    if(this.state.valores["pesquisa"] === undefined || this.state.valores["pesquisa"].length < 3){
      toast.dismiss();
      toast.warning(this.stringTranslate("Warning.PesquisarDigito"), toastOptions);
      return
    }

    var tipoPesquisa = [false, false, false, false];
    var categorias = [];
    this.state.valores["tipo"].forEach(prop => {
           if(prop === "PR") tipoPesquisa[0] = true;
      else if(prop === "PPA") tipoPesquisa[1] = true;
      else if(prop === "V" ) tipoPesquisa[2] = true;
      else if(prop === "EP") tipoPesquisa[3] = true;
    })

    if(this.totalCategorias !== this.state.valores["categoria"].length){
      this.state.valores["categoria"].forEach(prop => {
      categorias.push(prop.value)
    })}
    else if(this.state.valores["categoria"].length === 0)
      categorias = null;
    else
      categorias = "all";

    const body={
      cmd:"consultaPessoas",
      nome: this.state.valores["pesquisa"],      
      incluirinativos: this.state.toggleFiltro["incluirInativos"],
      qualquerparte: this.state.toggleFiltro["qualquerParte"],
      codempresa: this.state.valores["empresa"] === "" ? 0 : this.state.valores["empresa"],
      codlotacao: this.state.valores["lotacao"] === "" ? 0 : this.state.valores["lotacao"],
      codsecao: this.state.valores["secao"] === undefined ? 0 : this.state.valores["secao"],
      categoria: categorias,
      incluirresidente: tipoPesquisa[0],
      incluirPreAutorizado: tipoPesquisa[1],
      incluirPrecisaLiberacao: tipoPesquisa[2],
      incluirNaoResidenteAutorizado: tipoPesquisa[3],
      token:sessionStorage.getItem("token"),
    }
    console.log(body);
    postAdonis(body, '/Autorizado/Index').then(lista =>{     
      console.log(lista);
      if(lista.error === undefined)
      {
        this.state.data  = lista.dados.map((item,key) => {
          var cracha =  item.CONTEUDO;
          var autorizacao = "";
          if(item.TIPOAUTORIZACAO === 1)
            autorizacao = this.stringTranslate("Select.PermanenteResidente");
          else if(item.TIPOAUTORIZACAO === 2)
            autorizacao = this.stringTranslate("Select.ComPrazoPreAutorizado");
          else if(item.TIPOAUTORIZACAO === 3)
            autorizacao = this.stringTranslate("Select.Visitante");
          else if(item.TIPOAUTORIZACAO === 6)
            autorizacao = this.stringTranslate("Select.ExternoPermanente");
          //item.identificador !== undefined ? item.identificador.conteudo : "" , 
          return{tipoAutorizado:autorizacao, key:key, nome:item.NOME, matricula:item.MATRICULA, PIN:item.PIN, PIN2:item.CODPESSOA, cracha:cracha, comandos:this.comandos(item.CODPESSOA)}
        })

        this.setState({data:this.state.data});   ;                    
      }                
      else
      {
        toast.dismiss();
        toast.error(this.stringTranslate("Erro.Servidor"), toastOptions);
      } 
    }).catch(e => {
      console.log(e);
      toast.dismiss();
      toast.error(this.stringTranslate("Erro.Servidor"), toastOptions);
    });
  }

  comandos(key){
    return(   
      <>
        {this.permissoes.consultar ?       
        <Tooltip placement="top" title={this.stringTranslate("Horario.Botao.Ver")} overlayStyle={{fontSize: "12px"}}>
          <i className="far fa-eye ef-pulse-grow" onClick={() => this.toggle("Ver", key)} style={{top:"0", marginLeft: "10px", color:"#008F95", cursor:"pointer"}}/>
        </Tooltip> : null}
        {this.permissoes.alterar ?
        <Tooltip placement="top" title={this.stringTranslate("Horario.Botao.Editar")} overlayStyle={{fontSize: "12px"}}>
          <i className="far fa-edit ef-pulse-grow" onClick={() => this.toggle("Editar", key)} style={{top:"0", marginLeft: "10px", color:"#E9B000", cursor:"pointer"}}/>
        </Tooltip> : null}
        {this.permissoes.excluir ?
        <Tooltip  placement="top" title={this.stringTranslate("Botao.Excluir")} overlayStyle={{fontSize: "12px"}}>
          <Popconfirm placement="left" title={this.stringTranslate("Warning.DesejaExcluir")} onConfirm={() => this.excluirAutorizado(key)} okText="Sim" cancelText="Não">
            <i className="far fa-trash-alt ef-pulse-grow" style={{top:"0", marginLeft: "10px", color:"#E24E42", cursor:"pointer"}}/>
          </Popconfirm>
        </Tooltip> : null}
      </>
    )
  }

  excluirAutorizado(key){      
    const body={
      cmd:"excluirAutorizado",
      codpessoa: key,
      token:sessionStorage.getItem("token"),
    }
    postAdonis(body, '/Autorizado/Excluir').then(lista =>{
      if(lista.error === undefined)
      {
        toast.dismiss();
        toast.success(this.stringTranslate("Sucesso.Acesso.Excluir"), toastOptions);
        
      }
      else
      {
        toast.dismiss();
        toast.error(this.stringTranslate("Erro.Servidor"), toastOptions);
      }
      this.contErro = 0;
     })
  }


  onToggled(toggle){
    this.state.toggleFiltro[toggle] = !this.state.toggleFiltro[toggle];
    this.setState({toggleFiltro: this.state.toggleFiltro});
  }

  selectTreeShow(value, name){
    this.state.valores[name] = value;
    this.setState({ valores: this.state.valores });
  }

  limparFiltros(){
    this.state.valores = [];
    //this.state.valores["tipoProprietario"] = this.preencherOptions("tipoProprietario")[2];
    this.state.valores["categoria"] = this.categoria;
    this.state.valores["tipo"] = ["PR", "PPA", "V", "EP"];
    this.setState({valores: this.state.valores});
  }


  toggle(status, key) {
    this.setState({
      modal: !this.state.modal,
      statusModal: status,
      key: key
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
    else if (value === "tipo") valores = this.tipo;
    else if (value === "tipoProprietario") valores = this.tipoProprietario;
    else if (value === "tipoProprietarioModal") valores = this.tipoProprietarioModal;
    else if (value === "locaisAcesso") valores = this.locaisAcesso;

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

  handleChangeMulti(e, key){
    if(key === "categorias")
      this.state.valores["subCategorias"] = [];
    
    if(e === null)
      this.state.valores[key] = ""; 
    else
      this.state.valores[key] = e; 
      
      this.setState({valores: this.state.valores});
  }

  onChange(e){
    this.state.valores[e.target.name] = e.target.value;
    this.setState({valores: this.state.valores});
  }


  loadOptions(){
    
    //if(this.state.categorias === ""){
        const body={
          cmd:"listacategoria",          
          token: sessionStorage.getItem("token"),
        }
        postAdonis(body, '/CategoriaPessoa/Index').then(lista =>{    
          console.log(lista) 
          if(lista.error === undefined)
          {      
           // new Promise(resolve => {      
              var arrayPai = [];
              var arrayFilho = [];
              var padrao = [];
              var array = lista.dados.map((item, key) => { 
                  this.totalCategorias++;                           
                  if(item.codCategoriaSuperior === null)
                      arrayPai.push({value: parseInt(item.codCategoriaPessoa), title: item.Nome})
                  else
                      arrayFilho.push({value: item.codCategoriaPessoa, key: key, title: item.Nome, pai: item.codCategoriaSuperior})    
                      
                  padrao.push({value: parseInt(item.codCategoriaPessoa), label: item.Nome})            
                  
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
              this.categoria = padrao;
              this.setState({categorias: groupedOptions, valores: this.state.valores})                
           //   resolve(groupedOptions)
           // });     
          }                
          else
          {
            toast.dismiss();
            toast.error(this.stringTranslate("Erro.Servidor"), toastOptions);
          } 
          
        });
  };


  
  render() {    
    const tipo = [
      {
        title: this.stringTranslate("Select.PermanenteResidente"),
        value: "PR",
      },
      {
        title: this.stringTranslate("Select.ComPrazoPreAutorizado"),
        value: "PPA",
      },
      {
        title: this.stringTranslate("Select.Visitante"),
        value: "V",
      },
      {
        title: this.stringTranslate("Select.ExternoPermanente"),
        value: "EP",
      },
    ];
    return (
      <>      
        <div className="content">
          <Row>
            <Col md="12">
              <Card>
                <CardHeader tag="h4">
                  {this.permissoes.incluir ? <Button color="link" onClick={() => this.toggle("Novo", 0)} style={{float: "right"}}><i className="fad fa-plus-circle"/> {this.stringTranslate("Autorizado.Botao.NovoAutorizado")} </Button> : null}           
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
                <CardBody>
                  <Row md="8">
                    <Col>
                      <FormGroup>
                        <Label>{this.stringTranslate("Autorizado.Pesquisar")}</Label>
                        <Input type="text"
                          name= "pesquisa" 
                          value= {this.state.valores["pesquisa"]}
                          onChange={(e) => this.onChange(e)}
                          //onKeyPress={(e,) => this.pesquisar(e)}
                          onPressEnter={() => this.pesquisar()}
                          id="textBox"
                          size="large"
                        />                        
                      </FormGroup>
                    </Col>
                    <Col md="4" style={{marginTop: "20px"}}>
                        <Row>
                            <Col>                                          
                                <Switch 
                                    onChange={() => this.onToggled("incluirInativos")} 
                                    checked={this.state.toggleFiltro["incluirInativos"]}
                                    size="small"    
                                /> 
                                <Label style={{marginLeft: "7px"}} onClick={() => this.onToggled("incluirInativos")} > Incluir Inativos</Label>                                    
                            </Col>
                        </Row>
                        <Row> 
                            <Col>
                                <Switch 
                                    onChange={() => this.onToggled("qualquerParte")} 
                                    checked={this.state.toggleFiltro["qualquerParte"]}      
                                    size="small"                              
                                /> 
                                <Label style={{marginLeft: "7px"}} onClick={() => this.onToggled("qualquerParte")} > Qualquer Parte</Label>
                            </Col>                                           
                        </Row>                                        
                    </Col>
                  </Row>                     
                  <Collapse isOpen={this.state.filtrosPage}>
                  <Row>
                    <Col md="4">
                    <FormGroup> 
                      <Label>{this.stringTranslate("Autorizado.Pesquisar.Filtro.Empresa")}</Label>    
                      <Select                         
                          style={{ width: '100%' }}
                          placeholder=""                          
                          size="large"    
                          value={this.state.valores["empresa"]}
                          onChange={(e) => {this.handleChangeMulti(e, "empresa"); this.limpaValores(["lotacao", "secao"])}}
                          allowClear={true}
                      >                                       
                          {this.preencherOptions("empresa").map(prop => {
                              return(
                              <Option value={prop.value}> {prop.label}</Option> )
                          })}                                                                                                     
                      </Select>                       
                      </FormGroup>
                    </Col>
                    <Col md="4">
                    <FormGroup> 
                      <Label>{this.stringTranslate("Autorizado.Pesquisar.Filtro.Lotacao")}</Label>      
                      <Select                         
                          style={{ width: '100%' }}
                          placeholder=""                          
                          size="large"    
                          value={this.state.valores["lotacao"]}
                          allowClear="true"
                          onChange={(e) => {this.handleChangeMulti(e, "lotacao"); this.limpaValores(["secao"])}}    
                      >                                       
                          {this.preencherOptions("lotacao", "", this.state.valores["empresa"]).map(prop => {
                              return(
                              <Option value={prop.value}> {prop.label}</Option> )
                          })}                                                                                                     
                      </Select>  
                      </FormGroup>
                    </Col>
                    <Col md="4">
                      <FormGroup> 
                        <Label>{this.stringTranslate("Autorizado.Pesquisar.Filtro.Secao")}</Label>       
                        <Select                         
                          style={{ width: '100%' }}
                          placeholder=""                          
                          size="large"    
                          onChange={(e) => this.handleChangeMulti(e, "secao")}
                          value={this.state.valores["secao"]}
                          allowClear={true}  
                      >                                  
                          {this.preencherOptions("secao", "", this.state.valores["lotacao"]).map(prop => {
                              return(
                              <Option value={prop.value}> {prop.label}</Option> )
                          })}                                                                                                     
                      </Select>                   
                      </FormGroup>
                    </Col>
                    </Row>
                    <Row>
                    <Col md="8">
                      <FormGroup> 
                      <Label>{this.stringTranslate("Autorizado.Pesquisar.Filtro.Categorias")}</Label>         
                                                  
                        <TreeSelect     
                        value= {this.state.valores["categoria"]}
                        onChange= {(value) => this.selectTreeShow(value, "categoria")}
                        treeCheckable= {true}
                        searchPlaceholder= 'Selecione um Valor'
                        showSearch= {false}
                        size= "large"
                        style= {{ width: "100%", }}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        maxTagCount= {2} 
                        treeData={this.state.categorias}     
                        treeCheckStrictly = {true}                   
                        />                      
                      </FormGroup>
                    </Col>   

                    <Col md="4">
                      <FormGroup> 
                      <Label>{this.stringTranslate("Autorizado.Pesquisar.Filtro.Tipo")}</Label>                                     
                        <TreeSelect     
                        value= {this.state.valores["tipo"]}
                        onChange= {(value) => this.selectTreeShow(value,"tipo")}
                        treeCheckable= {true}
                        placeholder= 'Selecione um Valor'
                        onclick = {() => {}}
                        showSearch= {false}
                        size= "large"
                        style= {{
                          width: "100%",
                        }}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        maxTagCount= {1} 
                        treeData={tipo}                        
                        />                      
                      </FormGroup>
                    </Col> 

                  </Row>
                  </Collapse>    
                </CardBody>
                <CardFooter style={{paddingTop:"0px"}}>
                <Row>                   
                    <Col md='2'>
                        <Button block color="link" style={{color:"#b5b5b5"}} onClick={() => this.filtrosToggle()}> {this.state.filtrosPage === false ? (<>VER FILTROS <i className="fad fa-chevron-double-down"></i></>) : (<>ESCONDER FILTROS <i className="fad fa-chevron-double-up"></i></>)}</Button>
                    </Col>
                    <Col md='4'>

                    </Col>
                    <Col md='3'>
                        <Button block color="warning" style={{float:"right"}} onClick={() => this.limparFiltros()}>LIMPAR FILTROS</Button>
                    </Col>
                    <Col md='3'>
                        <Button block color="primary" style={{float:"right", marginLeft:"10px"}} onClick={() => this.pesquisar()}>PESQUISAR</Button>
                    </Col>
                </Row>

      
                </CardFooter>
              </Card>
            </Col>
          </Row>

          <TabelaAutorizados tableData = {this.state.data}></TabelaAutorizados>

        </div> 
        {this.state.modal === true ? (<ModalCadastro modal={this.state.modal} 

        categorias={this.state.categorias} 
        preencherOptions={this.preencherOptions} 
        onclick={this.toggle} 
        data={this.state.dadosModal} 
        statusModal={this.state.statusModal} 
        loadOptions={this.loadOptions} 
        codigo={this.state.key}
        empresa={this.empresa}
        lotacao={this.lotacao}
        secao={this.secao}
        jornadas={this.state.dadosPeriodos}
        locaisAcesso={this.locaisAcesso}/>):null}     
      </>
    );
  }
}

export default injectIntl(CadastroAutorizado);
