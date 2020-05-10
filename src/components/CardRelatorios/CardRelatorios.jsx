import React from "react";

import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import InputMask from 'react-input-mask';
import { injectIntl } from "react-intl";
import { Spin } from 'antd';
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Button, 
  Input,
  Label,
  FormGroup,
  CustomInput
} from "reactstrap"; 

//Definição de CSS dos componentes utilizados do MAterial UI



const tipos = [
  "Permanentes",
  "Visitantes",
]



//Componente da tela que armazena o número da matrícula (Material UI)
function TextMatricula (props){

  function handleChangeNumeroMatricula(event){
    props.onChangeNumeroMatricula(event);
  }

  function handleEnter(event){
    if (event.key === 'Enter')
      props.onChangeNumeroMatricula(event.key);
  }

  return(
    <FormGroup>
    <Label>{props.stringTranslate("Relatorios.card.numeroMatricula")}</Label>
    <Input
      type="text"      
      value={props.horaFim}
      onChange={handleChangeNumeroMatricula}
      onKeyPress={handleEnter}
      mask="9999999999999999999" maskChar={null}
      tag={InputMask}
    />
    </FormGroup>
  );
}

//Componente onde seleciona-se dados opcionais a serem exibidos na tabela (Material UI)
function ExibirRelatorio(props) {
  const [personName, setPersonName] = React.useState(props.exibir);

  const names = [
    ["Dados dos veículos", props.stringTranslate("Relatorios.card.exibirRelatorio.opcao.dadosVeiculos")],
    ["Matrícula", props.stringTranslate("Relatorios.card.exibirRelatorio.opcao.matricula")],
    ["Pessoa visitada", props.stringTranslate("Relatorios.card.exibirRelatorio.opcao.pessoaVisitada")],
    ["Tentativas de acesso", props.stringTranslate("Relatorios.card.exibirRelatorio.opcao.tentativasAcesso")],
  ];


  function handleChange(event) {
    var value;

    if(event !== null){
      value = event;
    }
    else{
      value = null;
    }

    setPersonName(value);
    props.onChangeExibirRelatorio(value);
    //console.log(value);
  }

  if (props.matricula !== null && props.matricula !== ""){
    var achou = false;
    props.exibir.map((prop) =>{
      if (prop.value === "Matrícula")
        achou = true;
    })
    if (!achou){
      props.exibir.push({value:"Matrícula", label:props.stringTranslate("Relatorios.card.exibirRelatorio.opcao.matricula")});
      setPersonName(props.exibir);
    }
  }

  const animatedComponents = makeAnimated();
  const options = names.map((name, key) => {
      return(                
          {value:name[0],label:name[1]}
      );
  })

  return (
    <FormGroup>
    <Label>{props.stringTranslate("Relatorios.card.exibirRelatorio")}</Label>
    <Select
      closeMenuOnSelect={false}
      components={animatedComponents}
      isMulti
      onChange={(value) => handleChange(value)}
      placeholder={props.stringTranslate("Relatorios.card.placeHolderNenhum")}
      options={options}
      value={personName}
    />
    </FormGroup>   
  );
}

//Componente da tela onde seleciona-se os locais de acesso a serem visualizados (Material UI)
function FiltroLocaisAcesso(props){
  const [localAcesso, setLocalAcesso] = React.useState();
  let options = [];

  function handleChange(event) {
    var value;
    
    if(event !== null)
      value = event;
    else
      value = options;

      setLocalAcesso(value);
      props.onChangeLocaisAcesso(value);
  }

  const animatedComponents = makeAnimated();

  if (Boolean(props.locais)){
    options = props.locais.map((local, key) => {
      
        return(  

            {value:local[1],label:local[0]}
        );
    })
  }

  return(
    <FormGroup>
    <Label>{props.stringTranslate("Relatorios.card.filtrarLocaisAcesso")}</Label>
      <Spin spinning={props.loadingLocais}>    
        <Select
          closeMenuOnSelect={false}
          components={animatedComponents}
          isMulti
          onChange={(e) => handleChange(e)}
          placeholder={props.stringTranslate("Relatorios.card.placeHolderTodos")}
          options={options}
        />
      </Spin>
    </FormGroup>      
  )
}

