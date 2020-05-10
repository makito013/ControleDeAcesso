import React from "react";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,  
} from "reactstrap";
import { Button, FormGroup, Label, Input, CustomInput  } from 'reactstrap';
import { post,postAdonis } from "utils/api";
import { toast, Slide } from 'react-toastify';

import { localstorageObjeto } from "../../utils/Requisicoes";
import { injectIntl } from "react-intl";
import { TreeSelect, Row, Col, DatePicker, Table, Spin } from 'antd';
import '../../assets/css/antd.css';
import { Switch,Skeleton } from 'antd';
import moment from 'moment';
import { CSVLink } from "react-csv";

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
class AcessosSecao extends React.Component {
  constructor(props) {
      super(props);
      this.state = {               
          timePost:[],   
          data: [],
          reload: false,
          toggleFiltro: [],
          loadingELS: true,
          arvore: [],
          dadosRelatorio: [],
          buscando: false
      };

      this.dataPesquisa = "";
      this.valores = [];
      this.onToggled = this.onToggled.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.handleChangeSelect = this.handleChangeSelect.bind(this);
      this.onChange = this.onChange.bind(this);
      this.stringTranslate = this.stringTranslate.bind(this);
      this.toggle = this.toggle.bind(this);
      this.pesquisar = this.pesquisar.bind(this); 
      this.state.toggleFiltro["soVisitantes"] = this.state.toggleFiltro["soVeiculos"] = this.state.toggleFiltro["mostrarPlacas"] = false;   
      this.consultaDadosELT = this.consultaDadosELT.bind(this);   
      this.reloadArvore = this.reloadArvore.bind(this);
      this.gerarRelatorio = this.gerarRelatorio.bind(this);
      this.consultaDadosELT();
      this.arraysecao = [];
      this.arrayempresa = [];
      this.arraylotacao = [];
      this.columns = [
        {
            title: this.stringTranslate("Label.Data"),
            dataIndex: 'data',
            label: this.stringTranslate("Label.Data"),
            key: 'data',
        },
        {
            title: this.stringTranslate("Label.Hora"),
            dataIndex: 'horario',
            label: this.stringTranslate("Label.Hora"),
            key: 'horario',
        },
        {
            title: this.stringTranslate("Label.Direcao"),
            dataIndex: 'direcao',
            label: this.stringTranslate("Label.Direcao"),
            key: 'direcao',
        },
        {
            title: this.stringTranslate("Label.Pessoa"),
            dataIndex: 'pessoa',
            label: this.stringTranslate("Label.Pessoa"),
            key: 'pessoa',
        },
        {
            title: this.stringTranslate("Label.Visitou"),
            dataIndex: 'visitou',
            label: this.stringTranslate("Label.Visitou"),
            key: 'visitou',
        },
        {
            title: this.stringTranslate("Label.Coletor"),
            dataIndex: 'coletor',
            label: this.stringTranslate("Label.Coletor"),
            key: 'datcoletora',
        },
    ];
  }

