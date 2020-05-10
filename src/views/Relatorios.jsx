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
import TabelaRelatorio from '../components/Table/TabelaRelatorio';
import CardPeriodo from 'components/CardRelatorios/CardRelatorios';
import { postAdonis } from "utils/api.js";
import moment from "moment";
import { toast, Slide } from 'react-toastify';
import { injectIntl } from "react-intl";
import { carregaStorage } from "utils/Requisicoes";


import { pegaData, pegahorario,pegaDataHora  } from "components/dataHora.jsx"


// reactstrap components
import {
  Row,
  Col,
} from "reactstrap";

const capitalize = (s) => {
  if (typeof s !== 'string') return ''

  var array = s.split(" ");
  var string = "";
  array.forEach(element => {
    string += element.charAt(0).toUpperCase() + element.slice(1) + " "
  });

  return string
}

const toastOptions = {
  transition: Slide,
  position: "top-center",
  autoClose: 5000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: true
};

class Relatorios extends React.Component {
  constructor(props) {

    super(props);

    this.state = {
        headTable: [this.stringTranslate("Relatorios.table.head.data"), 
                    this.stringTranslate("Relatorios.table.head.hora"), 
                    this.stringTranslate("Relatorios.table.head.direcao"), 
                    null, 
                    this.stringTranslate("Relatorios.table.head.pessoa"), 
                    null, 
                    null, 
                    null,
                    this.stringTranslate("Relatorios.table.head.lotacaoSecao"), 
                    this.stringTranslate("Relatorios.table.head.coletor")],
        dataTable: [],
        dataInicio: null,
        dataFim: null,
        horario: null,
        horaInicio: null,
        horaFim: null,
        locaisAcesso: [],
        numeroMatricula: null,
        exibirNoRelatorio: [],
        tiposAcesso: [],
        dataTableVisitantes: [],
        listaLocaisAcesso: [],
        loadingLocais: true,
      };
      this.state.dataFim = moment().format("YYYY-MM-DD");
      this.state.dataInicio = moment().subtract(800, 'days').format("YYYY-MM-DD");
      this.state.horario = "diaTodo";
      this.setState({
        dataFinal:  this.state.dataFinal,
        dataInicio: this.state.dataInicio,
        horario: this.state.horario,
      })
      //Função que compara dois horários e retorna qual é a maior
      this.comparaHora = this.comparaHora.bind(this);
      //Função que fará a consulta ao banco de dados
      this.buscaDados = this.buscaDados.bind(this);

      //Funções de mudança do estado do relatório de acordo com os valores dos componente sda tela
      this.handleChangeDataFim = this.handleChangeDataFim.bind(this);
      this.handleChangeDataInicio = this.handleChangeDataInicio.bind(this);
      this.handleChangeExibirRelatorio = this.handleChangeExibirRelatorio.bind(this);
      this.handleChangeHoraFim = this.handleChangeHoraFim.bind(this);
      this.handleChangeHoraInicio = this.handleChangeHoraInicio.bind(this);
      this.handleChangeHorario = this.handleChangeHorario.bind(this);
      this.handleChangeLocaisAcesso = this.handleChangeLocaisAcesso.bind(this);
      this.handleChangeTiposAcesso = this.handleChangeTiposAcesso.bind(this);
      this.handleChangeNumeroMatricula = this.handleChangeNumeroMatricula.bind(this);
      this.handleClickExibirRelatorio = this.handleClickExibirRelatorio.bind(this);
      //Atualiza o cabecalho da tabela
      this.atualizaCabecalho = this.atualizaCabecalho.bind(this);

      //Atribuindo as funções de mudanca de estado a um objeto que será passado ao componente "CardRelatoios"

      this.onChangeFunctions = {
        onChangeDataFim: this.handleChangeDataFim, 
        onChangeDataInicio: this.handleChangeDataInicio,
        onChangeExibirRelatorio: this.handleChangeExibirRelatorio,
        onChangeHoraFim: this.handleChangeHoraFim,
        onChangeHoraInicio: this.handleChangeHoraInicio,
        onChangeHorario: this.handleChangeHorario,
        onChangeLocaisAcesso: this.handleChangeLocaisAcesso,
        onChangeTiposAcesso: this.handleChangeTiposAcesso,
        onChangeNumeroMatricula: this.handleChangeNumeroMatricula,
        onClickExibirRelatorio: this.handleClickExibirRelatorio,
        }


     
      this.stringTranslate = this.stringTranslate.bind(this);

      this.postIndex = this.postIndex.bind(this);
      this.postIndex()
    }

