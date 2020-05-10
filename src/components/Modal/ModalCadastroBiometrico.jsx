import React from "react";
import {
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Table,
    Row,
    Col,
    Button, 
    Label,
    Modal,
    ModalHeader,
    ModalBody,
    Form,
    Input,
    FormGroup,
    Media,
    Badge

  } from "reactstrap";
import NKBITWebSocket from 'utils/nkbitweb.js';
import { element, func } from "prop-types";
import { post } from "utils/api";
import { toast, Slide } from 'react-toastify';
import Select from 'react-select';
import { injectIntl } from "react-intl";
import ClipLoader from 'react-spinners/ClipLoader';


var msgline;
var nkbit = new NKBITWebSocket("ws://localhost:5109");
let images = [];
let reader = "";
let conexao = 0;
 


function elem(id) {
  return document.getElementById(id);
}

//--- nkbit events ---//
function show(msg){
  //console.log(msg);
}

// onopen event: same as WebSocket onopen
nkbit.onopen = function(e) {
  conexao = 1;
  console.log("Connected to NK-BIT");
};


// onclose event: same as WebSocket onclose
nkbit.onclose = function(event) {
  if (event.wasClean) {
    show(`Connection closed cleanly, code=${event.code} reason=${event.reason}`);
  } else {
    show(`Connection died: code=${event.code}`);
  }
};

// onerror: same as WebSocket onerror
nkbit.onerror = function(error) {
  show(`[error] ${error.message}`);
};

//------//

// on loading: connect to NK-BIT
function connect() {
  msgline = elem('msgline');
  show("connecting...");

  // set the <img> element to display the image
  nkbit.imgtag = elem("fingerImage1");

  // connect to the web socket
  nkbit.connect();
}

// detect(): called by "Detect readers" button

// startCapture(): call nkbit.setReader(sn) with the serial number chosen
function startCapture(reader) {
  var sn = reader;
  nkbit.setReader(sn);
  elem("btnNovoCadastro").disabled = false;
}

// stopCapture(): call nkbit.setReader("")
function stopCapture() {
  nkbit.setReader("");
}

function passaImagem(event, Simulador){
  Simulador.setState({
    lastImage: event.imageBMPBase64,
  })
}

class ModalCadastroBiometrico extends React.Component{
constructor(props) {
    super(props);
    this.state = {
      value: [],
      dedo: 0,
      image:[],
      modal: false,
      nd: true,
      panicoMestre: [],
      vIndex:this.props.pessoa["vetorIdsBio"] === undefined ? [] : this.props.pessoa["vetorIdsBio"],
      haLeitor: false,
      disableLoginButton: false,
      textButton: "Cadastrar Biometria",
      vetor:[
        [1,this.stringTranslate("ModalBio.dedo.polegarDir")],
        [2,this.stringTranslate("ModalBio.dedo.indicadorDir")],
        [3,this.stringTranslate("ModalBio.dedo.medioDir")],
        [4,this.stringTranslate("ModalBio.dedo.anelarDir")],
        [5,this.stringTranslate("ModalBio.dedo.minimoDir")],
        [6,this.stringTranslate("ModalBio.dedo.polegarEsq")],
        [7,this.stringTranslate("ModalBio.dedo.indicadorEsq")],
        [8,this.stringTranslate("ModalBio.dedo.medioEsq")],
        [9,this.stringTranslate("ModalBio.dedo.anelarEsq")],
        [10,this.stringTranslate("ModalBio.dedo.minimoEsq")]
]
    };
    this.contador = 0;
    this.toggle = this.toggle.bind(this);

      this.detect = this.detect.bind(this);
      this.connect = this.connect.bind(this);
      this.inicilaizaModal = this.inicilaizaModal.bind(this); 
      this.finalizaModal = this.finalizaModal.bind(this);
      this.handleCadastrar = this.handleCadastrar.bind(this);
      this.handlePanicoMestre = this.handlePanicoMestre.bind(this);
      this.handleNovoCadastro = this.handleNovoCadastro.bind(this);
      this.preencherOptions = this.preencherOptions.bind(this);
      this.eventoimage = this.eventoimage.bind(this);
      this.onDetectReader = this.onDetectReader.bind(this);
      this.onSetReader = this.onSetReader.bind(this);
      this.handleModal = this.handleModal.bind(this);
      this.verificaConexao = this.verificaConexao.bind(this);
      this.resolvePromisse = this.resolvePromisse.bind(this);
      // onimage event: when an image is captured, it's displayed in capturedImage
      //   event.imageBMP: array of bytes containing a BMP file
      //   event.imageBMPBase64: same as imageBMP converted to base64
    
      //traduz strings
    this.stringTranslate = this.stringTranslate.bind(this);
    this.biometrico = this.biometrico.bind(this);

    nkbit.ondetect = this.onDetectReader;
    nkbit.onimage = this.biometrico; 
    nkbit.onsetreader = this.onSetReader;
    }

