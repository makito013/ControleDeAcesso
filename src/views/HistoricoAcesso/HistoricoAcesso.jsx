import React from "react";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Row,
  Col,
  Collapse,
  Nav,
  UncontrolledTooltip,
} from "reactstrap";
import { FormGroup, Label, Input, CustomInput  } from 'reactstrap';
import { post,postAdonis,get } from "utils/api";
import InputMask from 'react-input-mask';
import { toast, Slide } from 'react-toastify';
import { injectIntl } from "react-intl";
import { Table, Skeleton, Spin } from 'antd';
import { Progress } from 'antd';
import { Select, DatePicker, TimePicker } from 'antd';
import { Button } from 'antd';
import SelectTreeViewNeo from 'components/SelectTreeViewNeo/SelectTreeViewNeo';
import { pegaData } from "../../components/dataHora"
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;
const toastOptions = {
  transition: Slide,
  position: "top-center",
  autoClose: 5000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: true
};

const vazio = {value: "", label: ""};                
class HistoricoAcesso extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          porcentagem:0,
          valores: {"horario": 0, "data": [moment().subtract(1, 'days'), moment()], incluir:[], "hInicio": moment().startOf("day"), "hFim": moment().endOf("day") }, 
          dadosTabela: [],
          buscando: false,
        };
        
        this.handleChangeSelect = this.handleChangeSelect.bind(this);
        this.postGeraHistorico = this.postGeraHistorico.bind(this);
        this.getGerarHistorico = this.getGerarHistorico.bind(this);
        this.onChange = this.onChange.bind(this);
        this.colunasTabela = [];

        this.colunasRelatorio = [
          {
            title: this.stringTranslate("Label.Data"),
            dataIndex: "data",
            key: "data"
          },
          {
            title: this.stringTranslate("Label.Hora"),
            dataIndex: "hora",
            key: "hora",
          },
          {
            title: this.stringTranslate("Label.Direcao"),
            dataIndex: "direcao",
            key: "direcao",
          },
          {
            title: this.stringTranslate("Label.Pessoa"),
            dataIndex: "pessoa",
            key: "pessoa"
          },  
          {
            title: this.stringTranslate("Label.Lotacao") + " / " + this.stringTranslate("Label.Secao"),
            dataIndex: "lotacaoSecao",
            key: "lotacaoSecao"
          },
         // {
          //   title: this.stringTranslate("Label.Coletor"),
          //   dataIndex: "coletor",
          //   key: "coletor"
          // }
        ];

        this.colunaVisitou = {
          title: this.stringTranslate("Label.Visitou"),
          dataIndex: "visitou",
          key: "visitou"
        };

        this.colunasVeiculo = {
            title: this.stringTranslate("Label.Veiculo"),
            dataIndex: "veiculo",
            key: "veiculo"
          }
        this.colunasPlaca  =    {
            title: this.stringTranslate("Label.Placa"),
            dataIndex: "placa",
            key: "placa"
          }          
         ;
    }


    //Mark: Função StringTranslate
    stringTranslate(id){
        return this.props.intl.formatMessage({id: id});
    }
    //---------------------------------------------

    //Mark: Funcao HandleChange
    handleChangeSelect(e, key){
      if ((key === "hFim" && (e.isBefore(this.state.valores["hInicio"]))) || (key === "hInicio") && e.isAfter(this.state.valores["hFim"])){
        return;
      }
      console.log(key,e)
      this.state.valores[key] = e;
      this.setState({valores: this.state.valores})
    }  
    getGerarHistorico(){
      this.setState({buscando: true});
      var caminho= 'HistoricoAcesso';
      var horaInicio = "00:00:00";
      var horaFim = "23:59:00";   
      if(this.state.valores.horario === 1){
        horaInicio = this.state.valores.hInicio.format("HH:mm:ss");
        horaFim = this.state.valores.hFim.format("HH:mm:ss");
      }  
      const body={
       
        dataInicio: moment(this.state.valores.data[0]).format('YYYY-MM-DD') ,
        dataFim: moment(this.state.valores.data[1]).add(1, 'days').format('YYYY-MM-DD'),
        horaInicio: horaInicio,
        horaFim: horaFim,
        tentativaAcesso: this.state.valores.incluir.indexOf(3) > -1 ? true : false,
        dadosVeiculos: this.state.valores.incluir.indexOf(2) > -1 ? true : false,
        apenasAutorizado: this.state.valores.incluir.indexOf(1) > -1 ? true : false,
        pessoaVisitada: this.state.valores.incluir.indexOf(4) > -1 ? true : false,
        ordenacao: this.state.valores.order,
        token: sessionStorage.getItem("token")
      } 
      console.log(body) 
      postAdonis(body,"/Relatorio/HistoricoAcesso").then(lista =>{    

        if(lista.error === undefined)
        {   

         this.colunasTabela = this.colunasRelatorio.slice();
        
          if(this.state.valores.incluir.indexOf(2) > -1){
           this.colunasTabela.push(this.colunasVeiculo);
           this.colunasTabela.push(this.colunasPlaca);
          }
   
          if(this.state.valores.incluir.indexOf(4) > -1)  
         this.colunasTabela.push(this.colunaVisitou);
          //console.log(this.colunasTabela) 
          //  this.colunasTabela.splice(4, 0, this.colunaVisitou)
         var total= lista.count;     
         console.log(lista)
          this.state.dadosTabela = lista.dados.map((prop,index) => {

         //   var Placa = prop.PlacaVeiculo !== undefined ? prop.PlacaVeiculo : "";


         return {

          

                      data: moment(prop.DataHora, "YYYY-MM-DD").format(this.stringTranslate("Format.Date")),
                      hora: moment(prop.DataHora, "YYYY-MM-DD HH:mm:ss").format(this.stringTranslate("Format.Hour")),
                      direcao:  prop.Direcao === 1 ? this.stringTranslate("Label.Entrada") : prop.Direcao === "2" ? this.stringTranslate("Label.Saida") : this.stringTranslate("Label.Tentativa.Resumido"),
                      pessoa: <Label style={{textTransform: "capitalize"}}> { prop.NomePessoa.toLowerCase()} </Label>,
                      visitou: <Label style={{textTransform: "capitalize"}}> {prop.Visitou !== undefined &&   prop.Visitou !== null ? prop.Visitou.toLowerCase() : ""} </Label>,
                      lotacaoSecao: prop.NomeLotacao + '/' + prop.NomeSecao ,
                      veiculo:prop.ModeloCarro,
                      placa: prop.PlacaCarro
                 //     coletor: Coletor,
                  //    veiculo: Veiculo,
                   //   placa: Placa
         }


          })
          console.log(this.state.dadosTabela)
          this.setState({dadosTabela: this.state.dadosTabela, buscando: false});
        }                
        else
        {
            this.setState({buscando: false})
            toast.dismiss();
            this.state.mensagemErro = this.stringTranslate("Erro.Servidor");    
        }         
      }).catch((error) => {
          this.setState({buscando: false})
          toast.dismiss();
          this.state.mensagemErro = this.stringTranslate("Erro.Servidor");
      })  
    }
    //--------------------------------------------------

    //MARK: POST GERA HISTORICO
    postGeraHistorico(){
      this.setState({buscando: true});

      var horaInicio = "00:00:00";
      var horaFim = "23:59:99";      

      if(this.state.valores.horario === 1){
        horaInicio = this.state.valores.hInicio.format("HH:mm:ss");
        horaFim = this.state.valores.hFim.format("HH:mm:ss");
      }
      

      const body={
        cmd:"HistoricoAcessos", 
        dataInicio: moment(this.state.valores.data[0]).format('YYYY-MM-DD') ,
        dataFim: moment(this.state.valores.data[1]).add(1, 'days').format('YYYY-MM-DD'),
        horaInicio: horaInicio,
        horaFim: horaFim,
        tentativaAcesso: this.state.valores.incluir.indexOf(3) > -1 ? true : false,
        dadosVeiculos: this.state.valores.incluir.indexOf(2) > -1 ? true : false,
        apenasAutorizado: this.state.valores.incluir.indexOf(1) > -1 ? true : false,
        pessoaVisitada: this.state.valores.incluir.indexOf(4) > -1 ? true : false,
        ordenacao: this.state.valores.order,
        token: sessionStorage.getItem("token"),
      }
      post(body,"/HistoricoAcesso").then(lista =>{    
        //console.log(lista) 
        if(lista.error === undefined)
        {   
         // this.colunasTabela = this.colunasRelatorio.slice();;

          if(this.state.valores.incluir.indexOf(2) > -1)
           this.colunasRelatorio.push(this.colunasVeiculo);
   
          if(this.state.valores.incluir.indexOf(4) > -1)  
         this.colunasRelatorio.push(this.colunaVisitou);
          //console.log(this.colunasTabela) 
          //  this.colunasTabela.splice(4, 0, this.colunaVisitou)
            
          this.state.dadosTabela = lista.dados.acessos.map(prop => {
            var direcao = prop.Direcao === "Entrada" ? this.stringTranslate("Label.Entrada") : prop.Direcao === "Saída" ? this.stringTranslate("Label.Saida") : this.stringTranslate("Label.Tentativa.Resumido");
            var nome = prop.NomePessoa.toLowerCase();
            var nomeVisitou = prop.Visitou !== undefined ? prop.Visitou.toLowerCase() : "";
            var LotacaoSecao = prop.NomeSecao !== undefined ? prop.NomeSecao + " | " + prop.NomeLotacao : "";
            var Coletor = prop.NomeColetor !== undefined ? prop.NomeColetor : "";
            var Veiculo = prop.ModeloVeiculo !== undefined ? prop.ModeloVeiculo : "";
            var Placa = prop.PlacaVeiculo !== undefined ? prop.PlacaVeiculo : "";

            return {
                      data: moment(prop.DataHora, "DD/MM/YYYY HH:mm:ss").format(this.stringTranslate("Format.Date")),
                      hora: moment(prop.DataHora, "DD/MM/YYYY HH:mm:ss").format(this.stringTranslate("Format.Hour")),
                      direcao: direcao,
                      pessoa: <Label style={{textTransform: "capitalize"}}> {nome} </Label>,
                      visitou: <Label style={{textTransform: "capitalize"}}> {nomeVisitou} </Label>,
                      lotacaoSecao: LotacaoSecao,
                      coletor: Coletor,
                      veiculo: Veiculo,
                      placa: Placa
                    }
          })

          this.setState({dadosTabela: this.state.dadosTabela, buscando: false});
        }                
        else
        {
            this.setState({buscando: false})
            toast.dismiss();
            this.state.mensagemErro = this.stringTranslate("Erro.Servidor");    
        }         
      }).catch((error) => {
          this.setState({buscando: false})
          toast.dismiss();
          this.state.mensagemErro = this.stringTranslate("Erro.Servidor");
      })  
    }
    //-----------------------------------------------------

   
    onChange(e){
      this.state.valores[e.target.name] = e.target.value;
      this.setState({valores: this.state.valores});
    }

    
  render() {    
      
    
    return (
      <>      
      <div className="content">
        <Row>
          <Col md="12">
              <Card>
                <CardHeader tag="h4">                       
                  {this.stringTranslate("Relatorio.AcessoPessoas.Card.Title")}
                </CardHeader>
                <CardBody>
                  <FormGroup>
                      <Row>
                      <Col md="3">                      
                        <FormGroup>    
                          <Label for="data">{this.stringTranslate("Label.Data")}</Label>                                          
                          <RangePicker 
                            size="large" 
                            id="data" 
                            format={this.stringTranslate("Format.Date")}
                            style={{ width: '100%' }} 
                            placeholder={[this.stringTranslate("Label.DataInicio"), this.stringTranslate("Label.DataFim")]} 
                            onChange={(e) => this.handleChangeSelect(e, "data")}              
                            defaultValue={[ moment().subtract(1, 'days'), moment()]}
                          />                      
                        </FormGroup>
                      </Col>

                      <Col md="6">
                    <FormGroup>
                    <Label for="examplePassword">{this.stringTranslate("Label.Incluir")}</Label>
                        <Select                            
                          style={{ width: '100%' }}                      
                          size="large"    
                          value={this.state.valores["incluir"]}
                          mode="multiple"
                          onChange={e => this.handleChangeSelect(e, "incluir")}        
                          maxTagCount= {2} 
                          maxTagPlaceholder={(e) => "+" + e.length}
                      
                        >
                            <Option value={1}>{this.stringTranslate("RelatorioAcesso.Select.Incluir.Opcao1")}</Option>       
                            <Option value={2}>{this.stringTranslate("RelatorioAcesso.Select.Incluir.Opcao2")}</Option>   
                            <Option value={3}>{this.stringTranslate("RelatorioAcesso.Select.Incluir.Opcao3")}</Option>   
                            <Option value={4}>{this.stringTranslate("RelatorioAcesso.Select.Incluir.Opcao4")}</Option>              
                        </Select> 
                    </FormGroup>
                    </Col>

                    <Col md="3">                      
                      <FormGroup>    
                       <Label for="order">{this.stringTranslate("Label.Ordenar")}</Label>
                        <Select                            
                          style={{ width: '100%' }}                      
                          size="large"
                          id='order'    
                          value={this.state.valores["order"]}
                          onChange={e => this.handleChangeSelect(e, "order")}        
                        >
                            <Option value={"Pessoa"}>{this.stringTranslate("Label.Nome")}</Option>       
                            <Option value={"DataHora"}>{this.stringTranslate("Label.Data")}</Option>
                            <Option value={"Pessoa, DataHora"}>{this.stringTranslate("Label.NomeEData")}</Option>                  
                        </Select>                     
                      </FormGroup>
                    </Col>
                     
                    </Row>
                  </FormGroup>                  
                  <Row>
                    <Col md="3">   
                      <FormGroup>                                     
                        <Label for="examplePassword">{this.stringTranslate("Label.Horario")}</Label>
                        <Select                            
                            style={{ width: '100%' }}
                            size="large"
                            value={this.state.valores["horario"]}                                                    
                            onChange={e => this.handleChangeSelect(e, "horario")}
                          >
                          <Option value={0}>{this.stringTranslate("Label.diaInteiro")}</Option>       
                          <Option value={1}>{this.stringTranslate("Label.naFaixa")}</Option>              
                        </Select>  
                      </FormGroup> 
                    </Col>
                    {this.state.valores.horario === 1 ? (  <>                  
                        <Col md="3">
                          <FormGroup>
                            <Label for="examplePassword">{this.stringTranslate("Label.DataInicio")}</Label>
                            <TimePicker onChange={(e, str) => this.handleChangeSelect(e, "hInicio")} size="large" style={{ width: '100%' }} value={this.state.valores["hInicio"]} format={"HH:mm"} placeholder={this.stringTranslate("Label.HoraInicio")}/>                        
                          </FormGroup>
                        </Col>                        
                        <Col md="3">
                          <FormGroup>
                            <Label for="examplePassword">{this.stringTranslate("Label.DataFim")}</Label>
                            <TimePicker onChange={(e) => this.handleChangeSelect(e, "hFim")} size="large" style={{ width: '100%' }} value={this.state.valores["hFim"]} format={"HH:mm"} placeholder={this.stringTranslate("Label.HoraFim")}/>
                          </FormGroup>
                        </Col> </>) : (<Col md="6"></Col>) }              
                    <Col md="3">                                      
                        <Button 
                          block 
                          type="primary" 
                          size="large" 
                          style={{textTransform: "uppercase", top: "calc(100% - 50px)", marginBottom: "15px"}} 
                          onClick={() => this.getGerarHistorico()}>{this.stringTranslate("Botao.VerImpressao")}
                        </Button>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
          </Col>
        </Row>
        <Row>
          <Col md="12">
              <Card>
                <CardBody>

                  {this.state.buscando === true ? (<Skeleton />) : (<Table scroll={{x:"700px"}} size="small" columns={this.colunasTabela} dataSource={this.state.dadosTabela} />)}                                    
                </CardBody>
              </Card>
          </Col>
        </Row>
       </div> 
       </>
    );
  }
}

export default injectIntl(HistoricoAcesso);