    stringTranslate(id){
      return this.props.intl.formatMessage({id: id});
    }

    postIndex(){
      const body={
        id: navigator.productSub,
        token: sessionStorage.getItem("token")        
      }
      postAdonis(body,'/Portaria/Relatorio/Index').then(lista =>{  

        if(lista.error === undefined)
        {
          var listaLocal =  lista.dados.map(prop => {
            return [prop.Nome, prop.CodLocalAcesso]
          })

          this.setState({listaLocaisAcesso: listaLocal, locaisAcesso: listaLocal, loadingLocais: false});                
        }                
        else
        {
          this.setState({loadingLocais: false})
          toast.error(this.stringTranslate("Erro.Servidor"), toastOptions);      
        } 
      }).catch(e => { 
        toast.dismiss();
        toast.error(this.stringTranslate("Erro.Servidor"), toastOptions);  
        this.setState({loadingLocais: false})
      });
    }

  //Função que compara horários e retorna qual o maior
  comparaHora(hora1, hora2){
    hora1 = String(hora1).split(":");
    hora2 = String(hora2).split(":");
    if (hora1[0] > hora2[0])
      return true;
    else if (hora1[0] < hora2[0])
      return false;
    else if (hora1[1] > hora2[1])
      return true;
    else if (hora1[1] < hora2[1])
      return false;
    else
      return false;
  }

  // componentDidMount(){
  //   //Seta por padrão a data final como o dia atual e a data inicial como 30 dias antes no state para que já apareça na tela

  // }

  componentDidUpdate(){
    //Verifica se o idioma do cabeçaçho é igual ao idioma selecionado
    //Se não for atualiza o cabeçalho
    if (this.state.headTable[0] !== this.stringTranslate("Relatorios.table.head.data"))
      this.atualizaCabecalho();
    //this.buscaDados();
  }

  buscaDadosVisitantes(){
    
  }