    eventoimage(image){
      
      this.setState({image:image})
    }
    
    // onsetreader event:
    //   event.status = 0 if ok, or error code
    //   event.error: contains an error message if not ok
     onSetReader(event) {
      if( event.status == 0 ) {
        if( nkbit.capturing )
          console.log("Capture active: place a finger");
        else
          console.log("Capture inactive");
      } else {
        console.log("ERROR: " + event.error);
        this.setState({disableLoginButton: false, textButton: "Cadastrar Biometria"});
        this.toggle();
        toast.error(this.stringTranslate("ModalBio.toast.leitorNaoInicializado")+": ", {
          position: "top-center",
          transition: Slide,
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true
          });
      }
    }


    // ondetect event:
    //   event.readers contains an array of reader numbers
    onDetectReader = function(event) {
    if(event.readers.length > 0){
      this.state.haLeitor = true;
      this.setState({haLeitor: this.state.haLeitor});
      reader = event.readers[0];
      console.log("Leitor: "+reader);
  
      if(elem("coletorId") !== null)
        elem("coletorId").innerHTML = String(reader);
  
      //startCapture(reader);
    }else{
        this.state.haLeitor = false;
        this.setState({haLeitor: this.state.haLeitor});
    }
    this.verificaToggle();
  }

    biometrico(event) {
        
      show("Image captured");
      images.push({width:310, height:356, amostra: event.imageBMPBase64});
      this.state.image[this.contador++] = nkbit.imgtag;
      this.setState({image: this.state.image});
      var num = elem("totImpressoes");
      num.innerHTML = String(images.length);
      if (images.length === 3){
          elem("btnCadastrar").disabled = false;
          //elem("btnCadastrar").classList.remove("disabled");
          stopCapture();
          elem("btnNovoCadastro").innerHTML = "Novo Cadastro";
      }        
    }

    componentWillMount(){
        this.connect();
    }

    stringTranslate(id){
        return this.props.intl.formatMessage({id: id});
    }

    
    handlePanicoMestre(valores){
        this.state.panicoMestre = valores;
        this.setState({
            panicoMestre: this.state.panicoMestre,
        })
    }

