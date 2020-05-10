import React from "react";
import BootstrapTreeTable from 'bootstrap-react-treetable';
import ReactDOM from "react-dom";


import {post, postAdonis} from "../../../utils/api.js"
import { injectIntl } from "react-intl";
import Switch from "react-switch";
import InputMask from 'react-input-mask';
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { toast, Slide } from 'react-toastify';
import makeAnimated from "react-select/animated"


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
  Form,
  CustomInput,
  Button,
  FormGroup,
  Label,
  CardFooter,
} from "reactstrap";
import { numericLiteral } from "@babel/types";

function validaBooleanString(string){
    if (string === "False" || string === "false" || string === "F" || string === "f")
        return false;
    else
        return true;
}

function converteAcessoCheckLista(visitantes,motorista){
    let lista = [];
    if (visitantes === "True")
        lista.push(0);
    if (motorista === "True")
        lista.push(1);
    return(lista);
}

function converteAcessoListaCheck(lista){
    let checks = [false, false];
    for (var i = 0, j = lista.length; i < j; i++){
        checks[lista[i]] = true;
    }
    return (checks);
}

function converteMinutosHora(minutos){
    let horas = Math.floor(minutos/60);
    let min = minutos%60;
    return(("00"+horas).slice(-2)+":"+("00"+min).slice(-2));
}

function converterHorasMinutos(horas){
    let minutos = horas.split(":");
    return(minutos[0]*60 + minutos[1]);
}

