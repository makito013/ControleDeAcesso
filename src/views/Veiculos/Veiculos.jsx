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
  Nav
} from "reactstrap";
import { FormGroup, Label, Input  } from 'reactstrap';
import { postAdonis } from "utils/api";
import { toast, Slide } from 'react-toastify';

import { Select, Spin, Button, Tooltip } from 'antd';
import { injectIntl } from "react-intl";
import ModalVeiculo from "./modalVeiculos"
import TabelaVeiculos from "./tabelaVeiculos"

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


class Veiculos extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableHead: [this.stringTranslate("Veiculos.Tabela.Head.Placa"), 
                        this.stringTranslate("Veiculos.Tabela.Head.Modelo"), 
                        this.stringTranslate("Veiculos.Tabela.Head.Proprietario"), 
                        this.stringTranslate("Veiculos.Tabela.Head.Marca"), 
                        this.stringTranslate("Veiculos.Tabela.Head.Cor"),
                        this.stringTranslate("Veiculos.Tabela.Head.Categoria"), 
                        this.stringTranslate("Veiculo.Tabela.Comandos")],  
            valores: {"pesquisa" : "", "Proprietario" : ""},   
            filtrosPage: false,
            modal: false,
            statusModal: "",     
            timePost:[],   
            data: [],
            dados: [],
            reload: true,
            fetching: false,
            dataProprietario: [],
            loadingEmpresa: true,      
            loadingTable: false,      
        };
        this.contErro = 0;
        this.modalLocal = [];
        this.consultaDadosELT = this.consultaDadosELT.bind(this);
        this.veiculoPorId = this.veiculoPorId.bind(this);
        this.excluirVeiculo = this.excluirVeiculo.bind(this);
        this.loadOptions = this.loadOptions.bind(this);
        this.loadOptionsSelect = this.loadOptionsSelect.bind(this);
        this.filtrosToggle = this.filtrosToggle.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onChange = this.onChange.bind(this);
        this.stringTranslate = this.stringTranslate.bind(this);
        this.preencherOptions = this.preencherOptions.bind(this);
        this.toggle = this.toggle.bind(this);
        this.imprime = this.imprime.bind(this);
        this.pesquisar = this.pesquisar.bind(this);
        this.limparFiltros = this.limparFiltros.bind(this);

        this.ArrayCores=[["AZUL"   , this.stringTranslate("Cadastro.cor.opcao.azul")], 
                        ["BEGE"    , this.stringTranslate("Cadastro.cor.opcao.bege")],
                        ["BRANCO"  , this.stringTranslate("Cadastro.cor.opcao.branco")], 
                        ["CINZA"   , this.stringTranslate("Cadastro.cor.opcao.cinza")], 
                        ["DOURADO" , this.stringTranslate("Cadastro.cor.opcao.dourado")], 
                        ["FANTASIA", this.stringTranslate("Cadastro.cor.opcao.fantasia")], 
                        ["GRENA"   , this.stringTranslate("Cadastro.cor.opcao.grena")], 
                        ["LARANJA" , this.stringTranslate("Cadastro.cor.opcao.laranja")], 
                        ["MARROM"  , this.stringTranslate("Cadastro.cor.opcao.marrom")], 
                        ["PRATA"   , this.stringTranslate("Cadastro.cor.opcao.prata")], 
                        ["PRETO"   , this.stringTranslate("Cadastro.cor.opcao.preto")], 
                        ["ROSA"    , this.stringTranslate("Cadastro.cor.opcao.rosa")], 
                        ["ROXO"    , this.stringTranslate("Cadastro.cor.opcao.roxo")], 
                        ["VERDE"   , this.stringTranslate("Cadastro.cor.opcao.verde")], 
                        ["VERMELHO", this.stringTranslate("Cadastro.cor.opcao.vermelho")]]; 

        this.ArrayCategoria=[["AMBULÂNCIA", this.stringTranslate("Cadastro.categoriaVeiculo.opcao.ambulancia")],
                            ["CAMINHÃO", this.stringTranslate("Cadastro.categoriaVeiculo.opcao.caminhao")],
                            ["MICRO ÔNIBUS", this.stringTranslate("Cadastro.categoriaVeiculo.opcao.microOnibus")], 
                            ["QUADRICICLO", this.stringTranslate("Cadastro.categoriaVeiculo.opcao.quadriciclo")], 
                            ["ÔNIBUS", this.stringTranslate("Cadastro.categoriaVeiculo.opcao.onibus")], 
                            ["REBOQUE", this.stringTranslate("Cadastro.categoriaVeiculo.opcao.reboque")], 
                            ["TRICICLO", this.stringTranslate("Cadastro.categoriaVeiculo.opcao.triciclo")], 
                            ["VAN", this.stringTranslate("Cadastro.categoriaVeiculo.opcao.van")], 
                            ["VEÍCULOS LEVES", this.stringTranslate("Cadastro.categoriaVeiculo.opcao.veiculosLeves")], 
                            ["VIATURA", this.stringTranslate("Cadastro.categoriaVeiculo.opcao.viatura")], 
                            ["MOTO", this.stringTranslate("Cadastro.categoriaVeiculo.opcao.moto")]]; 

        this.ArrayMarca=[ "DUCATI", "DAFRA", "IMPORTADO", "KAWASAKI","YAMAHA","ROYAL ENFIELD","SUZUKI", 
                          "IMPORTADOS", "TOYOTA", "VOLKSWAGEN", "FORD", "NISSAN", "HONDA", 
                          "HYUNDAI", "CHEVROLET", "KIA", "RENAULT", "MERCEDES-BENZ", "PEUGEOT", "BMW", 
                          "AUDI", "MARUI", "MAZDA", "FIAT", "JEEP", "CHANGAN", "GEELY", "BUICK", "OUTROS" ];            
                                  
        this.tipo = [[0, this.stringTranslate("Veiculo.Pesquisar.Tipo.Opcao1")],
                    [1, this.stringTranslate("Veiculo.Pesquisar.Tipo.Opcao2")]];

        this.tipoProprietario = [[1, this.stringTranslate("Veiculo.Pesquisar.Proprietario.Opcao1")], //Empresa
                                [2, this.stringTranslate("Veiculo.Pesquisar.Proprietario.Opcao2")], //Pessoa
                                [3, this.stringTranslate("Veiculo.Pesquisar.Proprietario.Opcao5")], //Desconhecido
                                [4, this.stringTranslate("Veiculo.Pesquisar.Proprietario.Opcao4")],//Nenhum
                                [5, this.stringTranslate("Veiculo.Pesquisar.Proprietario.Opcao3")]]; //Todos

        this.tipoProprietarioModal = [[1, this.stringTranslate("Veiculo.Pesquisar.Proprietario.Opcao1")], //Empresa
                                      [2, this.stringTranslate("Veiculo.Pesquisar.Proprietario.Opcao2")], //Pessoa
                                      [3, this.stringTranslate("Veiculo.Pesquisar.Proprietario.Opcao5")], //Desconhecido
                                      [4, this.stringTranslate("Veiculo.Pesquisar.Proprietario.Opcao4")] //Nenhum
                                    ];


        this.empresa = [];
        this.lotacao = [];
        this.secao = [];
        this.locaisAcesso =[];
        this.consultaDadosELT();
        this.ArrayMarca.sort();
        this.ArrayCategoria.sort();
        this.ArrayCores.sort();                          
        this.state.valores["tipoProprietario"] = 5;
        this.state.valores["tipo"] = 0;
        this.state.valores["Proprietario"] = [];
        this.state.valores["Empresa"] = [];

        console.log(this.preencherOptions("marca","DUCATI"));

        //Permissões de visualização
        this.permissoes = {
          consultar: this.props.operacoes[0] === '*' ? true : false,
          incluir: this.props.operacoes[1] === '*' ? true : false,
          alterar: this.props.operacoes[2] === '*' ? true : false,
          excluir: this.props.operacoes[3] === '*' ? true : false,
        }
    }


        
  consultaDadosELT(){
    const body = {    
      "token": sessionStorage.getItem("token"),
    }
    postAdonis(body, "/Veiculos").then((data) =>{
      if(data.retorno){        
        this.secao = data.Secao.dados.map(props =>{
          return([props.CodSecao, props.Nome, props.codLotacao]);
        })

        this.lotacao = data.Lotacao.dados.map(propl => {
          return([propl.CodLotacao, propl.Nome, propl.codEmpresa])
        });

        this.empresa = data.Empresa.dados.map(prop => {
          return([prop.CodEmpresa, prop.Nome])
        });

        this.locaisAcesso = data.LocaisAcesso.dados.map(props =>{
          this.modalLocal[props.CodLocalAcesso] = props.Nome;
          return([props.CodLocalAcesso, props.Nome]);
        })

        this.setState({loadingEmpresa: false});
      }else{
        if(this.contErro++ > 3)
          toast.error(this.stringTranslate("Veiculo.Requisicao.CadastroVeiculo.Erro3"), toastOptions);            
        else
          this.consultaDadosELT()           
      }
    }).catch(() => {
      if(this.contErro++ > 3)
        toast.error(this.stringTranslate("Veiculo.Requisicao.CadastroVeiculo.Erro3"), toastOptions);            
      else
        this.consultaDadosELT()
    })       
  }


  pesquisar(){
	if(this.state.valores["pesquisa"].length < 3){
		toast.dismiss();
        toast.warning(this.stringTranslate("Warning.PesquisarDigito"), toastOptions);  
		return;
	}


    this.setState({loadingTable: true})
    const body={
      valorPesquisa: this.state.valores["pesquisa"],
      token:sessionStorage.getItem("token"),
      tipoPesquisa: this.state.valores["tipo"] !== null ? this.state.valores["tipo"] : "",
      tipoProprietario: this.state.valores["tipoProprietario"] !== null ? this.state.valores["tipoProprietario"] : "",    
      codProprietario: this.state.valores["Proprietario"] !== undefined ? this.state.valores["Proprietario"].key : "",
      codEmpresa: this.state.valores["Empresa"] !== undefined ? this.state.valores["Empresa"].key : "",
      modelo: this.state.valores["modelo"] !== null ? this.state.valores["modelo"] : "",
      textoCor: this.state.valores["cor"] !== null ? this.state.valores["cor"] : "",
      textoMarca: this.state.valores["marca"] !== null ? this.state.valores["marca"] : "",
      textoCategoria: this.state.valores["categoria"] !== null ? this.state.valores["categoria"] : ""
    }
    console.log(body);
    postAdonis(body,'/Veiculos/Pesquisa').then(lista =>{     
      if(lista.error === undefined)
      {
		
        var array = lista.dados.map((item, key) => {
          var icones = this.carregaIcones(item.CodVeiculo, key);
          var propprietario = item.proprietario !== null ? item.proprietario : item.proprietario1;
          return[item.CodVeiculo, item.Placa, item.Modelo, propprietario, item.TextoMarca, item.TextoCor, item.TextoCategoria, icones]
        })

        this.setState({data:array, loadingTable: false});                    
      }                
      else
      {
        this.setState({loadingTable: false})
        toast.error(this.stringTranslate("Veiculo.Requisicao.CadastroVeiculo.Erro2"), toastOptions);      
      } 
    }).catch(e => { 
      toast.dismiss();
      toast.error(this.stringTranslate("Veiculo.Requisicao.CadastroVeiculo.Erro2"), toastOptions);  
      this.setState({loadingTable: false})
    });
  }
  
  carregaIcones(prop, key){
	  return(<>
    {this.permissoes.consultar ?
		<Tooltip  placement="top" target="add" title={this.stringTranslate("Botao.Ver")} overlayStyle={{fontSize: "12px"}}>
		<i id={"Ver"+key} className="far fa-eye ef-pulse-grow" onClick={() => this.veiculoPorId("Ver", prop)} style={{top:"0", marginLeft: "5px", color:"#008F95", cursor:"pointer"}}/>
		</Tooltip> : null}

    {this.permissoes.alterar ?
		<Tooltip  placement="top" target="add" title={this.stringTranslate("Botao.Editar")} overlayStyle={{fontSize: "12px"}}>
		<i id={"Editar"+key} className="far fa-edit ef-pulse-grow" onClick={() => this.veiculoPorId("Editar", prop)} style={{top:"0", marginLeft: "10px", color:"#E9B000", cursor:"pointer"}}/>
		</Tooltip> : null}

    {this.permissoes.excluir ?
		<Tooltip  placement="top" target="add" title={this.stringTranslate("Botao.Excluir")} overlayStyle={{fontSize: "12px"}}>
		<i id={"Excluir"+key} className="far fa-trash-alt ef-pulse-grow" onClick={() => this.excluirVeiculo(prop)} style={{top:"0", marginLeft: "10px", color:"#E24E42", cursor:"pointer"}}/>
		</Tooltip> :null} </>);
  }

  veiculoPorId(key, Id){
    const body={
      codigo: Id,
      resumido: false,
      token:sessionStorage.getItem("token"),     
    }

    postAdonis(body, "/Veiculos/PesquisaId").then(lista =>{     
      console.log(lista);
      if(lista.error === undefined)
      {
        if(lista.retorno === true){
          this.state.dados = lista.dados;
          this.setState({dados:this.state.dados});                            
          this.toggle(key);
        }        
      }                
      else
      {
        toast.error(this.stringTranslate("Veiculo.Requisicao.CadastroVeiculo.Erro2"), toastOptions);      
      } 
    });
  }


  limparFiltros(){
    this.state.valores = [];
    this.state.valores["tipoProprietario"] = 5;
    this.state.valores["tipo"] = 0;
    this.state.valores["modelo"] = '';
    this.setState({valores: this.state.valores});
  }


  toggle(status) {
    this.setState({
      modal: !this.state.modal,
      statusModal: status,
    });  

    // if(status === "")
    //   this.setState({data: ""});
  }

  stringTranslate(id){
    return this.props.intl.formatMessage({id: id});
  }


  // MARK: PREENCHER OPÇÕES SELECT
  preencherOptions(value, pesquisa){ 
    var valor = ""
    var opcoes = [];

    if(value === "cor") valor = this.ArrayCores;
    else if(value === "categoria") valor = this.ArrayCategoria;
    else if(value === "empresa") valor = this.empresa;
    else if(value === "tipo") valor = this.tipo;
    else if (value === "tipoProprietario") valor = this.tipoProprietario;
    else if (value === "tipoProprietarioModal") valor = this.tipoProprietarioModal;

    if(valor !== ""){
      valor.forEach((prop) => {
        if(pesquisa !== undefined){
          if(prop[0] === pesquisa) opcoes = {value:prop[0],label:prop[1], name: value};
        }  
        else
           opcoes.push({value:prop[0],label:prop[1], name: value})
      })
      return opcoes 
    }  
    else if(value === "locaisAcesso"){
      this.locaisAcesso.forEach((prop) => {
        if(pesquisa !== undefined){
          if(prop[0] === pesquisa) opcoes.push({value:prop[0],label:prop[1], name: value});   
        }     
        else
           opcoes.push({value:prop[0],label:prop[1], name: value});
      })
      return opcoes 
    }
    else if(value === "marca"){
      this.ArrayMarca.forEach((prop) => {
        if(pesquisa !== undefined){
          if(prop === pesquisa) opcoes.push({value:prop,label:prop, name: value}); 
        }       
        else
           opcoes.push({value:prop,label:prop, name: value});
      })
      return opcoes 
    }
  }
  //-----------------------------------------------------------------------------------------//

  
  imprime(cabecalho){
    if (cabecalho !== null)
        var conteudo = cabecalho + document.getElementById("veiculosCard").innerHTML;
    else
        var conteudo = document.getElementById("veiculosCard").innerHTML;
    var telaImpressao = window.open();
    telaImpressao.document.write(conteudo);
    telaImpressao.window.print();
    telaImpressao.window.close();
}

  filtrosToggle(){
    this.setState({filtrosPage: !this.state.filtrosPage})
  }

  handleChange(e, index){
    if(e === null)
      this.state.valores[index] = "";
    else 
      this.state.valores[index] = e;
    
    if(index ==="tipoProprietario")  {
      this.state.valores["Proprietario"] = "";
      this.state.valores["Empresa"] = "";
    }
      
    
    this.setState({valores: this.state.valores});
  }

  excluirVeiculo (id) {
      const body={
        cmd:"excluirVeiculo",          
        codigo: id,
        token: sessionStorage.getItem("token"),
      }
      postAdonis(body,'/Veiculos/Excluir').then(lista =>{     
        if(lista.error === undefined)
        {            
          if(lista.retorno === false)
          {
            if(lista.mensagem === "1")
              toast.error(this.stringTranslate("Veiculo.Requisicao.Excluir.Erro1"), toastOptions);
          }
          else
              toast.success(this.stringTranslate("Veiculo.Requisicao.Excluir.Sucesso"), toastOptions);
        }                
        else
        {
          toast.error(this.stringTranslate("Veiculo.Requisicao.Excluir.Erro2"), toastOptions);
        } 
      });
  };

  onChange(e){
    this.state.valores[e.target.name] = e.target.value;
    this.setState({valores: this.state.valores});
  }
    

  loadOptions (inputValue, callback) {
    var array=[];
    if(inputValue.length > 2){
      clearInterval(this.state.timePost);
      this.state.timePost = setTimeout(() => {
        const body={
          cmd:"consultaPessoas",          
          nome: inputValue,
          resumo: true,
          token: sessionStorage.getItem("token"),
        }
        postAdonis(body, "/Geral/ConsultaPessoaP").then(lista =>{     
          if(lista.error === undefined)
          {            
            console.log(lista.dados);
            
            array = lista.dados.map((item) => {
              return{value: item.codigo, label: item.nome.toUpperCase(), name: "Proprietario", name2: "novoMotorista"}
            })
            
            console.log(array);
            
            callback(array);                   
          }                
          else
          {
            this.state.mensagemErro = this.stringTranslate("Liberacao.erro");
          } 
        });
        //var teste = [{value:"1",label: "Bruno"}, {value:"10",label: "Andrade"}, {value:"100",label: "Almeida"}]
        //console.log(inputValue)
        
      }, 500);
    }    
  };

  loadOptionsSelect = value => {
    if(value.length > 2){      
      clearInterval(this.timePost);
      
      this.timePost = setTimeout(() => this.consultaPessoa(value), 500);
    }    
  };

  consultaPessoa(value){
    const body={
        cmd:"consultaPessoas",          
        nome: value,
        resumo: true,
        token: sessionStorage.getItem("token"),
      }
      postAdonis(body, "/Geral/ConsultaPessoaP").then(lista =>{     
        if(lista.error === undefined)
        {            
          console.log(lista.dados);
          
          var array = lista.dados.map((item) => {
            return{value: item.codigo, text: item.nome.toUpperCase(), name: "Proprietario", name2: "novoMotorista"}
          })
          
          this.setState({dataProprietario: array, fetching: false});
        }                
        else
        {
          this.state.mensagemErro = this.stringTranslate("Liberacao.erro");
        } 
      });
  }

  
  render() {    
    return (
      <>      
        <div className="content">
          <Row>
            <Col md="12">
              <Card>
                <CardHeader tag="h4">
                  {this.permissoes.incluir? <Button type="link" onClick={() => this.toggle("Novo")} style={{float: "right"}}><i className="fad fa-plus-circle"/> {this.stringTranslate("Veiculo.Botao.NovoVeiculo")} </Button> : null}              
                  <Tooltip placement="top" title={this.stringTranslate("Veiculo.Pesquisar.Imprimir")} overlayStyle={{fontSize: "12px"}}> 
                  <Nav 
                    onClick={() => this.imprime("veiculos")}
                    block 
                    id="impressaoV"
                    className="fad fa-print" 
                    style={{ color:"grey", 
                    background:"transparent", 
                    fontSize:"20px",
                    margin:"5px 5px 0 5px", 
                    padding:"0", 
                    maxWidth:"fit-content",
                    float: "right",
                    cursor: "pointer"}} />
                  </Tooltip>
                  {this.stringTranslate("Veiculos.Card.Titulos")}  
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col>
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
                    <Col md={3}>
                      <FormGroup>                      
                        <Label>{this.stringTranslate("Veiculo.Pesquisar.Tipo")}</Label>          
                        <Select  
                          size="large"   
                          style={{width: "100%"}}
                          placeholder=""
                          value={this.state.valores["tipo"]}
                          onChange={(e) => this.handleChange(e, "tipo")}
                        >        
                        {this.preencherOptions("tipo").map((prop) => {
                          return(
                            <Option value={prop.value}>{prop.label}</Option>                            
                        )})}
                          </Select>                       
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>                      
                        <Label>{this.stringTranslate("Veiculo.Pesquisar.TipoProprietario")}</Label>    
                        <Select 
                          size="large" 
                          style={{width: "100%"}}                   
                          value={this.state.valores["tipoProprietario"]}
                          placeholder=""
                          onChange={(e) => this.handleChange(e, "tipoProprietario")}
                        >      
                        {this.preencherOptions("tipoProprietario").map((prop) => {
                          return(
                            <Option value={prop.value}>{prop.label}</Option>                            
                        )})}     
                        </Select>                                  
                      </FormGroup>
                    </Col>
                  </Row>    
                  <Row>
                    <Col md={12}>
                      {this.state.valores["tipoProprietario"] === 2 ? (
                      <FormGroup>                      
                        <Label>{this.stringTranslate("Veiculo.Pesquisar.Proprietario")}</Label>    
                        <Select
                          mode="default"
                          showSearch={true}
                          labelInValue
                          size="large"
                          value={this.state.valores["Proprietario"]}
                          placeholder=""
                          notFoundContent={this.state.fetching ? <Spin size="small" /> : null}
                          filterOption={false}
                          onSearch={this.loadOptionsSelect}
                          onChange={(e) => this.handleChange(e, "Proprietario")}
                          style={{ width: '100%' }}
                          allowClear={true}
                        >
                          {this.state.dataProprietario.map(d => (
                            <Option key={d.value}>{d.text}</Option>
                          ))}
                        </Select>
                      </FormGroup>) : 
                    this.state.valores["tipoProprietario"] === 1 ? (
                      <FormGroup>
                        <Spin spinning={this.state.loadingEmpresa}>
                        <Label>{this.stringTranslate("Veiculo.Pesquisar.Proprietario")}</Label>    
                        <Select 
                          size="large"
                          style={{width: "100%"}}                                               
                          value={this.state.valores["Empresa"]}
                          placeholder=""
                          onChange={(e) => this.handleChange(e, "Empresa")}
                        >    
                        {this.preencherOptions("empresa").map((prop) => {
                          return(
                            <Option value={prop.value}>{prop.label}</Option>                            
                        )})}     
                        </Select>   
                        </Spin>                                        
                      </FormGroup>
                    ) : this.state.valores["Proprietario"] = ""}
                    </Col>
                  </Row>  
                  <Collapse isOpen={this.state.filtrosPage}>
                  <Row>
                    <Col>
                    <FormGroup> 
                      <Label>{this.stringTranslate("Veiculo.Pesquisar.Filtro.Modelo")}</Label>                        
                      <Input type="text"
                          name= "modelo"
                          value= {this.state.valores["modelo"]}
                          onChange={(e) => this.onChange(e)}
                          onKeyPress={this.onKeyPress}
                          id="textBox"
                        />
                      </FormGroup>
                    </Col>
                    <Col>
                    <FormGroup> 
                      <Label>{this.stringTranslate("Veiculo.Pesquisar.Filtro.Cor")}</Label>          
                      <Select    
                        size="large"     
                        style={{width: "100%"}}               
                        allowClear={true}
                        showSearch={true}
                        value={this.state.valores["cor"]}
                        onChange={(e) => this.handleChange(e, "cor")}
                        placeholder=""
                      >
                        {this.preencherOptions("cor").map((prop) => {
                          return(
                            <Option value={prop.value}>{prop.label}</Option>                            
                        )})}     
                        </Select> 
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <FormGroup> 
                        <Label>{this.stringTranslate("Veiculo.Pesquisar.Filtro.Marca")}</Label>                        
                        <Select     
                          size="large"     
                          style={{width: "100%"}}               
                          allowClear={true}
                          showSearch={true}
                          onChange={(e) => this.handleChange(e, "marca")}
                          value={this.state.valores["marca"]}
                          placeholder=""
                        > 
                        {this.preencherOptions("marca").map((prop) => {
                          return(
                            <Option value={prop.value}>{prop.label}</Option>                            
                        )})}     
                        </Select> 
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup> 
                      <Label>{this.stringTranslate("Veiculo.Pesquisar.Filtro.Categoria")}</Label>                        
                      <Select   
                        style={{width: "100%"}}    
                        size="large"     
                        allowClear={true}
                        showSearch={true}
                        onChange={(e) => this.handleChange(e, "categoria")}
                        value={this.state.valores["categoria"]}
                        placeholder=""
                        > 
                        {this.preencherOptions("categoria").map((prop) => {
                          return(
                            <Option value={prop.value}>{prop.label}</Option>                            
                        )})}     
                        </Select> 
                      </FormGroup>
                    </Col>
                  </Row>
                  </Collapse>    
                </CardBody>
                <CardFooter style={{paddingTop:"0px"}}>    
                <Row>
                <Col md="2"><Button style={{top: "calc(100% - 49px)", marginBottom: "25px"}} type="link" onClick={() => this.filtrosToggle()}> {this.state.filtrosPage === false ? (<>{this.stringTranslate("Botao.VerFiltros")} <i className="fad fa-chevron-double-down"></i></>) : (<>{this.stringTranslate("Botao.EsconderFiltros")} <i className="fad fa-chevron-double-up"></i></>)}</Button></Col>
                <Col md="4"></Col>
                <Col md="3"><Button block style={{top: "calc(100% - 49px)", marginBottom: "25px"}} size="large"  onClick={() => this.limparFiltros()}>{this.stringTranslate("Botao.LimparFiltros")}</Button></Col>                
                <Col md="3"><Button block style={{top: "calc(100% - 49px)", marginBottom: "25px"}} size="large" type="primary" loading={this.state.loadingTable} onClick={() => this.pesquisar()}>{this.stringTranslate("Botao.Pesquisar")}</Button></Col>
                </Row>            
                </CardFooter>
              </Card>
            </Col>
          </Row>

          <TabelaVeiculos tableHead={this.state.tableHead} veiculoPorId={this.veiculoPorId} loading={this.state.loadingTable} tableData={this.state.data} excluirVeiculo={this.excluirVeiculo}></TabelaVeiculos>

        </div> 
        {this.state.modal === true ? (<ModalVeiculo modal={this.state.modal} local={this.modalLocal} excluirVeiculo={this.excluirVeiculo} pesquisaPessoa={this.loadOptions} preencherOptions={this.preencherOptions} onclick={this.toggle} data={this.state.dados} statusModal={this.state.statusModal}/>):null}     
      </>
    );
  }
}

export default injectIntl(Veiculos);