   gerarRelatorio(){
    this.setState({buscando:true});
    if (this.valores["prazo"] === undefined){
      toast.dismiss();
      toast.error(this.stringTranslate("Erro.prazo.undefined"), toastOptions);
      
    }
    else
    if (this.valores["ELS"] === undefined){
      toast.dismiss();
      toast.error(this.stringTranslate("Erro.ELS.undefined"), toastOptions);
      
    }
    else{
      console.log(this.state.toggleFiltro);
    const body = {
      cmd: "acessosPorSecao",
      token: sessionStorage.getItem("token"),
      dataInicio: this.valores["prazo"][0].format("YYYY-MM-DD"),
      dataFim: this.valores["prazo"][1].format("YYYY-MM-DD"),
      soVisitantes: this.state.toggleFiltro["soVisitantes"],
      mostrarPlacas: this.state.toggleFiltro["mostrarPlacas"],
      soVeiculos: this.state.toggleFiltro["soVeiculos"],
      codELS: this.valores["ELS"].split("_")[0],
      tipo: this.valores["ELS"].split("_")[1],
    };
    postAdonis(body,'/Relatorio/AcessosPorSecao').then((data) =>{

        this.state.dadosRelatorio =  data.dados.map((prop) =>{
         return {
           //prop
               data:  moment(prop.DataHora, "YYYY/MM/DD HH:mm:ss").format(this.stringTranslate("Format.Date")),
               horario: moment(prop.DataHora, "YYYY/MM/DD HH:mm:ss").format(this.stringTranslate("Format.Hour")),
               direcao:  prop.Direcao === 1 ? this.stringTranslate("Label.Entrada") : prop.Direcao === "2" ? this.stringTranslate("Label.Saida") : this.stringTranslate("Label.Tentativa.Resumido"),
                pessoa: prop.Nome,
               visitou: prop.NomeContato !== undefined &&   prop.NomeContato !== null ? prop.NomeContato : "",
               coletor: prop.NomeColetor,
               placa: prop.PlacaCarro != undefined?prop.PlacaCarro:null
            }

        });
        toast.success(this.stringTranslate("ResultadosEncontrados")+ data.count);      
        this.setState({dadosRelatorio: this.state.dadosRelatorio, buscando: false});
    })

  }
   }

   //MARK: Consulta Dados ELT
   consultaDadosELT(){
    const body = {
      "cmd": "listasecaolotacaoempresa",
      "token": sessionStorage.getItem("token"),
    }
    postAdonis(body,'/Empresa/Lista').then((data) =>{
      if(data.retorno){
        
        data.dados.secao.forEach(secao =>{
          this.arraysecao.push({value: secao.CodSecao,  title: secao.Nome, pai: secao.codLotacao})                          
        })

        data.dados.lotacao.forEach(lotacao => {
          this.arraylotacao.push({value: lotacao.CodLotacao, title: lotacao.Nome,pai: lotacao.codEmpresa})        
        });

        data.dados.empresa.forEach(empresa => {
          this.arrayempresa.push({value: empresa.CodEmpresa, title: empresa.Nome})  
        });

        this.reloadArvore()
        this.setState({reload: !this.state.reload}); // para recarregar os valores recebido do servidor para o select
      }else{
        if(this.contErro++ <= 3){
          toast.dismiss();
          toast.error(this.stringTranslate("Erro.Servidor"), toastOptions);
        }            
        else
          this.consultaDadosELT()                
      }
                  
    }).catch((error) => {
      if(this.contErro++ <= 3){
        toast.dismiss();
        toast.error(this.stringTranslate("Erro.Servidor"), toastOptions);
      }            
      else
        this.consultaDadosELT()     
    })      
    
  }
  //-----------------------------------------------------------------

  pesquisar(){
    this.setState({loadingELS: true})    
    this.gerarRelatorio();
    this.setState({loadingELS: false})  
  }

  //MARK:  Reload Select Arvore ELT 
  reloadArvore(){      
    var groupedOptions = this.arrayempresa.map((itemempresa) => {

      var filhoslotacao = [];

      this.arraylotacao.forEach((valuelotacao) => {
          if(valuelotacao.pai === itemempresa.value){
              var filhos=[];
                this.arraysecao.forEach(function(valuesecao){
                
                  if(valuesecao.pai === valuelotacao.value){
                      filhos.push({value: valuesecao.value + "_secao", key: valuesecao.value, title: valuesecao.title})
                  }
                 }) 
              filhoslotacao.push({value: valuelotacao.value + "_lotacao", key: valuelotacao.value, title: valuelotacao.title,children: filhos})  
          }
      })             

      return {value: itemempresa.value + "_empresa", key: itemempresa.value, title: itemempresa.title, children: filhoslotacao};
    })

    this.setState({arvore: groupedOptions, loadingELS: false})      
  } 
  //------------------------------------------------------------

  handleChangeSelect(e, key){
    if(key === "ELS")
      this.dataPesquisa = [];

    this.valores[key] = e;     
    console.log(this.valores[key]); 
  }

  onToggled(toggle){
    console.log(!this.state.toggleFiltro[toggle]);
    this.state.toggleFiltro[toggle] = !this.state.toggleFiltro[toggle];
    console.log(this.state.toggleFiltro[toggle]);
    this.setState({toggleFiltro: this.state.toggleFiltro});
  }


