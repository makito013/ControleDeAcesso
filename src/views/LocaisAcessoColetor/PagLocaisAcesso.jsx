import React from "react";
import BootstrapTreeTable from 'bootstrap-react-treetable';
import ReactDOM from "react-dom";
import Tabela from "../../components/Tabela/Tabela"


import {post, postAdonis} from "../../utils/api.js"
import { injectIntl } from "react-intl";
import { toast, Slide } from 'react-toastify';
import Select from "react-select";
import AsyncSelect from "react-select/async"
import makeAnimated from "react-select/animated";
import ModalAmbientesConectados from "./ModalAmbientesConectados.jsx";
import InputMask from 'react-input-mask';
import {Modal} from 'antd';

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
import { reject } from "q";
import { callbackify } from "util";
import { Spin } from "antd";


function converteSegundosHora(seg){
    let horas, minutos, segundos;
    horas = Math.floor(seg/3600);
    minutos = Math.floor((seg%3600)/60);
    segundos = ((seg%3600)%60);
    return (("00"+horas).slice(-2)+":"+("00"+minutos).slice(-2)+":"+("00"+segundos).slice(-2));
}

function converteHoraSegundos(hora){
    console.log(hora);
    let segundos = hora.split(":");
    console.log(segundos);
    return((parseInt(segundos[0])*3600) + (parseInt(segundos[1])*60) + (parseInt(segundos[2])));
}

function validaBooleanString(string){
    if (string === "False" || string === "false" || string === "F" || string === "f")
        return false;
    else
        return true;
}

function converteOperacaoCheckLista(opcoes){
    let lista = [];
    for (var i = 0, j = opcoes.length; i < j; i++){
        if (opcoes[i] === 1)
            lista.push(i);
    }
    return(lista);
}

function converteOperacaoListaCheck(tam, lista){
    let vet = [];
    for (var i = 0, j = tam; i < j; i++){
        vet.push(false);
    }
    for (var i = 0, j = lista.length ; i < j; i++){
        vet[lista[i]] = true;
    }
    return(vet);
}

function ValidacaoExigeSaida(props){
    const [validacoes, setValidacao] = React.useState();
    const [restricoes, setRestricoes] = React.useState(
        Boolean(props.value) !== false && props.value[0] === 0 ?
        (props.value[1] === 1 ?
        [
            {value: 0, label: props.stringTranslate("Coletor.exigeES.opcao.biometria")},
            {value: 1, label: props.stringTranslate("Coletor.exigeES.opcao.biometriaDupla")},
        ] :
        [
            {value: 0, label: props.stringTranslate("Coletor.exigeES.opcao.biometria")},
            {value: 1, label: props.stringTranslate("Coletor.exigeES.opcao.biometriaDupla")},
            {value: 2, label: props.stringTranslate("Coletor.exigeES.opcao.cartao")},
            {value: 3, label: props.stringTranslate("Coletor.exigeES.opcao.senha")},
        ]) :
        [
            {value: 0, label: props.stringTranslate("Coletor.exigeES.opcao.biometria")},
            {value: 2, label: props.stringTranslate("Coletor.exigeES.opcao.cartao")},
            {value: 3, label: props.stringTranslate("Coletor.exigeES.opcao.senha")},
        ]
    )
  
    function handleChange(event) {
        var Biometria = false;
        var BiometriaDupla = -1;
        var Cartao = -1;
        var Senha = -1;
        if (event !== null){
            for (var i = 0, j = event.length; i < j; i++){
                if(event[i].value === 0)
                    Biometria = true;
                else if(event[i].value === 1)
                    BiometriaDupla = i;
                else if (event[i].value === 2)
                    Cartao = i;
                else if (event[i].value === 3)
                    Senha = i;
            }
            if (!Biometria){
                setRestricoes( [
                    {value: 0, label: props.stringTranslate("Coletor.exigeES.opcao.biometria")},
                    {value: 2, label: props.stringTranslate("Coletor.exigeES.opcao.cartao")},
                    {value: 3, label: props.stringTranslate("Coletor.exigeES.opcao.senha")},
                ] );
                if(BiometriaDupla !== -1){
                    event.splice(BiometriaDupla, 1);
                    setValidacao(event);
                }else{
                    setValidacao(event);
                }
            }else{
                if(BiometriaDupla !== -1){
                    setRestricoes( [
                        {value: 0, label: props.stringTranslate("Coletor.exigeES.opcao.biometria")},
                        {value: 1, label: props.stringTranslate("Coletor.exigeES.opcao.biometriaDupla")},
                    ] );
                    if (Cartao !== -1){
                        event.splice(Cartao, 1);
                        if (Senha !== -1){
                            if (Senha > Cartao)
                                event.splice(Senha-1, 1);
                            else
                                event.splice(Senha, 1);
                        }
                    }
                    else if (Senha !== -1)
                        event.splice(Senha, 1);
                    setValidacao(event);
                }else{
                    setRestricoes( [
                        {value: 0, label: props.stringTranslate("Coletor.exigeES.opcao.biometria")},
                        {value: 1, label: props.stringTranslate("Coletor.exigeES.opcao.biometriaDupla")},
                        {value: 2, label: props.stringTranslate("Coletor.exigeES.opcao.cartao")},
                        {value: 3, label: props.stringTranslate("Coletor.exigeES.opcao.senha")},
                    ] );
                    setValidacao(event);
                }
            }
        }else{
            setRestricoes( [
                {value: 0, label: props.stringTranslate("Coletor.exigeES.opcao.biometria")},
                {value: 2, label: props.stringTranslate("Coletor.exigeES.opcao.cartao")},
                {value: 3, label: props.stringTranslate("Coletor.exigeES.opcao.senha")},
            ] );
            setValidacao(event);
        }
        props.onChangeExigeSaida(event);
    }
  
    const animatedComponents = makeAnimated();

    let vetores = [];
    if (Boolean(props.value) !== false){
        for (var i = 0, j = props.value.length; i < j; i++){
            restricoes.map((prop) => {
                if (prop.value === props.value[i])
                    vetores.push(prop);
            })
        }
    }
  
    return(
      <FormGroup>
      <Label>{props.stringTranslate("Coletor.exigeNaSaida")}</Label>
      <Select 
        defaultValue={vetores}
        isDisabled={!props.editavel}     
        closeMenuOnSelect={false}
        components={animatedComponents}
        isMulti
        options={restricoes}
        placeholder={("Sem validação")}
        onChange={(e) => handleChange(e)}
        
      />
      </FormGroup>
    )
  }


