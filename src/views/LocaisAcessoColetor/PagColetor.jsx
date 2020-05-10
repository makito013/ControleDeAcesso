import React from "react";
import BootstrapTreeTable from 'bootstrap-react-treetable';
import ReactDOM from "react-dom";
import Tabela from "../../components/Tabela/Tabela"
import ModalCategoriaPessoa from "../CategoriaPessoa/ModalCategoriaPessoa.jsx"


import {post, postAdonis} from "../../utils/api.js"
import { injectIntl } from "react-intl";
import Switch from "react-switch";
import InputMask from 'react-input-mask';
import Select from "react-select";
import makeAnimated from "react-select/animated"
import { toast, Slide } from 'react-toastify';
import DadosBasicos from "./AbasColetor/DadosBasicos.jsx"
import Hardware from "./AbasColetor/Hardware.jsx";
import Detalhes from "./AbasColetor/Detalhes.jsx";
import Biometria from "./AbasColetor/Biometria.jsx";
import Programacao from "./AbasColetor/Programacao.jsx";
import {Modal, Spin} from "antd";

import {
  CardImg,
  Card,
  CardHeader,
  CardBody,
  //CardFooter,
  Row,
  Col,
  InputGroupAddon,
  InputGroup,
  InputGroupText,
  Input,
  Button,
  CardFooter,
  ModalHeader,
  ModalFooter,
  ModalBody,
  UncontrolledTooltip,
  FormGroup,
  Label
} from "reactstrap";


function validaBooleanString(string){
    if (!Boolean(string) || (string === "False" || string === "false" || string === "F" || string === "f"))
        return false;
    else
        return true;
}

function converteOperacaoCheckLista(opcoes){
    let lista = [];
    for (var i = 0, j = opcoes.length; i < j; i++){
        if (Boolean(opcoes[i])){
            if (validaBooleanString(opcoes[i]))
                lista.push(i);
        }
    }
    return(lista);
}

function converteOperacaoListaCheck(tam, lista){
    let vet = [];
    for (var i = 0, j = tam; i < j; i++){
        vet.push(false);
    }
    for (var i = 0, j = lista.length; i < j; i++){
        vet[lista[i]] = true;
    }
    return(vet);
}

function converteAcessoListaCheck(lista){
    let checks = [false, false];
    for (var i = 0, j = lista.length; i < j; i++){
        checks[lista[i]] = true;
    }
    return (checks);
}

function converteAcessoCheckLista(visitantes,motorista){
    let lista = [];
    if (visitantes === "True" || visitantes === 1)
        lista.push(0);
    if (motorista === "True" || motorista === 1)
        lista.push(1);
    return(lista);
}

function converteDirecaoCartaoCheckLista(direcao, longaDistancia){
    let lista = [];
    if (parseInt(direcao) === 0){
        lista.push(1, 2);
    }else if (parseInt(direcao) === 1){
        lista.push(1);
    }else if (parseInt(direcao) === 2){
        lista.push(2);
    }
    if (validaBooleanString(longaDistancia)){
        lista.push(3);
    }
    return lista;
}

function converteDirecaoCartaoListaCheck(vetor){
    let result = [0,0]
    let checks = [false, false, false];
    if (Boolean(vetor)){
        for (var i = 0, j = vetor.length; i < j; i++){
            checks[vetor[i]-1] = true;
        }
    }
    if (!(checks[0] && checks[1])){
        if (checks[0])
            result[0] = 1;
        else if (checks[1])
            result[0] = 2;
    }else{
        result[0] = 0;
    }
    result[1] = checks[2];
    return result;
}

function converteMinutosHora(minutos){
    let horas = Math.floor(minutos/60);
    let min = minutos%60;
    return(("00"+horas).slice(-2)+":"+("00"+min).slice(-2));
}

function converterHorasMinutos(horas){
    let minutos = horas.split(":");
    return(parseInt(minutos[0])*60 + parseInt(minutos[1]));
}