  //Função que busca os dados na API e armazena eles no state para aparecer na tabela da tela
  buscaDados(tipo = 'G')
  { 
    console.log(tipoAcesso)
    //Para visitantes presentes tipo = 'V', para busca em geral tipo = 'G'
    var  cmd, dataI, dataF, horario, horaInicio, horaFim,numeroMatricula, locaisAcesso, exibirRelatorio, tipoAcesso;
    //Verificando estado dos campos de exibição
    var exibeMatricula = false;
    var exibeDadosVeiculos = false;
    var exibeVisitou = false;
    var exibeTentativaAcesso = false;
    //Função de formatação dos locais de acesso para busca na API
    const formataAcesso = (vetorLocais) =>{
      let stringLocais = [];
      if (Boolean(vetorLocais) !== false){
        stringLocais=  vetorLocais.map((id)=>{
          return id[1]
        })

        // for(var i = 0, l = vetorLocais.length; i < l; i++){
        //   stringLocais += vetorLocais[i][1]+",";
        // }
      }
      return stringLocais;
    }
    //Função de formatação de tipos de acesso para busca na API
    const formataTipoAcesso = (tipoAcesso) => {
      if (Boolean(tipoAcesso) !== false){
        if(tipoAcesso.length > 1)
          return 0;
        else{
          if(tipoAcesso[0] === "Permanentes")
            return 1;
          else
            return 2;
        }
      }
    }

    //Pegando token
    const token = sessionStorage.getItem("token"); 

    //Setando os parâmetros de busca de acordo com o tipo de busca (Visitantes presentes ou geral)
    if (tipo === 'V'){
      dataI = this.state.dataInicio;
      dataF = this.state.dataFim;
      horario = "diaTodo";
      horaInicio = horaFim = null;
      numeroMatricula = null;
      locaisAcesso = formataAcesso(this.state.locaisAcesso);
      exibirRelatorio = [];
      tipoAcesso = "Visitantes";
      cmd = "visitantesPresentes";

    }else{
      dataI = this.state.dataInicio;
      dataF = this.state.dataFim;
      horario = this.state.horario
      horaInicio = this.state.horaInicio;
      horaFim = this.state.horaFim;
      numeroMatricula = this.state.numeroMatricula;
      locaisAcesso = formataAcesso(this.state.locaisAcesso);
      exibirRelatorio = this.state.exibirNoRelatorio.map((prop) => {return prop.value});
      tipoAcesso = this.state.tiposAcesso;
      cmd = "consultaRelatorio";
    }

    //Verificando quais elementos opcionalmente visíveis serão mostrados na tabela
    if (this.state.exibirNoRelatorio !== undefined){
      this.state.exibirNoRelatorio.map((prop)=>{

        if (prop.value === "Matrícula")
          exibeMatricula = true;
        else if (prop.value === "Dados dos veículos")
          exibeDadosVeiculos = true;
        else if (prop.value === "Pessoa visitada")
          exibeVisitou = true;
        else if (prop.value === "Tentativas de acesso")
          exibeTentativaAcesso = true;
      })
    }

    //Contruindo requisição na API de acordo com os parâmetros de busca setados
    const body = {
        cmd: cmd,
        token: token,
        filtro: {
          dataInicial: dataI,
          dataFinal: dataF,
          horario: horario,
          horaInicio:horaInicio,
          horaFim: horaFim,
          //numeroMatricula pode ser null caso não se queira especificar uma
          numeroMatricula: numeroMatricula,
          locaisAcesso: locaisAcesso,
          exibirRelatorio: exibirRelatorio,
          tipoAcesso: tipoAcesso,
        }
    }
    console.log(Boolean(this.state.dataInicio));
    //Busca na API e armazenamento dos dados em state.dataTable
    postAdonis(body,'/Relatorio/Portaria').then(data => {

      //Caso a busca tenha sucesso
      if (data.error === undefined)
      {
        const dados= data.dados;

        var narray = [];
        var presentes = [];
        //Caso a busca seja por visitantes presentes
        if (tipo === 'V'){
          for (let i = 0; i < data.length; i++){
            var item = dados[i];

            // if (item.autorizado.TipoAutorizacao !== "AUTORIZACAO_PrecisaLiberacao")
            //   continue;
    
            
            var item = dados[i];
            var nomePessoa = item.Nome !== undefined ? item.Nome.toLowerCase() : "";         
            var coletor = item.ColetorNome !== undefined ? item.ColetorNome.toLowerCase() : "";

            
            //Retorna os dados em forma de array
           // if (direcao === 'E'){
              narray.push([ capitalize(nomePessoa), pegaDataHora(item.DataHora), coletor]);
           // }
            // else{
            //   var pos = presentes.indexOf(codPessoa);
            //   if (pos !== -1){
            //     presentes = presentes.splice(pos, 1);
            //     narray = narray.splice(pos, 1);
            //   }
            // }
          };
        }
        //Caso a busca seja geral
        else{
          // for (let i = 0; i < data.length; i++){
            dados.forEach(item => {
            console.log(1) 
          //  var item = dados[i];
            var nomePessoa = item.Nome !== undefined ? item.Nome.toLowerCase() : "";
            
            var lotacaoSecao = item.Secao !== null ? item.Lotacao+"/"+(item.Secao) : "";

            var direcao = item.Direcao;

            var coletor = item.Coletor !== undefined ? item.Coletor.toLowerCase() : "";

            var data = pegaData(item.Datahora);

            var hora = pegahorario(item.Datahora);
            //Opcionais de acordo com a pesquisa por isso retornam
            //Necessário se em exibirRelatorio constar a opção "Matrícula"
            if (exibeMatricula)
              var numeroMatricula = item.Matricula !== undefined ? item.Matricula : "";
            else
              var numeroMatricula = null;
            //Filtra por matrícula caso o filtro esteja ativado
            if(Boolean(this.state.numeroMatricula)){
              if(this.state.numeroMatricula != numeroMatricula);
             //   continue;
            }

            //Só exibe de acordo com a data definida
            if(moment(data).isAfter(this.state.dataFim) || moment(data).isBefore(this.state.dataInicio));
           //   continue;
            
            //Só exibe de acordo com o horário definido
            var hora1 = moment(hora);
            var hora2 = moment(this.state.horaFim);
            var hora3 = moment(this.state.horaInicio);
            if (this.state.horario === "faixa"){
              if(this.comparaHora(hora1._i, hora2._i) || this.comparaHora(hora3._i, hora1._i));
            //    continue
            }
            //Necessários se em exibirRelatorio constar a opção "Dados dos veículos"
            if (exibeDadosVeiculos){
              var modelo = item !== undefined ? 
                          (item.ModeloCarro !== null ? item.ModeloCarro.toLowerCase() : "") : "";
              var placa = item !== undefined ? 
                          (item.PlacaCarro !== null ? item.PlacaCarro.toLowerCase() : "") : "";
            }
            else{
              var modelo = null;
              var placa = null;
            }
            //Necessário se em exibirRelatorio constar a opção "Pessoa visitada"
            if (exibeVisitou)
              var nomeVisitou = item.PessoaContato !== null ? item.PessoaContato.toLowerCase() : "";
            else
              var nomeVisitou = null;

            //Não pode retorna tentativas de acesso a menos que seja requerido explicitamente
            if (exibeTentativaAcesso === false && direcao === "T");
            //  continue;        
       
            //Retorna os dados em forma de array
            narray.push([ data, hora, this.stringTranslate("Direcao."+direcao), 
                    numeroMatricula, capitalize(nomePessoa),  modelo, placa, nomeVisitou, lotacaoSecao, coletor]);
          });
        }
        console.log(narray);
        //Armazena os dados na tabela de dados de visitantes ou na tabela de dados geral
        if (tipo !== 'V')
          this.setState({dataTable:narray});
        else
          this.setState({dataTableVisitantes:narray});
      }
      //Caso a a busca na API não obtenha sucesso
      else{
        toast.error(this.stringTranslate("Relatorios.toast.erroServidor"), {
          transition: Slide,
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true
          });
      }
    });
  }