function ValidacaoExigeEntrada(props){
    const [validacoes, setValidacao] = React.useState();
    const [restricoes, setRestricoes] = React.useState(
        Boolean(props.value) !== false && props.value[0] === 0 ?
        (props.value[1] === 1 ?
        [
            {value: 0, label: props.stringTranslate("Coletor.exigeES.opcao.biometria")},
            {value: 1, label: props.stringTranslate("Coletor.exigeES.opcao.biometriaDupla")},
        ] :
        [
            {value: 0, label: props.stringTranslate("Coletor.exigeES.opcao.biometria")},
            {value: 1, label: props.stringTranslate("Coletor.exigeES.opcao.biometriaDupla")},
            {value: 2, label: props.stringTranslate("Coletor.exigeES.opcao.cartao")},
            {value: 3, label: props.stringTranslate("Coletor.exigeES.opcao.senha")},
        ]) :
        [
            {value: 0, label: props.stringTranslate("Coletor.exigeES.opcao.biometria")},
            {value: 2, label: props.stringTranslate("Coletor.exigeES.opcao.cartao")},
            {value: 3, label: props.stringTranslate("Coletor.exigeES.opcao.senha")},
        ]
    )
  
    function handleChange(event) {
        var Biometria = false;
        var BiometriaDupla = -1;
        var Cartao = -1;
        var Senha = -1;
        if (event !== null){
            for (var i = 0, j = event.length; i < j; i++){
                if(event[i].value === 0)
                    Biometria = true;
                else if(event[i].value === 1)
                    BiometriaDupla = i;
                else if (event[i].value === 2)
                    Cartao = i;
                else if (event[i].value === 3)
                    Senha = i;
            }
            if (!Biometria){
                setRestricoes( [
                    {value: 0, label: props.stringTranslate("Coletor.exigeES.opcao.biometria")},
                    {value: 2, label: props.stringTranslate("Coletor.exigeES.opcao.cartao")},
                    {value: 3, label: props.stringTranslate("Coletor.exigeES.opcao.senha")},
                ] );
                if(BiometriaDupla !== -1){
                    event.splice(BiometriaDupla, 1);
                    setValidacao(event);
                }else{
                    setValidacao(event);
                }
            }else{
                if(BiometriaDupla !== -1){
                    setRestricoes( [
                        {value: 0, label: props.stringTranslate("Coletor.exigeES.opcao.biometria")},
                        {value: 1, label: props.stringTranslate("Coletor.exigeES.opcao.biometriaDupla")},
                    ] );
                    if (Cartao !== -1){
                        event.splice(Cartao, 1);
                        if (Senha !== -1){
                            if (Senha > Cartao)
                                event.splice(Senha-1, 1);
                            else
                                event.splice(Senha, 1);
                        }
                    }
                    else if (Senha !== -1)
                        event.splice(Senha, 1);
                    setValidacao(event);
                }else{
                    setRestricoes( [
                        {value: 0, label: props.stringTranslate("Coletor.exigeES.opcao.biometria")},
                        {value: 1, label: props.stringTranslate("Coletor.exigeES.opcao.biometriaDupla")},
                        {value: 2, label: props.stringTranslate("Coletor.exigeES.opcao.cartao")},
                        {value: 3, label: props.stringTranslate("Coletor.exigeES.opcao.senha")},
                    ] );
                    setValidacao(event);
                }
            }
        }else{
            setRestricoes( [
                {value: 0, label: props.stringTranslate("Coletor.exigeES.opcao.biometria")},
                {value: 2, label: props.stringTranslate("Coletor.exigeES.opcao.cartao")},
                {value: 3, label: props.stringTranslate("Coletor.exigeES.opcao.senha")},
            ] );
            setValidacao(event);
        }
        props.onChangeExigeEntrada(event);
    }
  
    const animatedComponents = makeAnimated();
    let vetores = [];
    if (Boolean(props.value) !== false){
        for (var i = 0, j = props.value.length; i < j; i++){
            restricoes.map((prop) => {
                if (prop.value === props.value[i])
                    vetores.push(prop);
            })
        }
    }
  
    return(
      <FormGroup>
      <Label>{props.stringTranslate("Coletor.exigeNaEntrada")}</Label>
      <Select      
        defaultValue={vetores}
        isDisabled={!props.editavel}
        closeMenuOnSelect={false}
        components={animatedComponents}
        isMulti
        options={restricoes}
        placeholder={("Sem validação")}
        onChange={(e) => handleChange(e)}
        
      />
      </FormGroup>
    )
  }