class PagColetor extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            //Mudança de abas
            modal: false,
            salvando: false,
            corBotao:["primary", "link", "link", "link", "link", "link"],
            abaAtual: 0,


            //Dados básicos
            nome: this.props.tipo !== "add" ? this.props.dados.NOME : null,
            ativo: this.props.tipo !== "add" ? validaBooleanString(this.props.dados.Ativo): false,
            utilizacao: this.props.tipo !== "add" ? this.props.dados.TIPOUSO : 0,
            direcaoPermitida: this.props.tipo !== "add" ? this.props.dados.DIRECOESPERMITIDAS : 0,
            numIdentificacao:this.props.tipo !== "add" ? this.props.dados.NUMERO : null,
            acesso: this.props.tipo !== "add" ? 
                converteAcessoCheckLista(this.props.dados.PERMITEVISITANTES, this.props.dados.ExigeMotorista) : [],
            expirarEntrada: this.props.tipo !== "add" ? converteMinutosHora(this.props.dados.TEMPOEXPIRACAOENTRADA) : "24:00",
            empresa: this.props.tipo !== "add" ? this.props.dados.CodEmpresa : null,
            caminhoDiretorio: this.props.tipo !== "add" ? this.props.dados.CAMINHOLISTAS : null,
            //incluiNomeArquivo: this.props.tipo !== "add" ? validaBooleanString(this.props.dados.IncluiNomeArquivo) : false,
            formatoArquivo: this.props.tipo !== "add" ? this.props.dados.FORMATOARQUIVO : null,


            //Hardware
            //operacao: Boolean(this.props.dados.Coletor) !== false ? (this.props.dados.Coletor.ColetorRedirecionar === " " ? 0 : 1) : 0,
            togglePulsarExpirar:  this.props.tipo !== "add" ? validaBooleanString(this.props.dados.PULSARAPOSEXPIRARTEMPO) : false,
            toggleMonitorarPorta: this.props.tipo !== "add" ? validaBooleanString(this.props.dados.MONITORAPORTA) : false,
            toggleTratarSinaleira: this.props.tipo !== "add" ? validaBooleanString(this.props.dados.MONITORAPORTA) : false,
            modeloProtocolo: this.props.tipo !== "add" ? this.props.dados.MODELO : 0,
            identificacao: this.props.tipo !== "add" ? converteOperacaoCheckLista([this.props.dados.TemDispositivoTeclado,
                   this.props.dados.TemDispositivoCartao, this.props.dados.UsaBiometria]) : [],
            modoCatraca: this.props.tipo !== "add" ? (Boolean(this.props.dados.ModoCatraca) !== false ? validaBooleanString(this.props.dados.ModoCatraca) : false) : false,
            operacaoAcionamento: this.props.tipo !== "add" ? ((this.props.dados.NumSerieLeitor2 === " " || this.props.dados.NumSerieLeitor2 === null) ? 0 : 1) : 0,//coletorredirecionar
            operacaoModos: this.props.tipo !== "add" ? converteOperacaoCheckLista([this.props.dados.PADRAORELOGIO, 
                this.props.dados.EMITIRSONS,
                this.props.dados.DEVEAGUARDARGIRO, 
                this.props.dados.RESERVADO_S2, //SoRegistraPontoAoGirar
                this.props.dados.MODOCANCELA, 
                this.props.dados.MODOPORTA, 
                this.props.dados.ModoCatraca])
                : [],
            retardo: this.props.tipo !== "add" ? this.props.dados.TEMPORETARDOCANCELA : null,
            forcarModo: this.props.tipo !== "add" ? this.props.dados.RESERVADO_I2 : null, //ModoOperacaoForcado
            coletorRedirecionar: this.props.tipo !== "add" ? this.props.dados.NumSerieLeitor2 : null,

            ip: this.props.tipo !== "add" ? this.props.dados.EnderecoIP : null,
            porta: this.props.tipo !== "add" ? this.props.dados.NumPortaTCP : null,
            padraoEnderecamento: this.props.tipo !== "add" ? this.props.dados.AutoConfigIPUmaVez : false,
            configIniciar: this.props.tipo !== "add" ? validaBooleanString(this.props.dados.AutoConfigIPUmaVez): false,

            dispositivoEntrada: this.props.tipo !== "add" ? this.props.dados.RELEENTRADA : null,
            dispositivoSaida: this.props.tipo !== "add" ? this.props.dados.RELESAIDA: null,
            tempoDispEntrada: this.props.tipo !== "add" ? this.props.dados.TEMPORELEENTRADA : null,
            tempoDispSaida : this.props.tipo !== "add" ? this.props.dados.TEMPORELESAIDA: null,
            aguardaMin: this.props.tipo !== "add" ? this.props.dados.TempoMinAguardarGiro : null,
            bracoAbaixado: this.props.tipo !== "add" ? this.props.dados.SensorBracoAbaixado : null,

            sensoresEntrada: this.props.tipo !== "add" ? this.props.dados.SENSORENTRADA : null,
            sensoresSaida: this.props.tipo !== "add" ? this.props.dados.SENSORSAIDA: null,
            tempoMinAcionamento: this.props.tipo !== "add" ? this.props.dados.TempoMinRele: null,
            modoConectividade: this.props.tipo !== "add" ? this.props.dados.ModoConectividade : 2,

            modalCartoesValores: {
                numCartao1: this.props.tipo !== "add" ? this.props.dados.NumLeitorCartao1 : null,
                numCartao2: this.props.tipo !== "add" ? this.props.dados.NumLeitorCartao2 : null,
                numCartao3: this.props.tipo !== "add" ? this.props.dados.NumLeitorCartao3 : null,
                tipoCartao1: this.props.tipo !== "add" ? this.props.dados.TipoLeitorCartao1 : 0,
                tipoCartao2: this.props.tipo !== "add" ? this.props.dados.TipoLeitorCartao2 : 0,
                tipoCartao3: this.props.tipo !== "add" ? this.props.dados.TipoLeitorCartao3 : 0,
                direcaoCartao1: this.props.tipo !== "add" ? 
                    converteDirecaoCartaoCheckLista(this.props.dados.DirecoesCartao1, this.props.dados.LongaDistanciaCartao1 ) : [],
                direcaoCartao2: this.props.tipo !== "add" ? 
                    converteDirecaoCartaoCheckLista(this.props.dados.DirecoesCartao2, this.props.dados.LongaDistanciaCartao2 ) : [],
                direcaoCartao3: this.props.tipo !== "add" ? 
                    converteDirecaoCartaoCheckLista(this.props.dados.DirecoesCartao3, this.props.dados.LongaDistanciaCartao3 ) : [],
                usaAntenaTCPIP: this.props.tipo !== "add" ? this.props.dados.UsaAntenaTCPIP : false,
                enderecoIP: this.props.tipo !== "add" ? this.props.dados.EnderecoIPAntena : null,
                portaTCPAntena: this.props.tipo !== "add" ? this.props.dados.PortaTCPAntena: null,
                acionarDispositivo: this.props.tipo !== "add" ? this.props.dados.DispositivoAcionarUrna : null,
                sensorPassagem: this.props.tipo !== "add" ? this.props.dados.ENDERECO : null,
                tipoUrna : this.props.tipo !== "add" ? this.props.dados.NUMPORTASERIAL : null,
                leitorUrna: this.props.tipo !== "add" ? validaBooleanString(this.props.dados.LeitorNaUrna) : false,
                intervaloLeitura: this.props.tipo !== "add" ? this.props.dados.TempoCartaoLongaDistancia : null,
            },
            


            //Detalhes
            opcoesEspeciais: this.props.tipo !== "add" ? converteOperacaoCheckLista([this.props.dados.PermiteAbrirFecharSistema,
                this.props.dados.SoFuncionaUmaVez]): [],
            pictograma: this.props.tipo !== "add" ? this.props.dados.ModeloPictograma : null,
            dispositivo: this.props.tipo !== "add" ? this.props.dados.DispositivoAcionarParaEvento : null,
            tempo: this.props.tipo !== "add" ? this.props.dados.TempoAcionarParaEvento : null,
            mensagemPadrao: this.props.tipo !== "add" ? this.props.dados.MensagemPadrao : null,
            caracteres: this.props.tipo !== "add" ? Boolean(this.props.dados.MensagemPadrao) !== false ? 
            this.props.dados.MensagemPadrao.length : 0 : 0,
            comoSenha: this.props.tipo !== "add" ? validaBooleanString(this.props.dados.DigitacaoComoSenha) : false,
            modoLiberado: this.props.tipo !== "add" ? this.props.dados.ModoPanico : null,


            //Biometria
            numeroSerie: this.props.tipo !== "add" ? this.props.dados.NUMSERIELEITOR : null,
            resolucao: this.props.tipo !== "add" ? this.props.dados.RESOLUCAOLEITOR : null,
            padrao: this.props.tipo !== "add" ? validaBooleanString(this.props.dados.PADRAOCADASTRO) : false,
            segundoLeitor: this.props.tipo !== "add" ? 
            Boolean(this.props.dados.NumSerieLeitor2) !== false ? 
            this.props.dados.NumSerieLeitor2.split(",").length === 1 ?  
            this.props.dados.NumSerieLeitor2 : null
            : null
            :null,

            direcaoEntrada: this.props.tipo !== "add" ? Boolean(this.props.dados.NumSerieLeitor2) !== false
                ? this.props.dados.NumSerieLeitor2.split(",").length > 1 ? 
                this.props.dados.NumSerieLeitor2.split(",")[0] : null 
                : null 
                : null,
            direcaoSaida: this.props.tipo !== "add" ? Boolean(this.props.dados.NumSerieLeitor2) !== false
                ? this.props.dados.NumSerieLeitor2.split(",").length > 1 ? 
                this.props.dados.NumSerieLeitor2.split(",")[1] : null 
                : null 
                : null,
            direcaoOutros: this.props.tipo !== "add" ? Boolean(this.props.dados.NumSerieLeitor2) !== false
                ? this.props.dados.NumSerieLeitor2.split(",").length > 1 ? 
                this.props.dados.NumSerieLeitor2.split(",")[2] : null 
                : null 
                : null,


            //Programação
            dataTable: [],
        }

        //Dados Basicos salvar
        this.handleChangeUtilizacao = this.handleChangeUtilizacao.bind(this);
        this.handleChangeDirecaoPermitida = this.handleChangeDirecaoPermitida.bind(this);
        this.handleChangeNumIdentificacao = this.handleChangeNumIdentificacao.bind(this);
        this.handleChangeAcesso = this.handleChangeAcesso.bind(this);
        this.handleChangeExpirarEntrada = this.handleChangeExpirarEntrada.bind(this);
        this.handleChangeEmpresa = this.handleChangeEmpresa.bind(this);
        this.handleChangeCaminhoDiretorio = this.handleChangeCaminhoDiretorio.bind(this);
        this.handleChangeFormatoArquivo = this.handleChangeFormatoArquivo.bind(this);
        this.handleChangeIncluirNomeArquivo = this.handleChangeIncluirNomeArquivo.bind(this);
        this.handleChangeNome = this.handleChangeNome.bind(this);
        this.toggleAtivo = this.toggleAtivo.bind(this);
        this.DBF= {
            handleChangeNome: this.handleChangeNome,
            toggleAtivo: this.toggleAtivo,
            handleChangeUtilizacao : this.handleChangeUtilizacao,
            handleChangeDirecaoPermitida : this.handleChangeDirecaoPermitida,
            handleChangeNumIdentificacao : this.handleChangeNumIdentificacao,
            handleChangeAcesso : this.handleChangeAcesso,
            handleChangeExpirarEntrada : this.handleChangeExpirarEntrada,
            handleChangeEmpresa : this.handleChangeEmpresa,
            handleChangeCaminhoDiretorio : this.handleChangeCaminhoDiretorio,
            handleChangeFormatoArquivo : this.handleChangeFormatoArquivo,
            handleChangeIncluirNomeArquivo: this.handleChangeIncluirNomeArquivo,
        }
        //Detalhes salvar
        this.handleChangeOpcoesEspeciais = this.handleChangeOpcoesEspeciais.bind(this);
        this.handleChangePictograma = this.handleChangePictograma.bind(this);
        this.handleChangeDispositivo = this.handleChangeDispositivo.bind(this);
        this.handleChangeTempo = this.handleChangeTempo.bind(this);
        this.handleChangeMensagemPadrao = this.handleChangeMensagemPadrao.bind(this);
        this.handleChangeCaracteres = this.handleChangeCaracteres.bind(this);
        this.handleChangeComoSenha = this.handleChangeComoSenha.bind(this);
        this.handleChangeModoLiberado = this.handleChangeModoLiberado.bind(this);
        this.handleChangeComoSenha = this.handleChangeComoSenha.bind(this);
        this.DF = {
            handleChangeOpcoesEspeciais : this.handleChangeOpcoesEspeciais,
            handleChangePictograma : this.handleChangePictograma,
            handleChangeDispositivo : this.handleChangeDispositivo,
            handleChangeTempo : this.handleChangeTempo,
            handleChangeMensagemPadrao : this.handleChangeMensagemPadrao,
            handleChangeCaracteres : this.handleChangeCaracteres,
            handleChangeComoSenha : this.handleChangeComoSenha,
            handleChangeModoLiberado : this.handleChangeModoLiberado,
        }

        //Biometria salvar
        this.handleChangeNumeroSerie = this.handleChangeNumeroSerie.bind(this);
        this.handleChangeResolucao = this.handleChangeResolucao.bind(this);
        this.handleChangePadrao = this.handleChangePadrao.bind(this);
        this.handleChangeSegundoLeitor = this.handleChangeSegundoLeitor.bind(this);
        this.handleChangeEntrada = this.handleChangeEntrada.bind(this);
        this.handleChangeSaida = this.handleChangeSaida.bind(this);
        this.handleChangeOutros = this.handleChangeOutros.bind(this);
        this.BF = {
            handleChangeNumeroSerie : this.handleChangeNumeroSerie,
            handleChangeResolucao : this.handleChangeResolucao,
            handleChangePadrao : this.handleChangePadrao,
            handleChangeSegundoLeitor : this.handleChangeSegundoLeitor,
            handleChangeEntrada : this.handleChangeEntrada,
            handleChangeSaida : this.handleChangeSaida,
            handleChangeOutros : this.handleChangeOutros,
        }

        //Hardware salvar
        this.handleChangeModeloProtocolo = this.handleChangeModeloProtocolo.bind(this);
        this.handleChangeIdentificacao = this.handleChangeIdentificacao.bind(this);
        this.handleChangeOperacaoAcionamento = this.handleChangeOperacaoAcionamento.bind(this);
        this.handleChangeOperacaoModos = this.handleChangeOperacaoModos.bind(this);
        this.handleChangeRetardo = this.handleChangeRetardo.bind(this);
        this.handleChangeForcarModo = this.handleChangeForcarModo.bind(this);
        this.handleChangeColetorRedirecionar = this.handleChangeColetorRedirecionar.bind(this);
        this.handleChangeTratarSinaleira = this.handleChangeTratarSinaleira.bind(this);
        this.handleChangeMonitorarPorta = this.handleChangeMonitorarPorta.bind(this);
        this.handleChangePulsarExpirar = this.handleChangePulsarExpirar.bind(this);

        this.handleChangeIp = this.handleChangeIp.bind(this);
        this.handleChangePorta = this.handleChangePorta.bind(this);
        this.handleChangePadraoEnderecamento = this.handleChangePadraoEnderecamento.bind(this);
        this.handleChangeDispositivoEntrada = this.handleChangeDispositivoEntrada.bind(this);
        this.handleChangeDispositivoSaida = this.handleChangeDispositivoSaida.bind(this);
        this.handleChangeTempoDispEntrada = this.handleChangeTempoDispEntrada.bind(this);
        this.handleChangeTempoDispSaida = this.handleChangeTempoDispSaida.bind(this);
        this.handleChangeAguardaMin = this.handleChangeAguardaMin.bind(this);
        this.handleChangeSensoresEntrada = this.handleChangeSensoresEntrada.bind(this);
        this.handleChangeSensoresSaida = this.handleChangeSensoresSaida.bind(this);
        this.handleChangeTempoMinAcionamento = this.handleChangeTempoMinAcionamento.bind(this);
        this.handleChangeConfigIniciar = this.handleChangeConfigIniciar.bind(this);
        this.handleChangeDirecaoCatraca = this.handleChangeDirecaoCatraca.bind(this);
        this.handleChangeModoConectividade = this.handleChangeModoConectividade.bind(this);
        this.handleChangeBracoAbaixado = this.handleChangeBracoAbaixado.bind(this);
        this.handleChangeModalCartoes = this.handleChangeModalCartoes.bind(this);
        this.cancelaModalCartoes = this.cancelaModalCartoes.bind(this);
        this.HF={
            handleChangeModeloProtocolo : this.handleChangeModeloProtocolo,
            handleChangeIdentificacao : this.handleChangeIdentificacao,
            handleChangeOperacaoAcionamento : this.handleChangeOperacaoAcionamento,
            handleChangeOperacaoModos : this.handleChangeOperacaoModos,
            handleChangeRetardo : this.handleChangeRetardo,
            handleChangeForcarModo : this.handleChangeForcarModo,
            handleChangeColetorRedirecionar : this.handleChangeColetorRedirecionar,
            handleChangeTratarSinaleira: this.handleChangeTratarSinaleira,
            handleChangeMonitorarPorta: this.handleChangeMonitorarPorta,
            handleChangePulsarExpirar: this.handleChangePulsarExpirar,
            handleChangeBracoAbaixado: this.handleChangeBracoAbaixado,

            handleChangeIp : this.handleChangeIp,
            handleChangePorta : this.handleChangePorta,
            handleChangePadraoEnderecamento : this.handleChangePadraoEnderecamento,
            handleChangeDispositivoEntrada : this.handleChangeDispositivoEntrada,
            handleChangeDispositivoSaida : this.handleChangeDispositivoSaida,
            handleChangeTempoDispEntrada : this.handleChangeTempoDispEntrada,
            handleChangeTempoDispSaida : this.handleChangeTempoDispSaida,
            handleChangeAguardaMin : this.handleChangeAguardaMin,
            handleChangeSensoresEntrada : this.handleChangeSensoresEntrada,
            handleChangeSensoresSaida : this.handleChangeSensoresSaida,
            handleChangeTempoMinAcionamento : this.handleChangeTempoMinAcionamento,
            handleChangeConfigIniciar: this.handleChangeConfigIniciar,
            handleChangeDirecaoCatraca: this.handleChangeDirecaoCatraca,
            handleChangeModoConectividade: this.handleChangeModoConectividade,
            handleChangeModalCartoes: this.handleChangeModalCartoes,
            cancelaModalCartoes: this.cancelaModalCartoes,
        }


        this.editavel = true;
        this.stringTranslate = this.stringTranslate.bind(this);
        this.aba = null;
        this.toggle = this.toggle.bind(this);
        this.handleClickCancelar = this.handleClickCancelar.bind(this);
        this.handleClickRemove = this.handleClickRemove.bind(this);
        this.handleClickSair = this.handleClickSair.bind(this);
        this.handleClickSalvar = this.handleClickSalvar.bind(this);
    }

    stringTranslate(id){
        return this.props.intl.formatMessage({id: id});
    }

    //Dados basicos handles
    handleChangeNome(event){
        this.setState({nome: event.target.value});
    }
    toggleAtivo(){
        this.setState({ativo: !this.state.ativo});
    }
    handleChangeUtilizacao(event){
        this.setState({utilizacao: event.value});
    }
    handleChangeDirecaoPermitida(event){
        this.setState({direcaoPermitida: event.value});
    }
    handleChangeNumIdentificacao(num){
        this.setState({numIdentificacao: num});
    }
    handleChangeAcesso(event){
        if (event !== null)
            this.setState({acesso: event.map((prop) => {return prop.value})});
        else 
            this.setState({acesso: []});
    }
    handleChangeExpirarEntrada(event){
        var val = event.target.value.split(":");
        if (parseInt(val[1]) >= 60){
            val[1] = "59";
        }
        val = val[0]+":"+val[1];
        this.setState({expirarEntrada: val});
    }
    handleChangeEmpresa(event){
        this.setState({empresa: event.value});
    }
    handleChangeCaminhoDiretorio(event){
        event.target.parentElement.firstChild.children[1].innerHTML = event.target.value;
        this.setState({caminhoDiretorio: event.target.value});
    }
    handleChangeFormatoArquivo(event){
        this.setState({formatoArquivo: event.value});
    }
    handleChangeIncluirNomeArquivo(){
        this.setState({incluiNomeArquivo: !this.state.incluiNomeArquivo});
    }

    //Detalhes handles
    handleChangeOpcoesEspeciais(event){

        if (event !== null)
            this.setState({opcoesEspeciais: event.map((prop) => {return (prop.value) } ) } );
        else
            this.setState({opcoesEspeciais: []});
    }
    handleChangePictograma(event){
        this.setState({pictograma: event.value});
    }
    handleChangeDispositivo(event){
        this.setState({dispositivo: event.target.value});
    }
    handleChangeTempo(event){
        this.setState({tempo: event.target.value});
    }
    handleChangeMensagemPadrao(event){
        this.setState({mensagemPadrao: event.target.value});
    }
    handleChangeCaracteres(event){
        this.setState({caracteres: event.target.value});
    }
    handleChangeComoSenha(){
        this.setState({comoSenha: !this.state.comoSenha});
    }
    handleChangeModoLiberado(event){
        this.setState({modoLiberado: event.value});
    }

    //Biometria handles
    handleChangeNumeroSerie(event){
        this.setState({numeroSerie: event.value});
    }
    handleChangeResolucao(event){
        this.setState({resolucao: event.target.value});
    }
    handleChangePadrao(){
        this.setState({padrao: !this.state.padrao});
    }
    handleChangeSegundoLeitor(event){
        this.setState({segundoLeitor: event.value});
    }
    handleChangeSelectLeitores(event) {
        if(Boolean(this.handleChangeNumeroSerie) !== false)
          this.handleChangeSegundoLeitor(event);
        else
          this.handleChangeNumeroSerie(event);
    }
    handleChangeEntrada(event){
        this.setState({direcaoEntrada: event.target.value});
    }
    handleChangeSaida(event){
        this.setState({direcaoSaida: event.target.value});
    }
    handleChangeOutros(event){
        this.setState({direcaoOutros: event.value});
    }

    //Hardware handles
    handleChangeModeloProtocolo(event){
        this.setState({modeloProtocolo: event.value});
    }
    handleChangeIdentificacao(event){
        if (event !== null)
            this.setState({identificacao: event.map((prop) => {return prop.value})});
        else 
            this.setState({identificacao: []});
    }
    handleChangeOperacaoAcionamento(event){
        this.setState({operacaoAcionamento: event.value});
    }
    handleChangeOperacaoModos(event){
        if (event !== null)
            this.setState({operacaoModos: event.map((prop) => {return prop.value})});
        else 
            this.setState({operacaoModos: []});
    }
    handleChangeRetardo(event){
        this.setState({retardo: event.target.value});
    }
    handleChangeForcarModo(event){
        this.setState({forcarModo: event.target.value});
    }
    handleChangeColetorRedirecionar(event){
        if (event !== null)
            this.setState({coletorRedirecionar: event.value});
        else
            this.setState({coletorRedirecionar: null})
    }
    handleChangeTratarSinaleira(event){
        this.setState({toggleTratarSinaleira: event});
    }
    handleChangeMonitorarPorta(event){
        this.setState({toggleMonitorarPorta: event});
    }
    handleChangePulsarExpirar(event){
        this.setState({togglePulsarExpirar: event});
    }

    handleChangeIp(event){
        this.setState({ip: event.target.value});
    }
    handleChangePorta(event){
        var val = event.target.value !== '' ? event.target.value : null;
        this.setState({porta: val});
    }
    handleChangePadraoEnderecamento(event){
        this.setState({padraoEnderecamento: event});
    }
    handleChangeConfigIniciar(event){
        this.setState({configIniciar: event});
    }
    handleChangeDispositivoEntrada(event){
        this.setState({dispositivoEntrada: event.target.value})
    }
    handleChangeDispositivoSaida(event){
        this.setState({dispositivoSaida: event.target.value});
    }
    handleChangeTempoDispEntrada(event){
        this.setState({tempoDispEntrada: event.target.value});
    }
    handleChangeTempoDispSaida(event){
        this.setState({tempoDispSaida: event.target.value});
    }
    handleChangeAguardaMin(event){
        this.setState({aguardaMin: event.target.value});
    }
    handleChangeSensoresEntrada(event){
        this.setState({sensoresEntrada: event.target.value});
    }
    handleChangeSensoresSaida(event){
        this.setState({sensoresSaida: event.target.value});
    }
    handleChangeTempoMinAcionamento(event){
        this.setState({tempoMinAcionamento: event.target.value});
    }
    handleChangeDirecaoCatraca(event){
        if (event.value === 1){
            this.state.sensoresSaida = 101;
            this.state.sensoresEntrada = 102;
        }
        else{
            this.state.sensoresSaida = 102;
            this.state.sensoresEntrada = 101;
        }
        // let aux = this.state.sensoresSaida;
        // this.state.sensoresSaida = this.state.sensoresEntrada;
        // this.state.sensoresEntrada = aux;
    }
    handleChangeModoConectividade(event){
        this.setState({modoConectividade: event.value});
    }
    handleChangeBracoAbaixado(event){
        this.setState({bracoAbaixado: event.target.value});
    }


    handleChangeModalCartoes(valor, variavel,  isMulti){
        if (isMulti){
            if (valor !== null)
                this.state.modalCartoesValores[variavel] = (valor.map((prop) => {return prop.value}));
            else 
                this.state.modalCartoesValores[variavel] = [];
        }else{
            if (valor === '')
                this.state.modalCartoesValores[variavel] = null;
            else
                this.state.modalCartoesValores[variavel] = valor;
        }
        console.log({variavel: variavel, valor: this.state.modalCartoesValores[variavel]});
        this.setState({modalCartoesValores: this.state.modalCartoesValores});
    }

    cancelaModalCartoes(){
        var modalCartoesValores = {
            numCartao1: this.props.tipo !== "add" ? this.props.dados.NumLeitorCartao1 : null,
            numCartao2: this.props.tipo !== "add" ? this.props.dados.NumLeitorCartao2 : null,
            numCartao3: this.props.tipo !== "add" ? this.props.dados.NumLeitorCartao3 : null,
            tipoCartao1: this.props.tipo !== "add" ? this.props.dados.TipoLeitorCartao1 : 0,
            tipoCartao2: this.props.tipo !== "add" ? this.props.dados.TipoLeitorCartao2 : 0,
            tipoCartao3: this.props.tipo !== "add" ? this.props.dados.TipoLeitorCartao3 : 0,
            direcaoCartao1: this.props.tipo !== "add" ? 
                converteDirecaoCartaoCheckLista(this.props.dados.DirecoesCartao1, this.props.dados.LongaDistanciaCartao1 ) : [],
            direcaoCartao2: this.props.tipo !== "add" ? 
                converteDirecaoCartaoCheckLista(this.props.dados.DirecoesCartao2, this.props.dados.LongaDistanciaCartao2 ) : [],
            direcaoCartao3: this.props.tipo !== "add" ? 
                converteDirecaoCartaoCheckLista(this.props.dados.DirecoesCartao3, this.props.dados.LongaDistanciaCartao3 ) : [],
            usaAntenaTCPIP: this.props.tipo !== "add" ? this.props.dados.UsaAntenaTCPIP : false,
            enderecoIP: this.props.tipo !== "add" ? this.props.dados.EnderecoIPAntena : null,
            portaTCPAntena: this.props.tipo !== "add" ? this.props.dados.PortaTCPAntena: null,
            acionarDispositivo: this.props.tipo !== "add" ? this.props.dados.DispositivoAcionarUrna : null,
            sensorPassagem: this.props.tipo !== "add" ? this.props.dados.ENDERECO : null,
            tipoUrna : this.props.tipo !== "add" ? this.props.dados.TipoUrna : null,
            leitorUrna: this.props.tipo !== "add" ? validaBooleanString(this.props.dados.LeitorNaUrna) : false,
            intervaloLeitura: this.props.tipo !== "add" ? this.props.dados.TempoCartaoLongaDistancia : null,
        };
        this.state.modalCartoesValores = modalCartoesValores;
        this.setState({modalCartoesValores: this.state.modalCartoesValores});
    }

    //Pag handles
    handleClickSalvar(event){
        this.setState({salvando: true});
        let operacaoes = converteOperacaoListaCheck(7, this.state.operacaoModos);
        let acesso = converteAcessoListaCheck(this.state.acesso);
        let opcoesEsp = converteAcessoListaCheck(this.state.opcoesEspeciais);
        let dispositivo = converteOperacaoListaCheck(3, this.state.identificacao);
        let direcoesCartao1 = converteDirecaoCartaoListaCheck(this.state.modalCartoesValores["direcaoCartao1"]);
        let direcoesCartao2 = converteDirecaoCartaoListaCheck(this.state.modalCartoesValores["direcaoCartao2"]);
        let direcoesCartao3 = converteDirecaoCartaoListaCheck(this.state.modalCartoesValores["direcaoCartao3"]);
        console.log(this.state.modalCartoesValores);
        const body = {
            "cmd":"incluirColetores",
            "token": sessionStorage.getItem("token"),
            "enderecoIP": this.state.ip,
            "porta": this.state.porta,
            "autoconfig": this.state.configIniciar,
            "releentrada": this.state.dispositivoEntrada,
            "relesaida": this.state.dispositivoSaida,
            "temporeleentrada": this.state.tempoDispEntrada,
            "temporelesaida": this.state.tempoDispSaida,
            "tempoMinAguardaGiro": this.state.aguardaMin,
            "sensorentrada": this.state.sensoresEntrada,
            "sensorsaida": this.state.sensoresSaida,
            "tempoMinRele": this.state.tempoMinAcionamento,
            "forcarmodo": this.state.forcarModo,
            "ativo": this.state.ativo,
            "modopanico": this.state.modoLiberado,
            "comosenha": this.state.comoSenha,
            "modelopictograma": this.state.pictograma,
            "temdispositivoteclado": dispositivo[0],
            "temdispositivocartao": dispositivo[1],
            "usaBiometria": dispositivo[2],
            "incluinomearquivo": this.state.incluiNomeArquivo,
            "codigo": this.props.tipo !== "add" ? this.props.dados.CODCOLETOR : 0,
            "nome":this.state.nome,
            "codlocalacesso": this.props.dados.CODLOCALACESSO,
            "caminholistas": this.state.caminhoDiretorio,
            "formatoarquivo":this.state.formatoArquivo,
            "numero":this.state.numIdentificacao,
            //"numportaserial":"",
            "tipocoletor":this.state.modeloProtocolo,
            "direcaopermitida":this.state.direcaoPermitida + 1,
            "endereco": this.state.modalCartoesValores["sensorPassagem"],
            "resolucaoleitor": this.state.resolucao,
            "numserieleitor": this.state.numeroSerie,
            "padraocadastro": this.state.padrao,
            "padraorelogio": operacaoes[0],
            "emitirsons": operacaoes[1],
            //"numnaoreconhecimento": "",
            //"temponaoreconhecimento":"",
            "tipouso": this.state.utilizacao + 1,
            "permitevisitantes": acesso[0],
            "tempoexpiracaoentrada": converterHorasMinutos(this.state.expirarEntrada),
            "deveaguardargiro": operacaoes[2],
            "soregistragirar": operacaoes[3],
            "pulsaraposexpirartempo":this.state.togglePulsarExpirar,
            "modocancela":operacaoes[4],
            "temporetardocancela": this.state.retardo,
            "modoporta":operacaoes[5],
            "dispositivoalternativo": "",
            "sensorBracoAbaixado": this.state.bracoAbaixado,
            //"reservado_i1":"	",
            //"reservado_i2":"	",
            "monitoraPorta":this.state.toggleMonitorarPorta,
            //"reservado_s1":"	",
            //"reservado_s2":"	",
            //"ambienteexterno":"	",
            "numserieleitor2": this.state.segundoLeitor !== null ? this.state.segundoLeitor : this.state.direcaoEntrada !== null ? (this.state.direcaoEntrada+","+this.state.direcaoSaida+","+this.state.direcaoOutros) : null,
            //"ambienteinterno":"	",
            "permiteabrirfecharsistema":opcoesEsp[0],
            "sofuncionaumavez":opcoesEsp[1],
            //"numbitssitewiegand":"	",
            //"numbitsusuariowiegand":"	",
            "mensagempadrao":this.state.mensagemPadrao,
            "codformatoarquivoconfig":"	",
            "dispositivoacionarparaevento":this.state.dispositivo,
            "tempoacionarparaevento":this.state.tempo,
            "modoConectividade": this.state.modoConectividade, //Modo online se possível
            //"flags":"	",
            //"modopanico":"	",
            "dispositivoacionarurna": this.state.modalCartoesValores["acionarDispositivo"],
            "tipoUrna": this.state.modalCartoesValores["tipoUrna"],
            "leitorNaUrna": this.state.modalCartoesValores["leitorUrna"],
            //"ipdvr":"	",
            //"usuario":"	",
            //"senha":"	",
            //"numcamera":"	",
            //"modelocamera":"	",
            //"permitegravartexto":"	",
            //"portacameradvr":"	",
            //"modoconectividade":"	",
            //"senhamestre":"	",
            //"enderecoip":"	",
            "codempresa":this.state.empresa,
            //"codplantabaixa":"	",
            //"posx":"	",
            //"posy":"	",
            //"chaveatual":"	",
            //"chavenova":"",
            //"amostraspordedooffline":"	",
            //"ultimosequencial":"	",
            //"redelenta":"	",
            //"autocoletaoffline":"	",
            //"usasenhacriptoglobal":"	",
            //"usasenhamestraglobal":"	",
            //"usamensagempadraoglobal":"	",
            "numleitorcartao1": this.state.modalCartoesValores["numCartao1"],
            "numleitorcartao2": this.state.modalCartoesValores["numCartao2"],
            "numleitorcartao3": this.state.modalCartoesValores["numCartao3"],
            "tipoLeitorCartao1": this.state.modalCartoesValores["tipoCartao1"],
            "tipoLeitorCartao2": this.state.modalCartoesValores["tipoCartao2"],
            "tipoLeitorCartao3": this.state.modalCartoesValores["tipoCartao3"],
            "longaDistanciaCartao1": direcoesCartao1[1],
            "longaDistanciaCartao2": direcoesCartao2[1],
            "longaDistanciaCartao3": direcoesCartao3[1],
            "direcoesCartao1": direcoesCartao1[0],
            "direcoesCartao2": direcoesCartao2[0],
            "direcoesCartao3": direcoesCartao3[0],
            "tempocartaolongadistancia": this.state.modalCartoesValores["intervaloLeitura"],
            //"numportatcp":"	",
            //"dispositivolinear":"	",
            "modocatraca":operacaoes[6],
            //"tempominrele":"	",
            "usaAntenaTCPIP": this.state.modalCartoesValores["usaAntenaTCPIP"],
            "enderecoipantena": this.state.modalCartoesValores["enderecoIP"],
            "portatcpantena": this.state.modalCartoesValores["portaTCPAntena"],
            "exigemotorista": acesso[1],
            //"sensorbracoabaixado":"	",
            //"codcoletorfisico":"	",
            "codcoletorredirecionar": this.state.coletorRedirecionar,
            //"tempominaguardargiro":"	"
        }
        console.log(body);
        postAdonis(body, '/Coletor/Salvar').then((data) => {
            console.log(data);
            if (data.error === undefined){
                this.props.atualizaTable();
                this.props.toggle();
                toast.success(data.mensagem, {
                    transition: Slide,
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    pauseOnVisibilityChange: false
                    });    
            }else{
                toast.error(this.stringTranslate("Error: "+data.msg), {
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
            this.setState({salvando: false});
        })

    }

    handleClickRemove(event){
        const body = {
            "cmd": "excluirColetores",
            "token": sessionStorage.getItem("token"),
            "codigo": this.props.dados.CODCOLETOR,
        }
        postAdonis(body, '/Coletor/Excluir').then((data) => {
            if (data.erro === undefined){
                console.log(data);
                this.props.atualizaTable();
                this.props.toggle();
                toast.success(data.mensagem, {
                    transition: Slide,
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    pauseOnVisibilityChange: false
                    });    
            }else{
                toast.error(this.stringTranslate("Error: "+data.erro), {
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

    handleClickCancelar(event){
        this.props.toggle();
    }

    handleClickSair(event){
        this.props.toggle();
    }
    toggle(){
        this.setState({modal: !this.state.modal})
    }

    changeAba(pagina){
        var step;
        if(pagina === "dadosBasicos")
            step = 0;            
        else if(pagina === "hardware")
            step = 1;        
        else if(pagina === "detalhes")
            step = 2;  
        else if(pagina === "biometria")
            step = 3;
        else if(pagina === "programacao")
            step = 4;                    
        else if(pagina === "cftv")
            step = 5;                

        if(step === 0)        
            this.setState({abaAtual: 0, corBotao: ["primary", "link", "link", "link", "link", "link"]})
        else if(step === 1)
            this.setState({abaAtual: 1, corBotao: ["link", "primary", "link", "link", "link", "link"]})
        else if(step === 2)
            this.setState({abaAtual: 2, corBotao: ["link", "link", "primary", "link", "link", "link"]})
        else if(step === 3)
            this.setState({abaAtual: 3, corBotao: ["link", "link", "link", "primary", "link", "link"]})
        else if(step === 4)
            this.setState({abaAtual: 4, corBotao: ["link", "link", "link", "link", "primary", "link"]})
        else if(step === 5)
            this.setState({abaAtual: 5, corBotao: ["link", "link", "link", "link", "link", "primary"]})

    }

    render(){
        if (this.props.tipo === "view")
            this.editavel = false;
        else if (this.props.tipo === "del"){
            this.handleClickRemove();
            return null;
        }
        if (this.editavel){
            this.footer = <>
            <Row>
                <Col>
                    <Spin spinning={this.state.salvando}>
                        <Button onClick={this.handleClickSalvar} block>{this.stringTranslate("Coletor.salvar")}</Button>
                    </Spin>
                </Col>
                <Col>
                    <Button onClick={this.props.toggle} block>{this.stringTranslate("Coletor.cancelar")}</Button>
                </Col>
            </Row></>;
        }else{
            this.footer = <>
            <Row>
                <Col>
                    <Button onClick={this.props.toggle} block>{this.stringTranslate("Coletor.sair")}</Button>
                </Col>
            </Row>
            </>
        }
        switch (this.state.abaAtual) {
            case 0:
                this.aba =
                    <><DadosBasicos stateP={this.state} DBF={this.DBF} tipo={this.props.tipo} dados={this.props.dados} editavel={this.editavel}/></>
                break;
            case 1:
                this.aba = 
                    <><Hardware stateP={this.state} modalCartoesValores={this.state.modalCartoesValores} HF={this.HF} tipo={this.props.tipo} dados={this.props.dados} editavel={this.editavel} /></>
                break;
            case 2:
                this.aba =
                    <><Detalhes stateP={this.state} DF={this.DF} tipo={this.props.tipo} dados={this.props.dados} editavel={this.editavel} /></>
                break;
            case 3:
                this.aba=
                    <><Biometria stateP={this.state} modelo={this.state.modeloProtocolo} BF={this.BF} tipo={this.props.tipo} dados={this.props.dados} editavel={this.editavel} /></>
                break;
            case 4:
                this.aba=
                    <><Programacao stateP={this.state} tipo={this.props.tipo} dados={this.props.dados} editavel={this.editavel} /></>
                break;
            default:
                this.aba =null;
        }
        return(<div className="content">
            <Modal 
            style={{minWidth:"60%"}} 
            visible={this.props.isOpened}
            title={Boolean(this.state.nome) !== false ? this.stringTranslate("Coletor.pag.titulo")+String(this.state.nome)
            : this.stringTranslate("Coletor.pag.titulo")}
            onOk={this.editavel ? this.handleClickSalvar : this.handleClickSair}
            onCancel={this.handleClickCancelar}
            cancelButtonProps={{style:{visibility: this.editavel ? "visible" : "hidden"}}}
            zIndex={1050}
            >
                {/* <ModalHeader toggle={this.props.toggle}>
                    {Boolean(this.state.nome) !== false ? <h4>{this.stringTranslate("Coletor.pag.titulo")+String(this.state.nome)}</h4>
                    : <h4>{this.stringTranslate("Coletor.pag.titulo")}</h4>}
                </ModalHeader>
                <ModalBody>  */}
                    <div style={{textAlign: "center"}}>
                        <Button color={this.state.corBotao[0]} size="sm" style={{borderRadius: "50px"}} onClick={() => this.changeAba("dadosBasicos")} >{this.stringTranslate("Coletor.pag.dadosBasicos")}</Button> 
                        <Button color={this.state.corBotao[1]} size="sm" style={{borderRadius: "50px"}} onClick={() => this.changeAba("hardware")}>{this.stringTranslate("Coletor.pag.hardware")}</Button> 
                        <Button color={this.state.corBotao[2]} size="sm" style={{borderRadius: "50px"}} onClick={() => this.changeAba("detalhes")}>{this.stringTranslate("Coletor.pag.detalhes")}</Button>
                        <Button color={this.state.corBotao[3]} size="sm" style={{borderRadius: "50px"}} onClick={() => this.changeAba("biometria")}>{this.stringTranslate("Coletor.pag.biometria")}</Button>
                        <Button color={this.state.corBotao[4]} size="sm" style={{borderRadius: "50px"}} onClick={() => this.changeAba("programacao")}>{this.stringTranslate("Coletor.pag.programacao")}</Button>
                    </div>
                    <div >
                        {this.aba}
                    </div>
                {/* </ModalBody>
                <CardFooter>{this.footer}</CardFooter> */}
            </Modal>
        
        </div>)
    }
}

export default injectIntl(PagColetor);