import React from "react";
import ReactDOM from "react-dom";
import NKBITWebSocket from "../../../utils/nkbitweb";
import { injectIntl } from "react-intl";
import Switch from "react-switch";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import makeAnimated from "react-select/animated";


import {
  Card,
  CardHeader,
  CardBody,
  //CardFooter,
  Row,
  Col,
  Input,
  FormGroup,
  Label,
} from "reactstrap";

var nkbit = new NKBITWebSocket("ws://localhost:5109");

nkbit.onopen = function(e) {
    console.log("Connected to NK-BIT");
  };
  
  
// onclose event: same as WebSocket onclose
nkbit.onclose = function(event) {
if (event.wasClean) {
    console.log(`Connection closed cleanly, code=${event.code} reason=${event.reason}`);
} else {
    console.log(`Connection died: code=${event.code}`);
}
};

// onerror: same as WebSocket onerror
nkbit.onerror = function(error) {
    console.log(`[error] ${error.message}`);
};


function validaBooleanString(string){
    if (string === "False" || string === "false" || string === "F" || string === "f")
        return false;
    else
        return true;
}



function SelectLeitor(props){
    const [valor, setValor] = React.useState(null);
  
    function handleChange(event) {
      setValor(event);
      if(props.num === 2)
        props.onChangeSegundoLeitor(event);
      else
        props.onChangeNumeroSerie(event);
    }

//    let options = null;
    const animatedComponents = makeAnimated();
//     if (Boolean(leitores)){
//         options = leitores.map((prop, key) => {
//             return(                
//                 {value:key,label:prop}
//             );
//         })
//     }

    return(
      <FormGroup>
          <Label>{props.stringTranslate("Coletor.pag.biometria.leitor")}</Label>
      <AsyncSelect
        isLoading
        value={valor}
        defaultOptions
        loadOptions={(inputValue, callback) => props.load(inputValue, callback, setValor, props.num)}
        isDisabled = {!props.editavel}   
        closeMenuOnSelect={false}
        components={animatedComponents}
        placeholder={""}
        onChange={(e) => handleChange(e)}
      />
      </FormGroup>
    )
  }

  function DirecaoLeitores(props){
    const [entrada, setEntrada] = React.useState(props.entrada);
    const [saida, setSaida] = React.useState(props.saida);
    const [outros, setOutros] = React.useState(props.outros);

  
    function handleChangeEntrada(event) {
      setEntrada(event);
      props.onChangeEntrada(event)
    }

    function handleChangeSaida(event) {
        setSaida(event);
        props.onChangeSaida(event)
    }

    function handleChangeOutros(event) {
        setOutros(event);
        props.onChangeOutros(event)
    }

    const animatedComponents = makeAnimated();

    const options = [
        {label:props.stringTranslate("Coletor.pag.biometria.direcaoLeitores.entrada"), value:0},
        {label:props.stringTranslate("Coletor.pag.biometria.direcaoLeitores.saida"), value:1},
        {label:props.stringTranslate("Coletor.pag.biometria.direcaoLeitores.entradaSaida"), value:2},
        {label:props.stringTranslate("Coletor.pag.biometria.direcaoLeitores.negarAcesso"), value:3},
    ]

    return(<>
        <Card>
            <CardHeader>{props.stringTranslate("Coletor.pag.biometria.direcaoLeitores")}</CardHeader>
            <CardBody>
                <Row>
                    <Col>
                        <FormGroup>
                            <Label>{props.stringTranslate("Coletor.pag.biometria.outrosLeitores")}</Label>
                        <Select   
                            isDisabled = {props.editavel}   
                            closeMenuOnSelect={false}
                            components={animatedComponents}
                            options={options}
                            value={options[outros]}
                            defaultValue={options[0]}
                            onChange={(e) => handleChangeOutros(e)}
                        />
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <Label>{props.stringTranslate("Coletor.pag.biometria.leitorEntrada")}</Label>
                            <Input disabled={props.editavel} defaultValue={entrada} onChange={handleChangeEntrada} type="text" />
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <Label>{props.stringTranslate("Coletor.pag.biometria.leitorSaida")}</Label>
                            <Input disabled={props.editavel} defaultValue={saida} onChange={handleChangeSaida} type="text" />
                        </FormGroup>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    </>)
  }