//Componente da tela onde seleciona-se se serão exibidos dados referentes a 
//somente permanentes, somente visitantes ou ambos (Material UI)
function FiltroTiposAcesso(props){
  const [tipoAcesso, setTipoAcesso] = React.useState(["Permanentes", "Visitantes"]);

  function handleChange(event) {


    var value;

    if(event !== null)
      value = event.value;
    else
      value = 2;

    setTipoAcesso(value);
    props.onChangeTiposAcesso(value);
  }

  const animatedComponents = makeAnimated();
  const options = tipos.map((tipo, key) => {
      return(                
          {value:key,label:tipo}
      );
  })
  options.push({value:2,label:props.stringTranslate("Relatorios.card.placeHolderTodos")})
  return(
    <FormGroup>
    <Label>{props.stringTranslate("Relatorios.card.tipoAcesso")}</Label>
    <Select      
      closeMenuOnSelect={false}
      components={animatedComponents}
      defaultValue={2}
      options={options}
      placeholder={props.stringTranslate("Relatorios.card.placeHolderTodos")}
      onChange={(e) => handleChange(e)}
      
    />
    </FormGroup>
  )
}

//Componente da tela onde seleciona-se a faixa de horário de busca entre um intervalo específico ou o dia todo
//(Material UI)
function SelecaoHorario(props) {
  const [values, setValues] = React.useState("diaTodo");

  function handleChange(event) {
    setValues(event.target.value);
    props.onChangeHorario(event);
  }

  return (
    <FormGroup>
      <Label>{props.stringTranslate("Relatorios.card.tipoAcesso")}</Label>
      <CustomInput style={{color:"#000"}} type="select" onChange={handleChange} value={values}>
          <option value="diaTodo">{props.stringTranslate("Relatorios.card.horario.opcao.diaTodo")}</option>
          <option value="faixa">{props.stringTranslate("Relatorios.card.horario.opcao.faixa")}:</option>
        </CustomInput >
    </FormGroup>

  );
}

//Componente da tela onde seleciona-se a faixa de horário na busca
//Só aparece na tela caso o componente SelecaoHorario() esteja marcado com a opção de faixa de horário
function ColHorario (props){
    return(
      <>
        <Col sm="2">
        <FormGroup>
          <Label>{props.stringTranslate("Relatorios.card.hora.inicio")}</Label>   
          <Input
            type="time"
            onChange={props.onChangeHoraInicio}
            value={props.horaInicio}
          />
          </FormGroup>
        </Col>
        <Col sm="2">
        <FormGroup>
          <Label>{props.stringTranslate("Relatorios.card.hora.fim")}</Label>
          <Input
            type="time"
            onChange={props.onChangeHoraFim}
            value={props.horaFim}
          />
          </FormGroup>
        </Col>
        </>
    );
}

class CardPeriodo extends React.Component{

    constructor(props){
        super(props);
        
        //A coluna de seleção horários pode ou não aparecer de acordo com essa variável
        this.boolColHorario = false;

        //Funções de mudança de estado do relatório de acordo com os componentes
        this.handleChangeDataFim = this.handleChangeDataFim.bind(this);
        this.handleChangeDataInicio = this.handleChangeDataInicio.bind(this);
        this.handleChangeExibirRelatorio = this.handleChangeExibirRelatorio.bind(this);
        this.handleChangeHoraFim = this.handleChangeHoraFim.bind(this);
        this.handleChangeHoraInicio = this.handleChangeHoraInicio.bind(this);
        this.handleChangeHorario = this.handleChangeHorario.bind(this);
        this.handleChangeLocaisAcesso = this.handleChangeLocaisAcesso.bind(this);
        this.handleChangeNumeroMatricula = this.handleChangeNumeroMatricula.bind(this);
        this.handleClickExibirRelatorio = this.handleClickExibirRelatorio.bind(this);
        this.handleChangeTiposAcesso = this.handleChangeTiposAcesso.bind(this);



        this.handleDataInicio = this.handleDataInicio.bind(this);


        //Traduz as strings
        this.stringTranslate = this.stringTranslate.bind(this);
      }

      stringTranslate(id){
        return this.props.intl.formatMessage({id: id});
      }

      handleChangeDataInicio(event){
        this.props.onChangeFunctions.onChangeDataInicio(event);
      }
    
      handleChangeDataFim(event){
        this.props.onChangeFunctions.onChangeDataFim(event);
      }
    