  toggle(status) {
    this.setState({
      modal: !this.state.modal,
      statusModal: status,
    });  
  }

  stringTranslate(id){
    return this.props.intl.formatMessage({id: id});
  }  


  handleChange(e){
    this.state.valores[e.name] = e;
    this.setState({valores: this.state.valores});
  }


  onChange(e){
    this.state.valores[e.target.name] = e.target.value;
    this.setState({valores: this.state.valores});
  }

  
  render() {  
    this.columns = [
      {
          title: this.stringTranslate("Label.Data"),
          dataIndex: 'data',
          label: this.stringTranslate("Label.Data"),
          key: 'data',
      },
      {
          title: this.stringTranslate("Label.Hora"),
          dataIndex: 'horario',
          label: this.stringTranslate("Label.Hora"),
          key: 'horario',
      },
      {
          title: this.stringTranslate("Label.Direcao"),
          dataIndex: 'direcao',
          label: this.stringTranslate("Label.Direcao"),
          key: 'direcao',
      },
      {
          title: this.stringTranslate("Label.Pessoa"),
          dataIndex: 'pessoa',
          label: this.stringTranslate("Label.Pessoa"),
          key: 'pessoa',
      },
      {
          title: this.stringTranslate("Label.Visitou"),
          dataIndex: 'visitou',
          label: this.stringTranslate("Label.Visitou"),
          key: 'visitou',
      },
      {
          title: this.stringTranslate("Label.Coletor"),
          dataIndex: 'coletor',
          label: this.stringTranslate("Label.Coletor"),
          key: 'coletor',
      },
    ];
    if(this.state.toggleFiltro["mostrarPlacas"]){
      this.columns.push(
      {
        title: this.stringTranslate("Label.Placa"),
        dataIndex: 'placa',
        label: this.stringTranslate("Label.Placa"),
        key: 'placa',
      }
      )
    }
     
    return (
      <>      
        <div className="content">
          <Row>
            <Col md={24} sm={24} xs={24}>
                <Card>
                    <CardHeader tag="h4"> {this.stringTranslate("Routes.relatorio7")} </CardHeader>
                    <CardBody>
                        <Row type="flex" gutter={16} justify="space-between" align="middle">
                            <Col lg={15} md={24} xs={24}>
                                <Row type="flex"  justify="space-between" align="bottom" gutter={16}>
                                    <Col md={13} sm={24} xs={24}>                
                                        <FormGroup> 
                                            <Label for="categoria" style={{textTransform:"uppercase"}}>{this.stringTranslate("Label.ELS")}</Label>  
                                            <Spin spinning={this.state.loadingELS}>
                                                <TreeSelect
                                                style={{ width: '100%' }}                                
                                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                treeData={this.state.arvore}
                                                placeholder={this.stringTranslate("Autorizado.Modal.SelecioneUmaEmpresa")}                 
                                                onChange={(v) => this.handleChangeSelect(v, "ELS")}
                                                size="large"
                                                allowClear={true}
                                                />
                                            </Spin>                    
                                        </FormGroup>                    
                                    </Col>                    
                                    <Col md={11} sm={24} xs={24}>
                                        <FormGroup>    
                                            <Label for="periodo">{this.stringTranslate("Label.Prazo")}</Label>                  
                                            <RangePicker 
                                            size="large" 
                                            id="prazo" 
                                            style={{ width: '100%' }} 
                                            placeholder={[this.stringTranslate("Label.DataInicio"), this.stringTranslate("Label.DataFim")]} 
                                            onChange={(e) => this.handleChangeSelect(e, "prazo")} 
                                            format="DD-MM-YYYY"
                                            />
                                        </FormGroup>                                                               
                                    </Col>
                                
                                </Row>  

                                <Row>
                                    <Col lg={9} md={24} xs={24}>
                                        <Switch 
                                            onChange={() => this.onToggled("soVisitantes")} 
                                            checked={this.state.toggleFiltro["soVisitantes"]}
                                            size="small"    
                                        /> 
                                        <Label style={{marginLeft: "5px"}} onClick={() => this.onToggled("soVisitantes")}>{this.stringTranslate("Label.SoVisitantes")}</Label>      
                                    </Col>
                                    <Col lg={6} md={24} xs={24}>
                                        <Switch 
                                            onChange={() => this.onToggled("mostrarPlacas")} 
                                            checked={this.state.toggleFiltro["mostrarPlacas"]}
                                            size="small"    
                                        /> 
                                        <Label style={{marginLeft: "5px"}} onClick={() => this.onToggled("mostrarPlacas")}>{this.stringTranslate("Label.MostrarPlaca")}</Label>   
                                    </Col>
                                    <Col lg={8} md={24} xs={24}>   
                                        <Switch 
                                            onChange={() => this.onToggled("soVeiculos")} 
                                            checked={this.state.toggleFiltro["soVeiculos"]}
                                            size="small"    
                                        /> 
                                        <Label style={{marginLeft: "5px"}} onClick={() => this.onToggled("soVeiculos")}>{this.stringTranslate("Label.SoComPlaca")}</Label>  
                                    </Col>          
                                </Row>                                       
                            </Col>

                            <Col lg={9} md={24} xs={24}>
                                <Row type="flex"  justify="space-between" gutter={16}>

                                    {/* <Col md={12} sm={24} xs={24}>
                                        <FormGroup>   
                                            <Button block color="primary" onClick={() => this.pesquisar()}>{this.stringTranslate("Botao.Imprimir")}</Button>
                                        </FormGroup>   
                                    </Col> */}
                                    <Col md={12} sm={24} xs={24}>
                                      <FormGroup>
                                      {this.state.dadosRelatorio.length > 0 ?(
                                      <CSVLink  
                                              data={this.state.dadosRelatorio}
                                              headers={this.columns}
                                              filename={this.stringTranslate("Routes.relatorio7")+moment().format("YYYYMMDDhhmmss") +".csv"}
                                              style={{ //pass other props, like styles
                                                textAlign: "center",
                                                width: "100%",
                                                boxShadow:"none",
                                                background:"linear-gradient(to bottom left, #fb8b06, #fd9d27, #fb8b06)",
                                                backgroundColor:"#fb8b06",
                                                borderRadius:"6px",
                                                border:"none",
                                                display:"inline-block",
                                                cursor:"pointer","color":"#ffffff",
                                                fontSize:"15px",
                                                fontWeight:"bold",
                                                padding:"9px 20px",
                                                textDecoration:"none",
                                                textShadow:"0px 1px 0px ##ffffff"
                                                }}
                                                
                                            >
                                            {this.stringTranslate("Label.BaixarCSV")}    
                                        </CSVLink> 
                                      ):null}
                                          {/* <Button block disabled type="sucundary" style={{textTransform: "uppercase"}}  loading={this.state.loadingButtonPesquisar} size="large" onClick={() => this.pesquisar()}>{this.stringTranslate("Botao.Imprimir")}</Button> */}
                                      </FormGroup> 
                                    </Col>
                                    <Col md={12} sm={24} xs={24}>
                                    <Spin spinning={this.state.loadingELS}>
                                        <FormGroup>   
                                            <Button block color="warning" onClick={() => this.pesquisar()}>{this.stringTranslate("Botao.Visualizar")}</Button>
                                        </FormGroup>   
                                    </Spin>    
                                    </Col>
                              </Row>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Col>
          </Row>
          <Row>
              <Col>
                <Card>
                    <CardBody style={{marginTop: "10px"}}>
                    {this.state.buscando === true ? (<Skeleton />) : 
                      (<Table
                            columns={this.columns}
                            dataSource={this.state.dadosRelatorio}
                            pagination={{hideOnSinglePage: true, itemRender:this.itemRender, size:"small"}}
                            loading={this.state.loading}                            
                            size="small"
                        />)
                    }
                    </CardBody>
                </Card>
              </Col>
          </Row>
        </div> 
      </>
    );
  }
}

export default injectIntl(AcessosSecao);
