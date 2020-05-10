import React from "react";
import BootstrapTreeTable from 'bootstrap-react-treetable';
import ReactDOM from "react-dom";



import {post, postAdonis} from "../../../utils/api.js"
import { injectIntl } from "react-intl";
import Switch from "react-switch";
import InputMask from 'react-input-mask';
import Select from "react-select";
import { toast, Slide } from 'react-toastify';
import AsyncSelect from "react-select/async";
import makeAnimated from "react-select/animated";
import {Modal, Form, InputNumber} from "antd";


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
  CustomInput,
  Button,
  FormGroup,
  Label,
  CardFooter,
} from "reactstrap";
import { func } from "prop-types";

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

function SelectModoConectividade(props){
    const [valor, setValor] = React.useState(props.value);
  
    function handleChange(event) {
      val = event;
      setValor(event);
      props.onChangeModoConectividade(event);
    }

    const restricoes = [
        {value:0, label: props.stringTranslate("Conectividade.SoOffline")},
        {value:1, label: props.stringTranslate("Conectividade.SoOnline")},
        {value:2, label: props.stringTranslate("Conectividade.onlineSePossivel")},
        {value:3, label: props.stringTranslate("Conectividade.TemplateOnCard")},
    ];
  
    const animatedComponents = makeAnimated();
    let val = {value:2, label: props.stringTranslate("Conectividade.onlineSePossivel")};
    restricoes.map(prop => {
        if(prop.value === parseInt(valor))
            val = prop;
    })
  
    return(
        <FormGroup>
            <Label>{props.stringTranslate("Coletor.pag.hardware.selectModoConectividade")}</Label>
        <Select   
            isDisabled = {!props.editavel}
            closeMenuOnSelect={false}
            components={animatedComponents}
            defaultValue={val}
            options={restricoes}
            placeholder={""}
            onChange={(e) => handleChange(e)}
        />
        </FormGroup>
    )
  }