  //Funções que detectam eventos na interface e fazem atualizações no state
  handleChangeDataInicio(event){
    this.state.dataInicio = event.target.value;
    this.setState({dataInicio:this.state.dataInicio});
    if (Boolean(this.state.dataInicio) !== false){
      let ano = parseInt(this.state.dataInicio.split("-")[0]);
      let mes = parseInt(this.state.dataInicio.split("-")[1]);
      let dia = parseInt(this.state.dataInicio.split("-")[2]);
      if (ano > 9999){
        ano = 9999;
        console.log( ano+"-"+mes+"-"+dia)
        this.state.dataInicio = ano+"-"+("00"+mes).slice(-2)+"-"+("00"+dia).slice(-2);
        this.setState({dataInicio: this.state.dataInicio});
      }
    }
  }

  handleChangeDataFim(event){
    this.state.dataFim = event.target.value;
    this.setState({dataFim:this.state.dataFim});
    if (Boolean(this.state.dataFim) !== false){
      let ano = parseInt(this.state.dataFim.split("-")[0]);
      let mes = parseInt(this.state.dataFim.split("-")[1]);
      let dia = parseInt(this.state.dataFim.split("-")[2]);
      if (ano > 9999){
        ano = 9999;
        console.log( ano+"-"+mes+"-"+dia)
        this.state.dataFim = ano+"-"+("00"+mes).slice(-2)+"-"+("00"+dia).slice(-2);
        this.setState({dataFim: this.state.dataFim});
      }
    }
  }

