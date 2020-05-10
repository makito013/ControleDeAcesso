import React from "react";
import BootstrapTreeTable from 'bootstrap-react-treetable';
import ReactDOM from "react-dom";



import {post, postAdonis} from "../../../utils/api.js"
import { injectIntl } from "react-intl";
import Switch from "react-switch";
import InputMask from 'react-input-mask';
import Select from "react-select";
import makeAnimated from "react-select/animated"


import {
  CardImg,
  Card,
  CardHeader,
  CardBody,
  //CardFooter,
  Row,
  Col,
  Form,
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


function validaBooleanString(string){
    if (string === "False" || string === "false" || string === "F" || string === "f")
        return false;
    else
        return true;
}

function converteOperacaoCheckLista(opcoes){
    let lista = [];
    for (var i = 0, j = opcoes.length; i < j; i++){
        if (validaBooleanString(opcoes[i]))
            lista.push(i);
    }
    return(lista);
}


function SelectOpcoesEspeciais(props){
    const [reestricao, setRestricao] = React.useState();
  
    function handleChange(event) {
      setRestricao(event);
      props.onChangeOpcoesEspeciais(event);
    }

    const restricoes = [
        props.stringTranslate("Coletor.pag.detalhes.opcoesEspeciais.opcoes.aberturaFechamento"),
        props.stringTranslate("Coletor.pag.detalhes.opcoesEspeciais.opcoes.apenasUmAcionamentoAposAbrir"),
    ];
  
    const animatedComponents = makeAnimated();
    const options = restricoes.map((prop, key) => {
        return(                
            {value:key,label:prop}
        );
    })

    let vetores = [];
    if (props.value !== null){
        for (var i = 0, j = props.value.length; i < j; i++){
            vetores.push(options[props.value[i]]);
        }
    }
  
    return(
      <FormGroup>
          <Label>{props.stringTranslate("Coletor.pag.detalhes.opcoesEspeciais")}</Label>
      <Select   
        isMulti
        isDisabled = {!props.editavel}   
        defaultValue={vetores}
        closeMenuOnSelect={false}
        components={animatedComponents}
        placeholder={""}
        options={options}
        onChange={(e) => handleChange(e)}
      />
      </FormGroup>
    )
  }

  function SelectPictograma(props){
    const [valor, setValor] = React.useState(props.value);
  
    function handleChange(event) {
      setValor(event);
      props.onChangePictograma(event);
    }

    const restricoes = [
        props.stringTranslate("Coletor.pag.detalhes.pictograma.opcoes.nenhum"),
        props.stringTranslate("Coletor.pag.detalhes.pictograma.opcoes.western"),
        props.stringTranslate("Coletor.pag.detalhes.pictograma.opcoes.digicom"),
        props.stringTranslate("Coletor.pag.detalhes.pictograma.opcoes.blantech"),
        props.stringTranslate("Coletor.pag.detalhes.pictograma.opcoes.trix"),
    ];
  
    const animatedComponents = makeAnimated();
    const options = restricoes.map((prop, key) => {
        return(                
            {value:key,label:prop}
        );
    })
  
    
    return(
      <FormGroup>
          <Label>{props.stringTranslate("Coletor.pag.detalhes.pictograma")}</Label>
      <Select
        value={options[valor]}
        isDisabled = {!props.editavel}   
        closeMenuOnSelect={false}
        components={animatedComponents}
        defaultValue={options[0]}
        options={options}
        onChange={(e) => handleChange(e)}
      />
      </FormGroup>
    )
  }

  function SelectOperacaoModoLiberado(props){
    const [valor, setValor] = React.useState(props.value);
  
    function handleChange(event) {
      setValor(event);
      props.onChangeModoLiberado(event);
    }

    const restricoes = [
        props.stringTranslate("Coletor.pag.detalhes.modoLiberado.opcao.naoFazNada"),
        props.stringTranslate("Coletor.pag.detalhes.modoLiberado.opcao.tempoIndeterminado"),
        props.stringTranslate("Coletor.pag.detalhes.modoLiberado.opcao.conformeCadastro"),
    ];
  
    const animatedComponents = makeAnimated();
    const options = restricoes.map((prop, key) => {
        return(                
            {value:key,label:prop}
        );
    })
  
    return(
      <FormGroup>
          <Label>{props.stringTranslate("Coletor.pag.detalhes.modoLiberado")}</Label>
      <Select
        isDisabled = {!props.editavel}   
        closeMenuOnSelect={false}
        components={animatedComponents}
        defaultValue={options[0]}
        value={options[valor]}
        options={options}
        onChange={(e) => handleChange(e)}
      />
      </FormGroup>
    )
  }

class Detalhes extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            opcoesEspeciais: this.props.stateP.opcoesEspeciais,
            pictograma: this.props.stateP.pictograma,
            dispositivo: this.props.stateP.dispositivo,
            tempo: this.props.stateP.tempo,
            mensagemPadrao: this.props.stateP.mensagemPadrao,
            caracteres: this.props.stateP.caracteres,
            comoSenha: this.props.stateP.comoSenha,
            modoLiberado: this.props.stateP.modoLiberado,
        }
        this.editavel = this.props.editavel;
        this.stringTranslate = this.stringTranslate.bind(this);

        this.handleChangeOpcoesEspeciais = this.handleChangeOpcoesEspeciais.bind(this);
        this.handleChangePictograma = this.handleChangePictograma.bind(this);
        this.handleChangeDispositivo = this.handleChangeDispositivo.bind(this);
        this.handleChangeTempo = this.handleChangeTempo.bind(this);
        this.handleChangeMensagemPadrao = this.handleChangeMensagemPadrao.bind(this);
        this.handleChangeCaracteres = this.handleChangeCaracteres.bind(this);
        this.handleChangeComoSenha = this.handleChangeComoSenha.bind(this);
        this.handleChangeModoLiberado = this.handleChangeModoLiberado.bind(this);
    }

    handleChangeOpcoesEspeciais(event){
        //if (event !== null)
        //    this.setState({opcoesEspeciais: event.map((prop) => {return (prop.value) } ) } );
        //else
        //    this.setState({opcoesEspeciais: []});
        this.props.DF.handleChangeOpcoesEspeciais(event);
    }
    handleChangePictograma(event){
        //this.setState({pictograma: event.value});
        this.props.DF.handleChangePictograma(event);
    }
    handleChangeDispositivo(event){
        //this.setState({dispositivo: event.target.value});
        this.props.DF.handleChangeDispositivo(event);
    }
    handleChangeTempo(event){
        //this.setState({tempo: event.target.value});
        this.props.DF.handleChangeTempo(event);
    }
    handleChangeMensagemPadrao(event){
        //this.setState({mensagemPadrao: event.target.value});
        this.props.DF.handleChangeMensagemPadrao(event);
    }
    handleChangeCaracteres(event){
        //this.setState({caracteres: event.target.value});
        this.props.DF.handleChangeCaracteres(event);
    }
    handleChangeComoSenha(){
        this.setState({comoSenha:!this.state.comoSenha});
        this.props.DF.handleChangeComoSenha();
    }
    handleChangeModoLiberado(event){
        //this.setState({modoLiberado: event.value});
        this.props.DF.handleChangeModoLiberado(event);
    }

    stringTranslate(id){
        return this.props.intl.formatMessage({id: id});
    }

    render(){
        return(
            <>
            <div>
                <Row>
                    <Col md={8}>
                        <SelectOpcoesEspeciais value={this.state.opcoesEspeciais} onChangeOpcoesEspeciais={this.handleChangeOpcoesEspeciais} stringTranslate={this.stringTranslate} editavel={this.editavel} />
                    </Col>
                    <Col md={4}>
                        <SelectPictograma value={this.state.pictograma} onChangePictograma={this.handleChangePictograma} stringTranslate={this.stringTranslate} editavel={this.editavel} />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Card>
                            <CardHeader>{this.stringTranslate("Coletor.pag.detalhes.acionarEventos")}</CardHeader>
                            <CardBody>
                                <Row>
                                    <Col md={6}>
                                        <Form> 
                                            <FormGroup>
                                                <Label>{this.stringTranslate("Coletor.pag.detalhes.acionarEventos.dispositivo")}</Label>
                                                <Input disabled={!this.editavel} defaultValue={this.state.dispositivo} onChange={this.handleChangeDispositivo} type="text" />
                                            </FormGroup>
                                        </Form>
                                    </Col>
                                    <Col md={6}>
                                        <Form>
                                            <FormGroup>
                                                <Label>{this.stringTranslate("Coletor.pag.detalhes.acionarEventos.tempo")}</Label>
                                                <Input disabled={!this.editavel} defaultValue={this.state.tempo} onChange={this.handleChangeTempo} type="text" />
                                            </FormGroup>
                                        </Form>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <Label>{this.stringTranslate("Coletor.pag.detalhes.mensagemPadrao")}</Label>
                        <Form> 
                            <FormGroup>
                                <Label >{this.stringTranslate("Coletor.pag.detalhes.acionarEventos.texto")}</Label>
                                <Input disabled={!this.editavel} defaultValue={this.state.mensagemPadrao} onChange={this.handleChangeMensagemPadrao} type="text" />
                                {/* <Label>{this.state.caracteres+this.stringTranslate("Coletor.pag.detalhes.acionarEventos.caracteres")}</Label> */}
                            </FormGroup>
                        </Form>
                    </Col>
                    <Col md={6}>
                        <FormGroup style={{marginTop: "70px"}}> 
                            <Switch
                                disabled={!this.editavel} 
                                onChange={this.handleChangeComoSenha} 
                                checked={this.state.comoSenha}  
                                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)" 
                                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)" 
                                height={20}
                                width={40}
                                className="react-switch"
                            /> <Label onClick={this.handleChangeComoSenha} >{this.stringTranslate("Coletor.pag.detalhes.digitacaoTecladoComoSenha")}</Label>
                        </FormGroup>  
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <SelectOperacaoModoLiberado value={this.state.modoLiberado} onChangeModoLiberado={this.handleChangeModoLiberado} editavel={this.editavel} stringTranslate={this.stringTranslate} />
                    </Col>
                </Row>
            </div>
            </>
        )
    }
}

export default injectIntl(Detalhes);