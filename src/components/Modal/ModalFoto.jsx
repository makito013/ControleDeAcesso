import React from "react";
import TabelaVisitantesPresentes from 'components/Table/TabelaVisitantesPresentes'
import {
    Button, 
    Modal,
    ModalHeader,
    ModalBody,
    Nav,
    UncontrolledTooltip,
    Row,
    Col,
    UncontrolledCarousel
  } from "reactstrap";  
  import Webcam from "react-webcam";
  import { injectIntl } from "react-intl";
  import Slider from "react-slick";


  class ModalFoto extends React.Component{
    
    constructor(props) {
        super(props);
        this.state = {
          modal: false,
          dataTable: null,
          statePage: "index",
          fotoDocumento: this.props.fotos !== undefined ? this.props.fotos[1] : "",
          fotoPerfil: this.props.fotos !== undefined ? this.props.fotos[0] : "",
        };
        //Função responsável por fazer o modal aparecer na tela
        this.webcamPerf = null;
        this.webcamDoc = null;
        this.toggle = this.toggle.bind(this);
        this.stringTranslate = this.stringTranslate.bind(this);
        this.setRefPerfil = this.setRefPerfil.bind(this);
        this.setRefDocumento = this.setRefDocumento.bind(this);
        this.capturePerfil = this.capturePerfil.bind(this);
        this.captureDocumento = this.captureDocumento.bind(this);        
    }

    stringTranslate(id){
        return this.props.intl.formatMessage({id: id});
    }

    toggle() {
        this.setState(prevState => ({
          modal: !prevState.modal,
          statePage: "index"
        }));
    }

    setRefPerfil = webcam => {
        this.webcamPerf = webcam;
    };

    setRefDocumento = webcam => {
        this.webcamDoc = webcam;
    };
 
    capturePerfil = () => {
        const imageSrc = this.webcamPerf.getScreenshot();
        this.setState({fotoPerfil: imageSrc})
        //console.log(imageSrc);
    };
    
    captureDocumento = () => {
        const imageSrc = this.webcamDoc.getScreenshot();
        this.setState({fotoDocumento: imageSrc})
    };

    botaoNovaFoto(index){
        this.setState({statePage: index});
    }

    render(){

        const videoConstraints = {
            width: 300,
            height: 700,
            facingMode: "user"
          };
          var settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1
          };

          const items = [
            {
              src: this.state.fotoPerfil === "" ? require("../../assets/img/default-avatar.png") : this.state.fotoPerfil
            },
            {
              src: this.state.fotoDocumento === "" ? require("../../assets/img/idCard.png") : this.state.fotoDocumento
            },
          ];
        return(
            <>
            
            {this.props.novoCadastro === true ? (
            
                <Button block color="info" onClick={this.toggle}>
                    {this.stringTranslate("Cadastro.botao.foto")}
                </Button>
            ) : (
                <div style={{maxWidth: "292px"}}>
                {/* <Slider dots={false}>
                    <div>
                    <img src={this.props.fotos[0] === "" ? require("../../assets/img/default-avatar.png") : this.props.fotos[0]} />
                    </div>
                    <div>
                    <img src={this.props.fotos[1] === "" ? require("../../assets/img/idCard.png") : this.props.fotos[1]}/>
                    </div>
                </Slider> */}
                <UncontrolledCarousel items={items} autoPlay={false} indicators={false} interval={3000000}/>
                <div style={{position:"absolute", right: "0", left: "0", display: "flex", bottom: "30px", justifyContent: "center", paddingLeft:"0", marginRight:"15%", marginLeft:"15%"}}>
                    <div onClick={this.toggle} style={{cursor:"pointer", height:'30px', width:'40px', paddingTop:'3px', backgroundImage:'linear-gradient(35deg, #029be3, #08a5d1)', paddingRight:'2px', borderRadius:'7px', border:'1px solid #fff'}}>
                    <i className="tim-icons icon-camera-18" style={{cursor:"pointer", color:"#fff", fontSize:"20px", fontWeight:"bold"}}/></div>
                    </div>
                </div>
            )}            
            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} modalTransition={{timeout:0}} backdropTransition={{timeout:0}}>
                <ModalHeader toggle={this.toggle} tag="h4">
                    Cadastrar Foto
                </ModalHeader>
                <ModalBody>
                    {this.state.statePage === "index" ? ( <>
                    {/* PAGINA INICIAL DO MODAL */}                    
                    <Row>

                        <Col md="6" align="center">
                            <h6>Perfil</h6>                            
                            <img
                                height="150px"
                                alt="..."
                                className="border-gray"
                                src={this.state.fotoPerfil === "" ? require("../../assets/img/default-avatar.png") : this.state.fotoPerfil}
                            />
                            <Button size="sm" color="info" onClick={(event) => this.botaoNovaFoto("perfil")}>
                                Nova Foto
                            </Button>
                        </Col>
                        <Col md="6" align="center">
                            <h6>Documento</h6>
                            <img
                                height="150px"
                                alt="..."
                                className="border-gray"
                                src={this.state.fotoDocumento === "" ? require("../../assets/img/idCard.png") : this.state.fotoDocumento}
                            />

                            <Button size="sm" color="info" onClick={(evevent) => this.botaoNovaFoto("documento")}>    
                                Nova Foto
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col align="center">
                        <Button  color="secondary" onClick={this.toggle} style={{marginTop:"15px"}}>
                                Voltar
                        </Button>
                        </Col>
                    </Row>
                    </>) : this.state.statePage === "perfil" ? (<>
                    {/* PAGINA DE CADASTRO FOTO PERFIL */}                    
                    <Row>
                        {this.state.fotoPerfil === "" ? (<Webcam
                            audio={false}
                            ref={this.setRefPerfil}
                            screenshotFormat="image/png"
                            videoConstraints={videoConstraints}
                            style={{width:"100%", margin: "15px"}}
                        />) : (
                            <img
                                alt="..."
                                className="border-gray"
                                style={{width:"100%", margin: "15px"}}
                                src={this.state.fotoPerfil}
                            />
                        )}
                        
                    </Row>
                    <Row>         
                        {this.state.fotoPerfil === "" ? (<>
                        <Col md="6" align="center">
                            <Button block color="secondary" onClick={(evevent) => this.botaoNovaFoto("index")}>
                                Cancelar
                            </Button>
                        </Col>
                        <Col md="6" align="center">                            
                            <Button block color="login" onClick={(event) => this.capturePerfil()}>
                                Tirar Foto
                            </Button>
                        </Col>
                        </>) : (
                            <>
                            <Col md="4" align="center">                            
                            <Button block align="center" color="secondary" onClick={(event) => {this.setState({statePage: "index", fotoPerfil:""})}}>
                                Cancelar
                            </Button>
                            </Col>
                            <Col md="4" align="center">                            
                            <Button block align="center" color="danger" onClick={(event) => {this.setState({fotoPerfil:""})}}>
                                Excluir
                            </Button>
                            </Col>
                            <Col md="4" align="center">                            
                            <Button block color="success" onClick={(event) => {this.props.valorFotos("fotoPerfil", this.state.fotoPerfil); this.setState({statePage: "index"})}}>
                                Salvar
                            </Button>
                            </Col>
                            </>
                        )}
                        
                    </Row>
                    </>
                    ) : (<>
                    {/* PAGINA DE CADASTRO FOTO DOCUMENTO */}                    
                    <Row>
                        {this.state.fotoDocumento === "" ? (<Webcam
                            audio={false}
                            ref={this.setRefDocumento}
                            screenshotFormat="image/png"
                            videoConstraints={videoConstraints}
                            style={{width:"100%", margin: "15px"}}
                        />) : (
                            <img
                                alt="..."
                                className="border-gray"
                                style={{width:"100%", margin: "15px"}}
                                src={this.state.fotoDocumento}
                            />
                        )}
                        
                    </Row>
                    <Row>         
                        {this.state.fotoDocumento === "" ? (<>
                        <Col md="6" align="center">
                            <Button block color="secondary" onClick={(evevent) => this.botaoNovaFoto("index")}>
                                Cancelar
                            </Button>
                        </Col>
                        <Col md="6" align="center">                            
                            <Button block color="login" onClick={(event) => this.captureDocumento()}>
                                Tirar Foto
                            </Button>
                        </Col>
                        </>) : (
                            <>
                            <Col md="4" align="center">                            
                            <Button block align="center" color="secondary" onClick={(event) => {this.setState({statePage: "index", fotoDocumento:""})}}>
                                Cancelar
                            </Button>
                            </Col>
                            <Col md="4" align="center">                            
                            <Button block align="center" color="danger" onClick={(event) => {this.setState({fotoDocumento:""})}}>
                                Excluir
                            </Button>
                            </Col>
                            <Col md="4" align="center">                            
                            <Button block color="success" onClick={(event) => {this.props.valorFotos("fotoDocumento", this.state.fotoDocumento); this.setState({statePage: "index"})}}>
                                Salvar
                            </Button>
                            </Col>
                            </>
                        )}                        
                    </Row>
                    </>
                    )}
                   
                </ModalBody>
            </Modal>
        </>
        )
      };
  }
  export default injectIntl(ModalFoto);