class Biometria extends React.Component{
    constructor(props){
        super(props)
        this.state ={
            nd: true,
            readers: [],
            haLeitor: false,
            leitorSelecionado1: null,
            leitorSelecionado2: null,

            numeroSerie: this.props.stateP.numeroSerie,
            resolucao: this.props.stateP.resolucao,
            padrao: this.props.stateP.padrao,
            segundoLeitor: this.props.stateP.segundoLeitor,

            direcaoEntrada: this.props.stateP.direcaoEntrada,
            direcaoSaida: this.props.stateP.direcaoSaida,
            direcaoOutros: this.props.stateP.direcaoOutros,
        }
        this.editavel = this.props.editavel;
        this.stringTranslate = this.stringTranslate.bind(this);

        this.handleChangeNumeroSerie = this.handleChangeNumeroSerie.bind(this);
        this.handleChangeResolucao = this.handleChangeResolucao.bind(this);
        this.handleChangePadrao = this.handleChangePadrao.bind(this);
        this.handleChangeSegundoLeitor = this.handleChangeSegundoLeitor.bind(this);
        this.handleChangeEntrada = this.handleChangeEntrada.bind(this);
        this.handleChangeSaida = this.handleChangeSaida.bind(this);
        this.handleChangeOutros = this.handleChangeOutros.bind(this);

        //nkbitWeb
        this.biometrico = this.biometrico.bind(this);
        this.onSetReader = this.onSetReader.bind(this);
        this.onDetectReader = this.onDetectReader.bind(this);
        this.connect = this.connect.bind(this);
        this.detect = this.detect.bind(this);
        this.startCapture = this.startCapture.bind(this);
        this.stopCapture = this.stopCapture.bind(this);
        this.load = this.load.bind(this);

        nkbit.ondetect = this.onDetectReader;
        nkbit.onimage = this.biometrico; 
        nkbit.onsetreader = this.onSetReader;
    }

    componentDidMount(){
        this.connect();
        setTimeout(this.detect, 1500);
    }
   

    biometrico(event) {
        
        // show("Image captured");
        // images.push({width:310, height:356, amostra: event.imageBMPBase64});
        // this.state.image[this.contador++] = nkbit.imgtag;
        // this.setState({image: this.state.image});
        // var num = elem("totImpressoes");
        // num.innerHTML = String(images.length);
        // if (images.length === 3){
        //     elem("btnCadastrar").disabled = false;
        //     //elem("btnCadastrar").classList.remove("disabled");
        //     stopCapture();
        //     elem("btnNovoCadastro").innerHTML = "Novo Cadastro";
        // }        
      }

    onSetReader(event) {
        // if( event.status == 0 ) {
        //   if( nkbit.capturing )
        //     console.log("Capture active: place a finger");
        //   else
        //     console.log("Capture inactive");
        // } else {
        //   console.log("ERROR: " + event.error);
        //   this.setState({disableLoginButton: false, textButton: "Cadastrar Biometria"});
        //   this.toggle();
        //   toast.error(this.stringTranslate("ModalBio.toast.leitorNaoInicializado")+": ", {
        //     position: "top-center",
        //     transition: Slide,
        //     autoClose: 5000,
        //     hideProgressBar: true,
        //     closeOnClick: true,
        //     pauseOnHover: false,
        //     draggable: true
        //     });
        // }
      }

    load(inputValue, callback, setValor, num){
        var opcoes1 = [];
        var opcoes2 = [];
        if (num === 1){
            opcoes1.push({value:null, label:this.stringTranslate("Coletor.pag.biometria.leitor.sem")});
            if (Boolean(this.state.numeroSerie)){
                opcoes1.push({value:this.state.numeroSerie, label:this.state.numeroSerie});
                setValor({value:this.state.numeroSerie, label:this.state.numeroSerie});
            }
            var intervalo1 = setInterval(() => {
                if (this.state.haLeitor){
                    clearInterval(intervalo1);
                    this.state.readers.map((prop) =>{
                        if (prop !== this.state.numeroSerie)
                            opcoes1.push({value:prop, label: prop});
                    })
                    if (Boolean(callback) !== false)
                        callback(opcoes1);
                }
            }, 1000);
        }else{
            opcoes2.push({value:null, label:this.stringTranslate("Coletor.pag.biometria.leitor.sem")});
            if (Boolean(this.state.segundoLeitor)){
                opcoes2.push({value:this.state.segundoLeitor, label:this.state.segundoLeitor});
                setValor({value:this.state.segundoLeitor, label:this.state.segundoLeitor});
            }
            var intervalo2 = setInterval(() => {
                if (this.state.haLeitor){
                    clearInterval(intervalo2);
                    this.state.readers.map((prop) =>{
                        if (prop !== this.state.segundoLeitor)
                            opcoes2.push({value:prop, label: prop});
                    })
                    if (Boolean(callback) !== false)
                        callback(opcoes2);
                }
            }, 1000);
        }
        
    }

    onDetectReader = function(event) {
        console.log(event)
        if(event.readers.length > 0){
          this.state.readers = event.readers;
          this.state.haLeitor = true;
          this.setState({haLeitor: this.state.haLeitor, readers: this.state.readers});
          console.log("Leitor: "+this.state.readers);
      
        //   if(elem("coletorId") !== null)
        //     elem("coletorId").innerHTML = String(reader);
      
          //startCapture(reader);
        }else{
            this.state.readers = [];
            this.state.haLeitor = false;
            this.setState({haLeitor: this.state.haLeitor, readers: this.state.readers});
        }
      }

