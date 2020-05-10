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
  CardTitle,
  Row,
  Col
} from "reactstrap";
import { Button, FormGroup, Label, Input, CustomInput  } from 'reactstrap';
import { post,postAdonis } from "utils/api";
import  TabelaPesquisa from "components/Table/TabelaPesquisa.jsx";
import { toast, Slide } from 'react-toastify';
import  CadastroPessoa from "views/CadastroPessoa.jsx";
import { pegaDataHora } from "components/dataHora.jsx"
import { localstorageObjeto } from "utils/Requisicoes";
import { injectIntl } from "react-intl";
import { Redirect } from "react-router-dom";
import {Select} from 'antd';

const { Option } = Select;

const getDirecao = (tipo) => {
  if (tipo!= null){
	  var retorno = tipo.split("_")[1][0];
    return retorno;
  }
}



const getTipo = (tipo) =>{
	/*
	AUTORIZACAO_AUTORIZACAO_Residente,        //1- pessoa mora/trabalha no prédio
    AUTORIZACAO_PreAutorizado,    //2- autorizado com um prazo de validade
    // ver DataInicioLiberação, DataFimLiberação, PessoaResponsável
    AUTORIZACAO_PrecisaLiberacao, //3- precisa intervenção do guarda
    AUTORIZACAO_Desativado,       //4- desativado (não pode acessar)
    AUTORIZACAO_ResidentePonto,   //5- residente, bate ponto (segundo jornada)
    AUTORIZACAO_Externo);         //6-externo não residente (e.g.prop.lote)
  */
 var retorno=0
 if (tipo == 1)  
  retorno= 'Residente' 
 else  if (tipo == 2)  
  retorno= 'PreAutorizado'
 else  if (tipo == 3)  
  retorno=  'PrecisaLiberacao'
 else  if (tipo == 4)  
  retorno=  'Desativado'
 else  if (tipo == 5)  
  retorno= 'ResidentePonto'
 else  if (tipo == 6)  
  retorno= 'Externo'

//	var retorno = tipo.substr(tipo.indexOf('_')+1);
	return retorno;
}