function FiltroRestricaoDupla(props){
    const [valor, setValor] = React.useState(props.value);
  
    function handleChange(event) {
      setValor(event);
      console.log(event);
      props.onChangeRestricaoSentido(event);
    }

    const restricoes = [
        props.stringTranslate( "Coletor.antiDupla.opcao.semRestricoes"),
        props.stringTranslate( "Coletor.antiDupla.opcao.qualquerSentido"),
        props.stringTranslate( "Coletor.antiDupla.opcao.mesmoSentido"),
        props.stringTranslate( "Coletor.antiDupla.opcao.entrada"),
    ];
  
    const animatedComponents = makeAnimated();
    const options = restricoes.map((prop, key) => {
        return(                
            {value:key,label:prop}
        );
    })
  
    return(
      <FormGroup>
      <Select      
        value={options[valor]}
        isDisabled={!props.editavel}
        closeMenuOnSelect={false}
        components={animatedComponents}
        options={options}
        defaultValue={options[0]}
        onChange={(e) => handleChange(e)}
        
      />
      </FormGroup>
    )
  }

  function FiltroFinalidade(props){
    const [valor, setValor] = React.useState(props.value);
  
    function handleChange(event) {
      setValor(event);
      console.log(event);
      props.onChangeFinalidade(event);
    }

    const restricoes = [
        props.stringTranslate("Coletor.finalidade.opcao.acessoPontoCadastro"),
        props.stringTranslate("Coletor.finalidade.opcao.refeitorio"),
        props.stringTranslate("Coletor.finalidade.opcao.cadastroApenas"),
    ];
  
    const animatedComponents = makeAnimated();
    const options = restricoes.map((prop, key) => {
        return(                
            {value:key,label:prop}
        );
    })
  
    return(
      <FormGroup>
          <Label>{props.stringTranslate("Coletor.finalidade")}</Label>
      <Select   
        isDisabled = {!props.editavel}   
        closeMenuOnSelect={false}
        value={options[valor]}
        components={animatedComponents}
        options={options}
        defaultValue={options[0]}
        onChange={(e) => handleChange(e)}
        
      />
      </FormGroup>
    )
  }

  function AcessoVeiculos(props){
    const [reestricao, setRestricao] = React.useState();
  
    function handleChange(event) {
      setRestricao(event);
      console.log(event);
      props.onChangeAcessoVeiculos(event);
    }

    const restricoes = [
        props.stringTranslate( "Coletor.acessoVeiculos.opcao.controlaGaragem"),
        props.stringTranslate( "Coletor.acessoVeiculos.opcao.proibeLotado")
    ];
  
    const animatedComponents = makeAnimated();
    const options = restricoes.map((prop, key) => {
        return(                
            {value:key,label:prop}
        );
    })
  
    return(
      <FormGroup>
      <Select   
        isDisabled={!props.editavel}   
        closeMenuOnSelect={false}
        components={animatedComponents}
        options={options}
        isMulti
        placeholder={props.stringTranslate( "Coletor.acessoVeiculos.semExigenciaVeiculos")}
        onChange={(e) => handleChange(e)}
        
      />
      </FormGroup>
    )
  }

  function AmbientesConectadosInterno (props){
    const [ambiente, setAmbiente] = React.useState(null);
    const [dados, setDados] = React.useState(null);
    const [modalAmbientes, setModal] = React.useState(false);
    const [opcoes, setOpcoes]  = React.useState([]);
    const [tipo, setTipo] = React.useState("edit");
    const [reload, setReaload] = React.useState(false);
  
    function handleChange(event) {
      setAmbiente(event);
      if (event !== null)
        setDados(props.ambientes[event.value]);
      props.onChangeAmbientesConectadosInterno(event);
    }


    function toggleModal(){
        setTipo("edit");
        setModal(!modalAmbientes);
    }

    function mudaReload(estado){
        setReaload(estado);
    }


    const restricoes = [];
  
    const animatedComponents = makeAnimated();
    let options = props.ambientes.map((prop, key) => {
        return(                
            {value:key,label:prop.Nome}
        );
    })


    function handleClickRemove(event){
        setTipo("del");
        setModal(!modalAmbientes);
        props.render();
    }
  
    return(
        <Row>
           <Col md={6}>
                <FormGroup>
                    <Label>{props.stringTranslate( "Coletor.ambienteConectado.interno")}</Label>
                    {reload === true ? <AsyncSelect 
                        isLoading
                        defaultOptions
                        value={ambiente}
                        loadOptions={(inputValue, callback) => props.loadAmbientes(inputValue, callback, setAmbiente, setDados, setOpcoes, 1)}
                        isDisabled = {!props.editavel}     
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        onChange={(e) => handleChange(e)}
                        reload={reload}
                    /> : <>{mudaReload(true)}</>}
                </FormGroup>
            </Col>
            {props.editavel ? (<>
                <Col md={2}>
                    <Button onClick={toggleModal} block style={{marginTop:"23px"}}>{props.stringTranslate("Coletor.ambienteConectado.add")}</Button>
                </Col>
                <Col md={2}>
                    <Button onClick={handleClickRemove} block style={{marginTop:"23px"}}>{props.stringTranslate( "Coletor.ambienteConectado.rmv")}</Button>
                </Col>
            </>) : null}
            {modalAmbientes ? <ModalAmbientesConectados reload={reload} setReload={setReaload} tipo={1} codLocal={props.codLocal} atualizaComponentesConectados={props.atualizaComponentesConectados} ambientes={props.ambientes} opcoes={opcoes} isOpened={modalAmbientes} toggle={toggleModal} dados={dados} editavel={props.editavel} tipo={tipo} /> : null}
        </Row>
    )
  }

  function AmbientesConectadosExterno (props){
    const [ambiente, setAmbiente] = React.useState(null);
    const [dados, setDados] = React.useState(null);
    const [modalAmbientes, setModal] = React.useState(false);
    const [opcoes, setOpcoes] = React.useState([]);
    const [tipo, setTipo] = React.useState("edit");
    const [reload, setReaload] = React.useState(true);
  
    function handleChange(event) {
        setAmbiente(event);
        if (event !== null)
          setDados(props.ambientes[event.value]);
        props.onChangeAmbientesConectadosExterno(event);
      }


    const animatedComponents = makeAnimated();
    let options = props.ambientes.map((prop, key) => {
        return(                
            {value:key,label:prop.Nome}
        );
    })

    function toggleModal(){
        setTipo("edit");
        setModal(!modalAmbientes);
    }

    function handleClickRemove(event){
        setTipo("del");
        setModal(!modalAmbientes);
    }


    return(
        <Row>
           <Col md={6}>
                <FormGroup>
                    <Label>{props.stringTranslate( "Coletor.ambienteConectado.externo")}</Label>
                    {reload === true ? <AsyncSelect 
                        isLoading
                        defaultOptions
                        value={ambiente}
                        loadOptions={(inputValue, callback) => props.loadAmbientes(inputValue, callback, setAmbiente, setDados, setOpcoes, 2)}
                        isDisabled = {!props.editavel}     
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        onChange={(e) => handleChange(e)}
                        reload={reload}
                    /> : <>{setReaload(true)}</>}
                </FormGroup>
            </Col>
            {props.editavel ? (<>
                <Col md={2}>
                    <Button onClick={toggleModal} block style={{marginTop:"23px"}}>{props.stringTranslate("Coletor.ambienteConectado.add")}</Button>
                </Col>
                <Col md={2}>
                    <Button onClick={handleClickRemove} block style={{marginTop:"23px"}}>{props.stringTranslate( "Coletor.ambienteConectado.rmv")}</Button>
                </Col>
            </>) : null}
            {modalAmbientes ? <ModalAmbientesConectados reload={reload} setReload={setReaload} tipo={2} codLocal={props.codLocal} atualizaComponentesConectados={props.atualizaComponentesConectados} ambientes={props.ambientes} opcoes={opcoes} isOpened={modalAmbientes} toggle={toggleModal} dados={dados} editavel={props.editavel} tipo={tipo} /> : null}
        </Row>
    )           
  }