    connect() {
        //var msgline = elem('msgline');
        console.log("connecting...");
        // set the <img> element to display the image
        //nkbit.imgtag = elem("fingerImage"+(images.length+1).toString());
        
        // connect to the web socket
        nkbit.connect();    
    }
  
    detect() {
        // see ondetect event to get the result
        var nd = this.state.nd;
        nkbit.detect(nd); 
    }

    startCapture(reader) {
        var sn = reader;
        nkbit.setReader(sn);
        // elem("btnNovoCadastro").disabled = false;
    }
    
    // stopCapture(): call nkbit.setReader("")
    stopCapture() {
        nkbit.setReader("");
    }

    handleChangeSelectLeitores(event) {
        // if(Boolean(this.handleChangeNumeroSerie) !== false)
        //   this.handleChangeSegundoLeitor(event);
        // else
        //   this.handleChangeNumeroSerie(event);
        this.props.BF.handleChangeSelectLeitores(event);
    }

    handleChangeNumeroSerie(event){
        //this.setState({numeroSerie: event.value});
        this.props.BF.handleChangeNumeroSerie(event);
    }
    handleChangeResolucao(event){
        //this.setState({resolucao: event.target.value});
        this.props.BF.handleChangeResolucao(event);
    }
    handleChangePadrao(){
        this.setState({padrao: !this.state.padrao});
        this.props.BF.handleChangePadrao();
    }
    handleChangeSegundoLeitor(event){
        //this.setState({segundoLeitor: event.value});
        this.props.BF.handleChangeSegundoLeitor(event);
    }

    handleChangeEntrada(event){
        //this.setState({entrada: event.target.value});
        this.props.BF.handleChangeEntrada(event);
    }
    handleChangeSaida(event){
        //this.setState({saida: event.target.value});
        this.props.BF.handleChangeSaida(event);
    }
    handleChangeOutros(event){
        //this.setState({outros: event.target.value});
        this.props.BF.handleChangeOutros(event);
    }

    stringTranslate(id){
        return this.props.intl.formatMessage({id: id});
    }

    render(){
        return(
            <>
            <div>
                <Card>
                    <CardHeader>{this.stringTranslate("Coletor.pag.biometria.titulo")}</CardHeader>
                    <CardBody>
                        <Row>
                            <Col>
                                <Card>
                                    <CardHeader></CardHeader>
                                    <CardBody>
                                        <Row>
                                            <Col>
                                                <SelectLeitor num={1} load={this.load} readers={this.state.readers} value={this.state.numeroSerie} onChangeNumeroSerie={this.handleChangeNumeroSerie} editavel={this.editavel} stringTranslate={this.stringTranslate} />
                                                {/* <FormGroup>
                                                    <Label>{this.stringTranslate("Coletor.pag.biometria.leitor")}</Label>
                                                    {console.log(this.state.leitorSelecionado1)}
                                                <AsyncSelect
                                                    value={this.state.leitorSelecionado1}
                                                    isLoading
                                                    defaultOptions
                                                    loadOptions={(inputValue, callback) => this.load(inputValue, callback)}
                                                    isDisabled = {!this.editavel}   
                                                    closeMenuOnSelect={false}
                                                    components={makeAnimated()}
                                                    onChange={(e) => this.handleChangeSelectLeitores(e)}
                                                />
                                                </FormGroup> */}
                                            </Col>
                                            {this.props.modelo === "11" ? (null) : 
                                            (
                                                <Col>
                                                    <SelectLeitor num={2} load={this.load} value={this.state.segundoLeitor} onChangeSegundoLeitor={this.handleChangeSegundoLeitor} editavel={this.editavel} stringTranslate={this.stringTranslate} />
                                                </Col>
                                            )}
                                            <Col md={3}>
                                                <FormGroup>
                                                    <Label>{this.stringTranslate("Coletor.pag.biometria.resolucao")}</Label>
                                                    <Input disabled={!this.editavel} defaultValue={this.state.resolucao} onChange={this.handleChangeResolucao} type="text" />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <FormGroup style={{marginTop: "35px"}}> 
                                                    <Switch
                                                    disabled={!this.editavel} 
                                                    onChange={this.handleChangePadrao} 
                                                    checked={this.state.padrao}  
                                                    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)" 
                                                    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)" 
                                                    height={20}
                                                    width={40}
                                                    className="react-switch"
                                                    /> <Label onClick={this.handleChangePadrao} >{this.stringTranslate("Coletor.pag.biometria.padrao")}</Label>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                        {this.props.modelo === "11" ? (<DirecaoLeitores entrada={this.state.direcaoEntrada} saida={this.state.direcaoSaida} outros={this.state.direcaoOutros} onChangeEntrada={this.handleChangeEntrada} onChangeSaida={this.handleChangeSaida} onChangeOutros={this.handleChangeOutros} direcao={null} editavel={this.state.editavel} stringTranslate={this.stringTranslate} />) :
                        (null)}
                    </CardBody>
                </Card>
            </div>
            </>
        )
    }
}

export default injectIntl(Biometria);