function FiltroUtilizacao(props){
    const [valor, setValor] = React.useState(props.value);
  
    function handleChange(event) {
      setValor(event);
      props.onChangeUtilizacao(event);
      //props.onChangeFinalidade(event);
    }

    const restricoes = [
        props.stringTranslate("Coletor.pag.dadosB.utilizacao.opcao.ponto"),
        props.stringTranslate("Coletor.pag.dadosB.utilizacao.opcao.acesso"),
        props.stringTranslate("Coletor.pag.dadosB.utilizacao.opcao.pontoAcesso"),
        props.stringTranslate("Coletor.pag.dadosB.utilizacao.opcao.refeitorio"),
        props.stringTranslate("Coletor.pag.dadosB.utilizacao.opcao.balcao"),
        props.stringTranslate("Coletor.pag.dadosB.utilizacao.opcao.rep"),
        props.stringTranslate("Coletor.pag.dadosB.utilizacao.opcao.cargaRefeitorio"),
    ];
  
    const animatedComponents = makeAnimated();
    const options = restricoes.map((prop, key) => {
        return(                
            {value:key,label:prop}
        );
    })
  
    return(
      <FormGroup>
          <Label>{props.stringTranslate("Coletor.pag.dadosB.utilizacao")}</Label>
      <Select   
        isDisabled = {!props.editavel}   
        closeMenuOnSelect={false}
        components={animatedComponents}
        options={options}
        value={options[valor]}
        defaultValue={options[0]}
        onChange={(e) => handleChange(e)}
        
      />
      </FormGroup>
    )
  }

  function FiltroDirecaoPermitida(props){
    const [valor, setValor] = React.useState(props.value);
  
    function handleChange(event) {
      setValor(event);
      props.onChangeDirecaoPermitida(event);
      //props.onChangeFinalidade(event);
    }

    const restricoes = [
        props.stringTranslate("Coletor.pag.dadosB.direcaoPermitida.opcao.entradaSaida"),
        props.stringTranslate("Coletor.pag.dadosB.direcaoPermitida.opcao.entrada"),
        props.stringTranslate("Coletor.pag.dadosB.direcaoPermitida.opcao.saida"),
    ];
  
    const animatedComponents = makeAnimated();
    const options = restricoes.map((prop, key) => {
        return(                
            {value:key,label:prop}
        );
    })

    return(
      <FormGroup>
          <Label>{props.stringTranslate("Coletor.pag.dadosB.direcaoPermitida")}</Label>
      <Select   
        isDisabled = {!props.editavel}   
        components={animatedComponents}
        options={options}
        value={options[valor]}
        defaultValue={options[0]}
        onChange={(e) => handleChange(e)}
      />
      </FormGroup>
    )
  }

  function FiltroAcesso(props){
    const [reestricao, setRestricao] = React.useState();
  
    function handleChange(event) {
      setRestricao(event);
      props.onChangeAcesso(event);
    }

    const restricoes = [
        props.stringTranslate("Coletor.pag.dadosB.acesso.opcao.visitantes"),
        props.stringTranslate("Coletor.pag.dadosB.acesso.opcao.exigeMotorista"),
    ];
  
    const animatedComponents = makeAnimated();
    const options = restricoes.map((prop, key) => {
        return(                
            {value:key,label:prop}
        );
    })
  
    let vetores = []
    for (var i = 0, j = props.value.length; i < j; i++){
        vetores.push(options[props.value[i]]);
    }
    return(
      <FormGroup>
          <Label>{props.stringTranslate("Coletor.pag.dadosB.acesso")}</Label>
      <Select   
        isDisabled = {!props.editavel}   
        isMulti
        defaultValue={vetores}
        closeMenuOnSelect={false}
        components={animatedComponents}
        options={options}
        placeholder={""}
        onChange={(e) => handleChange(e)}
        
      />
      </FormGroup>
    )
  }


  function SelectEmpresa(props){
    const [reestricao, setRestricao] = React.useState();
    const [valor, setValor] = React.useState(null);

    let listaEmpresas = [];
    let id = props.value;

    function carregaEmpresa(inputValue, callback){
        const body = {
            "token": sessionStorage.getItem("token"),
            "cmd": "listasecaolotacaoempresa",
        }
        postAdonis(body, '/Empresa').then((data1) =>{
            if (data1.error === undefined){
                let empresas = data1.dados;
                empresas.map((prop) =>{
                    if (id === prop.CODEMPRESA)
                        setValor({value: prop.CODEMPRESA, label: prop.NOME});
                    listaEmpresas.push({value:prop.CODEMPRESA, label: prop.NOME})
                })
                if (Boolean(callback) !== false){
                    callback(listaEmpresas);
                }
            }else{
                toast.error(props.stringTranslate("Error: " +data1.msg), {
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

  
    function handleChange(event) {
      setValor(event);
      props.onChangeEmpresa(event);
    }

    const restricoes = [];
  
    const animatedComponents = makeAnimated();
    // const options = props.lista.map((prop) => {
    //     return(                
    //         {value:props.value,label:prop.label}
    //     );
    // })

    return(
      <FormGroup>
          <Label>{props.stringTranslate("Coletor.pag.dadosB.empresa")}</Label>
      <AsyncSelect   
        isLoading
        defaultOptions
        value={valor}
        isDisabled = {!props.editavel} 
        components={animatedComponents}
        loadOptions={(inputValue, callback) => carregaEmpresa(inputValue, callback)}
        placeholder={props.stringTranslate("Coletor.pag.dadosB.selecioneEmpresa")}
        onChange={(e) => handleChange(e)}
      />
      </FormGroup>
    )
  }

  function SelectFormatoColeta(props){
    const [reestricao, setRestricao] = React.useState();
    const [valor, setValor] = React.useState(props.value);

    let id = parseInt(props.value);
  


    function carregaFormatos(inputValue, callback){
        const body = {
            "token": sessionStorage.getItem("token"),
            "cmd": "listaFormatosColeta"
        }
        postAdonis(body, '/Geral/FormatosColeta').then((data) => {
            if (data.error === undefined){
                let formatos = [];
                data.dados.map((prop) =>{
                    if (id === parseInt(prop.cod)){
                        setValor({value: parseInt(prop.cod), label: prop.nome});
                    }
                    formatos.push({value: parseInt(prop.cod), label: prop.nome});
                })
                callback(formatos);
            }else{
                toast.error(props.stringTranslate("Error: "+data.msg), {
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
  
    function handleChange(event) {
      setValor(event);
      props.onChangeFormatoArquivo(event);
    }

    const restricoes = [];
  
    const animatedComponents = makeAnimated();
    const options = restricoes.map((prop, key) => {
        return(                
            {value:key,label:prop}
        );
    })
  
    return(
      <FormGroup>
          <Label>{props.stringTranslate("Coletor.pag.dadosB.offLine.formatoDadosColeta")}</Label>
      <AsyncSelect   
        isDisabled = {!props.editavel}   
        isLoading
        value={valor}
        defaultOptions
        loadOptions={(inputValue, callback) => carregaFormatos(inputValue, callback)}
        components={animatedComponents}
        onChange={(e) => handleChange(e)}
      />
      </FormGroup>
    )
  }


class DadosBasicos extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            toggleCollapse:false,
            listaEmpresas:[],
            listaFormatos:[],

            nome: this.props.stateP.nome,
            ativo: this.props.stateP.ativo,
            utilizacao: this.props.stateP.utilizacao,
            direcaoPermitida: this.props.stateP.direcaoPermitida,
            numIdentificacao: this.props.stateP.numIdentificacao,
            acesso: this.props.stateP.acesso,
            expirarEntrada: this.props.stateP.expirarEntrada,
            empresa: this.props.stateP.empresa,
            caminhoDiretorio: this.props.stateP.caminhoDiretorio,
            incluiNomeArquivo: this.props.stateP.incluiNomeArquivo,
            formatoArquivo: this.props.stateP.formatoArquivo,
        };
        this.editavel = this.props.editavel;
        this.stringTranslate = this.stringTranslate.bind(this);
        this.geraNumColetor = this.geraNumColetor.bind(this);
        this.toggleCollapse = this.toggleCollapse.bind(this);
        this._addDirectory = this._addDirectory.bind(this);
        this.handleFile = this.handleFile.bind(this);

        this.handleChangeUtilizacao = this.handleChangeUtilizacao.bind(this);
        this.handleChangeDirecaoPermitida = this.handleChangeDirecaoPermitida.bind(this);
        this.handleChangeNumIdentificacao = this.handleChangeNumIdentificacao.bind(this);
        this.handleChangeAcesso = this.handleChangeAcesso.bind(this);
        this.handleChangeExpirarEntrada = this.handleChangeExpirarEntrada.bind(this);
        this.handleChangeEmpresa = this.handleChangeEmpresa.bind(this);
        this.handleChangeCaminhoDiretorio = this.handleChangeCaminhoDiretorio.bind(this);
        this.handleChangeFormatoArquivo = this.handleChangeFormatoArquivo.bind(this);
        this.handleChangeNome = this.handleChangeNome.bind(this);
        this.toggleAtivo = this.toggleAtivo.bind(this);

        this.salvar = this.salvar.bind(this);

        if (this.props.salvar){
            this.salvar();
        }
    }


    componentDidMount(){
        // if (Boolean(this.state.caminhoDiretorio) !== false){
        //     let campo = document.getElementById("caminho");
        //     campo.parentElement.firstChild.children[1].innerHTML = this.state.caminhoDiretorio;
        // }
    }

    geraNumColetor(){
        const body = {
            cmd: "geraNumColetor",
            token: sessionStorage.getItem("token"),
        }
        postAdonis(body, '/Coletor/GeraNumColetor').then((data) =>{
            console.log(data);
            if (data.error === undefined){
                this.props.DBF.handleChangeNumIdentificacao(data.dados);
                this.state.numIdentificacao = data.dados;
                this.setState({numIdentificacao: this.state.numIdentificacao});
            }else{
                toast.dismiss();
                toast.error("Error: "+data.mensagem, {
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

    toggleCollapse(event){
        this.setState({incluiNomeArquivo: !this.state.incluiNomeArquivo});
        this.props.DBF.toggleCollapse();
    }
    toggleAtivo(){
        this.setState({ativo: !this.state.ativo});
        this.props.DBF.toggleAtivo();
    }
    handleChangeUtilizacao(event){
        //this.setState({utilizacao: event.value});
        this.props.DBF.handleChangeUtilizacao(event);
    }
    handleChangeDirecaoPermitida(event){
        //this.setState({direcaoPermitida: event.value});
        this.props.DBF.handleChangeDirecaoPermitida(event);
    }
    handleChangeNumIdentificacao(event){
        //this.setState({numIdentificacao: event.target.value});
        this.props.DBF.handleChangeNumIdentificacao(event.target.value);
    }
    handleChangeAcesso(event){
        // if (event !== null)
        //     this.setState({acesso: event.map((prop) => {return prop.value})});
        // else 
        //     this.setState({acesso: []});
        this.props.DBF.handleChangeAcesso(event);
    }
    handleChangeExpirarEntrada(event){
        var val = event.target.value.split(":");
        if (parseInt(val[1]) >= 60){
            val[1] = "59";
        }
        val = val[0]+":"+val[1];
        this.setState({expirarEntrada: val});
        this.props.DBF.handleChangeExpirarEntrada(event);
    }
    handleChangeEmpresa(event){
        //this.setState({empresa: event.value});
        this.props.DBF.handleChangeEmpresa(event);
    }
    handleChangeCaminhoDiretorio(event){
        // event.target.parentElement.firstChild.children[1].innerHTML = event.target.value;
        // this.setState({caminhoDiretorio: event.target.value});
        this.props.DBF.handleChangeCaminhoDiretorio(event);
    }
    handleChangeFormatoArquivo(event){
        // this.setState({formatoArquivo: event.value});
        this.props.DBF.handleChangeFormatoArquivo(event);
    }

    handleChangeNome(event){
        this.props.DBF.handleChangeNome(event);
    }

    stringTranslate(id){
        return this.props.intl.formatMessage({id: id});
    }

    toggleCollapse(){
        this.setState({incluiNomeArquivo: !this.state.incluiNomeArquivo})
        this.props.DBF.handleChangeIncluirNomeArquivo();
    }

    _addDirectory(node) {
        if (node) {
          node.directory = true;
          node.webkitdirectory = true;
        }
      }

    handleFile(event){
        event.target.parentElement.firstChild.children[1].innerHTML = "OLAH";
    }

    salvar(){
        console.log("Salvar");
    }


    render(){
        return(
            <>
            <div>
                <Card>
                    <CardHeader>
                        <h4>{this.stringTranslate("Coletor.dadosB.titulo")}</h4>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col>
                                <Label>{this.stringTranslate("Coletor.dadosB.nome")}</Label>
                                <Input defaultValue={this.state.nome} onChange={this.handleChangeNome} disabled={!this.editavel} type="text" />
                            </Col>
                            <Col>
                                <FormGroup>
                                    <Label>{this.stringTranslate("Coletor.dadosB.numeroIdentificacao")}</Label>
                                    <Input defaultValue={this.state.numIdentificacao} onChange={this.handleChangeNumIdentificacao} disabled={!this.editavel} type="text" />
                                </FormGroup>
                            </Col>
                            <Col>
                                <Button color="primary" onClick={this.geraNumColetor} style={{marginTop:"26px"}}>{this.stringTranslate("Coletor.dadosB.gerarNum")}</Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <FiltroDirecaoPermitida value={this.state.direcaoPermitida} onChangeDirecaoPermitida={this.handleChangeDirecaoPermitida} editavel={this.editavel} stringTranslate={this.stringTranslate}/>
                            </Col>
                            <Col>
                                <FiltroUtilizacao value={this.state.utilizacao} onChangeUtilizacao={this.handleChangeUtilizacao} editavel={this.editavel} stringTranslate={this.stringTranslate}/>
                            </Col>
                            <Col md={4}>
                                <FormGroup>
                                    <Label>{this.stringTranslate("Coletor.dadosB.expirarEntrada")}</Label>
                                    <Input onChange={this.handleChangeExpirarEntrada} disabled={!this.editavel} type="text" 
                                    mask="99:99" maskChar={null}
                                    value={this.state.expirarEntrada}
                                    tag={InputMask}/>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <FiltroAcesso value={this.state.acesso} onChangeAcesso={this.handleChangeAcesso} stringTranslate={this.stringTranslate} editavel={this.editavel} />
                            </Col>
                            <Col>
                                <SelectEmpresa value={this.state.empresa} carregaEmpresa={this.carregaEmpresa} onChangeEmpresa={this.handleChangeEmpresa} stringTranslate={this.stringTranslate} editavel={this.editavel} />
                            </Col>
                            <Col>
                                <SelectFormatoColeta value={this.state.formatoArquivo} carregaFormatos={this.carregaFormatos} onChangeFormatoArquivo={this.handleChangeFormatoArquivo} editavel={this.editavel} stringTranslate={this.stringTranslate} />
                            </Col>
                        </Row>
                        <Row> 
                            <Col>
                                <FormGroup> 
                                    <Switch 
                                        disabled={!this.editavel}
                                        onChange={this.toggleAtivo} 
                                        checked={this.state.ativo}  
                                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)" 
                                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)" 
                                        height={20}
                                        width={40}
                                        className="react-switch"
                                    /> <Label onClick={this.toggleCollapse} >{this.stringTranslate("Coletor.dadosB.ativo")}</Label>
                                </FormGroup>  
                            </Col>                  
                        </Row>
                    </CardBody>
                </Card>
            </div>
            </>
        )
    }
}

export default injectIntl(DadosBasicos);