import React from "react";
import BootstrapTreeTable from 'bootstrap-react-treetable';
import ReactDOM from "react-dom";
import Tabela from "../../components/Tabela/Tabela"


import {post, postAdonis} from "../../utils/api.js"
import { injectIntl } from "react-intl";
import { toast, Slide } from 'react-toastify';
import Select from "react-select";
import AsyncSelect from "react-select/async";
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
  Button,
  CardFooter,
  Modal,
  ModalHeader,
  ModalFooter,
  ModalBody,
  UncontrolledTooltip,
  FormGroup,
  Label
} from "reactstrap";
import {Spin} from "antd";
import { callbackify } from "util";

var atualizou = false;

function ContidoEm(props){
    let val = null;
    props.ambientes.map((prop, key) => {
        if(prop.CodAmbienteAcesso === props.value){
            val = {value:key, label:prop.Nome, key:prop.CodAmbienteAcesso}
        }
    })

    const [valor, setValor] = React.useState(val);
  
    function handleChange(event) {
      setValor(event);
      console.log(event);
      props.onChangeContidoEm(event);
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
        <Label>{props.stringTranslate("Coletor.modalAmbiente.contidoEm")}</Label>
      <Select     
        options={props.opcoes} 
        closeMenuOnSelect={false}
        components={animatedComponents}
        onChange={(e) => handleChange(e)}
        value={valor}
      />
      </FormGroup>
    )
  }

  function SelectEmpresa(props){
    const [valor, setValor] = React.useState();
  
    function handleChange(event) {
      setValor(event);
      props.onChangeEmpresa(event);
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
        <Label>{props.stringTranslate("Coletor.modalAmbiente.empresa")}</Label>
        <AsyncSelect  
        isLoading
        defaultOptions    
        loadOptions={(inputValue, callback) => props.load(inputValue, callback, setValor)}
        value={valor}     
        closeMenuOnSelect={false}
        components={animatedComponents}
        onChange={(e) => handleChange(e)}
      />
      </FormGroup>
    )
  }

  function SelectLotacao(props){
    const [valor, setValor] = React.useState();
  
    function handleChange(event) {
      setValor(event);
      console.log(event);
      props.onChangeLotacao(event);
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
        <Label>{props.stringTranslate("Coletor.modalAmbiente.lotacao")}</Label>
        <AsyncSelect  
        isLoading
        defaultOptions    
        loadOptions={(inputValue, callback) => props.load(inputValue, callback, setValor)}
        value={valor}   
        closeMenuOnSelect={false}
        components={animatedComponents}
        onChange={(e) => handleChange(e)}
        
      />
      </FormGroup>
    )
  }

  function SelectSecao(props){
    const [valor, setValor] = React.useState();
  
    function handleChange(event) {
      setValor(event);
      props.onChangeSecao(event);
      console.log(event);
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
        <Label>{props.stringTranslate("Coletor.modalAmbiente.secao")}</Label>
      <AsyncSelect  
        isLoading
        defaultOptions    
        loadOptions={(inputValue, callback) => props.load(inputValue, callback, setValor)}
        value={valor}
        closeMenuOnSelect={false}
        components={animatedComponents}
        onChange={(e) => handleChange(e)}
      />
      </FormGroup>
    )
  }