      handleChangeHorario(event){
        this.props.onChangeFunctions.onChangeHorario(event);

        /* Define se a coluna de faixa de horário será renderizada ou não através do valor da caixa de seleçãode faixa de horário*/
        if (event.target.value === "diaTodo"){
            this.boolColHorario = false;
        }else{
            this.boolColHorario = true;
        }
      }
    
      handleChangeHoraInicio(event){
        this.props.onChangeFunctions.onChangeHoraInicio(event);
      }
    
      handleChangeHoraFim(event){
        this.props.onChangeFunctions.onChangeHoraFim(event);
      }
    
      handleChangeLocaisAcesso(event){
        this.props.onChangeFunctions.onChangeLocaisAcesso(event);
      }

      handleChangeTiposAcesso(event){
        this.props.onChangeFunctions.onChangeTiposAcesso(event);
      }
    
      handleChangeNumeroMatricula(event){
        this.props.onChangeFunctions.onChangeNumeroMatricula(event);
      }
    
      handleChangeExibirRelatorio(event){
        this.props.onChangeFunctions.onChangeExibirRelatorio(event);
      }

      handleClickExibirRelatorio(event){
        this.props.onChangeFunctions.onClickExibirRelatorio(event);
      }

      handleDataInicio(event){
        console.log(event.target.value);
      }
    
    render(){
        let colHorarioA = null;
        if (this.boolColHorario){
            colHorarioA = <ColHorario stringTranslate={this.stringTranslate} horaInicio={this.props.estados.horaInicio} horaFim={this.props.estados.horaFim} 
                                      onChangeHoraInicio={this.handleChangeHoraInicio} onChangeHoraFim={this.handleChangeHoraFim}/>
        }

        return(
        <Card>
         <CardHeader tag="h4">
          {this.stringTranslate("Relatorios.card.titulo")}
        </CardHeader>
        <CardBody>
            <Row>
              <Col sm={4}>
                <FormGroup>
                  <Label> {this.stringTranslate("Relatorios.card.dataInicio")} </Label>
                  <Input
                    type="date"
                    id="dataInicio"                  
                    value={this.props.estados.dataInicio}
                    onChange={this.handleChangeDataInicio}
                    />
                  </FormGroup>
              </Col>
              <Col sm={4}>
              <FormGroup>
              <Label> {this.stringTranslate("Relatorios.card.dataFim")} </Label>
                  <Input
                    type="date"
                    name="date"
                    value={this.props.estados.dataFim}
                    onChange={this.handleChangeDataFim}
                  />
                   </FormGroup>
              </Col>
              <Col>
                  <SelecaoHorario stringTranslate={this.stringTranslate} horario={this.props.estados.horario} onChangeHorario={this.handleChangeHorario}/>
              </Col>
            </Row>
            <Row>
              <Col>
              <FormGroup>
                  <FiltroLocaisAcesso stringTranslate={this.stringTranslate} onChangeLocaisAcesso={this.handleChangeLocaisAcesso} locais={this.props.estados.listaLocaisAcesso} loadingLocais={this.props.estados.loadingLocais}/>
              </FormGroup>
              </Col>
              {colHorarioA}
            </Row>
            <Row> 
              <Col sm={4}>
                <TextMatricula stringTranslate={this.stringTranslate} matricula={this.props.estados.numeroMatricula} onChangeNumeroMatricula={this.handleChangeNumeroMatricula}/>
              </Col>
              <Col>
                <FiltroTiposAcesso stringTranslate={this.stringTranslate} onChangeTiposAcesso={this.handleChangeTiposAcesso}/>
              </Col>
            </Row>
            <Row>
              <Col sm={9}>
                  <ExibirRelatorio stringTranslate={this.stringTranslate} id="fil" exibir={this.props.estados.exibirNoRelatorio} onChangeExibirRelatorio={this.handleChangeExibirRelatorio}
                                    matricula={this.props.estados.numeroMatricula}/>
              </Col>
              <Col sm={3}> 
                  <Button style={{marginTop: "22px", marginBottom: "22px"}} id="exibir" onClick={this.handleClickExibirRelatorio} block color="primary">{this.stringTranslate("Relatorios.card.botao.exibirRelatorio")}</Button>
              </Col>
            </Row>
        </CardBody>
        </Card>
    )
  }
}
export default injectIntl(CardPeriodo);