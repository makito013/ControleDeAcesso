/*!

=========================================================
* Argon Dashboard React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import '../../assets/scss/bandeira.scss';
import {Cookies} from 'react-cookie';
import {Link} from 'react-router-dom'
import AdminNavbar from "components/Navbars/AdminNavbar.jsx";
// reactstrap components
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    FormGroup,    
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    Row,
    Col,
    FormText,
    FormFeedback,
    Nav,
    Modal,
    ModalHeader,
    ModalBody,
    Label,
    ModalFooter
} from "reactstrap";

import { encrypt, decrypt} from "../../utils/crypto.js"
import logoDokeo from "../../assets/img/logo-admin.png";
import logoPortaria from "../../assets/img/logo-portaria.png";
import { postAdonis } from "utils/api";
import { toast, Slide, ToastContainer } from 'react-toastify';
import ClipLoader from 'react-spinners/ClipLoader';
import { Switch, Select, Spin  } from 'antd';
import { injectIntl } from "react-intl";
import logoNeo from "../../assets/img/logoNeo.png"

const { Option } = Select;

let cookies = new Cookies();

const toastOptions = {
    transition: Slide,
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true
};
var encTok = encrypt("token"); 

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            aceptLogErro1: false,
            aceptLogErro2: false,
            checked: false,
            showPassword: false,
            username:"",
            password:"",        
            logErroText1: "",
            logErroText2: "",
            token: "",
            efetuandoLogin: 0,
            disableLoginButton: false,
            TextButton: this.stringTranslate("Botao.Entrar") ,
            redirect: false,
            login: cookies.get(encTok) !== undefined ? true : false,
            modal: false,
            maqCadastrada: cookies.get(encrypt("maqCadastrada")) !== undefined ? Boolean(decrypt(cookies.get(encrypt("maqCadastrada")))) : false,
            dokeo: cookies.get(encrypt("dokeo")) !== undefined ? Boolean(decrypt(cookies.get(encrypt("dokeo")))) : false,
            page: "",
            loadSaveModal: false,
            sidebarOpened: document.documentElement.className.indexOf("nav-open") !== -1
        };
        //Translate-----------
        this.setIdioma = this.setIdioma.bind(this);
        this.getDefaultIdioma = this.getDefaultIdioma.bind(this);
        this.dicIdiomas = [
            {pais: "BR", idioma: "br"},
            {pais: "US", idioma: "en"}];
        //---------------------
        //Permissões portaria
        this.modalForm = {nome: "", locais: []};
        this.salvaPermissao = this.salvaPermissao.bind(this);
        this.locaisAcesso = [];
        this.handleChangeNew = this.handleChangeNew.bind(this);
        this.onclickModal = this.onclickModal.bind(this);
        //---------------------        
        this.timeOut=[];
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleKeyPressPass = this.handleKeyPressPass.bind(this);
        this.handleChangePass = this.handleChangePass.bind(this);
        this.handleChangeUser = this.handleChangeUser.bind(this);
        // this.verificaLogin = this.verificaLogin.bind(this);
        this.handleLogin = this.handleLogin.bind(this);   
        this.stringTranslate = this.stringTranslate.bind(this);     
        this.cadastraPortaria = this.cadastraPortaria.bind(this);
        this.handleChangeSelect = this.handleChangeSelect.bind(this);
        ////// PARA TESTAR
        // window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;//compatibility for Firefox and chrome and edge
        // var pc = new RTCPeerConnection({iceServers:[]}), noop = function(){};      
        // pc.createDataChannel('');//create a bogus data channel
        // pc.createOffer(pc.setLocalDescription.bind(pc), noop);// create offer and set local description
        // pc.onicecandidate = function(ice)
        // {
        //     if (ice && ice.candidate && ice.candidate.candidate)
        //     {
        //     var myIP ="";
        //     console.log('my IP: ', ice);   
        //     pc.onicecandidate = noop;
        //     }
        // };    
        if(Boolean(cookies.get(encrypt("CodLocalAcesso"))) && Boolean(cookies.get(encrypt("LocalAcessoNome"))) !== undefined){
            var codLocal = decrypt(cookies.get(encrypt("CodLocalAcesso"))).split(",")
            var nomeLocal = decrypt(cookies.get(encrypt("LocalAcessoNome"))).split(",")

            this.locaisAcesso = [];                       
            codLocal.forEach((prop, key) => {
                this.locaisAcesso.push({value: prop, label: nomeLocal[key]})
            })
        }
    }
    
    
    getDefaultIdioma(){
    const idioma = localStorage.getItem("locale");
    let pais = "US";
    this.dicIdiomas.map((prop) =>{
        if (idioma === prop.idioma)
        pais = prop.pais
    })
    return pais;
    }
    
    setIdioma(pais){
    let idioma = "en";
    this.dicIdiomas.map((prop) =>{
        if (pais == prop.pais)
        idioma = prop.idioma;
    })

    localStorage.setItem("locale",idioma)    
    window.location.reload(); 
    this.props.setLocale(idioma);
    //this.setState({redirect: true})
    //window.location.reload();
    }

    stringTranslate(id){
    return this.props.intl.formatMessage({id: id});
    }

    handleChangeNew(e) {
        this.modalForm[e.target.name] = e.target.value
    }

    onclickModal() {
        this.setState({
            modal: !this.state.modal,
        });        
    }

    timeOutFunction(){

    }
    
    componentDidMount(){          
        if(sessionStorage.getItem("token") !== null){
            this.setState({redirect: true});
        }
    }

    salvaPermissao(){
        if(this.modalForm.locais.length === 0)
        {
            toast.dismiss();
            toast.warning((this.stringTranslate("Warning.maisLocais")),toastOptions); 
            return;
        }
        this.setState({loadSaveModal: true})
        const body = ({
            token: cookies.get(encrypt("token")),
            id: navigator.productSub,
            locaisAcesso: this.modalForm.locais,
            nome: this.modalForm.nome
        });

        postAdonis(body,"/LiberacaoMaquina")
            .then(data => {                
            if(data.retorno === true)
            { 
                toast.dismiss();
                toast.success(this.stringTranslate("Sucesso.MaquinaLiberada"),toastOptions);
                this.setState({maqCadastrada: true})
                this.onclickModal();
            } else{                  
                toast.dismiss();
                toast.error(this.stringTranslate("Login.erroSuporte"),toastOptions);               
            }
        }).catch(error => {
            toast.dismiss();
            toast.error(this.stringTranslate("Login.erroSuporte"),toastOptions);               
        });

        this.setState({loadSaveModal: false})
    }

    cadastraPortaria() {
        if(this.state.dokeo){
            
            this.setState({modal: true})                                    
        }
        else{
            toast.dismiss();
            toast.warn(this.stringTranslate("Warning.PermissaoLiberarMaquina"), toastOptions);
        }
    }

    handleChangeSelect(e) {
        if(e.indexOf("ALL") !== -1){
            this.modalForm["locais"] = decrypt(cookies.get(encrypt("CodLocalAcesso"))).split(",")
            
        }else if(e.indexOf("NULL") !== -1){
            this.modalForm["locais"] = [];
        }
        else
            this.modalForm["locais"] = e
        
        this.setState({true:true})
        console.log(this.modalForm["locais"])
    }

    handleLogin() {

        if(this.state.username === "")
        {
            this.setState({ logErroText1: this.stringTranslate("Warning.todosOsCampos") });
            this.setState({ aceptLogErro1: true });
        }
        
        if(this.state.password === "")
        {
            this.setState({ logErroText2: this.stringTranslate("Warning.todosOsCampos") });
            this.setState({ aceptLogErro2: true });
        }
        
        if(this.state.username !== "" && this.state.password !== ""){
            this.timeOut = setTimeout(
                function() {
                    this.setState({disableLoginButton: false, TextButton: this.stringTranslate("Botao.Entrar")});
                    toast.dismiss();
                    toast.error(this.stringTranslate("Erro.Servidor"), toastOptions);
                }.bind(this),
                5000                
            );

        this.setState({ logErroText1: "" });
        this.setState({ logErroText2: "" });
        //this.setState({ loading: true });
            const body = ({
                cmd: "login",
                user: this.state.username,
                password: this.state.password,
                id: navigator.productSub
            });
        this.setState({disableLoginButton: true, 
            TextButton: <><ClipLoader sizeUnit={"px"}  size={18} color={'#fff'}/> {this.stringTranslate("Botao.Aguarde")} </>}
        );

        postAdonis(body,'/Login')
            .then(data => {          
            clearInterval(this.timeOut);      
            if(data.error === undefined)
            {   
                if (data.retorno) {   
                    //console.log(decrypt(encrypt("Texto de Teste")));
                    //console.log(sessionStorage.getItem("encrypt"));                                 
                    if(data.token){                        
                        cookies.set(encrypt("maqCadastrada"), encrypt(data.maqCadastrada.toString()), { path: '/' });
                        cookies.set(encrypt("dokeo"), encrypt(data.dokeo.toString()), { path: '/' });
                        cookies.set(encrypt("token"), data.token, { path: '/' });
                        sessionStorage.setItem("token", data.token);
                        this.locaisAcesso = [];
                        var cookiesLocaisCod = [], cookiesLocaisNome = [];
                        data.locais.forEach((prop) => {
                            cookiesLocaisCod.push(prop.CodLocalAcesso)
                            cookiesLocaisNome.push(prop.Nome)
                            this.locaisAcesso.push({value: prop.CodLocalAcesso, label: prop.Nome})
                        })

                        cookies.set(encrypt("CodLocalAcesso"), encrypt(cookiesLocaisCod.toString()), { path: '/' });
                        cookies.set(encrypt("LocalAcessoNome"), encrypt(cookiesLocaisNome.toString()), { path: '/' });
                        this.setState({token: data.token, login: true, maqCadastrada: data.maqCadastrada, dokeo: data.dokeo})
                    }
                    else{ 
                        toast.dismiss();
                        toast.error(this.stringTranslate("Erro.login"), toastOptions)                                                                                       
                    }
                } else {
                    this.setState({disableLoginButton: false, TextButton: this.stringTranslate("Botao.Entrar") });
                    var mensagem;
                    
                    if(data.mensagem === "01")
                        mensagem= this.stringTranslate("Erro.usuarioSenha");
                    else if(data.mensagem === "02")
                        mensagem=  this.stringTranslate("Erro.login");
                    else
                        mensagem=  this.stringTranslate("Erro.suporte");                                                

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
            }
            else{                 
                toast.error(this.stringTranslate("Erro.Servidor"), {
                transition: Slide,
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                pauseOnVisibilityChange: false
                });
                this.setState({disableLoginButton: false, TextButton:  this.stringTranslate("Botao.Entrar")  });
            }
        })
        .catch(error => {
            console.log(error);
            clearInterval(this.timeOut);  
        });
    
      }
    
        if(this.state.logErroText1 !== "" || this.state.logErroText2 !== ""){
            clearInterval(this.timeOut);
            this.timeOut = setTimeout(
            function() {
                this.setState({ logErroText1: "" });
                this.setState({ logErroText2: "" });
                this.setState({ aceptLogErro2: false });
                this.setState({ aceptLogErro1: false });
            },
            5000
        );}      
    }  

    handleKeyPress(e) {
        if(e.which === 13)
            this.handleLogin();
    }
  
    handleKeyPressPass(e) {
        if(e.which === 13)
            this.handleLogin();
  
  
        if(e.keyCode === 20 && e.getModifierState('CapsLock'))
            this.setState({flag: true});
        else if ( e.getModifierState('CapsLock'))
            this.setState({flag: true});
        else
            this.setState({flag: false});
  
    }

    toggleSidebar = () => {
        document.documentElement.classList.toggle("nav-open");
        this.setState({ sidebarOpened: !this.state.sidebarOpened });
      };  
    

    handleChangePass(e){
    this.setState({ password: e.target.value });
    this.setState({ logErroText2: "" });
    this.setState({ aceptLogErro2: false });
    };

    handleChangeUser(e){
    this.setState({ username: e.target.value });
    this.setState({ logErroText1: "" });
    this.setState({ aceptLogErro1: false });
    };

    handleChange(showPassword) {
        this.setState({ showPassword });
    }

    render() {
        return (
            <>                   
            <Row style={{justifyContent: "center", alignItems: "center", }}>
            <ToastContainer pauseOnVisibilityChange={false} autoClose={5000} hideProgressBar={false}/>
            </Row>              
                
            <div className="wrapper">    
                <div
                    className="main-panel"
                    ref="mainPanel"
                    data="orange"                        
                >
                    {this.state.login === true ? (
                        <AdminNavbar
                            setLocale={this.props.setLocale}
                            {...this.props}
                            // brandText={this.getBrandText(this.props.location.pathname)}
                            toggleSidebar={this.toggleSidebar}
                            sidebarOpened={this.state.sidebarOpened}      
                            logo={{
                                outterLink: "",
                                text: "DOKEO",
                                imgSrc: ""
                            }}                         
                        />  ) : null}
                    <Row style={{justifyContent: "center", alignItems: "center", }}>     
                    {this.state.login === true ? ( 
                        <>                           
                        <div className="logo-img">
                            <img src={logoNeo} alt="react-logo" style={{height: "120px", marginTop:"30px"}} />
                        </div>

                        <Card className="card-chart" style={{marginTop:"60px"}}>
                            <CardBody style={{paddingTop:"20px"}}>
                                <Row align="center">
                                    <Col lg={this.state.dokeo ? "6" : "12"} md="12" style={{paddingTop:"20px", marginBottom:"20px"}}>
                                        {this.state.maqCadastrada ? (
                                            <Link to="/portaria">
                                                <img src={logoPortaria} alt="react-logo" />
                                            </Link>
                                        ) : (
                                            <a onClick={this.cadastraPortaria}>
                                                <img src={logoPortaria} alt="react-logo" />
                                            </a>
                                        )}
                                    </Col>
                                    {this.state.dokeo ? (                                        
                                        <Col lg="6" md="12" style={{paddingTop:"20px", marginBottom:"20px"}}>
                                            <Link to="/Dokeo">
                                                <img src={logoDokeo} alt="react-logo" />
                                            </Link>
                                        </Col>                                        
                                    ) : null}
                                </Row>                                    
                            </CardBody>
                        </Card>
                        </>
                        ) : (                   
                        <Card className="card-chart" style={{top:"10%", maxWidth:"400px", position: "absolute"}}>
                            <CardHeader tag="h4" style={{paddingLeft:"30px", paddingRight:"30px"}}>
                                <a
                                    className="simple-text logo-mini"
                                    target="_blank"
                                    >
                                    <div className="logo-img">
                                        <img src={logoNeo} alt="react-logo" />
                                    </div>
                                </a>
                            </CardHeader>
                            <CardBody style={{paddingLeft:"30px", paddingRight:"30px"}}>
                            <Row><Col  style={{textAlign: "center", marginBottom:"20px"}}>{this.stringTranslate("Login.Text.InsiraCredenciais")}</Col></Row>
        
                            <InputGroup style={{marginBottom:"15px"}}>
                                <InputGroupAddon addonType="prepend">
                                <InputGroupText style={{padding: "10px 0px 10px 5px"}} ><i style={{marginRight: "5px", marginLeft: "5px"}} className="tim-icons icon-badge"/> </InputGroupText>
                                </InputGroupAddon>
                                {this.state.aceptLogErro2 === true ? (
                                    <Input type="text"
                                    name="user" 
                                    id="user" 
                                    onChange={this.handleChangeUser} 
                                    onKeyUp={this.handleKeyPress} 
                                    placeholder={this.stringTranslate("Login.Text.insiraUsuario")}
                                    invalid
                                /> ) : (
                                    <Input type="text"
                                    name="user" 
                                    id="user" 
                                    onChange={this.handleChangeUser} 
                                    onKeyUp={this.handleKeyPress} 
                                    placeholder={this.stringTranslate("Login.Text.insiraUsuario")}
                                />
                                )}
                                {this.state.logErroText1 !== "" ? (<FormFeedback style={{fontWeight:"bold"}}>{this.state.logErroText1}</FormFeedback>):(<></>)}
                            </InputGroup>
                            <FormGroup style={{marginBottom:"20px"}}>
                            <InputGroup >
                                <InputGroupAddon addonType="prepend">
                                <InputGroupText style={{padding: "10px 0px 10px 5px"}} ><i style={{marginRight: "5px", marginLeft: "5px"}} className="tim-icons icon-lock-circle"/> </InputGroupText>                       
                                </InputGroupAddon>
                                {this.state.aceptLogErro2 === true ? (
                                    <Input type={this.state.showPassword ? 'text' : 'password'} 
                                    name="password" 
                                    id="password" 
                                    onChange={this.handleChangePass} 
                                    onKeyUp={this.handleKeyPressPass} 
                                    placeholder={this.stringTranslate("Login.Text.insiraSenha")}
                                    invalid                                    
                                /> ) : 
                                (<Input type={this.state.showPassword ? 'text' : 'password'} 
                                            name="password" 
                                            id="password" 
                                            onChange={this.handleChangePass} 
                                            onKeyUp={this.handleKeyPressPass} 
                                            placeholder={this.stringTranslate("Login.Text.insiraSenha")}
                                        />
                                )}
                                    
                                {this.state.logErroText2 !== "" ? (<FormFeedback style={{fontWeight:"bold"}}>{this.state.logErroText2}</FormFeedback>):null}
                                
                            </InputGroup>  
                            {this.state.flag === true ? (<FormText valid tooltip>Caps-Lock está ativo</FormText>):null}                  
                            </FormGroup>
        
                            <Row style={{marginBottom:"20px"}}>
                                <Col sm='1'>
                                    <Switch 
                                        onChange={this.handleChange} 
                                        checked={this.state.showPassword}  
                                        size="small"
                                    />
                                </Col>
                                <Col style={{marginLeft:"7px"}}>
                                    <span>{this.stringTranslate("Login.Text.verSenha")} </span>
                                </Col>
                            </Row>
                            <Button color="login" onClick={this.handleLogin} block disabled={this.state.disableLoginButton}> {this.state.TextButton} </Button>
                            </CardBody>
                        </Card>    
                    )}      
                    </Row>
                </div>
                </div>

                <Modal fade isOpen={this.state.modal}  size="lg" style={{minHeight: "600px", marginTop: "-30px"}}>
                    <ModalHeader toggle={this.onclickModal}><h4>{this.props.statusModal} {this.stringTranslate("Login.modalTitulo")}</h4></ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col>
                            <FormGroup>  
                                <Label>{this.stringTranslate("Login.LabelNomeMaquina")}</Label>
                                <Input type="text"
                                    name= "nome"
                                    onChange={(e) => this.handleChangeNew(e)}
                                    onKeyPress={this.onKeyPress}
                                /> 
                            </FormGroup>  
                            </Col>
                        </Row>
                        
                        <Row>
                            <Col>
                            <FormGroup> 
                                <Label>{this.stringTranslate("Login.LocaisPermitidos")}</Label>
                                <Select
                                    mode="multiple"
                                    style={{ width: '100%' }}
                                    onChange={this.handleChangeSelect}
                                    size="large"
                                    maxTagCount={window.innerWidth > 1000 ? '6' : '3'}
                                    maxTagTextLength="5"
                                    value={this.modalForm["locais"]}
                                >
                                    <Option key={this.modalForm["locais"].length > 0 ? "NULL" : "ALL"}>{this.modalForm["locais"].length > 0 ? this.stringTranslate("Select.Nenhum") : this.stringTranslate("Select.Todos")}</Option>
                                    {this.locaisAcesso.map(prop => {
                                        return (<Option key={prop.value}>{prop.label}</Option>)
                                    })}
                                </Select> 
                            </FormGroup> 
                            </Col> 
                        </Row>

                    </ModalBody>
                    <ModalFooter>
                        <Button color="warning" style={{width: "100px"}} onClick={this.onclickModal}>{this.stringTranslate("Botao.Cancelar")}</Button>
                        <Spin spinning={this.state.loadSaveModal}> <Button color="success" style={{width: "100px"}} onClick={this.salvaPermissao}>{this.stringTranslate("Botao.Salvar")}</Button> </Spin>
                    </ModalFooter>
                </Modal>
            </>
            );
            
        }
    }

export default injectIntl(Login);