class PagLocaisAcesso extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            modal: false,
            salvando: false,
            dataTable: [],
            tableHeader: [],
            switchAcessosDia: false,
            ambientes: [],
            nome: this.props.tipo !== "add" ? (this.props.dados.NOME) : null,
            codigo: this.props.tipo !== "add" ? this.props.dados.CODLOCALACESSO: 0,
            descricao: this.props.tipo !== "add" ? (this.props.dados.DESCRICAO) : null,
            concentrador: this.props.tipo !== "add" ? (this.props.dados.NOMECOMPUTADOR) : null,
            finalidade: this.props.tipo !== "add" ? (this.props.dados.Finalidade) : 0,
            limiteAcessosDia: this.props.tipo !== "add" ? (this.props.dados.LimiteAcessosDia) : 0,
            exigeNaSaida: this.props.tipo !== "add" ? (converteOperacaoCheckLista([this.props.dados.ExigeBiometriaSaida,
                                                       this.props.dados.ExigeBiometria2xSaida,
                                                       this.props.dados.ExigeCartaoSaida,
                                                       this.props.dados.ExigeSenhaSaida ])) : [],
            exigeNaEntrada: this.props.tipo !== "add" ? (converteOperacaoCheckLista([this.props.dados.ExigeBiometriaEntrada,
                                                        this.props.dados.ExigeBiometria2xEntrada,
                                                        this.props.dados.ExigeCartao,
                                                        this.props.dados.ExigeSenhaEntrada ])) : [],
            restricaoSentido: this.props.tipo !== "add" ? (this.props.dados.RestringeTempoMesmoSentido) : 0,
            intervaloMinimoAcesso: this.props.tipo !== "add" ? (this.props.dados.TempoMinimoEntreAcessos) : 0,
            ambientesConectadosInterno: this.props.tipo !== "add" ? 
                (this.props.dados.CodAmbienteInterno !== " " ? this.props.dados.CodAmbienteInterno : null) : null,
            ambientesConectadosExterno: this.props.tipo !== "add" ? 
                (this.props.dados.CodAmbienteExterno !== " " ? this.props.dados.CodAmbienteExterno : null) : null,
            acessoVeiculos: this.props.tipo !== "add" ? (this.props.dados.NOME) : null,
        }
        this.editavel = true;
        this.icone = null;
        this.footer = <></>;
        this.handleChangeNome = this.handleChangeNome.bind(this);
        this.handleChangeDescricao = this.handleChangeDescricao.bind(this);
        this.handleChangeConcentrador = this.handleChangeConcentrador.bind(this);
        this.handleChangeFinalidade = this.handleChangeFinalidade.bind(this);
        this.handleChangeLimiteAcessosDia = this.handleChangeLimiteAcessosDia.bind(this);
        this.handleChangeExigeSaida = this.handleChangeExigeSaida.bind(this);
        this.handleChangeExigeEntrada = this.handleChangeExigeEntrada.bind(this);
        this.handleChangeRestricaoSentido = this.handleChangeRestricaoSentido.bind(this);
        this.handleChangeIntervaloMinimoAcesso = this.handleChangeIntervaloMinimoAcesso.bind(this);
        this.handleChangeAmbientesConectadosInterno = this.handleChangeAmbientesConectadosInterno.bind(this);
        this.handleChangeAmbientesConectadosExterno = this.handleChangeAmbientesConectadosExterno.bind(this);
        this.handleChangeAcessoVeiculos = this.handleChangeAcessoVeiculos.bind(this);
        this.handleClickUsarNomePC = this.handleClickUsarNomePC.bind(this);
        this.handleClickSalvar = this.handleClickSalvar.bind(this);
        this.handleClickSair = this.handleClickSair.bind(this);
        this.handleClickCancelar = this.handleClickCancelar.bind(this);
        this.handleClickRemove = this.handleClickRemove.bind(this);
        this.atualizaComponentesConectados = this.atualizaComponentesConectados.bind(this);
        this.loadAmbientes = this.loadAmbientes.bind(this);
        this.onClickLine = this.onClickLine.bind(this);
        this.stringTranslate = this.stringTranslate.bind(this);
        this.handleChangeSwitch = this.handleChangeSwitch.bind(this);
        this.toggle = this.toggle.bind(this);
        this.tipo = this.props.tipo;
    }

    loadAmbientes(inputValue, callback, setValor, setDados, setOpcoes, tipo){
        this.atualizaComponentesConectados().then((val) =>{
            if (val){
                let valores = [];
                if (tipo === 1){
                    valores.push({value:null, label:"Sem", key:-1});
                    setValor({value:null, label:"Sem", key:-1});
                    this.state.ambientes.map((prop, key) =>{
                        if (String(prop.CodAmbienteAcesso) === this.state.ambientesConectadosInterno){
                            setValor({value:key, label:prop.Nome, key:prop.CodAmbienteAcesso});
                            setDados(this.state.ambientes[key]);
                        }
                        valores.push({value:key, label:prop.Nome, key:prop.CodAmbienteAcesso});
                    });
                    setOpcoes(valores);
                    callback(valores);
                }else{
                    valores.push({value: null, label:"Sem", key:-1});
                    setValor({value:null, label:"Sem", key:-1});
                    this.state.ambientes.map((prop, key) =>{
                        if (String(prop.CodAmbienteAcesso) === this.state.ambientesConectadosExterno){
                            setValor({value:key, label:prop.Nome, key:prop.CodAmbienteAcesso});
                            setDados(this.state.ambientes[key]);
                        }
                        valores.push({value:key, label:prop.Nome, key:prop.CodAmbienteAcesso});
                    });
                    setOpcoes(valores);
                    callback(valores);
                }
            }
        })
    }

    atualizaComponentesConectados(){
        return(
            new Promise((resolve, reject) => {
                const body = {
                    "cmd": "consultaAmbiente",
                    "token": sessionStorage.getItem("token"),
                }
                postAdonis(body, '/LocalAcesso/Ambientes/Index').then((data) =>{
                    if (data.error === undefined){
                        var dados = data.dados;
                        this.state.ambientes = dados.map((prop) => {return(prop)});
                        this.setState({ambientes: this.state.ambientes});
                        resolve(true);
                    }else{
                        resolve(false);
                    }
                })
            })
        )
    }

    componentDidMount(){
        this.atualizaComponentesConectados();
    }

    toggle(event){
        this.setState({modal: !this.state.modal})
    }

    handleChangeNome(event){
        this.setState({nome: event.target.value})
    }
    handleChangeDescricao(event){
        this.setState({descricao: event.target.value})
    }
    handleChangeConcentrador(event){
        this.setState({concentrador: event.target.value})
    }
    handleChangeFinalidade(event){
        this.setState({finalidade: event.value})
    }
    handleChangeLimiteAcessosDia(event){
        this.setState({limiteAcessosDia: event.target.value})
    }
    handleChangeExigeSaida(event){
        if (event !== null)
            this.setState({exigeNaSaida: event.map((prop) => {return prop.value})});
        else 
            this.setState({exigeNaSaida: []});
    }
    handleChangeExigeEntrada(event){
        if (event !== null)
            this.setState({exigeNaEntrada: event.map((prop) => {return prop.value})});
        else 
            this.setState({exigeNaEntrada: []});
    }
    handleChangeRestricaoSentido(event){
        this.setState({restricaoSentido: event.value})
    }
    handleChangeIntervaloMinimoAcesso(event){
        this.setState({intervaloMinimoAcesso: converteHoraSegundos(event.target.value)})
    }
    handleChangeAmbientesConectadosInterno(event){
        if (event !== null)
            this.setState({ambientesConectadosInterno: event.key } );
        else
            this.setState({ambientesConectadosInterno: -1});
    }
    handleChangeAmbientesConectadosExterno(event){
        if (event !== null)
            this.setState({ambientesConectadosExterno: event.key } );
        else
            this.setState({ambientesConectadosExterno: -1});
    }
    handleChangeAcessoVeiculos(event){
        if (event !== null)
            this.setState({acessoVeiculos: event.map((prop) => {return prop.value})});
        else 
            this.setState({acessoVeiculos: []});
    }

    handleClickUsarNomePC(event){
        const body = {
            "cmd": "nomeMaquina",
            "token": sessionStorage.getItem("token"),
        };
        post(body).then((data) => {
            console.log(data);
            this.state.concentrador = data.dados.nomeMaquina;
            this.setState({concentrador : this.state.concentrador});
        });
    }

    handleClickRemove(){
        const body = {
            "cmd": "excluirLocaisAcesso",
            "token": sessionStorage.getItem("token"),
            "codigo": this.props.dados.CODLOCALACESSO,
        };
        postAdonis(body, '/LocalAcesso/Excluir').then((data) =>{
            console.log(data);
            if (data.erro === undefined){
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
        })
    }

    handleClickSalvar(event){
        this.setState({salvando: true});
        let entrada = [];
        let saida = [];
        entrada = converteOperacaoListaCheck(4, this.state.exigeNaEntrada);
        saida = converteOperacaoListaCheck(4, this.state.exigeNaSaida);
        const body = {
            "cmd": "incluirLocaisAcesso",
            "token": sessionStorage.getItem("token"),
            "codigo": this.props.tipo !== "add" ? this.props.dados.CODLOCALACESSO : 0,
            "nome": this.state.nome,
            "concentrador": this.state.concentrador,
            "finalidade": this.state.finalidade,
            "antiDupla": this.state.restricaoSentido,
            "exigeBioE":entrada[0],
            "exigeBioS":saida[0],
            "exigeBioDuplaE":entrada[1],
            "exigeBioDuplaS":saida[1],
            "exigeCartaoE":entrada[2],
            "exigeCartaoS":saida[2],
            "exigeSenhaE":entrada[3],
            "exigeSenhaS":saida[3],
            "intervalominimo": this.state.intervaloMinimoAcesso,
            "codAmbienteInterno": this.state.ambientesConectadosInterno,
            "codAmbienteExterno": this.state.ambientesConectadosExterno,
            "descricao": this.state.descricao,
            "acessosPorDia": this.state.limiteAcessosDia,
            "restricaoSentido": this.state.restricaoSentido
        };
        postAdonis(body, '/LocalAcesso/Salvar').then((data) => {
            if(data.erro === undefined){
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

    handleClickCancelar(event){
        this.props.toggle();
    }

    handleClickSair(event){
        this.props.toggle();
    }


    handleChangeSwitch() {
        this.setState({switchAcessosDia: !this.state.switchAcessosDia });
    }

    stringTranslate(id){
        return this.props.intl.formatMessage({id: id});
    }

    onClickLine(){

    }

    render(){
        switch(this.tipo){
            case "add":
               // this.icone = <> <i id={"addLoc"+this.props.dados.codLocal} onClick={this.toggle} className="tim-icons icon-simple-add" style={{top:"0", paddingLeft: "10px", color:"green", cursor:"pointer"}} />
                                 //<UncontrolledTooltip placement="top" target={"addLoc"+this.props.dados.codLocal}>{this.stringTranslate("EmpresaLS.Secao.add")}</UncontrolledTooltip></>;
                break;
            case "edit":
                //this.icone = <> <i id={"editLoc"+this.props.dados.codLocal} onClick={this.toggle} className="tim-icons icon-pencil" style={{top:"0", paddingLeft: "10px", color:"orange", cursor:"pointer"}} /> 
                                 //<UncontrolledTooltip placement="top" target={"editLoc"+this.props.dados.codLocal}>{this.stringTranslate("EmpresaLS.Secao.editar")}</UncontrolledTooltip></>;
                break;
            case "view":
                //this.icone = <> <i id={"viewLoc"+this.props.dados.codLocal} onClick={this.toggle} className="far fa-eye" style={{top:"0", paddingLeft: "10px", color:"black", cursor:"pointer"}} />
                                // <UncontrolledTooltip placement="top" target={"viewLoc"+this.props.dados.codLocal}>{this.stringTranslate("EmpresaLS.Secao.visualizar")}</UncontrolledTooltip></>;
                this.editavel = false;
                break;
            case "del":
                    //this.icone = <> <i id={"delLoc"+this.props.dados.codLocal} onClick={this.handleClickExcluir} className="tim-icons icon-trash-simple" style={{top:"0", paddingLeft: "10px", color:"red", cursor:"pointer"}} />
                                    //<UncontrolledTooltip placement="top" target={"delLoc"+this.props.dados.codLocal}>{this.stringTranslate("EmpresaLS.Secao.deletar")}</UncontrolledTooltip></>;
                    this.handleClickRemove();
                    return(null);
                    break;
            default:
                //this.icone = null;
                break;
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
        return(
            <>
                <Modal title={this.stringTranslate("Coletor.nome")} 
                visible={this.props.isOpened} size="lg" 
                zIndex={1050} 
                style={{minHeight:"600px", minWidth:"80%"}}
                onOk={this.editavel ? this.handleClickSalvar : this.handleClickSair}
                onCancel={this.handleClickCancelar}
                cancelButtonProps={{style:{visibility: this.editavel ? "visible" : "hidden"}}}
                >
                    {/* <ModalHeader toggle={this.props.toggle}>
                        <Row>
                            <Col>
                                <h3>{this.stringTranslate("ColetorLocalAcesso")}: </h3>
                            </Col>
                        </Row>
                    </ModalHeader>
                    <ModalBody> */}
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Label>{this.stringTranslate("Coletor.nome")}</Label>
                                    <Input disabled={!this.editavel} onChange={this.handleChangeNome} value={this.state.nome} type="text" />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Label>{this.stringTranslate("Coletor.descricao")}</Label>
                                    <Input disabled={!this.editavel} onChange={this.handleChangeDescricao} value={this.state.descricao} type="text" />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            {this.editavel ? (
                                <>
                                <Col md={8}>
                                    <FormGroup>
                                        <Label>{this.stringTranslate("Coletor.concentrador")}</Label>
                                        <Input disabled={!this.editavel} onChange={this.handleChangeConcentrador} value={this.state.concentrador} type="text" />
                                    </FormGroup>
                                </Col>
                            
                                <Col  md={4}>
                                    <Button disabled={!this.editavel} onClick={this.handleClickUsarNomePC} block style={{marginTop:"23px"}}>{this.stringTranslate("Coletor.opcao.usarNomePC")}</Button>
                                </Col>
                                </>
                            ) : (
                                <Col>
                                    <FormGroup>
                                        <Label>{this.stringTranslate("Coletor.concentrador")}</Label>
                                        <Input disabled={!this.editavel} onChange={this.handleChangeConcentrador} value={this.state.concentrador} type="text" />
                                    </FormGroup>
                                </Col>
                            )} 
                        </Row>
                        <Row>
                            <Card>
                                <CardHeader>
                                    {this.stringTranslate("Coletor.finalidade")}
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col>
                                            <FiltroFinalidade value={this.state.finalidade} editavel={this.editavel} onChangeFinalidade={this.handleChangeFinalidade} stringTranslate={this.stringTranslate} />
                                        </Col>
                                        {/* <Col>
                                            <Switch  
                                                onChange={this.handleChangeSwitch}
                                                checked={this.state.switchAcessosDia}
                                                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)" 
                                                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)" 
                                                height={20}
                                                width={40}
                                            />
                                        </Col> */}
                                        <Col md={4}>
                                        <FormGroup>
                                            <Label>{this.stringTranslate("Coletor.finalidade.limiteAcessosDia")}</Label>
                                            <Input value={this.state.limiteAcessosDia} disabled={!this.editavel} onChange={this.handleChangeLimiteAcessosDia} type="text"
                                            mask="9999999999999999999" maskChar={null}
                                            tag={InputMask}
                                            ></Input>
                                        </FormGroup>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Row>
                        <Row>
                            <Card>
                                <CardHeader>
                                    {this.stringTranslate("Coletor.tiposValidacao")}
                                </CardHeader>
                                <CardBody>
                                    <ValidacaoExigeEntrada value={this.state.exigeNaEntrada} editavel={this.editavel} onChangeExigeEntrada={this.handleChangeExigeEntrada} stringTranslate={this.stringTranslate}/>
                                    <ValidacaoExigeSaida value={this.state.exigeNaSaida} editavel={this.editavel} onChangeExigeSaida={this.handleChangeExigeSaida} stringTranslate={this.stringTranslate} />
                                </CardBody>
                            </Card>
                        </Row>
                        <Row>
                            <Card>
                                <CardHeader>
                                    {this.stringTranslate("Coletor.antiDupla")}
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col>
                                            <FormGroup>
                                                <Label>{this.stringTranslate("Coletor.antiDupla.restricaoSentido")}</Label>
                                                 <FiltroRestricaoDupla value={this.state.restricaoSentido} editavel={this.editavel} onChangeRestricaoSentido={this.handleChangeRestricaoSentido} stringTranslate={this.stringTranslate} />
                                            </FormGroup>
                                        </Col>
                                        <Col>
                                        <FormGroup>
                                            <Label>{this.stringTranslate("Coletor.antiDupla.intervaloMinimoAcesso")}</Label>
                                            <Input value={converteSegundosHora(this.state.intervaloMinimoAcesso)} disabled={!this.editavel} onChange={this.handleChangeIntervaloMinimoAcesso} type="time" step="1" defaultValue="00:00:00">
                                            </Input>
                                        </FormGroup>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Row>
                        <Row>
                            <Card>
                                <CardHeader>
                                    {this.stringTranslate("Coletor.ambienteConectado")}
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col>
                                            <AmbientesConectadosInterno render={this.render} codLocal={this.state.codigo} atualizaComponentesConectados={this.atualizaComponentesConectados} loadAmbientes={this.loadAmbientes} ambientes={this.state.ambientes} interno={this.state.ambientesConectadosInterno} editavel={this.editavel} onChangeAmbientesConectadosInterno={this.handleChangeAmbientesConectadosInterno} stringTranslate={this.stringTranslate} />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <AmbientesConectadosExterno codLocal={this.state.codigo} atualizaComponentesConectados={this.atualizaComponentesConectados} loadAmbientes={this.loadAmbientes} ambientes={this.state.ambientes}  externo={this.state.ambientesConectadosExterno} editavel={this.editavel} onChangeAmbientesConectadosExterno={this.handleChangeAmbientesConectadosExterno} stringTranslate={this.stringTranslate} />
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Row>
                        <Row>
                            <Card>
                                <CardHeader>
                                    {this.stringTranslate("Coletor.acessoVeiculos")}
                                </CardHeader>
                                <CardBody>
                                    <AcessoVeiculos value={this.state.acessoVeiculos} veiculos={this.state.acessoVeiculos} editavel={this.editavel} onChangeAcessoVeiculos={this.handleChangeAcessoVeiculos} stringTranslate={this.stringTranslate} />
                                </CardBody>
                            </Card>
                        </Row>
                    {/* </ModalBody>
                    <ModalFooter>
                        {this.footer}
                    </ModalFooter> */}
                </Modal>
            </>
        );
    }
}

export default injectIntl(PagLocaisAcesso);