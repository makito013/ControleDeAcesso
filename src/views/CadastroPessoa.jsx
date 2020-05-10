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
  Col
} from "reactstrap";
import { Button, FormGroup, Label, Input, CardFooter, CustomInput, Modal, ModalHeader, ModalBody, ModalFooter  } from 'reactstrap';
import { post,postAdonis } from "utils/api";
import { toast, Slide } from 'react-toastify';
import InputMask from 'react-input-mask';
import Search from 'components/Form/AutoSugestion.jsx';
import { Redirect } from "react-router-dom";
import { ListGroupItem, ListGroup  } from 'reactstrap';
import { pegaDataHora, pegaData } from "components/dataHora.jsx"; 
import ModalCadastroBiometrico from "components/Modal/ModalCadastroBiometrico"
import { localstorageObjeto, solicitaImagem } from "utils/Requisicoes";
import ClipLoader from 'react-spinners/ClipLoader';
import { injectIntl } from "react-intl";
import Webcam from "react-webcam";
import ModalFoto from "components/Modal/ModalFoto.jsx"

class CadastroPessoa extends React.Component {
  //Contrutor
    constructor(props) {
        super(props);
        // this.videoConstraints = {
        //   width: 1280,
        //   height: 720,
        //   facingMode: "user"
        // };
        //  this.stringTranslate = this.stringTranslate.bind(this);
        //  this.useRef = React.useRef(null);
        //  this.capture = React.useCallback(
        //   () => {
        //     this.imageSrc = this.webcamRef.current.getScreenshot();
        //   },
        //   [this.webcamRef]
        // );
        //Variaveis do objeto
        this.state = {            
            novoDocumento: false,
            infoVeiculo:[],
            infoPessoa:[],
            ArrayTipoCarros:[ this.stringTranslate("Cadastro.veiculo.opcao.carro"), 
                              this.stringTranslate("Cadastro.veiculo.opcao.moto"), 
                              this.stringTranslate("Cadastro.veiculo.opcao.bicicleta"), 
                              this.stringTranslate("Cadastro.veiculo.opcao.pe")],
            ArrayMarcaCarros:["IMPORTADO", "TOYOTA", "VOLKSWAGEN", "FORD", "NISSAN", "HONDA", "HYUNDAI", "CHEVROLET", "KIA", "RENAULT", "MERCEDES-BENZ", "PEUGEOT", "BMW", "AUDI", "MARUI", "MAZDA", "FIAT", "JEEP", "CHANGAN", "GEELY", "BUICK", "OUTROS"],
            ArrayMarcaMotos:["BMW","DUCATI","DAFRA","HONDA","KAWASAKI","YAMAHA","ROYAL ENFIELD","SUZUKI","OUTROS", "IMPORTADOS"],
            ArrayCategoriaCarros:[["Ambulância", this.stringTranslate("Cadastro.categoriaVeiculo.opcao.ambulancia")],
                                  ["Caminhão", this.stringTranslate("Cadastro.categoriaVeiculo.opcao.caminhao")],
                                  ["Micro Ônibus", this.stringTranslate("Cadastro.categoriaVeiculo.opcao.microOnibus")], 
                                  ["Quadriciclo", this.stringTranslate("Cadastro.categoriaVeiculo.opcao.quadriciclo")], 
                                  ["Ônibus", this.stringTranslate("Cadastro.categoriaVeiculo.opcao.onibus")], 
                                  ["Reboque", this.stringTranslate("Cadastro.categoriaVeiculo.opcao.reboque")], 
                                  ["Triciclo", this.stringTranslate("Cadastro.categoriaVeiculo.opcao.triciclo")], 
                                  ["Van", this.stringTranslate("Cadastro.categoriaVeiculo.opcao.van")], 
                                  ["Veículos Leves", this.stringTranslate("Cadastro.categoriaVeiculo.opcao.veiculosLeves")], 
                                  ["Viatura", this.stringTranslate("Cadastro.categoriaVeiculo.opcao.viatura")], 
                                  ["Moto", this.stringTranslate("Cadastro.categoriaVeiculo.opcao.moto")]],
            ArrayCores:[["Azul"   , this.stringTranslate("Cadastro.cor.opcao.azul")], 
                        ["Bege"    , this.stringTranslate("Cadastro.cor.opcao.bege")],
                        ["Branco"  , this.stringTranslate("Cadastro.cor.opcao.branco")], 
                        ["Cinza"   , this.stringTranslate("Cadastro.cor.opcao.cinza")], 
                        ["Dourado" , this.stringTranslate("Cadastro.cor.opcao.dourado")], 
                        ["Fantasia", this.stringTranslate("Cadastro.cor.opcao.fantasia")], 
                        ["Grena"   , this.stringTranslate("Cadastro.cor.opcao.grena")], 
                        ["Laranja" , this.stringTranslate("Cadastro.cor.opcao.laranja")], 
                        ["Marrom"  , this.stringTranslate("Cadastro.cor.opcao.marrom")], 
                        ["Prata"   , this.stringTranslate("Cadastro.cor.opcao.prata")], 
                        ["Preto"   , this.stringTranslate("Cadastro.cor.opcao.preto")], 
                        ["Rosa"    , this.stringTranslate("Cadastro.cor.opcao.rosa")], 
                        ["Roxo"    , this.stringTranslate("Cadastro.cor.opcao.roxo")], 
                        ["Verde"   , this.stringTranslate("Cadastro.cor.opcao.verde")], 
                        ["Vermelho", this.stringTranslate("Cadastro.cor.opcao.vermelho")]],
            ArrayValoresLotacao: [],// localstorageObjeto("lotacao"),
            ArrayValoresNomeEmpresa:[],// localstorageObjeto("empresas"),
            ArrayValoresSecao:[] ,//localstorageObjeto("secao"),
            ArrayValoresColetor:[],// localstorageObjeto("coletores"),
            ArrayValorescategoria:[],//localstorageObjeto("categorias"),
   
            valores:[],
            sugestion: [],
            secao:0,
            timerInit:[],
            contadorTimer: 0,  
            mensagemErro: "",
            campoDocumento: 1,
            data:[],
            loading: true,
            redirect: false,
            numeroBiometria: "",
            foto: [],
            modal: false,
        };
                
        //Inicia Valores padrões
      
        //Chamada de funções da classe
        this.getempresalotacaoSecao()
        this.registrarSaidaSemEntrada = this.registrarSaidaSemEntrada.bind(this);
        this.carregaValores = this.carregaValores.bind(this);
        this.enviaCadastro = this.enviaCadastro.bind(this);
        this.funcaoAlteraValor = this.funcaoAlteraValor.bind(this);
        this.voltar = this.voltar.bind(this);
        this.limpar = this.limpar.bind(this);
        this.solicitaDadosPessoa = this.solicitaDadosPessoa.bind(this);
        this.redirect = this.redirect.bind(this);
        this.registraSaida = this.registraSaida.bind(this);
        this.handleBiometria = this.handleBiometria.bind(this);
        this.valorFotos = this.valorFotos.bind(this);
        this.carregaDocumentos = this.carregaDocumentos.bind(this);
        this.toggle = this.toggle.bind(this);
        //this.handleChange = this.handleChange.bind(this);

        //Pega as array das selectbos e põe em ordem alfabetica
        this.state.ArrayMarcaCarros.sort();
        this.state.ArrayCategoriaCarros.sort();
        this.state.ArrayCores.sort();
        this.state.ArrayMarcaMotos.sort();


        //Valores padrão 
        this.state.infoPessoa["documento1"] = "CPF"; 
        this.state.infoPessoa["tipoVeiculo"] =  3;       
        this.state.infoPessoa["nome"] = this.props.Nome;
        this.state.infoPessoa["nomeDisabled"] = false
        this.state.infoPessoa["codIdPessoa"] = 0;
        this.state.infoPessoa["tipoAutenticacao"] = "PIN";


        //Verifica se é um novo cadastro para pular a obtenção de valores pessoa
        if(this.props.nome !== undefined)                
          this.state.data = this.props.data;        
           
        

         //Inicializa timer para verificar tempo de resposta                            
        
         //Traduz as strings
        
  }
  getempresalotacaoSecao(){
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
  stringTranslate(id){
    return this.props.intl.formatMessage({id: id});
  }

  toggle() {
    this.state.modal = !this.state.modal;
    this.setState(() => ({
        modal: this.state.modal
    }));
  }

  mensagemTela(mensagem, tipo){
    if(tipo === "error"){
      toast.error(mensagem, {
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
    else if(tipo === "success"){
      toast.success(mensagem, {
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
    else if(tipo === "warn"){
      toast.warn(mensagem, {
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
    else if(tipo === "info"){
      toast.info(mensagem, {
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
  }




  ////////////////////////////// Requisição post para pegar dados da pessoa ///////////////////////////
  solicitaDadosPessoa() {
    let selectedIndex = this.props.Id;   

    const token = sessionStorage.getItem("token");
    const body={
      cmd:"pessoacodigo",
      codigo:selectedIndex,
      token:token,
    }

    post(body).then(lista =>{        
      if(lista.error === undefined)
      {
        this.state.data = lista.dados;
        this.setState({data:this.state.data});                    
      }                
      else
      {
        this.state.mensagemErro = this.stringTranslate("Liberacao.erro");
        this.redirect();
      } 
    });
  }
  //-------------------------------------------------------------------------------------------------------//




  ////////////////////////////// Requisição post para registrar saida sem entrada ///////////////////////////
  registrarSaidaSemEntrada() {
    if(this.state.infoPessoa["obs"] === undefined || this.state.infoPessoa["obs"] === "")
    {
      this.mensagemTela(this.stringTranslate("CadastroPessoa.Erro.CampoObrigatorioObs"), "warn");
    }
    else if(this.state.infoPessoa["obs"].length < 10)
    {
      this.mensagemTela(this.stringTranslate("CadastroPessoa.Erro.InsiraMaisInformacoes"), "warn");
    }
    else{
      const token = sessionStorage.getItem("token");
      const body={      
        cmd:"registrarSaidaSemEntrada",
        codPessoa:this.state.infoPessoa["codIdPessoa"],
        acionar:false,
        codColetor: this.state.infoPessoa["coletor"],
        obs: this.state.infoPessoa["obs"],
        token:token,
      }
      post(body).then(lista =>{
        this.mensagemTela(this.stringTranslate("Cadastro.mensagemTela.saidaSucesso"), "success");  
        this.redirect();
      });
    }
  }
  //-------------------------------------------------------------------------------------------------------//




  ////////////////////  Função executada assim que a pagina terminar de montar ////////////////////////////
  componentDidMount() //Assim pois a chamada disabled do componente buttom, faz perder o link, então é feito o disabled após o render()
  {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    
    this.state.data = this.props.data;
    this.setState({data:this.state.data});       

    if(this.state.data !== undefined)
    {
      this.carregaValores();           
    }               

    this.setState({
      loading: false,
    });
  }
  //-----------------------------------------------------------------------------//





  /////////////////////////// Carrega as variaveis com os valores obtidos do servidor ////////////////////////
  carregaValores(){
    console.log(this.state.data.Pessoa)
    this.state.infoPessoa["nomeDisabled"] = true;
    this.state.infoPessoa["codIdPessoa"] = this.state.data.Pessoa[0].CODPESSOA;
    this.carregaDocumentos();
    this.state.infoPessoa["nome"] = this.state.data.Pessoa[0].NOME;
    this.state.infoPessoa["CPF"] = this.state.data.Pessoa[0].CPF;
    this.state.infoPessoa["CNH"] = this.state.data.Pessoa[0].NumeroCNH;
    this.state.infoPessoa["validade"] = pegaData(this.state.data.Pessoa[0].DataValidadeCNH) === "Invalid date" ? null : pegaData(this.state.data.Pessoa[0].DataValidadeCNH);
    this.state.infoPessoa["nomeMae"] = this.state.data.Pessoa[0].NomeMae;
    this.state.infoPessoa["numeroAutenticacao"] = this.state.data.Autorizado.PIN;
   // this.state.infoPessoa["vetorIdsBio"] =  this.state.data.vetorIdsBio;

    if(this.state.infoPessoa["CPF"] !== "" || this.state.infoPessoa["CNH"] !== "")
    {
      if(this.state.infoPessoa["CPF"] !== "" )
      {
        this.state.infoPessoa["documento1"] = "CPF";
        this.state.campoDocumento= 1;
        if(this.state.infoPessoa["CNH"] !== "")
        {
          this.state.infoPessoa["documento2"] = "CNH";
          this.state.campoDocumento= 3;
        }            
      }        
      else if(this.state.infoPessoa["CNH"] !== "")
      {
        this.state.campoDocumento= 1;          
        this.state.infoPessoa["documento1"] = "CNH";
      }          
    }
    else
    {
      if(this.state.infoPessoa["documento2"] = "CNH" !== "")
      {
        this.state.infoPessoa["documento2"] = this.state.data.Autorizado.TIPODOCUMENTO;
        this.state.infoPessoa["numero2"] = this.state.data.Autorizado.NUMDOCUMENTO;
        this.state.campoDocumento= 3;
      }
        
    }

    this.state.infoPessoa["categoria"] = this.state.data.Pessoa[0].CodCategoriaPessoa;
    this.state.infoPessoa["secao"] = this.state.data.Autorizado.CODSECAO;

    var ultimoAcesso = this.state.data.ultimoAcesso;

    console.log(ultimoAcesso)
    if(ultimoAcesso !== undefined && ultimoAcesso[0] !== undefined && ultimoAcesso[0].PLACACARRO !== undefined)
    {       
      
      this.state.infoPessoa["placaVeiculo"] = ultimoAcesso[0].PLACACARRO;
      this.state.infoPessoa["modeloVeiculo"] = ultimoAcesso[0].MODELOCARRO;
      this.state.infoPessoa["tipoVeiculo"] = (ultimoAcesso[0].TipoVeiculo)-1;
      this.state.infoPessoa["obs"] = ultimoAcesso[0].Observacoes;
    }
    //this.state.infoPessoa["codAutorizante"] = 
    // codPessoaContato: this.state.infoPessoa["codPessoa"] !== "" && this.state.infoPessoa["codPessoa"] !== undefined ? this.state.infoPessoa["codPessoa"] : "",

    this.setState({campoDocumento: this.state.campoDocumento })
    this.setState({infoPessoa: this.state.infoPessoa});      
    
    if(this.state.data.ultimosacessos !== undefined)
    {
      var entrada = "Sem Registro", saida = "Sem Registro";

      this.state.data.ultimosacessos.forEach(element => {
        if(entrada === "Sem Registro" && element.Direcao.replace(/DIRECAO_/gi, "") === this.stringTranslate("Cadastro.entrada"))
          entrada = pegaDataHora(element.acesso.DataHora);
        if(saida === "Sem Registro" && element.Direcao.replace(/DIRECAO_/gi, "") === this.stringTranslate("Cadastro.saida"))
          saida = pegaDataHora(element.acesso.DataHora);  
        
    });        
      
      this.state.infoPessoa["entrada"] = entrada;
      this.state.infoPessoa["saida"] = saida;
    }            
               
  }    



  //////////////////////////////////  Pega imagens e altera no fomulário  ////////////////////////////////////
  carregaDocumentos(){
    var data = solicitaImagem(this.props.Id,sessionStorage.getItem("token"))

    if(data !== "Erro"){
      this.state.infoPessoa["fotoPerfil"]     = data !== undefined && data.fotoPerfil !== undefined? "data:image/png;base64"+data.fotoPerfil : "";
      this.state.infoPessoa["fotoDocumento"]  = data !== undefined && data.fotoDocumento !== undefined? "data:image/png;base64"+data.fotoDocumento : "";
      
      this.state.foto[0] = this.state.infoPessoa["fotoPerfil"];
      this.state.foto[1] = this.state.infoPessoa["fotoDocumento"];

      this.setState({infoPessoa:  this.state.infoPessoa})
      this.setState({foto: this.state.foto});
    }
  }
  //--------------------------------------------------------------------------------------------------//





  ////////////////////////////// Muda os status de Redirecionamento ////////////////////////////////////////
  redirect (){
    this.setState({redirect: true})
  }
  //---------------------------------------------------------------------------------------------------//    






  //////////////// Função para pegar os valores obtidos no componente search //////////////////////////////
  funcaoAlteraValor(codPessoa, codAutorizante){

    if(codPessoa !== "" )
    {
      this.state.infoPessoa["codPessoa"] = codPessoa;
    }
    
    if(codAutorizante !== "")
    {
      this.state.infoPessoa["codAutorizante"] = codAutorizante;
    }
  }
  //-----------------------------------------------------------------------------------------------------//
  



  ////////////////// Funcao que converte o tipo de veiculo recebido do servidor em numero ///////////////////
  // funcao criada pois o servidor retorna o tipo de veiculo em nome, porem ao regstrar uma entrada
  // ele só recebe se for em número
  verificaVeiculo(tipo)
  {
    switch (tipo){
      case "Carro":
        return 0;
      break;

      case "Moto":
        return 1;
      break;

      case "Bicicleta":
        return 2;
      break;
      
      case "APe":
        return 3;
      break;
    }
  }
  //-----------------------------------------------------------------------------------------------//





  ///////////// Requisição Post que envia os dados para registro ///////////////////////////////////
  enviaCadastro(biometrico){
  
      const body={
        cmd:"salvaliberacao",
        dadosPessoa:
        {
          codpessoa: this.state.infoPessoa["codIdPessoa"],
          nome: this.state.infoPessoa["nome"],
          cpf: this.state.infoPessoa["CPF"] != undefined ? this.state.infoPessoa["CPF"].replace(/[\.-]/g, '') : "",
          cnhnumero: this.state.infoPessoa["CNH"],
          validadecnh: this.state.infoPessoa["validade"] != null && this.state.infoPessoa["validade"] != "" ? pegaData(this.state.infoPessoa["validade"]): null,
          nomemae: this.state.infoPessoa["nomeMae"] !== "" && this.state.infoPessoa["nomeMae"] !== undefined ? this.state.infoPessoa["nomeMae"] : "",
          pin: this.state.infoPessoa["numeroAutenticacao"],
          tipooutrodoc: this.state.infoPessoa["documento1"] !== "CPF" && this.state.infoPessoa["documento1"] !== "CNH"? this.state.infoPessoa["documento1"] : this.state.infoPessoa["documento2"] !== "CPF" && this.state.infoPessoa["documento2"] !== "CNH"? this.state.infoPessoa["documento2"] : "",
          numerooutrodoc: this.state.infoPessoa["documento1"] !== "CPF" && this.state.infoPessoa["documento1"] !== "CNH"? this.state.infoPessoa["numero1"] : this.state.infoPessoa["documento2"] !== "CPF" && this.state.infoPessoa["documento2"] !== "CNH"? this.state.infoPessoa["numero2"] : "",
          codCategoria: this.state.infoPessoa["categoria"],
         // pin:this.state.infoPessoa["numeroAutenticacao"],
          fotoPerfil:this.state.infoPessoa["fotoPerfil"],
          fotoDocumento:this.state.infoPessoa["fotoDocumento"],
        },
        dadosAcesso:
        {
          pin: this.state.infoPessoa["numeroAutenticacao"],
          codSecaoDestino: this.state.infoPessoa["secao"],
          codPessoaAutorizante: this.state.infoPessoa["codAutorizante"],
          codPessoaContato: this.state.infoPessoa["codPessoa"],
          placaVeiculo: this.state.infoPessoa["placaVeiculo"],
          modeloVeiculo: this.state.infoPessoa["modeloVeiculo"],
          observacao: this.state.infoPessoa["obs"],
          descricaomaterial: "",
          tipoveiculo: this.state.infoPessoa["tipoVeiculo"],
          codColetor: this.state.infoPessoa["coletor"],
        },
        token: sessionStorage.getItem("token")
      }

        postAdonis(body,'/Portaria/Pesquisa/Liberacao').then(lista =>{

          if(lista.error !== undefined)        
            this.mensagemTela(lista.error+ " !", "error");           
          else if(lista.retorno === false)
            this.mensagemTela(lista.mensagem+" !", "warn");                 
          else if(lista.retorno === true)
          {            
            if(this.props.biometrico === false){
              this.mensagemTela(this.stringTranslate("Cadastro.mensagemTela.liberacaoSucesso"), "success"); 
              this.redirect();
            }
            else if (this.props.biometrico === true){
              this.state.infoPessoa["codIdPessoa"] = lista.dados.Acesso.Pessoa.CodPessoa;
              this.setState({infoPessoa: this.state.infoPessoa});
              console.log(this.state.infoPessoa["codIdPessoa"]);             
            }
              
          }
      });  
  }
  //-------------------------------------------------------------------------------------------//




  ///////////// Requisição Post para registrar saída ///////////////////////////////////
  registraSaida(){
    if(this.state.infoPessoa["coletor"] === "" || this.state.infoPessoa["coletor"] === undefined)    
      this.mensagemTela("Selecione um coletor!", "warn");            
    else{
      const token = sessionStorage.getItem("token");
    const body={      
      cmd:"registrarSaida",
      codPessoa:this.state.infoPessoa["codIdPessoa"],
      acionar:false,
      codColetor: this.state.infoPessoa["coletor"],
      token:token,
    }
      post(body).then(lista =>{
          if(lista.error !== undefined)          
            this.mensagemTela(lista.error+ " !", "error");           
          else if(lista.retorno === false)
          {
            if(lista.mensagem === "Pessoa sem Registro de Entrada.")
              this.toggle();   
          }   
          else if(lista.retorno === true)
          {
            this.mensagemTela(this.stringTranslate("Cadastro.mensagemTela.saidaSucesso"), "success");  
            this.redirect();
          }
      });   
    }    
}
//-------------------------------------------------------------------------------------------//
    


    
  /////////////// Funções referente a alteração de valores nas inputs e ações de botão //////////////////
  handleChangeselectedtipoDocumento(e)
  {
    if(e.target.name === "documento2" && this.state.infoPessoa["documento2"] === undefined)
    {
      document.getElementById("documento2").remove("0");
    }
    
    this.state.infoPessoa[e.target.name] =  e.target.value;
    this.setState({infoPessoa: this.state.infoPessoa})

  }
  //
  handleClickAdd(e, index)
  {
    if(index === 2 && this.state.infoPessoa["documento1"] === undefined)
    {
      this.state.infoPessoa["documento1"] =  document.getElementById("documento1").value;
      this.setState({infoPessoa: this.state.infoPessoa})
    }

    if(index === 2 && document.getElementById("numero1").value !== "")
    {
      var i = this.state.campoDocumento;
      this.state.campoDocumento = i + index;
      document.getElementById("numero1").disabled = true;
      document.getElementById("documento1").disabled = true;
      this.setState({campoDocumento: this.state.campoDocumento})
    }
    else if(index === 2 && document.getElementById("numero1").value === "")
    {
      this.mensagemTela(this.stringTranslate("Campo Documento vazio"), "error");
    }
  }
  //
  handleClickRemove(e, index)
  {
    var i = this.state.campoDocumento;
    this.state.campoDocumento = i - index;
    this.setState({campoDocumento: this.state.campoDocumento})

    if(index === 2){
      this.state.infoPessoa["documento2"] = "";
      this.state.infoPessoa["numero2"] = "";
    }
    else if(index === 1)
    {
      this.state.infoPessoa["documento1"] = "";
      this.state.infoPessoa["numero1"] = "";
    }
      

    if(document.getElementById("numero1").disabled === true)
    {
      document.getElementById("numero1").disabled = false;
      document.getElementById("documento1").disabled = false;
    }
  }
  //
  handleChangeVeiculo(e)
  {
    this.state.infoVeiculo[e.target.name] = e.target.value;
    this.setState({infoVeiculo: this.state.infoVeiculo})
  }
  //
  handleChange(e)
  {
    this.state.infoPessoa[e.target.name] = e.target.value;
    this.setState({infoPessoa: this.state.infoPessoa})

    if(e.target.name === "empresa" || e.target.name === "lotacao")    
      this.state.infoPessoa["secao"] = "";
    
  }
  //
  handleChangeEmpresa(e)
    {
      this.state.infoPessoa[e.target.name] = e.target.value;
      this.setState({infoPessoa: this.state.infoPessoa})
  }
  //
  renderSearch(){
      return(
        <Search secao={this.state.infoPessoa["secao"]} funcao={this.funcaoAlteraValor} />
      )
  }
  //
  voltar()
   {
     this.setState({redirect: true});
     this.state.infoPessoa = [];
     this.setState({infoPessoa: this.state.infoPessoa})
  }
  //
  limpar()
  {
     this.state.infoPessoa = [];
  }
  //
  handleBiometria(value){
   this.state.numeroBiometria += value + " , ";
    this.setState({
      numeroBiometria: this.state.numeroBiometria
    })
  }
  //
  //-----------------------------------------------------------------------------------------------------//
  setRef = webcam => {
    this.webcam = webcam;
  };

  capture = () => {
    const imageSrc = this.webcam.getScreenshot();
  };

  valorFotos(index, valor){
    this.state.infoPessoa[index] = valor.replace(/TPV_/gi, "data:image/png;base64,");
  }

  render() {
    const videoConstraints = {
      width: 300,
      height: 300,
      facingMode: "user"
    };    

    return (

      <>             
      {this.state.loading === true ? (<div style={{textAlign:"center"}}><ClipLoader sizeUnit={"px"}  size={200} color={'#048ccc '} /></div>) :(
      <>   
      {this.state.redirect === true? (<Redirect to={'/admin/pesquisa'}/>) : null}        
        <Row>      
          {this.state.foto.length > 0 ? ( <>           
              <Col md="4" align="center">
              <ModalFoto valorFotos={this.valorFotos} novoCadastro={false} fotos={this.state.foto}/>              
                {/* <UncontrolledCarousel items={this.state.foto} style={{width:"100%", height:"100%"}} autoPlay={false} indicators={false} controls={true} onClickHandler={event => console.log("entrei")}/>                 */}
              </Col>
              </>
             ) : null}
            <Col>
            <Row>              
              <Col>
              <FormGroup>
                <Label for="nome">{this.stringTranslate("Cadastro.nome")}</Label>
                <Input type="text" name="nome" id="nome" disabled={this.state.infoPessoa["nomeDisabled"]} value={this.state.infoPessoa["nome"]} onChange={(e) => this.handleChange(e)}></Input>
              </FormGroup>
              </Col> 
              {this.state.foto.length === 0 ? (
              <Col md="4" style={{paddingTop:"20px"}}  align="center">
                <ModalFoto valorFotos={this.valorFotos} novoCadastro={true}/>
              </Col>
              ) : null}
              </Row>
            <Row>
            <Col>
            <FormGroup>
            <Label for="documento1">{this.stringTranslate("Cadastro.tipoDocumento")}</Label>
                  <CustomInput type="select" style={{color:"#000"}} name="documento1" id="documento1" value={this.state.infoPessoa["documento1"]} onChange={(e) => this.handleChangeselectedtipoDocumento(e)}>                          
                    {this.state.infoPessoa["documento2"] === 'OUTROS' || this.state.infoPessoa["documento2"] === 'RG' || this.state.infoPessoa["documento2"] === 'CTPS' ? 
                    
                      (<>
                        <option value="CPF">{this.stringTranslate("Cadastro.tipoDocumento.opcao.cpf")}</option>
                        <option value="CNH">{this.stringTranslate("Cadastro.tipoDocumento.opcao.cnh")}</option>                           
                        </>)
                      : (<> 
                      {this.state.infoPessoa["documento2"] !== 'CPF' ? (<option value="CPF">{this.stringTranslate("Cadastro.tipoDocumento.opcao.cpf")}</option>) : null}
                      {this.state.infoPessoa["documento2"] !== 'CNH'?(<option value="CNH">{this.stringTranslate("Cadastro.tipoDocumento.opcao.cnh")}</option>) : null}    
                      {this.state.infoPessoa["documento2"] !== 'RG'?(<option value="RG">{this.stringTranslate("Cadastro.tipoDocumento.opcao.rg")}</option>)  : null}              
                      {this.state.infoPessoa["documento2"] !== 'CTPS'?(<option value="CTPS">{this.stringTranslate("Cadastro.tipoDocumento.opcao.ctps")}</option>): null}
                      {this.state.infoPessoa["documento2"] !== 'OUTROS'?(<option value="OUTROS">{this.stringTranslate("Cadastro.tipoDocumento.opcao.outros")}</option>) : null}
                    </>)}
                    </CustomInput>
              </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                <Label for="numero1">{this.stringTranslate("Cadastro.numero")}</Label>
                {this.state.infoPessoa["documento1"] === "CPF" || this.state.infoPessoa["documento1"] === "CTPS" ? (
                  <Input type="text" 
                    name={this.state.infoPessoa["documento1"] === "CPF" ? ("CPF") : ("CNH") } 
                    mask={this.state.infoPessoa["documento1"] === "CPF" ? ("999.999.999-99") : ("999.99999.99-99") }  
                    id="numero1"   maskChar={null} tag={InputMask} onChange={(e) => this.handleChange(e)}/>
                  ) : (
                  <Input type="text" 
                  name={this.state.infoPessoa["documento1"] === "CNH" ? ("CNH") : ("numero1") } 
                  id="numero1" mask="9999999999999999999" maskChar={null} tag={InputMask} 
                  onChange={(e) => this.handleChange(e)}/>)
                } 
                </FormGroup>
              </Col>
              {this.state.infoPessoa["documento1"] === "CNH" || this.state.infoPessoa["documento1"] === "RG" ? (
              <Col>
              {this.state.infoPessoa["documento1"] === "CNH"? (
                  <FormGroup><Label for="validade">{this.stringTranslate("Cadastro.validade")}</Label> <Input type="date" name="validade" value={this.state.infoPessoa["validade"]} onChange={(e) => this.handleChange(e)} id="validade"/></FormGroup>) :
                (<FormGroup><Label for="expedicao">{this.stringTranslate("Cadastro.expedicao")}</Label> <Input type="date" name="expedicao" value={this.state.infoPessoa["expedicao"]} onChange={(e) => this.handleChange(e)} id="expedicao"/></FormGroup>)}
              </Col> 
              ) : null}
              </Row>
            <Row>
            <Col>
            <FormGroup>
                  <Label for="documento2">{this.stringTranslate("Cadastro.tipoDocumento")}</Label>
                  <CustomInput type="select" style={{color:"#000"}} name="documento2" id="documento2" value={this.state.infoPessoa["documento2"]} onChange={(e) => this.handleChangeselectedtipoDocumento(e)}>
                    <option></option>
                      {this.state.infoPessoa["documento1"] === 'OUTROS' || this.state.infoPessoa["documento1"] === 'RG' || this.state.infoPessoa["documento1"] === 'CTPS' ?                        
                      (<>
                        <option value="CPF">{this.stringTranslate("Cadastro.tipoDocumento.opcao.cpf")}</option>
                        <option value="CNH">{this.stringTranslate("Cadastro.tipoDocumento.opcao.cnh")}</option>                           
                      </>)
                      : (<> 
                      {this.state.infoPessoa["documento1"] !== 'CPF' ? (<option value="CPF">{this.stringTranslate("Cadastro.tipoDocumento.opcao.cpf")}</option>) : null}
                      {this.state.infoPessoa["documento1"] !== 'CNH'?(<option value="CNH">{this.stringTranslate("Cadastro.tipoDocumento.opcao.cnh")}</option>) : null}    
                      {this.state.infoPessoa["documento1"] !== 'RG'?(<option value="RG">{this.stringTranslate("Cadastro.tipoDocumento.opcao.rg")}</option>)  : null}              
                      {this.state.infoPessoa["documento1"] !== 'CTPS'?(<option value="CTPS">{this.stringTranslate("Cadastro.tipoDocumento.opcao.ctps")}</option>): null}
                      {this.state.infoPessoa["documento1"] !== 'OUTROS'?(<option value="OUTROS">{this.stringTranslate("Cadastro.tipoDocumento.opcao.outros")}</option>) : null}
                    </>)}
                    </CustomInput>
              </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                <Label for="numero2">{this.stringTranslate("Cadastro.numero")}</Label>
                  {this.state.infoPessoa["documento2"] === "CPF" || this.state.infoPessoa["documento2"] === "CTPS" ? (
                  <Input type="text" 
                    name={this.state.infoPessoa["documento2"] === "CPF" ? ("CPF") : ("CNH") } 
                    mask={this.state.infoPessoa["documento2"] === "CPF" ? ("999.999.999-99") : ("999.99999.99-99") } 
                    id="numero1"   maskChar={null} tag={InputMask} onChange={(e) => this.handleChange(e)}/>
                  ) : (
                  <Input type="text" 
                  name={this.state.infoPessoa["documento2"] === "CNH" ? ("CNH") : ("numero1") } 
                  id="numero1" mask="9999999999999999999" maskChar={null} tag={InputMask} 
                  onChange={(e) => this.handleChange(e)}/>)
                } 
                </FormGroup>
              </Col>
              {this.state.infoPessoa["documento2"] === "CNH" || this.state.infoPessoa["documento2"] === "RG" ? (
              <Col>
              {this.state.infoPessoa["documento2"] === "CNH"? (
                  <FormGroup><Label for="validade">{this.stringTranslate("Cadastro.validade")}</Label> <Input type="date" name="validade" value={this.state.infoPessoa["validade"]} id="validade" onChange={(e) => this.handleChange(e)}/></FormGroup>) :
                  (<FormGroup><Label for="expedicao">{this.stringTranslate("Cadastro.expedicao")}</Label> <Input type="date" name="expedicao" value={this.state.infoPessoa["expedicao"]} id="expedicao" onChange={(e) => this.handleChange(e)}/></FormGroup>)}
              </Col> ) : null}
              </Row>

          <Row>
            <Col>
              <FormGroup>
                <Label for="nomeMae">{this.stringTranslate("Cadastro.nomeMae")}</Label>
                <Input type="text" name="nomeMae" id="nomeMae" value={this.state.infoPessoa["nomeMae"]} onChange={(e) => this.handleChange(e)}></Input>
              </FormGroup>
            </Col>
          </Row>
          </Col>
        </Row>
          <Row>
          <Col>
            <FormGroup>
              <Label for="tipoVeiculo">{this.stringTranslate("Cadastro.veiculo")}</Label>
              <CustomInput type="select" style={{color:"#000"}} name="tipoVeiculo" id="tipoVeiculo"  value={this.state.infoPessoa["tipoVeiculo"]} onChange={(e) => this.handleChange(e)}>
                  {this.state.ArrayTipoCarros.map((prop, key) => {
                    return (
                      <option value={key}>{prop}</option>
                    );
                  })}
              </CustomInput>
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label for="modeloVeiculo">{this.stringTranslate("Cadastro.modelo")}</Label>
              <Input type="text" value={this.state.infoPessoa["modeloVeiculo"]} onChange={(e) => this.handleChange(e)} name="modeloVeiculo" id="modeloVeiculo"></Input>
            </FormGroup>
          </Col>

          {this.state.infoPessoa["tipoVeiculo"] < 2 ? (
            <>
          <Col>
            <FormGroup>
              <Label for="placaVeiculo">{this.stringTranslate("Cadastro.placa")}</Label>
              <Input type="text" value={this.state.infoPessoa["placaVeiculo"]} onChange={(e) => this.handleChange(e)} name="placaVeiculo"></Input>
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label for="cor">{this.stringTranslate("Cadastro.cor")}</Label>
              <CustomInput type="select" style={{color:"#000"}} value={this.state.infoPessoa["cor"]} onChange={(e) => this.handleChange(e)} name="cor" id="cor">
              <option ></option>
                {this.state.ArrayCores.map((prop, key) => {
                    return (                          
                      <option value={prop[0]}>{prop[1]}</option>
                    );
                })}
              </CustomInput>
            </FormGroup>
          </Col>
            {this.state.infoPessoa["tipoVeiculo"] === 1 ? (
          <Col>
            <FormGroup>
              <Label for="marca">{this.stringTranslate("Cadastro.marca")}</Label>
              <CustomInput type="select" style={{color:"#000"}} name="marca" value={this.state.infoPessoa["marca"]} onChange={(e) => this.handleChange(e)} id="marca">
              <option ></option>
                  {this.state.ArrayMarcaCarros.map((prop, key) => {                        
                    return (                        
                      <option>{prop}</option>
                    );
                  })}
              </CustomInput>
            </FormGroup>
          </Col>) : (<Col>
            <FormGroup>
              <Label for="marca">{this.stringTranslate("Cadastro.marca")}</Label>
              <CustomInput type="select" style={{color:"#000"}} name="marca" value={this.state.infoPessoa["marca"]} onChange={(e) => this.handleChange(e)} id="marca">
              <option ></option>
                    {this.state.ArrayMarcaMotos.map((prop, key) => {
                      return (
                        <option>{prop}</option>
                      );
                    })}
              </CustomInput>
            </FormGroup>
            </Col>)}


          <Col>
            <FormGroup>
              <Label for="categoriaVeiculo">{this.stringTranslate("Cadastro.categoria")}</Label>
              <CustomInput type="select" style={{color:"#000"}} name="categoriaVeiculo" value={this.state.infoPessoa["categoriaVeiculo"]} onChange={(e) => this.handleChange(e)} id="categoriaVeiculo">
              <option ></option>
                  {this.state.ArrayCategoriaCarros.map((prop, key) => {
                    return (
                      <option value={prop[0]}>{prop[1]}</option>
                    );
                  })}
              </CustomInput>
            </FormGroup>
          </Col>
          </>) : null }

            </Row>
            <Row>
              <Col md="4">
                <FormGroup>
                  <Label for="empresa">{this.stringTranslate("Cadastro.empresa")}</Label>
                  <CustomInput type="select" style={{color:"#000"}} name="empresa" id="empresa" value={this.state.infoPessoa["empresa"]} onChange={(e) => this.handleChange(e)}>
                  <option ></option>
                  {this.state.ArrayValoresNomeEmpresa.map((prop, key) => {
                    return (
                      <option value={prop[0]}>{prop[1]}</option>
                    );
                  })}
                    </CustomInput>
                </FormGroup>
            </Col>

            <Col md="4">
                <FormGroup>
                  <Label for="lotacao">{this.stringTranslate("Cadastro.lotacao")}</Label>
                  <CustomInput type="select" style={{color:"#000"}} name="lotacao" id="lotacao" value={this.state.infoPessoa["lotacao"]} onChange={(e) => this.handleChange(e)}>
                    <option ></option>
                    {this.state.ArrayValoresLotacao.map((prop, key) => {
                    return (
                        (prop[2] === parseInt(this.state.infoPessoa["empresa"])) ? (<option value={prop[0]}>{prop[1]}</option>) : null
                      );
                    })}                                            
                </CustomInput>
                </FormGroup>
              </Col>
              
              <Col md="4">
                <FormGroup>
                  <Label for="secao">{this.stringTranslate("Cadastro.secao")}</Label>
                  <CustomInput type="select" style={{color:"#000"}} name="secao" id="secao" value={this.state.infoPessoa["secao"]} onChange={(e) => this.handleChange(e)}>
                  <option ></option>
                  {this.state.ArrayValoresSecao.map((prop, key) => {                        
                    return (
                      (prop[2] === parseInt(this.state.infoPessoa["lotacao"])) ? (
                        
                      <option value={prop[0]} >{prop[1]}</option>) : null
                    );
                  })}
                  </CustomInput>
                </FormGroup>
              </Col>
            </Row>
            {this.renderSearch()}
          <Row>
            <Col md="3">
              <FormGroup>
              <Label for="tipoAutenticacao">{this.stringTranslate("Cadastro.tipoDeAutenticacao")}</Label>
                    <CustomInput type="select" style={{color:"#000"}} name="tipoAutenticacao" value={this.state.infoPessoa["tipoAutenticacao"]} id="tipoAutenticacao" onChange={(e) => this.handleChange(e)}>
                      <option>{this.stringTranslate("Cadastro.tipoDocumento.opcao.pin")}</option>
                      <option>{this.stringTranslate("Cadastro.tipoDocumento.opcao.cracha")}</option>                          
                    </CustomInput>
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                {this.state.infoPessoa["tipoAutenticacao"] === "PIN" ? (<Label for="numeroAutenticacao">{this.stringTranslate("Cadastro.numeroPIN")}</Label>): (<Label for="numeroAutenticacao">{this.stringTranslate("Cadastro.numeroCracha")}</Label>)}                    
                <Input type="text" name="numeroAutenticacao" id="numeroAutenticacao" value={this.state.infoPessoa["numeroAutenticacao"]} onChange={(e) => this.handleChange(e)} mask="9999999999999" maskChar={null}  tag={InputMask}></Input>
              </FormGroup>
            </Col>
          </Row>
          <Row>
              <Col md="4">
              <FormGroup>
                <Label for="procedencia">{this.stringTranslate("Cadastro.procedencia")}</Label>
                <Input type="text" name="procedencia" id="procedencia" value={this.state.infoPessoa["procedencia"]} value={this.state.infoPessoa["procedencia"]} onChange={(e) => this.handleChange(e)}></Input>
              </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label for="categoria">{this.stringTranslate("Cadastro.categoria")}</Label>
                  <CustomInput type="select" style={{color:"#000"}} name="categoria" id="categoria" value={this.state.infoPessoa["categoria"]} onChange={(e) => this.handleChange(e)}>
                  <option ></option>
                  {this.state.ArrayValorescategoria.map((prop, key) => {                        
                    return (
                      <option value={prop[0]} >{prop[1]}</option>
                    );
                  })}
                  </CustomInput>
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label for="coletor">{this.stringTranslate("Cadastro.coletor")}</Label>
                  <CustomInput type="select" style={{color:"#000"}} name="coletor" value={this.state.infoPessoa["coletor"]} id="coletor" onChange={(e) => this.handleChange(e)}>
                  <option ></option>
                  {this.state.ArrayValoresColetor.map((prop, key) => {                        
                    return (
                      <option value={prop[0]} >{prop[1]}</option>
                    );
                  })}
                  </CustomInput>
                </FormGroup>
              </Col>
          </Row>
          <Row>
            <Col md = "8">
              <FormGroup>
                <Label>{this.stringTranslate("Cadastro.biometrias")}</Label>
                <Input type="text" disabled value={this.state.numeroBiometria}></Input>
              </FormGroup>
            </Col> 
            <Col md = "4"  align="center" style={{paddingTop:"20px"}}>
              <ModalCadastroBiometrico id={this.state.infoPessoa["codIdPessoa"]} handleBiometria={this.handleBiometria} cadastrarPessoa={this.enviaCadastro} pessoa={this.state.infoPessoa} nomeBotao={this.state.botaoBiometrico}/>
            </Col>
          </Row>
            <FormGroup>
              <Label for="coletor">{this.stringTranslate("Cadastro.observacoes")}</Label>
              <Input type="textarea" name="obs" id="obs " value={this.state.infoPessoa["obs"]} onChange={(e) => this.handleChange(e)}></Input>
            </FormGroup>

          <CardFooter style={{paddingRight: "0px", marginBottom: "15px"}}>
            <Button color="success" style={{float:"right", marginLeft:"5px"}} onClick={this.enviaCadastro}>{this.stringTranslate("Cadastro.botao.registrarEntrada")}</Button>
            
            {this.props.Id !== undefined ? (<Button color="danger" style={{float:"right", marginLeft:"5px"}} onClick={this.registraSaida}>{this.stringTranslate("Cadastro.botao.registrarSaida")}</Button>) : <Button color="warning" style={{float:"right", marginLeft:"5px"}} onClick={this.limpar}>{this.stringTranslate("Cadastro.botao.limpar")}</Button>}
            
            <Button color="secondary" style={{float:"right", marginLeft:"5px"}} onClick={this.redirect}>{this.stringTranslate("Cadastro.botao.cancelar")}</Button> 
          </CardFooter> 




          <Modal modalTransition={{timeout:0}} backdropTransition={{timeout:0}}  isOpen={this.state.modal}  >
              <ModalHeader toggle={this.toggle}>{this.stringTranslate("Cadastro.saidaSemEntrada.titulo")}</ModalHeader>
                <ModalBody>
                   {this.stringTranslate("Cadastro.saidaSemEntrada")}                   

                    <FormGroup style={{marginTop: "10px"}}>
                      <Label for="coletor">{this.stringTranslate("Cadastro.observacoes")}:</Label>
                      <Input type="textarea" name="obs" id="obs " value={this.state.infoPessoa["obs"]} onChange={(e) => this.handleChange(e)}></Input>
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" onClick={this.toggle}>{this.stringTranslate("Cadastro.botao.nao")}</Button>
                  <Button color="success" onClick={this.registrarSaidaSemEntrada}>{this.stringTranslate("Cadastro.botao.sim")}</Button>
                </ModalFooter>
            </Modal>
        </>
        )}
       
      </>
    );
  }
}

export default injectIntl(CadastroPessoa);