class ModalCategoriaPessoas extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            modal: false,
            salvando: false,
            reload: true,
            listaEmpresa: null,
            listaLotacao: null,
            listaSecao: null,
            carregamento: false,
            mudou: false,

            codigo: Boolean(this.props.dados) !== false ? this.props.dados.CodAmbienteAcesso : 0,
            nome: Boolean(this.props.dados) !== false ? this.props.dados.Nome : null,
            numero: Boolean(this.props.dados) !== false ?  this.props.dados.Numero : null,
            contidoEm: Boolean(this.props.dados) !== false ? this.props.dados.CodAmbienteExterno : null,
            empresa: Boolean(this.props.dados) !== false ? this.props.dados.Nome : null,
            lotacao:  Boolean(this.props.dados) !== false ? this.props.dados.Nome : null,
            secao:  Boolean(this.props.dados) !== false ? {value:this.props.dados.CodSecao, label:null} : null,
        }

        console.log(this.props.dados);

        this.editavel = this.props.editavel;
        this.tipo = this.props.tipo;
        this.toggle = this.toggle.bind(this);
        this.handleChangeNome = this.handleChangeNome.bind(this);
        this.handleClickSalvar = this.handleClickSalvar.bind(this);
        this.handleChangeNumero = this.handleChangeNumero.bind(this);
        this.handleChangeSecao = this.handleChangeSecao.bind(this);
        this.handleChangeLotacao = this.handleChangeLotacao.bind(this);
        this.handleChangeEmpresa = this.handleChangeEmpresa.bind(this);
        this.handleChangeContidoEm = this.handleChangeContidoEm.bind(this);
        this.stringTranslate = this.stringTranslate.bind(this);
        this.loadEmpresa = this.loadEmpresa.bind(this);
        this.loadLotacao = this.loadLotacao.bind(this);
        this.loadSecao = this.loadSecao.bind(this);
        this.handleClickRemove = this.handleClickRemove.bind(this);
        this.handleClickSalvar = this.handleClickSalvar.bind(this);

        this.empresas = [];
        this.lotacoes = [];
        this.secoes = [];

        this.select = null;
        this.atualizaELS();
        this.footer = null;
        this.button = null;
    }

    componentDidMount(){
        this.atualizaELS();
    }

    atualizaELS(){
        const body = {
            "cmd": "listasecaolotacaoempresa",
            "token": sessionStorage.getItem("token"),
          }
          postAdonis(body, '/Empresa/Lista').then((dato) =>{
            if(dato.error === undefined){
                if (this.state.secao !== null){
                    var data = dato.dados;
                    let mSecao = [], mLotacao = [];
                    this.secoes = data.secao.map(prop =>{
                        if (prop.CodSecao === this.state.secao.value){
                            this.state.secao = {value: prop.CodSecao, label: prop.Nome};
                            this.state.lotacao = {value:prop.CodLotacao, label:null};
                            this.setState({secao:this.state.secao, lotacao: this.state.lotacao})
                        }
                        //return({value: prop.codSecao, label: prop.Nome});
                        return (prop);
                    });
                    this.lotacoes = data.lotacao.map(prop =>{
                        if (prop.CodLotacao === this.state.lotacao.value){
                            for(var i = 0, j = this.secoes.length; i < j; i++){
                                if (this.secoes[i].codLotacao === prop.CodLotacao){
                                this.secoes[i].nomeLotacao = prop.Nome;
                                mSecao.push({value: this.secoes[i].codSecao, label: this.secoes[i].Nome});
                                }
                            }
                            this.state.lotacao = {value: prop.CodLotacao, label: prop.Nome};
                            this.state.empresa = {value:prop.CodEmpresa, label:null};
                            this.setState({lotacao: this.state.lotacao, empresa: this.state.empresa})
                        }
                        //return({value: prop.codLotacao, label: prop.Nome});
                        return(prop);
                    });
                    this.empresas = data.empresa.map(prop =>{
                        if (prop.CodEmpresa === this.state.empresa.value){
                            for (var i = 0, j = this.lotacoes.length; i < j; i++){
                                if (this.lotacoes[i].CodEmpresa === prop.CodEmpresa){
                                this.lotacoes[i].NomeEmpresa = prop.Nome;
                                mLotacao.push({value: this.lotacoes[i].CodLotacao, label: this.lotacoes[i].Nome});
                                }
                            }
                            this.state.empresa = {value: prop.CodEmpresa, label: prop.Nome};
                            this.setState({empresa: this.state.empresa})
                        }
                        return({value: prop.CodEmpresa, label: prop.Nome});
                    })
                    this.setState({listaSecao:mSecao, listaLotacao: mLotacao, listaEmpresa: this.empresas, carregamento:true});
                }else{
                    var data = dato.dados;
                    this.secoes = data.secao.map(prop =>{
                        return (prop);
                    });
                    // for (var i = 0, j = data.empresa.length; i < j; i++){
                    //     for (var k = 0, l = data.empresa[i].children.length; k < l; k++){
                    //         for (var m = 0, n = data.empresa[i].children[k].length; m < n; m++){
                    //             this.secoes.push(data.empresa[i].children[k].children[m]);
                    //         }
                    //     }
                    // }
                    this.lotacoes = data.lotacao.map(prop =>{
                        return(prop);
                    });
                    // for (var i = 0, j = data.empresa.length; i < j; i++){
                    //     for (var k = 0, l = data.empresa[i].children.length; k < l; k++){
                    //         data.empresa[i].children[k].NomeEmpresa = data.empresa[i].Nome;
                    //         this.lotacoes.push(data.empresa[i].children[k]);
                    //     }
                    // }
                    this.empresas = data.empresa.map(prop =>{
                        return({value: prop.CodEmpresa, label: prop.Nome});
                    })
                    this.setState({listaEmpresa: this.empresas, carregamento:true});
                }
            }else{
                toast.error(this.stringTranslate("Error: "+dato.msg), {
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

    loadSecao(inputValue, callback, setValor){
        let intervalo = setInterval(() =>{
            if(this.state.carregamento){
                setValor(this.state.secao);
                clearInterval(intervalo);
                callback(this.state.listaSecao);
            }
        }, 1000)
    }
    

    loadLotacao(inputValue, callback, setValor){
        let intervalo = setInterval(() =>{
            if(this.state.carregamento){
                setValor(this.state.lotacao);
                clearInterval(intervalo);
                callback(this.state.listaLotacao);
            }
        }, 1000)
    }

    loadEmpresa(inputValue, callback, setValor){
        let intervalo = setInterval(() =>{
            if(this.state.carregamento){
                setValor(this.state.empresa);
                clearInterval(intervalo);
                callback(this.state.listaEmpresa);
            }
        }, 1000)
    }

    // loadSecao(inputValue, callback){
    //     const body = {
    //         "cmd": "consultaCodigoSecao",
    //         "token": sessionStorage.getItem("token"),
    //         "codigo": this.state.secao,
    //     }
    //     post(body).then((data) => {
    //         console.log(data);
    //         if (data.retorno){
    //             this.state.lotacao = data.dados.secao.codLotacao;
    //             this.setState({lotacao: this.state.lotacao});
    //             const body2 = {
    //                 "cmd": "consultaCodigoLotacao",
    //                 "token": sessionStorage.getItem("token"),
    //                 "codigo": this.state.secao,
    //             }
    //             post(body2).then((data) =>{
    //                 if (data.retorno){
    //                     this.state.empresa = data.dados.lotacao.codEmpresa;
    //                     this.setState({empresa: this.state.empresa});
    //                 }
    //             })
    //         }
    //     })
    // }

    handleChangeNome(event){
        this.setState({nome: event.target.value});
    }
    handleChangeNumero(event){
        this.setState({numero: event.target.value});
    }
    handleChangeContidoEm(event){
        this.setState({contidoEm: event.key});
    }
    handleChangeEmpresa(event){
        this.state.empresa = event;

        let mLotacao = [];
        for (var i = 0, j = this.lotacoes.length; i < j; i++){
            if (this.lotacoes[i].CodEmpresa === event.value){
            mLotacao.push({value:this.lotacoes[i].CodLotacao, label:this.lotacoes[i].Nome});
            }
        }

        this.state.lotacao = "";
        this.state.secao = "";
        this.state.listaLotacao = mLotacao;
        this.state.listaSecao = [];
        this.state.carregamento = false;
        this.setState({empresa: this.state.empresa, 
            listaLotacao:this.state.listaLotacao, 
            listaSecao:this.state.listaSecao, 
            carregamento:this.state.carregamento,
            secao: this.state.secao,
            lotacao:this.state.lotacao});
        this.setState({mudou: true, carregamento: true});
    }
    handleChangeLotacao(event){
        this.state.lotacao = event;

        let mSecao = [];
        for (var i = 0, j = this.secoes.length; i < j; i++){
            if (this.secoes[i].CodLotacao === event.value){
            mSecao.push({value:this.secoes[i].CodSecao, label:this.secoes[i].Nome});
            }
        }

        this.state.secao = "";
        this.state.listaSecao = mSecao;
        this.state.carregamento = false;
        this.setState({
            listaSecao:this.state.listaSecao, 
            carregamento:this.state.carregamento,
            secao: this.state.secao,
            });
        this.setState({mudou: true, carregamento: true});
    }
    handleChangeSecao(event){
        this.setState({secao: event});
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

    handleClickSalvar(){
        this.setState({salvando: true});
        const body = {
            "cmd": "incluirAmbienteConectado",
            "token": sessionStorage.getItem("token"),
            "nome": this.state.nome,
            "codigo": this.state.codigo,
            "numero": this.state.numero,
            "codContido": this.state.contidoEm,
            "codSecao": this.state.secao.value,
            "codlocal": this.props.codLocal,
            "tipo": this.props.tipo,
        }
        postAdonis(body, '/LocalAcesso/Ambientes/Salvar').then((data) => {
            if (data.erro === undefined){
                console.log(body);
                console.log(data);
                this.props.atualizaComponentesConectados();
                this.props.setReload(!this.props.reload);
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
            this.setState({salvando: false})
        })

    }

    handleClickRemove(){
        const body = {
            "cmd": "excluirAmbienteConectado",
            "codLocal": this.props.codLocal, 
            "token": sessionStorage.getItem("token"),
            "codigo": this.state.codigo,
        }
        postAdonis(body, '/LocalAcesso/Ambientes/Excluir').then((data) => {
            if (data.erro === undefined){
                console.log(body);
                console.log(data);
                this.props.atualizaComponentesConectados();
                this.props.setReload(!this.props.reload);
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
                this.render(); 
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


    render(){
        if (this.tipo === "del"){
            this.tipo = "edit";
            this.handleClickRemove();
            return(null);
        }
        if (this.state.mudou){
            this.select = null;
            this.setState({mudou: false});
        }else{
            this.select = <>{this.editavel ? (
                <>
                <SelectEmpresa carregamento={this.state.carregamento} load={this.loadEmpresa} onChangeEmpresa={this.handleChangeEmpresa} stringTranslate={this.stringTranslate} />
                <SelectLotacao carregamento={this.state.carregamento} load={this.loadLotacao} onChangeLotacao={this.handleChangeLotacao} stringTranslate={this.stringTranslate} />
                </>
                ) : null}
                <SelectSecao carregamento={this.state.carregamento} load={this.loadSecao} value={this.state.secao} onChangeSecao={this.handleChangeSecao} stringTranslate={this.stringTranslate}/>
                </>;
        }
        if (this.editavel){
            this.footer = <>
            <Row>
                <Col>
                    <Button onClick={this.handleClickSalvar} block>{this.stringTranslate("Categoria.Modal.Salvar")}</Button>
                </Col>
                <Col>
                    <Button onClick={this.props.toggle} block>{this.stringTranslate("Categoria.Modal.Cancelar")}</Button>
                </Col>
            </Row></>;
        }else{
            this.footer = <>
            <Row>
                <Col>
                    <Button onClick={this.props.toggle} block>{this.stringTranslate("Categoria.Modal.Sair")}</Button>
                </Col>
            </Row>
            </>
        }

        return(
            <>
            <Modal isOpen={this.props.isOpened} style={{minWidth:"75%", marginTop:"-10%"}}>
                <ModalHeader toggle={this.props.toggle}>
                    <h4>{this.stringTranslate("Coletor.ambienteConectado")}:</h4>
                </ModalHeader>
                <ModalBody>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label>{this.stringTranslate("Coletor.modalAmbiente.nome")}</Label>
                                <Input onChange={this.handleChangeNome} value={this.state.nome} type="text" disabled={!this.editavel} />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label>{this.stringTranslate("Coletor.modalAmbiente.numero")}</Label>
                                <Input onChange={this.handleChangeNumero} value={this.state.numero} type="text" disabled={!this.editavel} />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormGroup>
                                <ContidoEm ambientes={this.props.ambientes} opcoes={this.props.opcoes} value={this.state.contidoEm} onChangeContidoEm={this.handleChangeContidoEm} stringTranslate={this.stringTranslate} />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Card>
                            <CardHeader>
                                {this.stringTranslate("Coletor.modalAmbiente.secao")}
                            </CardHeader>
                            <CardBody>
                                {this.select}
                            </CardBody>
                        </Card>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    {this.footer}
                </ModalFooter>
            </Modal>
            </>
        )
    }
}

export default injectIntl(ModalCategoriaPessoas);