    handleCadastrar(){
      if(Boolean(this.state.dedo)){
        const body = {
            cmd:"cadastrobiometrico",             
            codpessoa:this.props.pessoa["codIdPessoa"],
            dedo:this.state.dedo,
            countimage:1,
            amostras:images,
            token:sessionStorage.getItem("token"),
        }
        


        post(body).then(data =>{
            if (data.retorno === true){
                toast.success(this.stringTranslate("ModalBio.toast.digitalColetada")+": "+data.dados.indice, {
                    position: "top-center",
                    transition: Slide,
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true
                    });
              //  this.toggle();
                
                this.handleNovoCadastro();
                this.state.vIndex.push(this.state.dedo);
                this.setState({vIndex: this.state.vIndex});
                this.props.handleBiometria(data.dados.indice);
                this.setState({value: []})

            }else{
                toast.error(this.stringTranslate("ModalBio.toast.digitalNaoColetada")+": "+data.mensagem, {
                    position: "top-center",
                    transition: Slide,
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true
                    });
                    elem("btnCadastrar").disabled = true;  
                    this.handleNovoCadastro();     
            }
        })
      }else{
        toast.error(this.stringTranslate("ModalBio.toast.selecioneDedo"), {
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

    preencherOptions(){    
        const options = this.state.vetor.map((prop, key) => {
            return(                
                (this.state.vIndex!== undefined) && (this.state.vIndex.indexOf(prop[0]) !== -1) ? (
                {value:prop[0],label:<span style={{color:"green"}}> <span style={{color:"#3f8f03"}} className= "fas fa-fingerprint"/>  {prop[1]}</span>}
                ):(
                  {value:prop[0],label:<span> {prop[1]}</span>}   
                )
            );
        })
      
        return options;
    }
     
    handleNovoCadastro(){
        stopCapture();
        images = [];
        this.setState({image:[]});
        this.contador = 0;
        nkbit.imgtag = elem("fingerImage"+(images.length+1).toString());
        elem("totImpressoes").innerHTML = images.length;
        startCapture(reader);
        elem("btnNovoCadastro").innerHTML = "Reiniciar";
    }

    connect() {
      msgline = elem('msgline');
      // set the <img> element to display the image
      nkbit.imgtag = elem("fingerImage"+(images.length+1).toString());
      
      // connect to the web socket
      nkbit.connect();    
    }

    detect() {
      // see ondetect event to get the result
      var nd = this.state.nd;
      nkbit.detect(nd); 
    }

    componentWillUnmount(){
      clearInterval(this.timerDetect);
    }

    toggle() {
        this.state.modal = !this.state.modal;
        this.setState(() => ({
            modal: this.state.modal
        }));
    }

    resolvePromisse(){
      console.log(this.props.pessoa["codIdPessoa"])
      if(this.props.pessoa["codIdPessoa"] !== 0){        
        this.toggle();
      }        
    }

    verificaToggle(){
      var resultado = false;
        if (this.state.haLeitor){ 
          //Mark: mudar depois            
          if(this.props.pessoa["codIdPessoa"] === 0)        
            new Promise(this.props.cadastrarPessoa).then(setTimeout(this.resolvePromisse,500))
          else
            this.toggle();  
        }else{
          this.setState({disableLoginButton: false, textButton: "Cadastrar Biometria"});
          toast.error(this.stringTranslate("ModalBio.toast.semLeitor"), {
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

    verificaConexao(){
      if (conexao === 0){
        toast.error(this.stringTranslate("ModalBio.toast.semConexao"), {
          transition: Slide,
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true
          });
        this.setState({disableLoginButton: false, textButton: "Cadastrar Biometria"});
      }else{        
        this.detect();
      }
      conexao = 0;
    }

    handleModal(){
      this.setState({disableLoginButton: true, textButton: "Aguarde"});
      this.connect();
      setTimeout(this.verificaConexao,1500);
    }

    inicilaizaModal(){      
      if(images.length < 3){
          elem("btnCadastrar").disabled = true;
          elem("btnNovoCadastro").disabled = true;
          elem("coletorId").innerHTML = reader;
          startCapture(reader);
      }

      this.setState({disableLoginButton: false, textButton: "Cadastrar Biometria"});
      var num = elem("totImpressoes");
      num.innerHTML = String(images.length);
    }

    finalizaModal(){
      stopCapture();
    }

    componentDidUpdate(){
      // if(this.state.textButton !== this.props.nomeBotao)
      //  this.setState({textButton: this.props.nomeBotao});
    }
    onChangeSelect(e){
        this.setState({dedo:e.value, value: e})
    }
    render(){

        return(
            <>
            <Button block color="info" disabled={this.state.disableLoginButton} onClick={this.handleModal}>
              {this.state.textButton === "Aguarde" ? (<ClipLoader sizeUnit={"px"}  size={18} color={'#fff'}/>) : null} {this.stringTranslate("ModalBio.botao."+this.state.textButton)}
            </Button>
            {this.props.pessoa !== undefined ? (
            <Modal onOpened={this.inicilaizaModal} onClosed={this.finalizaModal} isOpen={this.state.modal} toggle={this.toggle} style={{minWdth:"40%", minHeight:"40%"}}>
              <ModalHeader toggle={this.toggle}>{this.stringTranslate("ModalBio.botao.Cadastrar Biometria")}</ModalHeader>
                <ModalBody>
                    <Row>
                        <Col >
                            <h4>{this.stringTranslate("ModalBio.titulo")}</h4>
                            <h4>{this.props.pessoa["nome"]}</h4>
                            <FormGroup>
                                <Label>{this.stringTranslate("ModalBio.selecioneDedo")}</Label>
                                <Select id="selecaoDedo" placeholder="" options={this.preencherOptions()} value={this.state.value} onChange={(e)=>this.onChangeSelect(e)} theme={theme => ({
                                    ...theme,
                                    colors: {
                                      ...theme.colors,
                                      primary25: '#f6f4e5',
                                      primary: '#2bbbff',
                                    },
                                  })}/>                                  
                            </FormGroup>
                        </Col>
                    </Row> 
                    <Row>
                      {this.state.image[0] !== undefined ? (
                        <Col style={{textAlign:"center"}} md={4}>
                        <img  src={this.state.image[0]} style={{width:"100px", height:"150px",float:"none"}}/> 
                        </Col>
                        ):
                        (
                         <Col style={{textAlign:"center"}} md={4}>
                        <img
                               alt="..."
                            className="border-gray"
                           src={require("assets/img/bio2.png")}
                           style={{width:"100px", height:"150px",float:"none"}}/> 
                        </Col>
                        )
                      }
                        {this.state.image[1] !== undefined ? (
                        <Col style={{textAlign:"center"}} md={4}>

                        <img src={this.state.image[1]} style={{width:"100px", height:"150px", float:"none"}}/> 

                        </Col>
                        ):(
                        <Col style={{textAlign:"center"}} md={4}>
                          <img
                            alt="..."
                            className="border-gray"
                            src={require("assets/img/bio2.png")}
                            style={{width:"100px", height:"150px",float:"none"}}/> 
                          </Col>
                        )
                      }
                        {this.state.image[2] !== undefined ? (
                        <Col style={{textAlign:"center"}} md={4}> 

                        <img src={this.state.image[2]} style={{width:"100px", height:"150px", float:"none"}}/> 

                        </Col>
                                  ):(
                        <Col style={{textAlign:"center"}} md={4}>
                          <img
                                 alt="..."
                            className="border-gray"
                            src={require("assets/img/bio2.png")}
                           style={{width:"100px", height:"150px",float:"none"}}/> 
                          </Col>
                        )
                      }
                    </Row>
                    <Row style={{padding: "10px"}}>
                        <Col md={6}>
                            <Button color="info"  id="btnNovoCadastro" onClick={this.handleNovoCadastro} block>{this.stringTranslate("ModalBio.botao.reiniciar")}</Button>
                        </Col>
                        <Col md={6}>
                            <Button color="success" id="btnCadastrar" onClick={this.handleCadastrar} block>{this.stringTranslate("ModalBio.botao.cadastrar")}</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{padding: "10px"}}>
                            <label>{this.stringTranslate("ModalBio.coletor")}:</label>
                            <strong id="coletorId">{reader}</strong>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <label>{this.stringTranslate("ModalBio.totalImpressoes")}:</label>
                            <strong id="totImpressoes">0</strong>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
            ) : null        
            }
        </>
        )
    };
}
export default injectIntl(ModalCadastroBiometrico);