function SelectProtocolo(props){
    const [valor, setValor] = React.useState(props.value);
  
    function handleChange(event) {
      val = event;
      setValor(event);
      props.onChangeModeloProtocolo(event);
    }

    const restricoes = [
        {value:0, label:"USB/outros"},
        {value:1, label:"NK-FP v.1"},
        {value:2, label:"NK-FP v.2"},
        {value:3, label:"NK-Door"},
        {value:4, label:"NK-Door 2"},
        {value:6, label:"DC-730/NK-FP3"},
        {value:9, label:"NK-FP5"},
        {value:10,label:"NAC110/GAM110/GAMii"},
        {value:11,label:"NAS220/BCGMG"},
        {value:7,label:"DIMEP TCP/IP"},
        {value:12,label:"TBT220"},
        {value:13,label:"Trix XREP 520"},
        {value:14,label:"Trix/Xpto XTM-Compact"},
        {value:5,label:"Módulo Guarita"},
        {value:16,label:"FaceID"},
        {value:17,label:"Biometrix"},
        {value:18,label:"Biometrix Bio REP-100"},
        {value:19,label:"Anviz"},
        {value:20,label:"Control ID"},
        {value:21,label:"TOPDATA-Inner"},
        {value:22,label:"Mobile"},
        {value:8,label:"Virtual"},
    ];
  
    const animatedComponents = makeAnimated();
    let val = null;
    restricoes.map(prop => {
        if(prop.value === parseInt(valor))
            val = prop;
    })
  
    return(
        <FormGroup>
            <Label>{props.stringTranslate("Coletor.pag.hardware.selectProtocolo")}</Label>
        <Select   
            isDisabled = {!props.editavel}
            closeMenuOnSelect={false}
            components={animatedComponents}
            defaultValue={val}
            options={restricoes}
            placeholder={""}
            onChange={(e) => handleChange(e)}
        />
        </FormGroup>
    )
  }

  function SelectTipoCartao(props){
    const [valor, setValor] = React.useState(props.value);
  
    function handleChange(event) {
      val = event;
      setValor(event);
      props.onChangeValoresModalCartoes(event, "tipoCartao"+props.numCartao);
    }

    const restricoes = [
        {value:0, label: props.stringTranslate("Coletor.pag.hardware.modalCartoes.tipo.opcao.nenhum")},
        {value:1, label: props.stringTranslate("Coletor.pag.hardware.modalCartoes.tipo.opcao.qualquerTipo")},
        {value:2, label: "MIFARE 13.56 MHz"},
        {value:3, label: "RFID 125kHz"},
        {value:4, label: props.stringTranslate("Coletor.pag.hardware.modalCartoes.tipo.opcao.codBarra")},
        {value:5, label: props.stringTranslate("Coletor.pag.hardware.modalCartoes.tipo.opcao.codBarraEngolidor")},
        {value:6, label: props.stringTranslate("Coletor.pag.hardware.modalCartoes.tipo.opcao.multi")},
        {value:7, label: "MIFARE (Neokoros/SRT)"},
        {value:8, label: "Duali"},
        {value:9, label: props.stringTranslate("Coletor.pag.hardware.modalCartoes.tipo.opcao.antenaUHF")},
    ];
  
    const animatedComponents = makeAnimated();
    let val = null;
    restricoes.map(prop => {
        if(prop.value === parseInt(valor))
            val = prop;
    })
  
    return(
        <FormGroup>
            <Label>{props.stringTranslate("Coletor.pag.hardware.selectTipoCartao")+" "+props.numCartao}</Label>
        <Select   
            isDisabled = {!props.editavel}
            closeMenuOnSelect={false}
            components={animatedComponents}
            defaultValue={val}
            options={restricoes}
            placeholder={""}
            onChange={(e) => handleChange(e)}
        />
        </FormGroup>
    )
  }

  function SelectTipoUrnaCartao(props){
    const [valor, setValor] = React.useState(props.value);
  
    function handleChange(event) {
      val = event;
      setValor(event);
      props.onChangeValoresModalCartoes(event, "tipoUrnaCartao");
    }

    const restricoes = [
        {value:0, label: props.stringTranslate("Label.Nenhuma")},
        {value:1, label: props.stringTranslate("Label.Entrada")},
        {value:2, label: props.stringTranslate("Label.Saida")},
    ];
  
    const animatedComponents = makeAnimated();
    let val = null;
    restricoes.map(prop => {
        if(prop.value === parseInt(valor))
            val = prop;
    })
  
    return(
        <FormGroup>
            <Label>{props.stringTranslate("Coletor.pag.hardware.selectTipoUrnaCartao")}</Label>
        <Select   
            isDisabled = {!props.editavel}
            closeMenuOnSelect={false}
            components={animatedComponents}
            defaultValue={val}
            options={restricoes}
            placeholder={""}
            onChange={(e) => handleChange(e)}
        />
        </FormGroup>
    )
  }

  function SelectDirecaoCartao(props){
    const [valor, setValor] = React.useState(props.value);
  
    function handleChange(event) {
      setValor(event);
      props.onChangeValoresModalCartoes(event, "direcaoCartao"+props.numCartao, true);
    }

    const restricoes = [
        {value:1, label: props.stringTranslate("Label.Entrada")},
        {value:2, label: props.stringTranslate("Label.Saida")},
        {value:3, label: props.stringTranslate("Label.LongaDistancia")},
    ];
    const animatedComponents = makeAnimated();

    const options = restricoes.map((prop, key) => {
        return(                
            {value:key,label:prop}
        );
    })
  
    let values = [];
    for (var i = 0, j = props.value.length; i < j; i++){
        values.push(options[props.value[i]-1].label);
    }
    return(
        <FormGroup>
            <Label>{props.stringTranslate("Coletor.pag.hardware.selectDirecaoCartao")}</Label>
        <Select   
            isDisabled = {!props.editavel}
            closeMenuOnSelect={false}
            components={animatedComponents}
            defaultValue={values}
            placeholder={""}
            isMulti
            options={restricoes}
            onChange={(e) => handleChange(e)}
        />
        </FormGroup>
    )
  }

  function SelectIdentificacao(props){
    const [restricao, setRestricao] = React.useState();
    let cartao = false;
    function handleChange(event) {
      cartao = false;
      if (event !== null){
        event.map((prop) =>{
            if (prop.value === 1)
                cartao = true;
        })
      }
      setRestricao(event);
      props.onChangeIdentificacao(event);
    }

    

    const restricoes = [props.stringTranslate("Coletor.pag.hardware.selectIdentificacao.opcao.teclado"),
                        props.stringTranslate("Coletor.pag.hardware.selectIdentificacao.opcao.cartao"),
                        props.stringTranslate("Coletor.pag.hardware.selectIdentificacao.opcao.biometria")];
  
    const animatedComponents = makeAnimated();
    const options = restricoes.map((prop, key) => {
        return(                
            {value:key,label:prop}
        );
    })

    let values = [];
    for (var i = 0, j = props.value.length; i < j; i++){
        if (options[props.value[i]].value === 1)
            cartao = true;
        values.push(options[props.value[i]]);
    }
  
    return(
      <>
      <FormGroup>
          <Label>{props.stringTranslate("Coletor.pag.hardware.selectIdentificacao")}</Label>
      <Select   
        isDisabled = {!props.editavel}   
        isMulti
        defaultValue={values}
        closeMenuOnSelect={false}
        components={animatedComponents}
        options={options}
        placeholder={""}
        onChange={(e) => handleChange(e)}
      />
      </FormGroup>
      {cartao ? <Button onClick={props.toggleModalCartoes}>{props.stringTranslate("Coletor.pag.hardware.opcoesCartao")}</Button> : null}
      </>
    )
  }

  function SelectOperacaoAcionamento(props){
    const [valor, setValor] = React.useState(props.value);
  
    function handleChange(event) {
      setValor(event);
      if (event === null)
        props.mudaOperacao(-1);
      else
        props.mudaOperacao(event.value);
      props.onChangeOperacaoAcionamento(event);
    }

    const restricoes = [props.stringTranslate("Coletor.pag.hardware.modoOperacao.opcao.proprioColetor"),
                        props.stringTranslate("Coletor.pag.hardware.redirecionar")];
  
    const animatedComponents = makeAnimated();
    const options = restricoes.map((prop, key) => {
        return(                
            {value:key,label:prop}
        );
    })
  
    return(
        <FormGroup>
            <Label>{props.stringTranslate("Coletor.pag.hardware.selectAcionamento")}</Label>
        <Select   
          isDisabled = {!props.editavel}
          closeMenuOnSelect={false}
          value={options[valor]}
          components={animatedComponents}
          options={options}
          placeholder={""}
          onChange={(e) => handleChange(e)}
        />
        </FormGroup>
     )
  }



  function SelectOperacaoModos(props){
    const [modo, setModo] = React.useState(false);
    const [selecionado, setSelecionado] = React.useState(null);
    let vet = [
        {value: 0 ,label: props.stringTranslate("Coletor.pag.hardware.operacao.opcao.padraoRelogio")},
        {value: 1 ,label: props.stringTranslate("Coletor.pag.hardware.operacao.opcao.emitirSons")},
        {value: 2 ,label: props.stringTranslate("Coletor.pag.hardware.operacao.opcao.aguardarGiroAbertura")},
        {value: 3 ,label: props.stringTranslate("Coletor.pag.hardware.operacao.opcao.soRegistrarGirar")},
        {value: 4 ,label: props.stringTranslate("Coletor.pag.hardware.operacao.opcao.modoCancela")},
        {value: 5 ,label: props.stringTranslate("Coletor.pag.hardware.operacao.opcao.modoPortaTorniquete")},
        {value: 6, label: props.stringTranslate("Coletor.pag.hardware.operacao.opcao.modoCatraca")},
    ]


    const [restricoes, setRestricao] = React.useState(
        vet
    );

    
  
    function handleChange(event) {
       
      if (event !== null){
        var modoCancela = -1;
        var modoPorta = -1;
        var modoCatraca = -1;
        for(var i = 0, j = event.length; i < j; i++){
            if (event[i].value === 4){
                modoCancela = i;
            }else if (event[i].value === 5){
                modoPorta = i;
            }else if (event[i].value === 6){
                modoCatraca = i;
            }
        }
        if (modoCancela !== -1){
            //event.splice(modoPorta, 1);
            let vet = [
                {value: 0 ,label: props.stringTranslate("Coletor.pag.hardware.operacao.opcao.padraoRelogio")},
                {value: 1 ,label: props.stringTranslate("Coletor.pag.hardware.operacao.opcao.emitirSons")},
                {value: 2 ,label: props.stringTranslate("Coletor.pag.hardware.operacao.opcao.aguardarGiroAbertura")},
                {value: 3 ,label: props.stringTranslate("Coletor.pag.hardware.operacao.opcao.soRegistrarGirar")},
                {value: 4 ,label: props.stringTranslate("Coletor.pag.hardware.operacao.opcao.modoCancela")},
            ];
            setRestricao(
                vet
            )
            props.mudaModoOperacao(0);
        }else if (modoPorta !== -1){
            //event.splice(modoCancela, 1);
            let vet = [
                {value: 0 ,label: props.stringTranslate("Coletor.pag.hardware.operacao.opcao.padraoRelogio")},
                {value: 1 ,label: props.stringTranslate("Coletor.pag.hardware.operacao.opcao.emitirSons")},
                {value: 2 ,label: props.stringTranslate("Coletor.pag.hardware.operacao.opcao.aguardarGiroAbertura")},
                {value: 3 ,label: props.stringTranslate("Coletor.pag.hardware.operacao.opcao.soRegistrarGirar")},
                {value: 5 ,label: props.stringTranslate("Coletor.pag.hardware.operacao.opcao.modoPortaTorniquete")},
            ];
            setRestricao(
                vet
            );
            props.mudaModoOperacao(1);
        }else if (modoCatraca !== -1){
            let vet = [
                {value: 0 ,label: props.stringTranslate("Coletor.pag.hardware.operacao.opcao.padraoRelogio")},
                {value: 1 ,label: props.stringTranslate("Coletor.pag.hardware.operacao.opcao.emitirSons")},
                {value: 2 ,label: props.stringTranslate("Coletor.pag.hardware.operacao.opcao.aguardarGiroAbertura")},
                {value: 3 ,label: props.stringTranslate("Coletor.pag.hardware.operacao.opcao.soRegistrarGirar")},
                {value: 6, label: props.stringTranslate("Coletor.pag.hardware.operacao.opcao.modoCatraca")}
            ];
            setRestricao(
                vet
            );
            props.mudaModoOperacao(2);
        }else{
            let vet =[
                {value: 0 ,label: props.stringTranslate("Coletor.pag.hardware.operacao.opcao.padraoRelogio")},
                {value: 1 ,label: props.stringTranslate("Coletor.pag.hardware.operacao.opcao.emitirSons")},
                {value: 2 ,label: props.stringTranslate("Coletor.pag.hardware.operacao.opcao.aguardarGiroAbertura")},
                {value: 3 ,label: props.stringTranslate("Coletor.pag.hardware.operacao.opcao.soRegistrarGirar")},
                {value: 4 ,label: props.stringTranslate("Coletor.pag.hardware.operacao.opcao.modoCancela")},
                {value: 5 ,label: props.stringTranslate("Coletor.pag.hardware.operacao.opcao.modoPortaTorniquete")},
                {value: 6, label: props.stringTranslate("Coletor.pag.hardware.operacao.opcao.modoCatraca")},
            ];
            setRestricao(
                vet
            );
            props.mudaModoOperacao(-1);
        }
      }else{
        props.mudaModoOperacao(-1);
        let vet = [
            {value: 0 ,label: props.stringTranslate("Coletor.pag.hardware.operacao.opcao.padraoRelogio")},
            {value: 1 ,label: props.stringTranslate("Coletor.pag.hardware.operacao.opcao.emitirSons")},
            {value: 2 ,label: props.stringTranslate("Coletor.pag.hardware.operacao.opcao.aguardarGiroAbertura")},
            {value: 3 ,label: props.stringTranslate("Coletor.pag.hardware.operacao.opcao.soRegistrarGirar")},
            {value: 4 ,label: props.stringTranslate("Coletor.pag.hardware.operacao.opcao.modoCancela")},
            {value: 5 ,label: props.stringTranslate("Coletor.pag.hardware.operacao.opcao.modoPortaTorniquete")},
            {value: 6, label: props.stringTranslate("Coletor.pag.hardware.operacao.opcao.modoCatraca")},
        ];
        setRestricao(
            vet
        )
      }
      props.onChangeOperacaoModos(event);
    }

    let values = [];
    for (var i = 0, j = props.value.length; i < j; i++){
        values.push(restricoes[props.value[i]]);
    }

    if (!modo){
        if (props.modoCatraca){
            props.mudaModoOperacao(2);          
        }
        setSelecionado(values);
        handleChange(values);
        setModo(true);
    }
  
    
    const animatedComponents = makeAnimated();
  
    return(
        <FormGroup>
            <Label>{props.stringTranslate("Coletor.pag.hardware.selectModoOperacao")}</Label>
        <Select   
          isDisabled = {!props.editavel}
          isMulti
          defaultValue={selecionado}
          closeMenuOnSelect={false}
          components={animatedComponents}
          options={restricoes}
          placeholder={""}
          onChange={(e) => handleChange(e)}
        />
        </FormGroup>
     )
  }


  function SelectRedirecionar(props){
    const [reestricao, setRestricao] = React.useState();
    const [valores, setValores] = React.useState([]);

    let id = props.value;
    let coletoresAtivos = [];
  
    function handleChange(event) {
      setValores(event);
      props.onChangeRedirecionar(event);
    }


    function carregaColetoresAtivos(inputValue, callback){
        const body = {
            "cmd": "consultaColetores",
            "token": sessionStorage.getItem("token"),
            "soAtivo": true,
        }
        postAdonis(body, '/Coletor/Index').then((data1) =>{
            if (data1.error === undefined){
                let data = data1.dados;
                coletoresAtivos.push({value: 0, label: props.stringTranslate("Coletor.pag.operacao.redirecionar.sem")});
                data.map((prop) => {
                    if (prop.CodLocalAcesso === props.dados.codLocalAcesso
                        && prop.CodColetor !== props.dados.CodColetor){
                            if (id === prop.CodColetor)
                                setValores({value: prop.CodColetor, label: prop.Nome}); 
                            coletoresAtivos.push({value: prop.CodColetor, label: prop.Nome});
                        }
                })
                if (Boolean(callback) !== false)
                    callback(coletoresAtivos);
            }else{
                toast.error(props.stringTranslate("Error: "+data1.msg), {
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

    const restricoes = [];
  
    const animatedComponents = makeAnimated();
    const options = restricoes.map((prop, key) => {
        return(                
            {label:prop}
        );
    })

  
    return(
        <FormGroup>
            <Label>{props.stringTranslate("Coletor.pag.hardware.coletorParaRedirecionar")}</Label>
        <AsyncSelect 
          loadOptions={(inputValue, callback) => carregaColetoresAtivos(inputValue, callback)}
          isLoading ={true}  
          value={valores}
          isDisabled = {!props.editavel}
          defaultOptions
          components={animatedComponents}
          placeholder={""}
          onChange={(e) => handleChange(e)}
        />
        </FormGroup>
     )
  }

  function Enderecamento(props){
      const [ip, setIp] = React.useState(null);
      const [porta, setPorta] = React.useState(0);
      const [padrao, setPadrao] = React.useState(props.padrao);
      const [configIniciar, setConfigIniciar] = React.useState(props.configIniciar);

      function handleChangeIp(event){
          setIp(event.target.value);
          props.onChangeIp(event);
      }

      function handleChangePorta(event){
          setPorta(event.target.value);
          props.onChangePorta(event);
      }

      function handleChangePadrao(event){
          setPadrao(!padrao);
          props.onChangePadrao();
      }

      function handleChangeConfigIniciar(event){
          setConfigIniciar(!configIniciar);
          props.onChangeConfigIniciar();
      }


      return(<>
        <Row>
            <Card>
                <CardHeader>{props.stringTranslate("Coletor.pag.hardware.enderecamento.titulo")}</CardHeader>
                <CardBody>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label>{props.stringTranslate("Coletor.pag.hardware.enderecamento.ip")}</Label>
                                <Input defaultValue={props.ip} onChange={handleChangeIp} disabled={!props.editavel} type="text"
                                ></Input>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label>{props.stringTranslate("Coletor.pag.hardware.enderecamento.porta")}</Label>
                                <Input defaultValue={props.porta} onChange={handleChangePorta} disabled={!props.editavel} type="text"
                                ></Input>
                            </FormGroup>
                        </Col>
                        {/* <Col>
                            <FormGroup style={{marginTop: "40px"}}> 
                                <Switch
                                    disabled={!props.editavel} 
                                    onChange={handleChangePadrao} 
                                    checked={padrao}  
                                    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)" 
                                    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)" 
                                    height={20}
                                    width={40}
                                    className="react-switch"
                                /> <Label onClick={handleChangePadrao} >{props.stringTranslate("Coletor.pag.hardware.enderecamento.padrao")}</Label>
                            </FormGroup>  
                        </Col> */}
                        <Col>
                            <FormGroup style={{marginTop: "40px"}}> 
                                <Switch
                                    disabled={!props.editavel} 
                                    onChange={handleChangeConfigIniciar} 
                                    checked={configIniciar}  
                                    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)" 
                                    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)" 
                                    height={20}
                                    width={40}
                                    className="react-switch"
                                /> <Label onClick={handleChangeConfigIniciar} >{props.stringTranslate("Coletor.pag.hardware.enderecamento.configIniciar")}</Label>
                            </FormGroup>  
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </Row>
      </>)
  }

  function Acionamentos(props){
    const [dispEntrada, setDispEntrada] = React.useState(0);
    const [dispSaida, setDispSaida] = React.useState(0);
    const [tempEntrada, setTempEntrada] = React.useState(0);
    const [tempSaida, setTempSaida] = React.useState(0);
    const [aguardaMin, setAguardaMin] = React.useState(0);

    function handleChangeDispEntrada(event){
        setDispEntrada(event.target.value);
        props.onChangeDispEntrada(event);
    }

    function handleChangeDispSaida(event){
        setDispSaida(event.target.value);
        props.onChangeDispSaida(event);
    }

    function handleChangeTempEntrada(event){
        setTempEntrada(event.target.value);
        props.onChangeTempoDispEntrada(event);
    }

    function handleChangeTempSaida(event){
        setTempSaida(event.target.value);
        props.onChangeTempoDispSaida(event);
    }

    function handleChangeAguardaMin(event){
        setAguardaMin(event.target.value);
        props.onChangeAguardaMin(event);
    }

    return(<>
        <Row>
            <Card>
                <CardHeader>{props.stringTranslate("Coletor.pag.hardware.acionamentos.titulo")}</CardHeader>
                <CardBody>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label>{props.stringTranslate("Coletor.pag.hardware.acionamentos.dispEntrada")}</Label>
                                <Input defaultValue={props.dispositivoEntrada} onChange={handleChangeDispEntrada} disabled={!props.editavel} type="text"
                                ></Input>
                            </FormGroup>
                        </Col>
                        <Col>  
                            <FormGroup>
                                <Label>{props.stringTranslate("Coletor.pag.hardware.acionamentos.dispSaida")}</Label>
                                <Input defaultValue={props.dispositivoSaida} onChange={handleChangeDispSaida} disabled={!props.editavel} type="text"
                                ></Input>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label>{props.stringTranslate("Coletor.pag.hardware.acionamentos.tempoEntrada")}</Label>
                                <Input defaultValue={props.tempoDispEntrada} onChange={handleChangeTempEntrada} disabled={!props.editavel} type="text"
                                ></Input>
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup>
                                <Label>{props.stringTranslate("Coletor.pag.hardware.acionamentos.tempoSaida")}</Label>
                                <Input defaultValue={props.tempoDispSaida} onChange={handleChangeTempSaida} disabled={!props.editavel} type="text"
                                ></Input>
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup>
                                <Label>{props.stringTranslate("Coletor.pag.hardware.acionamentos.aguardarMinimo")}</Label>
                                <Input defaultValue={props.aguardaMin} onChange={handleChangeAguardaMin} disabled={!props.editavel} type="text"
                                ></Input>
                            </FormGroup>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </Row>
    </>)
  }

  function Sensores(props){
      const [entrada, setEntrada] = React.useState(0);
      const [saida, setSaida] = React.useState(0);
      const [tempoMin, setTempoMin] = React.useState(0);
      const [tempoAbaixado, setBracoAbaixado] = React.useState(0);

    function handleChangeEntrada(event){
        setEntrada(event.target.value);
        props.onChangeSensorEntrada(event);
    }
    function handleChangeSaida(event){
        setSaida(event.target.value);
        props.onChangeSensorSaida(event);
    }
    function handleChangeTempoMin(event){
        setTempoMin(event.target.value);
        props.onChangeTempoMinAcionamento(event);
    }
    function handleChangeBracoAbaixado(event){
        setBracoAbaixado(event.target.value);
        props.onChangeBracoAbaixado(event);
    }

      return(<>
        <Row>
            <Card>
                <CardHeader>{props.stringTranslate("Coletor.pag.hardware.sensores.titulo")}</CardHeader>
                <CardBody>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label>{props.stringTranslate("Coletor.pag.hardware.sensores.entrada")}</Label>
                                <Input defaultValue={props.sensorEntrada} onChange={handleChangeEntrada} disabled={!props.editavel} type="text"
                                ></Input>
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup>
                                <Label>{props.stringTranslate("Coletor.pag.hardware.sensores.saida")}</Label>
                                <Input defaultValue={props.sensorSaida} onChange={handleChangeSaida} disabled={!props.editavel} type="text"
                                ></Input>
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup>
                                <Label>{props.stringTranslate("Coletor.pag.hardware.sensores.aguardaMin")}</Label>
                                <Input defaultValue={props.tempoMinAcionamento} onChange={handleChangeTempoMin} disabled={!props.editavel} type="text"
                                ></Input>
                            </FormGroup>
                        </Col>
                        {props.modoCancela ? (
                            <Col>
                                <FormGroup>
                                    <Label>{props.stringTranslate("Coletor.pag.hardware.sensores.bracoAbaixado")}</Label>
                                    <Input defaultValue={props.bracoAbaixado} onChange={handleChangeBracoAbaixado} disabled={!props.editavel} type="text"
                                    ></Input>
                                </FormGroup>
                            </Col>
                        ) : null}
                    </Row>
                </CardBody>
            </Card>
        </Row>
      </>)
  }


  function ModoCatraca(props){
      const [tempoMin, setTempoMin] = React.useState(0);
      const [tempoAcio, setTempoAci] = React.useState(0);
      const [direcao, setDirecao] = React.useState(props.direcao);

      function handleChangeDirecao(event){
          setDirecao(event.value);
          props.onChangeDirecaoCatraca(event);
      }

      function handleChangeAguardaMin(event){
        setTempoMin(event.target.value);
        props.onChangeAguardaMin(event);
      }

      function handleChangeTempoDisp(event){
          setTempoAci(event.target.value);
          props.onChangeTempoDispEntrada(event);
          props.onChangeTempoDispSaida(event);
      }

      const options = [
          {value: {entrada: 1, saida: 2}, label: (props.stringTranslate("Coletor.pag.hardware.catraca.dir.opcao1P1")+
          props.dispositivoSaida+props.stringTranslate("Coletor.pag.hardware.catraca.dir.opcao1P2")+
          props.dispositivoEntrada+props.stringTranslate("Coletor.pag.hardware.catraca.dir.opcao1P3"))},

          {value: {entrada: 2, saida: 1}, label: (props.stringTranslate("Coletor.pag.hardware.catraca.dir.opcao2P1")+
          props.dispositivoEntrada+props.stringTranslate("Coletor.pag.hardware.catraca.dir.opcao2P2")+
          props.dispositivoSaida+props.stringTranslate("Coletor.pag.hardware.catraca.dir.opcao2P3"))},
      ]

      let val = 0;
      if (parseInt(props.sensorEntrada) === 102){
        val = 1;
      }

      const animatedComponents = makeAnimated();
      return(<>
        <Row>
            <Card>
                <CardHeader>{props.stringTranslate("Coletor.pag.hardware.catraca.titulo")}</CardHeader>
                <CardBody>
                    <Row>
                        <Col>
                            <Select   
                            isDisabled = {!props.editavel}
                            defaultValue={options[val]}
                            components={animatedComponents}
                            options={options}
                            placeholder={""}
                            onChange={handleChangeDirecao}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label>{props.stringTranslate("Coletor.pag.hardware.catraca.tempoAcionamento")}</Label>
                                <Input defaultValue={props.tempoDispEntrada} onChange={handleChangeTempoDisp} disabled={!props.editavel} type="text"
                                ></Input>
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup>
                                <Label>{props.stringTranslate("Coletor.pag.hardware.catraca.tempoMinAguardar")}</Label>
                                <Input defaultValue={props.aguardaMin} onChange={handleChangeAguardaMin} disabled={!props.editavel} type="text"
                                ></Input>
                            </FormGroup>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </Row>
      </>)
  }

class Hardware extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            coletoresAtivos: [],



            operacao: this.props.stateP.operacao,
            togglePulsarExpirar:  this.props.stateP.togglePulsarExpirar,
            toggleMonitorarPorta: this.props.stateP.toggleMonitorarPorta,
            toggleTratarSinaleira: this.props.stateP.toggleTratarSinaleira,
            modoOperacao: -1,
            modeloProtocolo: this.props.stateP.modeloProtocolo,
            modoCatraca: this.props.stateP.modeloProtocolo,
            identificacao: this.props.stateP.identificacao,
            operacaoAcionamento: this.props.stateP.operacaoAcionamento,
            operacaoModos: this.props.stateP.operacaoModos,
            retardo: this.props.stateP.retardo,
            forcarModo: this.props.stateP.forcarModo,
            coletorRedirecionar: this.props.stateP.coletorRedirecionar,

            ip: this.props.stateP.ip,
            porta: this.props.stateP.porta,
            padraoEnderecamento: this.props.stateP.padraoEnderecamento,
            configIniciar: this.props.stateP.configIniciar,

            dispositivoEntrada: this.props.stateP.dispositivoEntrada,
            dispositivoSaida: this.props.stateP.dispositivoSaida,
            tempoDispEntrada: this.props.stateP.tempoDispEntrada,
            tempoDispSaida : this.props.stateP.tempoDispSaida,
            aguardarMin: this.props.stateP.aguardaMin,
            bracoAbaixado: this.props.stateP.bracoAbaixado,

            sensoresEntrada: this.props.stateP.sensoresEntrada,
            sensoresSaida: this.props.stateP.sensoresSaida,
            tempoMinAcionamento: this.props.stateP.tempoMinAcionamento,
            modoConectividade: this.props.stateP.modoConectividade,


            modalCartoes: false,
        }

        this.editavel = this.props.editavel;

        this.stringTranslate = this.stringTranslate.bind(this);
        this.toggleMonitorarPorta = this.toggleMonitorarPorta.bind(this);
        this.togglePulsarExpirar = this.togglePulsarExpirar.bind(this);
        this.toggleTratarSinaleira = this.toggleTratarSinaleira.bind(this);
        this.mudaOperacao = this.mudaOperacao.bind(this);
        this.mudaModoOperacao = this.mudaModoOperacao.bind(this);

        this.handleChangeModeloProtocolo = this.handleChangeModeloProtocolo.bind(this);
        this.handleChangeIdentificacao = this.handleChangeIdentificacao.bind(this);
        this.handleChangeOperacaoAcionamento = this.handleChangeOperacaoAcionamento.bind(this);
        this.handleChangeOperacaoModos = this.handleChangeOperacaoModos.bind(this);
        this.handleChangeRetardo = this.handleChangeRetardo.bind(this);
        this.handleChangeForcarModo = this.handleChangeForcarModo.bind(this);
        this.handleChangeColetorRedirecionar = this.handleChangeColetorRedirecionar.bind(this);

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
        this.handleChangeDirecaoCatraca = this.handleChangeDirecaoCatraca.bind(this);
        this.handleChangeModoConectividade = this.handleChangeModoConectividade.bind(this);
        this.handleChangeConfigIniciar = this.handleChangeConfigIniciar.bind(this);
        this.handleChangeBracoAbaixado = this.handleChangeBracoAbaixado.bind(this);

        this.handleClickSalvarCartoes = this.handleClickSalvarCartoes.bind(this);
        this.handleClickCancelarCartoes = this.handleClickCancelarCartoes.bind(this);
        this.handleClickSairCartoes = this.handleClickSairCartoes.bind(this);
        this.toggleModalCartoes = this.toggleModalCartoes.bind(this);
    }

    

    handleChangeModeloProtocolo(event){
        if (event.value === 11)
            this.state.modoCatraca = true;
        else{
            this.state.modoCatraca = false;
            if (this.state.modoOperacao === 2)
                this.setState({modoOperacao: -1})
        }
        this.setState({modeloProtocolo: event.value});
        this.props.HF.handleChangeModeloProtocolo(event);
    }
    handleChangeIdentificacao(event){
        if (event !== null)
            this.setState({identificacao: event.map((prop) => {return prop.value})});
        else 
            this.setState({identificacao: []});
        this.props.HF.handleChangeIdentificacao(event);
    }
    handleChangeOperacaoAcionamento(event){
        this.setState({operacaoAcionamento: event.value});
        this.props.HF.handleChangeOperacaoAcionamento(event);
    }
    handleChangeOperacaoModos(event){
        if (event !== null)
            this.setState({operacaoModos: event.map((prop) => {return prop.value})});
        else 
            this.setState({operacaoModos: []});
        this.props.HF.handleChangeOperacaoModos(event);
    }
    handleChangeRetardo(event){
        this.setState({retardo: event.target.value});
        this.props.HF.handleChangeRetardo(event);
    }
    handleChangeForcarModo(event){
        this.setState({forcarModo: event.target.value});
        this.props.HF.handleChangeForcarModo(event);
    }
    handleChangeColetorRedirecionar(event){
        if (event !== null)
            this.setState({coletorRedirecionar: event});
        else
            this.setState({coletorRedirecionar: null})
        this.props.HF.handleChangeColetorRedirecionar(event);
    }

    toggleMonitorarPorta(){
        let val = !this.state.toggleMonitorarPorta;
        this.setState({toggleMonitorarPorta: val});
        this.props.HF.handleChangeMonitorarPorta(val);
    }

    toggleTratarSinaleira(){
        let val = !this.state.toggleTratarSinaleira;
        this.setState({toggleTratarSinaleira: val});
        this.props.HF.handleChangeTratarSinaleira(val);
    }

    togglePulsarExpirar(){
        let val = !this.state.togglePulsarExpirar;
        this.setState({togglePulsarExpirar: val});
        this.props.HF.handleChangePulsarExpirar(val);
    }

    handleChangeIp(event){
        this.setState({ip: event.target.value});
        this.props.HF.handleChangeIp(event);
    }
    handleChangePorta(event){
        var val = event.target.value !== '' ? event.target.value : null;
        this.setState({porta: val});
        this.props.HF.handleChangePorta(event);
    }
    handleChangePadraoEnderecamento(event){
        let val = !this.state.padraoEnderecamento;
        this.setState({padraoEnderecamento: val});
        this.props.HF.handleChangePadraoEnderecamento(val);
    }
    handleChangeConfigIniciar(event){
        let val = !this.state.configIniciar;
        this.setState({configIniciar: val});
        this.props.HF.handleChangeConfigIniciar(val);
    }
    handleChangeDispositivoEntrada(event){
        this.setState({dispositivoEntrada: event.target.value})
        this.props.HF.handleChangeDispositivoEntrada(event);
    }
    handleChangeDispositivoSaida(event){
        this.setState({dispositivoSaida: event.target.value});
        this.props.HF.handleChangeDispositivoSaida(event);
    }
    handleChangeTempoDispEntrada(event){
        this.setState({tempoDispEntrada: event.target.value});
        this.props.HF.handleChangeTempoDispEntrada(event);
    }
    handleChangeTempoDispSaida(event){
        this.setState({tempoDispSaida: event.target.value});
        this.props.HF.handleChangeTempoDispSaida(event);
    }
    handleChangeAguardaMin(event){
        this.setState({aguardaMin: event.target.value});
        this.props.HF.handleChangeAguardaMin(event);
    }
    handleChangeSensoresEntrada(event){
        this.setState({sensoresEntrada: event.target.value});
        this.props.HF.handleChangeSensoresEntrada(event);
    }
    handleChangeSensoresSaida(event){
        this.setState({sensoresSaida: event.target.value});
        this.props.HF.handleChangeSensoresSaida(event);
    }
    handleChangeTempoMinAcionamento(event){
        this.setState({tempoMinAcionamento: event.target.value});
        this.props.HF.handleChangeTempoMinAcionamento(event);
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
        this.props.HF.handleChangeDirecaoCatraca(event);
    }

    handleChangeModoConectividade(event){
        this.setState({modoConectividade: event.value});
        this.props.HF.handleChangeModoConectividade(event);
    }

    handleChangeBracoAbaixado(event){
        this.setState({bracoAbaixado: event.target.value});
        this.props.HF.handleChangeBracoAbaixado(event);
    }


    stringTranslate(id){
        return this.props.intl.formatMessage({id: id});
    }
    mudaOperacao(modo){
        this.setState({operacao: modo});
    }

    mudaModoOperacao(modo){
        this.setState({modoOperacao: modo})
    }


    handleClickSalvarCartoes(){
        this.toggleModalCartoes();
    }

    handleClickCancelarCartoes(){
        this.props.HF.cancelaModalCartoes();
        this.toggleModalCartoes();
    }

    handleClickSairCartoes(){
        this.toggleModalCartoes();
    }
    

    toggleModalCartoes(){
        this.setState({modalCartoes: !this.state.modalCartoes});
    }

    render(){
        switch(parseInt(this.state.modeloProtocolo)){
            case 11:
                this.enderecamento = <Enderecamento 
                ip={this.state.ip} onChangeIp={this.handleChangeIp} 
                porta={this.state.porta} onChangePorta={this.handleChangePorta}
                configIniciar={this.state.configIniciar} onChangeConfigIniciar={this.handleChangeConfigIniciar}
                padrao={this.state.padraoEnderecamento} onChangePadrao={this.handleChangePadraoEnderecamento}
                editavel={this.editavel}
                stringTranslate={this.stringTranslate} />

                this.acionamentos = <Acionamentos 
                dispositivoEntrada={this.state.dispositivoEntrada} onChangeDispEntrada={this.handleChangeDispositivoEntrada}
                dispositivoSaida={this.state.dispositivoSaida} onChangeDispSaida={this.handleChangeDispositivoSaida}
                tempoDispEntrada={this.state.tempoDispEntrada} onChangeTempoDispEntrada={this.handleChangeTempoDispEntrada}
                tempoDispSaida={this.state.tempoDispSaida} onChangeTempoDispSaida={this.handleChangeTempoDispSaida}
                aguardaMin={this.state.aguardarMin} onChangeAguardaMin={this.handleChangeAguardaMin}
                editavel={this.editavel}
                stringTranslate={this.stringTranslate} />

                this.sensores = (<Sensores 
                sensorEntrada={this.state.sensoresEntrada} onChangeSensorEntrada={this.handleChangeSensoresEntrada}
                sensorSaida={this.state.sensoresSaida} onChangeSensorSaida={this.handleChangeSensoresSaida}
                bracoAbaixado={this.state.bracoAbaixado} onChangeBracoAbaixado={this.handleChangeBracoAbaixado}
                tempoMinAcionamento={this.state.tempoMinAcionamento} onChangeTempoMinAcionamento={this.handleChangeTempoMinAcionamento}
                editavel={this.editavel}
                stringTranslate={this.stringTranslate}
                modoCancela={this.state.modoOperacao === 0 ? true : false}
                />)

                this.catraca =
                (<ModoCatraca 
                dispositivoEntrada={this.state.dispositivoEntrada} onChangeDispEntrada={this.handleChangeDispositivoEntrada}
                dispositivoSaida={this.state.dispositivoSaida} onChangeDispSaida={this.handleChangeDispositivoSaida}
                sensorEntrada={this.state.sensoresEntrada}
                tempoDispEntrada={this.state.tempoDispEntrada} onChangeTempoDispEntrada={this.handleChangeTempoDispEntrada}
                tempoDispSaida={this.state.tempoDispSaida} onChangeTempoDispSaida={this.handleChangeTempoDispSaida}
                aguardaMin={this.state.aguardarMin} onChangeAguardaMin={this.handleChangeAguardaMin}
                onChangeDirecaoCatraca={this.handleChangeDirecaoCatraca}
                editavel={this.editavel}
                stringTranslate={this.stringTranslate}
                />)

                this.conectividade = 
                (<SelectModoConectividade
                editavel={this.editavel}
                value={this.state.modoConectividade}
                stringTranslate={this.stringTranslate}
                onChangeModoConectividade={this.handleChangeModoConectividade}
                />)

                break;
            default:
                this.enderecamento = null;
                this.acionamentos = null;
                this.sensores = null;
                this.catraca = null;
                this.conectividade = null;
                break;
        }
        return(
            <>
                <div>
                    <Card>
                        <CardHeader>
                            <h4>{this.stringTranslate("Coletor.pag.hardware.titulo")}</h4>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col>
                                    <SelectProtocolo value={this.state.modeloProtocolo} onChangeModeloProtocolo={this.handleChangeModeloProtocolo} editavel={this.editavel} stringTranslate={this.stringTranslate} />
                                </Col>
                                <Col>
                                    <SelectIdentificacao value={this.state.identificacao} onChangeIdentificacao={this.handleChangeIdentificacao} editavel={this.editavel} stringTranslate={this.stringTranslate} toggleModalCartoes={this.toggleModalCartoes} />
                                </Col>
                                <Col>
                                    <SelectOperacaoAcionamento value={this.state.operacaoAcionamento} onChangeOperacaoAcionamento={this.handleChangeOperacaoAcionamento} mudaOperacao={this.mudaOperacao} editavel={this.editavel} stringTranslate={this.stringTranslate} />
                                </Col>
                            </Row>
                            {this.enderecamento}
                            {this.state.operacaoAcionamento !== -1 ? 
                            (
                                <>
                                    <Row>
                                        <Card>
                                            <CardHeader>
                                                    {this.state.operacaoAcionamento === 0 ? (
                                                        <h4>{this.stringTranslate("Coletor.pag.hardware.operacao")}</h4>
                                                    ): (
                                                        <h4>{this.stringTranslate("Coletor.pag.hardware.redirecionar")}</h4>
                                                    )}
                                            </CardHeader>
                                            <CardBody>
                                                    {this.state.operacaoAcionamento === 0 ? (
                                                        <>
                                                            <Row>
                                                                <Col>
                                                                    <SelectOperacaoModos modoCatraca={this.state.modoCatraca} value={this.state.operacaoModos} onChangeOperacaoModos={this.handleChangeOperacaoModos} mudaModoOperacao={this.mudaModoOperacao} modoOperacao={this.state.modoOperacao} stringTranslate={this.stringTranslate} editavel={this.editavel} />
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                            {this.state.modoOperacao !== -1 ? (
                                                                this.state.modoOperacao === 0 ? (
                                                                    <>    
                                                                        <Col>
                                                                            <FormGroup style={{marginTop: "40px"}}> 
                                                                                <Switch 
                                                                                    disabled={!this.editavel}
                                                                                    onChange={this.toggleMonitorarPorta} 
                                                                                    checked={this.state.toggleMonitorarPorta}  
                                                                                    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)" 
                                                                                    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)" 
                                                                                    height={20}
                                                                                    width={40}
                                                                                    className="react-switch"
                                                                                /> <Label onClick={this.toggleMonitorarPorta} >{this.stringTranslate("Coletor.pag.hardware.operacao.tratarSinaleira")}</Label>
                                                                            </FormGroup>  
                                                                        </Col>
                                                                        <Col>
                                                                            <FormGroup style={{marginTop: "40px"}}> 
                                                                                <Switch
                                                                                    disabled={!this.editavel} 
                                                                                    onChange={this.togglePulsarExpirar} 
                                                                                    checked={this.state.togglePulsarExpirar}  
                                                                                    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)" 
                                                                                    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)" 
                                                                                    height={20}
                                                                                    width={40}
                                                                                    className="react-switch"
                                                                                /> <Label onClick={this.togglePulsarExpirar} >{this.stringTranslate("Coletor.pag.hardware.operacao.pulsarExpirar")}</Label>
                                                                            </FormGroup>  
                                                                        </Col>
                                                                        <Col>
                                                                            <FormGroup>
                                                                                <Label>{this.stringTranslate("Coletor.pag.hardware.operacao.retardo")}</Label>
                                                                                <Input defaultValue={this.state.retardo} onChange={this.handleChangeRetardo} disabled={!this.editavel} type="text"
                                                                                mask="9999999999999999999" maskChar={null}
                                                                                tag={InputMask}
                                                                                ></Input>
                                                                            </FormGroup>
                                                                        </Col>
                                                                    </>
                                                                ):
                                                                (
                                                                    <>
                                                                        <Col>
                                                                            <FormGroup style={{marginTop: "40px"}}> 
                                                                                <Switch 
                                                                                    disabled={!this.editavel}
                                                                                    onChange={this.toggleMonitorarPorta} 
                                                                                    checked={this.state.toggleMonitorarPorta}  
                                                                                    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)" 
                                                                                    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)" 
                                                                                    height={20}
                                                                                    width={40}
                                                                                    className="react-switch"
                                                                                /> <Label onClick={this.toggleMonitorarPorta} >{this.stringTranslate("Coletor.pag.hardware.operacao.monitorarPorta")}</Label>
                                                                            </FormGroup>  
                                                                        </Col>
                                                                    </>
                                                                )
                                                            ): null}
                                                                <Col md={3}>
                                                                    <FormGroup>
                                                                        <Label>{this.stringTranslate("Coletor.pag.hardware.operacao.forcarModo")}</Label>
                                                                        <Input defaultValue={this.state.forcarModo} onChange={this.handleChangeForcarModo} disabled={!this.editavel} type="text"
                                                                        ></Input>
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                            {this.state.modoOperacao !== 2 ? (
                                                                <>
                                                                {this.acionamentos}
                                                                {this.sensores}
                                                                </>
                                                            ) :
                                                            (
                                                                <>
                                                                {this.catraca}
                                                                </>
                                                            )}
                                                            
                                                        </>
                                                    ): (
                                                        <>
                                                            <Row>
                                                                <Col>
                                                                    <SelectRedirecionar value={this.state.coletorRedirecionar} dados={this.props.dados} onChangeRedirecionar={this.handleChangeColetorRedirecionar} editavel={this.editavel} stringTranslate={this.stringTranslate} />
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col>
                                                                    {this.stringTranslate("Coletor.pag.operacao.redirecionar.aviso")}
                                                                </Col>
                                                            </Row>
                                                        </>
                                                    )}
                                                {this.conectividade}
                                            </CardBody>
                                        </Card>
                                    </Row>
                                </>
                            ) :null}
                        </CardBody>
                    </Card>
                    {this.state.modalCartoes ? (
                        
                    
                        <Modal title={this.stringTranslate("Coletor.Hardware.OpcoesCartao")}
                        visible={this.state.modalCartoes}
                        onOk={this.editavel ? this.handleClickSalvarCartoes : this.handleClickSairCartoes}
                        onCancel={this.handleClickCancelarCartoes}
                        zIndex={1051}
                        cancelButtonProps={{style:{visibility: this.editavel ? "visible" : "hidden"}}}
                        style={{minWidth:"70%"}}
                        >
                            <Card>
                                <CardHeader>{this.stringTranslate("Coletor.pag.hardware.cartoes.leitores")}</CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col>
                                            <Form layout="vertical">
                                                <Form.Item label={this.stringTranslate("Label.Numero")+" "+this.stringTranslate("Label.Cartao")+" 1"}>
                                                    <InputNumber value={this.props.modalCartoesValores["numCartao1"]} onChange={(event) => this.props.HF.handleChangeModalCartoes(event, "numCartao1")} min={0} defaultValue={0}/>
                                                </Form.Item>
                                            </Form>
                                        </Col>
                                        <Col>
                                            <SelectTipoCartao 
                                            value={this.props.modalCartoesValores["tipoCartao1"]} 
                                            onChangeValoresModalCartoes={(event) => this.props.HF.handleChangeModalCartoes(event.value, 'tipoCartao1')} 
                                            editavel={this.editavel} 
                                            stringTranslate={this.stringTranslate} 
                                            numCartao="1" />
                                        </Col>
                                        <Col>
                                            <SelectDirecaoCartao value={this.props.modalCartoesValores["direcaoCartao1"]} onChangeValoresModalCartoes={this.props.HF.handleChangeModalCartoes} editavel={this.editavel} stringTranslate={this.stringTranslate} numCartao="1" />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Form layout="vertical">
                                                <Form.Item label={this.stringTranslate("Label.Numero")+" "+this.stringTranslate("Label.Cartao")+" 2"}>
                                                    <InputNumber value={this.props.modalCartoesValores["numCartao2"]} onChange={(event) => this.props.HF.handleChangeModalCartoes(event, "numCartao2")} min={0} defaultValue={0}/>
                                                </Form.Item>
                                            </Form>
                                        </Col>
                                        <Col>
                                            <SelectTipoCartao 
                                            value={this.props.modalCartoesValores["tipoCartao2"]} 
                                            onChangeValoresModalCartoes={(event) => this.props.HF.handleChangeModalCartoes(event.value, 'tipoCartao2')} 
                                            editavel={this.editavel} 
                                            stringTranslate={this.stringTranslate} 
                                            numCartao="2" />
                                        </Col>
                                        <Col>
                                            <SelectDirecaoCartao value={this.props.modalCartoesValores["direcaoCartao2"]} onChangeValoresModalCartoes={this.props.HF.handleChangeModalCartoes} editavel={this.editavel} stringTranslate={this.stringTranslate} numCartao="2" />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Form layout="vertical">
                                                <Form.Item label={this.stringTranslate("Label.Numero")+" "+this.stringTranslate("Label.Cartao")+" 3"}>
                                                    <InputNumber value={this.props.modalCartoesValores["numCartao3"]} onChange={(event) => this.props.HF.handleChangeModalCartoes(event, "numCartao3")} min={0} defaultValue={0}/>
                                                </Form.Item>
                                            </Form>
                                        </Col>
                                        <Col>
                                            <SelectTipoCartao 
                                            value={this.props.modalCartoesValores["tipoCartao3"]} 
                                            onChangeValoresModalCartoes={(event) => this.props.HF.handleChangeModalCartoes(event.value, 'tipoCartao3')} 
                                            editavel={this.editavel} 
                                            stringTranslate={this.stringTranslate} 
                                            numCartao="3" />
                                        </Col>
                                        <Col>
                                            <SelectDirecaoCartao value={this.props.modalCartoesValores["direcaoCartao3"]} onChangeValoresModalCartoes={this.props.HF.handleChangeModalCartoes} editavel={this.editavel} stringTranslate={this.stringTranslate} numCartao="3" />
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                            <Card>
                                <CardHeader>{this.stringTranslate("Coletor.pag.hardware.cartoes.antenauhf")}</CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col>
                                            <Form layout="vertical">
                                                <Form.Item label={this.stringTranslate("Coletor.pag.hardware.modalCartoes.enderecoIP")}>
                                                    <Input value={this.props.modalCartoesValores["enderecoIP"]} onChange={(event) => this.props.HF.handleChangeModalCartoes(event.target.value, "enderecoIP")}/>
                                                </Form.Item>
                                            </Form>
                                        </Col>
                                        <Col>
                                            <Form layout="vertical">
                                                <Form.Item label={this.stringTranslate("Coletor.pag.hardware.modalCartoes.porta")}>
                                                    <Input value={this.props.modalCartoesValores["portaTCPAntena"]} onChange={(event) => this.props.HF.handleChangeModalCartoes(event.target.value, "portaTCPAntena")}/>
                                                </Form.Item>
                                            </Form>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                            <Card>
                                <CardHeader>{this.stringTranslate("Coletor.pag.hardware.cartoes.leitores")}</CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col>
                                            <SelectTipoUrnaCartao 
                                            value={this.props.modalCartoesValores["tipoUrna"]} 
                                            onChangeValoresModalCartoes={(event) => this.props.HF.handleChangeModalCartoes(event.value, "tipoUrna")} 
                                            editavel={this.editavel} 
                                            stringTranslate={this.stringTranslate} />
                                        </Col>
                                        <Col>
                                            <Form layout="vertical">
                                                <Form.Item label={this.stringTranslate("Coletor.pag.hardware.modalCartoes.sensorPassagem")}>
                                                    <InputNumber value={this.props.modalCartoesValores["sensorPassagem"]} onChange={(event) => this.props.HF.handleChangeModalCartoes(event, "sensorPassagem")} min={0} defaultValue={0}/>
                                                </Form.Item>
                                            </Form>
                                        </Col>
                                        <Col>
                                            <Form layout="vertical">
                                                <Form.Item label={this.stringTranslate("Coletor.pag.hardware.modalCartoes.acionarDispositivo")}>
                                                    <InputNumber value={this.props.modalCartoesValores["acionarDispositivo"]} onChange={(event) => this.props.HF.handleChangeModalCartoes(event, "acionarDispositivo")} min={0} defaultValue={0}/>
                                                </Form.Item>
                                            </Form>
                                        </Col>
                                        <Col>
                                            <FormGroup style={{marginTop: "-0.7px"}}> 
                                                <Label onClick={(event) => this.props.HF.handleChangeModalCartoes(event, "leitorUrna")} >{this.stringTranslate("Coletor.pag.hardware.modalCartoes.leitorUrna")}</Label>
                                                <Switch
                                                    disabled={!this.editavel} 
                                                    onChange={(event) => this.props.HF.handleChangeModalCartoes(event, "leitorUrna")} 
                                                    checked={this.props.modalCartoesValores["leitorUrna"]}  
                                                    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)" 
                                                    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)" 
                                                    height={20}
                                                    width={40}
                                                    className="react-switch"
                                                />                                         
                                            </FormGroup>  
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                            <Card>
                                <CardHeader>{this.stringTranslate("Coletor.pag.hardware.cartoes.longaDistancia")}</CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col>
                                            <Form layout="vertical">
                                                <Form.Item label={this.stringTranslate("Coletor.pag.hardware.modalCartoes.intervaloLeitura")}>
                                                    <InputNumber value={this.props.modalCartoesValores["intervaloLeitura"]} onChange={(event) => this.props.HF.handleChangeModalCartoes(event, "intervaloLeitura")} min={0} defaultValue={0}/>
                                                </Form.Item>
                                            </Form>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Modal>
                    ) : null}
                </div>
            </>
        )
    }
}

export default injectIntl(Hardware);