  handleChangeHorario(event){
    this.setState({horario:event.target.value});
    if (event.target.value === "faixa"){
      this.state.horaInicio = "00:00";
      this.state.horaFim = "23:59"
      this.setState({horaInicio: this.state.horaInicio,
                    horaFim: this.state.horaFim})
    }
  }

  handleChangeHoraInicio(event){
    var hora = event.target.value;
    this.setState({horaInicio:hora});
  }

  handleChangeHoraFim(event){
    var hora = event.target.value;
    this.setState({horaFim: hora});
  }

  handleChangeLocaisAcesso(value){
    this.setState({locaisAcesso:value});
  }

  handleChangeTiposAcesso(value){
    console.log(value)
    this.state.tiposAcesso= value
    this.setState({tiposAcesso:this.state.tiposAcesso});
  }

  handleChangeNumeroMatricula(event){
    if (event === "Enter")
      this.handleClickExibirRelatorio()
    else
      this.setState({numeroMatricula:event.target.value});
  }

  handleChangeExibirRelatorio(value){
    var exibir = [];
    if (value !== null){
      if (value.length > 0){
        exibir = value.map((prop) => {return prop})
      }
    }
    this.setState({exibirNoRelatorio:exibir});   
  }

  handleClickExibirRelatorio(){
    if (Boolean(this.state.dataInicio) === false){
      toast.error(this.stringTranslate("Relatorios.card.validaData"), {
        transition: Slide,
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true
        });
    }else{
      if (Boolean(this.state.dataFim) === false){
        toast.error(this.stringTranslate("Relatorios.card.validaData"), {
          transition: Slide,
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true
          });
      }else{
        if (this.state.numeroMatricula !== null && this.state.numeroMatricula !== ""){
          var achou = false;
          this.state.exibirNoRelatorio.map((prop) =>{
            if (prop.value === "Matrícula")
              achou = true;
          })
          if (!achou){
            this.state.exibirNoRelatorio.push({value:"Matrícula", label:this.stringTranslate("Relatorios.card.exibirRelatorio.opcao.matricula")});
            this.setState({exibirNoRelatorio: this.state.exibirNoRelatorio});
          }
        }
        this.atualizaCabecalho();
        this.buscaDados();
      }
    }
  }

  atualizaCabecalho(){
    let headTable;
    headTable = [this.stringTranslate("Relatorios.table.head.data"), 
                this.stringTranslate("Relatorios.table.head.hora"), 
                this.stringTranslate("Relatorios.table.head.direcao"), 
                null, 
                this.stringTranslate("Relatorios.table.head.pessoa"), 
                null, 
                null, 
                null,
                this.stringTranslate("Relatorios.table.head.lotacaoSecao"), 
                this.stringTranslate("Relatorios.table.head.coletor")];
    if (this.state.exibirNoRelatorio.length > 1){
      this.state.exibirNoRelatorio.map((prop, key) =>{
          if (prop.value === "Dados dos veículos"){
            headTable[5] = this.stringTranslate("Relatorios.table.head.carro");
            headTable[6] = this.stringTranslate("Relatorios.table.head.placa");
          }
          if (prop.value === "Matrícula"){
            headTable[3] = this.stringTranslate("Relatorios.table.head.matricula");
          }
          if (prop.value === "Pessoa visitada"){
            headTable[7] = this.stringTranslate("Relatorios.table.head.visitou");
          }
        }
      )
    }
    this.setState({headTable: headTable});
  }

  render() {
    return (
      <>
        <div className="content">
          <Row>
            <Col>
              <CardPeriodo buscaDados={this.buscaDados} dataTable={this.dataTable} onChangeFunctions={this.onChangeFunctions}
                          estados={this.state}/>
            </Col>
          </Row>
          <Row>
            <Col>
              <TabelaRelatorio buscaDados={this.buscaDados} headTable={this.state.headTable} 
                                          dataTable={this.state.dataTable} dataTableVisitantes={this.state.dataTableVisitantes}/>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default injectIntl(Relatorios);