class Pesquisar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            token: '',
            tableHead: [this.stringTranslate("Pesquisa.table.head.nome"), 
                        this.stringTranslate("Pesquisa.table.head.tipo"), 
                        this.stringTranslate("Pesquisa.table.head.ultimoAcesso"), 
                        this.stringTranslate("Pesquisa.table.head.dir"), 
                        this.stringTranslate("Pesquisa.table.head.veiculo"),
                        this.stringTranslate("Pesquisa.table.head.placa"),
                        this.stringTranslate("Pesquisa.table.head.lotacaoSecao"),
                        this.stringTranslate("Pesquisa.table.head.empresa")],
            data: [],
            valorPesquisa: "",
            selectedValueTipo: "nome",
            selectedtipoAutorizado: 1,
            codigoempresa: "",
            empresa: 0,
            lotacao: 0,
            secao: 0,
            redirect: false,
            resultado:"",
            dataSelecionado: "",
            infoPesquisa: [],
            ArrayValoresNomeEmpresa: [],
            ArrayValoresLotacao: [],
            ArrayValoresSecao: [],
            statusBotao: [true, true],
            link: "",
        };

        this.handleChange = this.handleChange.bind(this);
        this.ConsultaPessoa = this.ConsultaPessoa.bind(this);
        this.cadastroPessoa = this.cadastroPessoa.bind(this);
        this.dataPessoaselect = this.dataPessoaselect.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.postDados = this.postDados.bind(this);
        this.stringTranslate = this.stringTranslate.bind(this);
        this.atualizaCabecalho = this.atualizaCabecalho.bind(this);
    }

    atualizaCabecalho(){
      this.setState({
        tableHead: [this.stringTranslate("Pesquisa.table.head.nome"), 
                    this.stringTranslate("Pesquisa.table.head.tipo"), 
                    this.stringTranslate("Pesquisa.table.head.ultimoAcesso"), 
                    this.stringTranslate("Pesquisa.table.head.dir"), 
                    this.stringTranslate("Pesquisa.table.head.veiculo"),
                    this.stringTranslate("Pesquisa.table.head.placa"),
                    this.stringTranslate("Pesquisa.table.head.lotacaoSecao"),
                    this.stringTranslate("Pesquisa.table.head.empresa")] 
      });
    }

    componentDidUpdate(){
      if (this.state.tableHead[0] !== this.stringTranslate("Pesquisa.table.head.nome"))
      this.atualizaCabecalho();
    }
  
    stringTranslate(id){
      return this.props.intl.formatMessage({id: id});
    }


    cadastroPessoa(e){
        this.state.index = "0";
        var redirect = "";
  
        if(typeof(Storage) !== "undefined"){
          sessionStorage.setItem("id", "0");
          sessionStorage.setItem("nome", this.state.infoPesquisa["valor"]);
          redirect = "/admin/Liberacao";    
        }
        else{
          redirect = "/admin/Liberacao?id=0&nome=" + this.state.infoPesquisa["valor"];        
        }
        this.state.dataSelecionado = "";
        this.setState({index: this.state.index, link: redirect, redirect: true, dataSelecionado: this.state.dataSelecionado});
    };

    onKeyPress(e){
      if(e.which === 13 && e.target.value.length > 2)
        this.ConsultaPessoa();        
    };

    handleChange(e) {
      console.log(e.target.name,e.target.value )
      if(e.target.name === "tipoPesquisa")
      {
        this.state.infoPesquisa["valor"] = "";
        this.state.infoPesquisa["lotacao"] = "";
        this.state.infoPesquisa["secao"] = "";
        this.state.statusBotao[1] = true;
        this.state.statusBotao[0] = true;
        this.setState({statusBotao: this.state.statusBotao});
      }

      if(e.target.name === "secao" || e.target.name === "lotacao")
      {
        if(e.target.value !== "")     
          this.state.statusBotao[0] = false;   
          this.setState({statusBotao: this.state.statusBotao});         
      }

      if(e.target.name === "valor" && e.target.value.length > 2)
      {
        this.state.statusBotao[0] = false;
        this.setState({statusBotao: this.state.statusBotao});
      }  

      this.state.infoPesquisa[e.target.name] = e.target.value;
      this.setState({
        infoPesquisa: this.state.infoPesquisa,
      });
    }

    componentDidMount() //Assim pois a chamada disabled do componente buttom, faz perder o link, então é feito o disabled após o render()
    {
        this.state.statusBotao[0] = true;
        this.state.statusBotao[1] = true;
        this.state.infoPesquisa["tipoPesquisa"] = "1";
        this.state.infoPesquisa["tipoAutorizado"] = "1";
        this.setState({statusBotao: this.state.statusBotao});
        this.postDados();

    }

    async ConsultaPessoa(){        
      this.setState({loading:true});
      const token = sessionStorage.getItem("token");
      const body={
        cmd:"listapessoasfiltros",
        valor: this.state.infoPesquisa["valor"],
        tipopesquisa: this.state.infoPesquisa["tipoPesquisa"],
        tipoautorizado: this.state.infoPesquisa["tipoAutorizado"],
        token:token,
        idLotacao:parseInt(this.state.infoPesquisa["lotacao"]),
        idSecao: parseInt(this.state.infoPesquisa["secao"])
      }
      var Comando = '';
      if  (this.state.infoPesquisa["tipoPesquisa"] ==="1"){
        Comando = '/Portaria/Pesquisa/NomeDocPlaca'
      }
      else
      if  (this.state.infoPesquisa["tipoPesquisa"] ==="2"){
        Comando = '/Portaria/Pesquisa/Matricula'
      }
      else
      if  (this.state.infoPesquisa["tipoPesquisa"] ==="3"){
        Comando = '/Portaria/Pesquisa/Crachar'
      }
      else
      if  (this.state.infoPesquisa["tipoPesquisa"] ==="4"){
        Comando = '/Portaria/Pesquisa/EmpresaLotacaoSecao'
      }
   //   console.log(Comando,)
      postAdonis(body,Comando).then(lista =>{
        //postAdonis(body).then(lista =>{
        if(lista.error === undefined)
        {
            const dados = lista.dados;
         //   const array = dados.ListaAutorizados;
            const array = dados;
            
            
            this.state.resultado = dados.count + this.stringTranslate("Pesquisa.toast.resultadoPesquisa");
            this.setState({resultado: this.state.resultado});

            if(lista.retorno === true)
            {
              this.state.statusBotao[1] = false;
              this.setState({statusBotao: this.state.statusBotao});
            }

            if(dados.count == 0)            
              this.erroNotification(this.stringTranslate("Pesquisa.toast.semResultado"), "warning");            
            else{
              const data = array.map(item =>{
                let data = [];
                let tipo ="";
                let veiculo ="";
                let placa="";
                let lotacaoSecao = "", empresa = "";

                if(item.acessoultimo !== " " && item.acessoultimo !== null){
        
                  data=pegaDataHora(item.acessoultimo.Datahora);
                  
                  if(item.acessoultimo.Visitou !== undefined && item.acessoultimo.Visitou !== " ")
                  {
                    lotacaoSecao = item.acessoultimo.Visitou;//nomeLotacao + " / " + item.acessoultimo.nomeSecao;
                    empresa = item.acessoultimo.nomeEmpresa;
                  }
    
                  if((item.acessoultimo.acessoextra !== " ") && (item.acessoultimo.acessoextra !== null)){
                    veiculo= item.acessoultimo.acessoextra.ModeloCarro!== null?item.acessoultimo.acessoextra.ModeloCarro:"";
                    placa=item.acessoultimo.acessoextra.PlacaCarro!== null? item.acessoultimo.acessoextra.PlacaCarro:"";
                  }
                  tipo=(this.stringTranslate("Direcao."+item.acessoultimo.Direcao));
                }
    
                return [item.CodPessoa,item.pessoa.Nome.toLowerCase(),this.stringTranslate("TipoAutorizado."+getTipo(item.TipoAutorizacao)),data,tipo,veiculo,placa,lotacaoSecao,empresa,""];
              });
              this.setState({data:data,loading:false,selectedValueTipo:this.state.selectedValueTipo,empresa:this.state.empresa,lotacao:this.state.lotacao,secao:this.state.secao})
            }                      
        }
        else
        {
          this.erroNotification(this.stringTranslate("Pesquisa.toast.erroServidor") , "erro");
        }
        
     });
    }

    erroNotification(mensagem, tipo){
      if(tipo === "erro"){
        toast.error(mensagem, {
          transition: Slide,
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true
          });
      }
      else if(tipo === "info"){
        toast.info(mensagem, {
          transition: Slide,
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true
          });
      }
      else if(tipo === "sucess"){
        toast.success(mensagem, {
          transition: Slide,
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true
          });
      }
      else if(tipo === "warning"){
        toast.warning(mensagem, {
          transition: Slide,
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true
          });
      }
         
    }

    postDados() {
        this.state.ArrayValoresNomeEmpresa = localstorageObjeto("empresas");
        this.state.ArrayValoresLotacao = localstorageObjeto("lotacao");
        this.state.ArrayValoresSecao = localstorageObjeto("secao");
        this.setState({
          ArrayValoresNomeEmpresa: this.state.ArrayValoresNomeEmpresa, 
          ArrayValoresLotacao: this.state.ArrayValoresLotacao, 
          ArrayValoresSecao: this.state.ArrayValoresSecao
        }); 

        

        const token = sessionStorage.getItem("token");
        const body={
          cmd:"listasecaolotacaoempresa",
          token:token
        }
  
          postAdonis(body,'/Empresa/Lista').then(lista =>{
            if(lista.error === undefined)
            {
              const dados = lista.dados;
  
              const nomeEmpresas = dados.empresa.map(item =>{
                return [item.CodEmpresa, item.Nome];
              });
  
              const lotacao = dados.lotacao.map(item =>{
                return [item.CodLotacao,item.Nome,item.CodEmpresa];
              });
  
              const secao = dados.secao.map(item =>{
                return [item.CodSecao,item.Nome,item.CodLotacao];
              });
  
              this.state.ArrayValoresNomeEmpresa = nomeEmpresas;
              this.state.ArrayValoresLotacao = lotacao;
              this.state.ArrayValoresSecao = secao;
              this.setState({ArrayValoresNomeEmpresa: this.state.ArrayValoresNomeEmpresa});
              this.setState({ArrayValoresLotacao: this.state.ArrayValoresLotacao});
              this.setState({ArrayValoresSecao: this.state.ArrayValoresSecao});            
            }                
            else
            {
              this.erroNotification("Erro ao obter informações!", "erro");
            }          
          })
        
    }
    

  dataPessoaselect(data){
    this.state.dataSelecionado = data;
    this.state.dataSelecionado["length"] = 1;
    sessionStorage.setItem("search", this.state.dataSelecionado);
    /*this.setState({dataSelecionado: this.state.dataSelecionado});
    this.setState(prevState => ({
      redirect: true
    }))*/
  }
  // renderselecLotacao(){
  //   var lotacaoEmpresa = this.state.ArrayValoresNomeEmpresa.map((prop)
  //   return (
  //     <>
  //     <Select defaultValue="" style={{ width: 120 }}  
  //         onChange={(e) => this.handleChange(e)}
  //         name= 'lotacao'
  //         id= 'lotacao'>

  //     <Option key=""></Option>
  //       {this.state.ArrayValoresNomeEmpresa.forEach((prop) =>
          
  //          <Option key={prop[0]} > {prop[1] }</Option>
          
  //       )}

  //   </Select>
  //     </Select>
  //   <CustomInput  type="select"
  //   style={{color:"#000"}}
  //         value={this.state.infoPesquisa["lotacao"]}
  //         onChange={(e) => this.handleChange(e)}
  //         name= 'lotacao'
  //         id= 'lotacao'>
  //           <option></option>
  //      {this.state.ArrayValoresLotacao.map((prop) => {
  //        console.log(prop[0],prop[1],prop[2],this.state.infoPesquisa["empresa"])
  //         return (
  //             (prop[2] === this.state.infoPesquisa["empresa"]) ? (<option value={prop[0]} name>{prop[1]}</option>) : null
  //           );
  //      })}
  //     </CustomInput>
  //     </>
  //     )
  // }
  // renderselectEmpresa(){
  //   console.log(this.state.ArrayValoresNomeEmpresa)
  //   if(this.state.ArrayValoresNomeEmpresa != undefined)
  //   return (
  //   <>
  //   <Select defaultValue="" style={{ width: 120 }}
  //    onChange={(e) => this.handleChange(e)}
  //    name= 'empresa'
  //    id='empresa'>
  //     <Option key=""></Option>

  //       {this.state.ArrayValoresNomeEmpresa.map((prop) =>
          
  //          <Option key={prop[0]} > {prop[1] }</Option>
          
  //       )}
  //   </Select>
  //   </>
  //   )
  //   else return null
  // }
  render() {
    if(this.state.redirect === true){
      return( <Redirect to={this.state.link} /> )
    }
    else{
    return (
      <>      
        <div className="content">
          <Row>
            <Col md="12">
              <Card className="demo-icons" >
                <CardHeader tag="h4">
                {this.stringTranslate("Pesquisa.card.titulo")}                  
                </CardHeader>
                <CardBody className="all-icons" style={{marginRight:"10px"}}>
                  <Row>
                    <Col md="7" controlId="validationCustom01">
                      <FormGroup>
                        <Label>{this.stringTranslate("Pesquisa.card.tipoPesquisa")}</Label>
                        <CustomInput style={{color:"#000"}} type="select" onChange={(e) => this.handleChange(e)} name="tipoPesquisa" value={this.state.infoPesquisa["tipoPesquisa"]}>
                            <option value="1">{this.stringTranslate("Pesquisa.card.tipoPesquisa.opcao.nome")}</option>
                            <option value="2">{this.stringTranslate("Pesquisa.card.tipoPesquisa.opcao.matricula")}</option>
                            <option value="3">{this.stringTranslate("Pesquisa.card.tipoPesquisa.opcao.cracha")}</option>
                            <option value="4">{this.stringTranslate("Pesquisa.card.tipoPesquisa.opcao.empresa")}</option>
                          </CustomInput>
                      </FormGroup>
                    </Col>
                    <Col md="5">
                    <FormGroup>
                      <Label>{this.stringTranslate("Pesquisa.card.tipoAutorizado")}</Label>
                      <CustomInput style={{color:"#000"}} type="select" onChange={(e) => this.handleChange(e)} name="tipoAutorizado" value={this.state.infoPesquisa["tipoAutorizado"]}>
                          <option value="2">{this.stringTranslate("Pesquisa.card.tipoAutorizado.opcao.visitantes")}</option>
                          <option value="1">{this.stringTranslate("Pesquisa.card.tipoAutorizado.opcao.permanentes")}</option>
                          <option value="3">{this.stringTranslate("Pesquisa.card.tipoAutorizado.opcao.todos")}</option>
                        </CustomInput>
                        </FormGroup>
                    </Col>
                  </Row>

                  {this.state.infoPesquisa["tipoPesquisa"] !== "4" ? (
                  <Row>
                    <Col md="7">
                    <FormGroup>
                      <Label>{this.stringTranslate("Pesquisa.card.input.preencher")}</Label>
                      <Input type="text"
                          name= "valor"
                          value={this.state.infoPesquisa["valor"]}
                          onChange={(e) => this.handleChange(e)}
                          onKeyPress={this.onKeyPress}
                          id="textBox"
                      />
                    </FormGroup>
                    </Col>
                    <Col md="5">
                      <Row>
                      <Col md="6">
                      <Button block
                          color="primary"
                          id="botaoPesquisa"
                          disabled={this.state.statusBotao[0]}
                          style={{marginTop:"25px"}}
                          onClick={this.ConsultaPessoa}>{this.stringTranslate("Pesquisa.card.botao.pesquisar")}
                      </Button>
                      </Col>
                      <Col md="6">
                        <Button block
                        color="primary"
                        id="botaoCadastro"
                        disabled={this.state.statusBotao[1]}
                        style={{marginTop:"25px"}}
                        onClick={this.cadastroPessoa}>{this.stringTranslate("Pesquisa.card.botao.cadastro")}
                        </Button>
                      </Col>
                      </Row>
                    </Col>
                  </Row>
                  ) :(
                    <>
                  <Row>
                  <Col><FormGroup>
                      <Label>{this.stringTranslate("Pesquisa.card.empresa")}</Label>
                      {/* {this.renderselectEmpresa()} */}
                      <CustomInput  type="select"
                      style={{color:"#000"}}
                            value={this.state.infoPesquisa["empresa"]}
                            onChange={(e) => this.handleChange(e)}
                            name= 'empresa'
                            id='empresa'>
                              <option></option>
                      {this.state.ArrayValoresNomeEmpresa.map((prop, key) => {
                        return (
                          <option value={prop[0]} name>{prop[1]}</option>
                        );
                      })}
                        </CustomInput>
                        </FormGroup>
                    </Col>

                    <Col><FormGroup>
                        <Label>{this.stringTranslate("Pesquisa.card.lotacao")}</Label>
                        <CustomInput  type="select"
                        style={{color:"#000"}}
                              value={this.state.infoPesquisa["lotacao"]}
                              onChange={(e) => this.handleChange(e)}
                              name= 'lotacao'
                              id= 'lotacao'>
                                <option></option>
                           {this.state.ArrayValoresLotacao.map((prop) => {
                             console.log(prop[0],prop[1],prop[2],this.state.infoPesquisa["empresa"])
                              return (
                                  (prop[2] ===  parseInt(this.state.infoPesquisa["empresa"])) ? (<option value={prop[0]} name>{prop[1]}</option>) : null
                                );
                           })}
                          </CustomInput></FormGroup>
                      </Col>
                      <Col><FormGroup>
                          <Label>{this.stringTranslate("Pesquisa.card.secao")}</Label>
                          <CustomInput  type="select"
                          style={{color:"#000"}}
                                value={this.state.infoPesquisa["secao"]}
                                onChange={(e) => this.handleChange(e)}
                                name= 'secao'
                                id= 'secao'
                            >
                             <option></option>
                              {this.state.ArrayValoresSecao.map((prop, key) => {                        
                                return (
                                  (prop[2] === parseInt(this.state.infoPesquisa["lotacao"])) ? (
                                    
                                  <option value={prop[0]} >{prop[1]}</option>) : null
                                );
                              })}
                            </CustomInput ></FormGroup>
                        </Col>                        
                    </Row>
                    <Row >
                      <Col md="7"></Col>
                      <Col md="5">
                      <Row>
                        <Col md="6">
                            <Button block
                            color="primary"
                            disabled={this.state.statusBotao[0]}
                            id="botaoPesquisa"
                            style={{marginTop:"25px"}}
                            onClick={this.ConsultaPessoa}>{this.stringTranslate("Pesquisa.card.botao.pesquisar")}
                            </Button>
                          </Col>
                          <Col md="6">
                            <Button block
                            color="primary"
                            disabled={this.state.statusBotao[1]}
                            id="botaoCadastro"
                            style={{marginTop:"25px"}}
                            onClick={this.cadastroPessoa}>{this.stringTranslate("Pesquisa.card.botao.cadastro")}
                            </Button>
                          </Col>
                        </Row>
                        </Col>
                    </Row>
                    </>
              )}
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
          <Col md="12">
            <TabelaPesquisa
              tableHead={this.state.tableHead}
              tableData={this.state.data}
              loading={this.state.loading}
              encontrados={this.state.resultado}
              pegaDados={this.dataPessoaselect}
              />
          </Col>  
          </Row>
        </div>    
      </>
    );


  }
}
}

export default injectIntl(Pesquisar);
