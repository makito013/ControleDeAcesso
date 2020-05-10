import React from "react";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  Nav,
  Collapse
} from "reactstrap";
import { FormGroup, Label, CustomInput  } from 'reactstrap';
import { post } from "utils/api";
import InputMask from 'react-input-mask';
import { toast, Slide } from 'react-toastify';
import { injectIntl } from "react-intl";
import { Tree, Skeleton, TreeSelect, Spin } from 'antd';
import { Select, Switch, DatePicker, Empty, Row, Col, Form } from 'antd';
import { Button, Tooltip, Tabs, Table, Input } from 'antd';
import moment from 'moment';

const { Option } = Select;
const { TabPane } = Tabs;
const toastOptions = {
  transition: Slide,
  position: "top-center",
  autoClose: 5000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: true
};

const { RangePicker } = DatePicker;


const vazio = {value: "", label: ""};                
class AcessosComuns extends React.Component {
    constructor(props) {
        super(props);
        this.state = {          
            totalColetores: 0,
            data: [],
            pagination: {},
            loading: false,
            filtrosPage: false,
            loadingELS: true,
            invalid: [false, false],
            dadosRelatorio: []
        };
        this.contErro = 0;
        this.valores = {secao1: "", secao2: ""};
        this.arraysecao=[];
        this.arraylotacao=[];
        this.arrayempresa=[];

        this.stringTranslate = this.stringTranslate.bind(this);   
        this.handleChangeSelect = this.handleChangeSelect.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.pesquisar = this.pesquisar.bind(this);
        this.gerarRelatorio = this.gerarRelatorio.bind(this);

        this.consultaDadosELT = this.consultaDadosELT.bind(this);
        this.defaultValue();

        this.columns = [
            {
                title: this.stringTranslate("Label.Nome"),
                dataIndex: 'nome',
            },
            {
                title: this.stringTranslate("Label.Data"),
                dataIndex: 'data',
            },
            {
                title: this.stringTranslate("Label.Hora"),
                dataIndex: 'horario',
            },
            {
                title: this.stringTranslate("Label.Direcao"),
                dataIndex: 'direcao',
            },
            {
                title: this.stringTranslate("Label.Secao"),
                dataIndex: 'secao',
            },
            {
                title: this.stringTranslate("Label.Visitou"),
                dataIndex: 'visitou',
            },
            {
                title: this.stringTranslate("Label.Coletor"),
                dataIndex: 'coletor',
            },
        ];
    }

    gerarRelatorio(){
        const body = {
            "cmd": "acessoComumSecoes",
            "token": sessionStorage.getItem("token"),
            "secao1": this.valores.secao1,
            "secao2": this.valores.secao2,
            "dataInicio": this.valores["prazo"][0].format("DD-MM-YYYY"),
            "dataFim": this.valores["prazo"][1].format("DD-MM-YYYY"),
            "soVisitantes": Boolean(this.valores["filtroTipo"]),
        }
        post(body).then((data) =>{
            this.state.dadosRelatorio = [];
            data.dados.acessos.map((prop) =>{
                this.state.dadosRelatorio.push(
                    {
                        nome: prop.Nome,
                        data: prop.Date,
                        horario: prop.Horario,
                        direcao: this.stringTranslate(prop.Direcao.split("_")[1]),
                        secao: prop.Secao,
                        visitou: prop.Visitou,
                        coletor: prop.Coletor,
                    }
                );
            });
            this.setState({dadosRelatorio: this.state.dadosRelatorio});
        }).catch((error) => {
            if(this.contErro++ >= 3){
              toast.dismiss();
              toast.error(this.stringTranslate("Erro.Servidor"), toastOptions);
            }            
            else
              this.gerarRelatorio()     
          })      
    }

    //MARK: Consulta Dados ELT
    consultaDadosELT(){
        const body = {
          "cmd": "listasecaolotacaoempresa",
          "token": sessionStorage.getItem("token"),
        }
        post(body).then((data) =>{
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
  
            this.setState({loadingELS: false}); // para recarregar os valores recebido do servidor para o select
          }else{
            if(this.contErro++ >= 3){
              toast.dismiss();
              toast.error(this.stringTranslate("Erro.Servidor"), toastOptions);
            }            
            else
              this.consultaDadosELT()                
          }
                      
        }).catch((error) => {
          if(this.contErro++ >= 3){
            toast.dismiss();
            toast.error(this.stringTranslate("Erro.Servidor"), toastOptions);
          }            
          else
            this.consultaDadosELT()     
        })      
        
      }
      //-----------------------------------------------------------------


    defaultValue(){
        this.valores.posicao = 4;
        this.valores.usoCartao = 1;
        this.valores.tipoPessoa = [1, 2, 3];
        this.valores.data = moment();
        this.consultaDadosELT();
    }

    stringTranslate(id){
        return this.props.intl.formatMessage({id: id});
    }
    

    handleChangeSelect(e, key){
        //Verifica se secao1 e secao2 são diferentes para poder salvar o valor novo        
        this.valores[key] = e;      
        
        if(key === "empresa1"){
            this.valores.secao1 = "";
            this.valores.lotacao1 = "";
        }
        else if(key === "lotacao1")
            this.valores.secao1 = "";    

        else if(key === "empresa2"){
            this.valores.secao2 = "";
            this.valores.lotacao2 = "";
        }
        else if(key === "lotacao2")
            this.valores.secao2 = "";    

        this.setState({})
    } 

    handleChange(e, key){
        this.valores[key] = e.target.value;      
      }
    

   
    pesquisar(){ 
        //Verifica se todos os campos estão de acordo       
        if(this.valores.secao1 === undefined || this.valores.secao1 === ""){
            toast.dismiss();
            toast.warning(this.stringTranslate("Warning.SecaoNull1"), toastOptions);
            return;
        }

        if(this.valores.secao2 === undefined || this.valores.secao2 === ""){
            toast.dismiss();
            toast.warning(this.stringTranslate("Warning.SecaoNull2"), toastOptions);
            return;
        }

        if( this.valores.secao1 === this.valores.secao2){
            toast.dismiss();
            toast.warning(this.stringTranslate("Warning.SecaoIgual"), toastOptions);
            return;
        }

        if(this.valores.prazo === undefined){
            toast.dismiss();
            toast.warning(this.stringTranslate("Warning.dateNull"));
            return;
        }

        this.setState({loading: true});
        this.gerarRelatorio();
        this.setState({loading: false});
    }


  render() {    
      
    
    return (
      <>      
      <div className="content">


        <Row type="flex" justify="space-between" align="bottom" gutter={16}>
        <Col md={8} sm={24} xs={24}>
            <Card>
              <CardHeader tag="h4">        
                 {this.stringTranslate("AcessosComun.Card.Title1")}
              </CardHeader>
              <CardBody style={{paddingBottom: "5px"}}>                            
                <Row gutter={16}>
                    <Col>                       
                        <FormGroup>                                                 
                            <Label for="empresa1">{this.stringTranslate("Label.Empresa")}</Label>  
                            <Spin spinning={this.state.loadingELS}> 
                                <Select  
                                    id="empresa1"                          
                                    style={{ width: '100%' }}
                                    placeholder=""
                                    size="large"    
                                    onChange={e => this.handleChangeSelect(e, "empresa1")}        
                                >                                    
                                    {this.arrayempresa.map(prop => {
                                        return(
                                        <Option value={prop.value}> {prop.title}</Option> )
                                    })}                                                                                                     
                                </Select>  
                            </Spin>              
                        </FormGroup>                            
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col>                        
                        <FormGroup> 
                            <Label for="lotacao1">{this.stringTranslate("Label.Lotacao")}</Label>                              
                            <Spin spinning={this.state.loadingELS}>
                                <Select         
                                    id="lotacao1"                   
                                    style={{ width: '100%' }}
                                    placeholder=""
                                    value={this.valores.lotacao1}
                                    size="large"   
                                    onChange={e => this.handleChangeSelect(e, "lotacao1")}        
                                >                                    
                                    {this.arraylotacao.map(prop => {
                                        if(this.valores.empresa1 === prop.pai)
                                            return(<Option value={prop.value}> {prop.title}</Option> )
                                        else
                                            return(null);  
                                    })}                     
                                </Select>
                            </Spin>             
                        </FormGroup>                        
                    </Col> 
                </Row>
                <Row gutter={16}>        
                    <Col>                        
                        <FormGroup> 
                            <Label for="secao1">{this.stringTranslate("Label.Secao")}</Label>  
                            <Spin spinning={this.state.loadingELS}>
                                <Select   
                                    id="secao1"                         
                                    style={{ width: '100%' }}
                                    placeholder=""
                                    value={this.valores.secao1}
                                    size="large"    
                                    onChange={e => this.handleChangeSelect(e, "secao1")}        
                                >
                                    {this.arraysecao.map(prop => {
                                        if(this.valores.lotacao1 === prop.pai)
                                            return(<Option value={prop.value}> {prop.title}</Option> )
                                        else
                                            return(null);  
                                    })}
                                </Select> 
                            </Spin>            
                        </FormGroup>
                    </Col>                   
                </Row >                                    
              </CardBody>
            </Card>
          </Col>

          <Col md={8} sm={24} xs={24}>
            <Card>
              <CardHeader tag="h4">        
                 {this.stringTranslate("AcessosComun.Card.Title2")}
              </CardHeader>
              <CardBody style={{paddingBottom: "5px"}}>                            
                <Row gutter={16}>
                    <Col>                        
                        <FormGroup>                      
                            <Label for="empresa2">{this.stringTranslate("Label.Empresa")}</Label>  
                            <Spin spinning={this.state.loadingELS}>
                                <Select  
                                    id="empresa2"                          
                                    style={{ width: '100%' }}
                                    placeholder=""
                                    size="large"    
                                    onChange={e => this.handleChangeSelect(e, "empresa2")}        
                                >
                                    {this.arrayempresa.map(prop => {
                                            return(
                                            <Option value={prop.value}> {prop.title}</Option> )
                                    })}                   
                                </Select>    
                            </Spin>            
                        </FormGroup>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col>
                        <FormGroup> 
                            <Label for="lotacao2">{this.stringTranslate("Label.Lotacao")}</Label>  
                            <Spin spinning={this.state.loadingELS}>
                                <Select         
                                    id="lotacao2"                   
                                    style={{ width: '100%' }}
                                    placeholder=""
                                    size="large"   
                                    value={this.valores.lotacao2}
                                    onChange={e => this.handleChangeSelect(e, "lotacao2")}        
                                >
                                    {this.arraylotacao.map(prop => {
                                         if(this.valores.empresa2 === prop.pai)
                                            return(<Option value={prop.value}> {prop.title}</Option> )
                                          else
                                            return(null);  
                                    })}                     
                                </Select>  
                            </Spin>           
                        </FormGroup>
                    </Col> 
                </Row>
                <Row gutter={16}>        
                    <Col>                        
                        <FormGroup> 
                            <Label for="secao2">{this.stringTranslate("Label.Secao")}</Label>  
                            <Spin spinning={this.state.loadingELS}>
                                <Select   
                                    id="secao2"                         
                                    style={{ width: '100%' }}
                                    placeholder=""
                                    size="large"    
                                    value={this.valores.secao2}
                                    onChange={e => this.handleChangeSelect(e, "secao2")}        
                                >
                                    {this.arraysecao.map(prop => {
                                        if(this.valores.lotacao2 === prop.pai)
                                            return(<Option value={prop.value}> {prop.title}</Option> )
                                        else
                                            return(null);  
                                    })}
                                </Select> 
                            </Spin>            
                        </FormGroup>                        
                    </Col>                   
                </Row >                                    
              </CardBody>
            </Card>
          </Col>

          <Col md={8} sm={24} xs={24}>
            <Card>
              <CardBody style={{paddingBottom: "5px"}}>                            
                <Row gutter={16}>
                    <Col>                      
                        <FormGroup>    
                            <Label for="prazo">{this.stringTranslate("Label.Periodo")}</Label>                                          
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
                <Row gutter={16}>
                    <Col>
                        <FormGroup>
                        <Label for="examplePassword">{this.stringTranslate("AcessosComun.Select.tipo")}</Label>
                        <Select                            
                            style={{ width: '100%' }}
                            size="large"                                                   
                            onChange={e => this.handleChangeSelect(e, "filtroTipo")}
                            defaultValue={0}
                        >
                            <Option value={0}>{this.stringTranslate("AcessosComun.Select.tipo.Option1")}</Option>       
                            <Option value={1}>{this.stringTranslate("AcessosComun.Select.tipo.Option2")}</Option>              
                        </Select>  
                    </FormGroup>
                    </Col>
                </Row>    
                    <Row style={{marginTop: "11px"}} gutter={16} align="bottom" justify="space-between">
                        <Col>
                            <FormGroup> 
                                <Button block disabled type="sucundary" style={{textTransform: "uppercase"}}  loading={this.state.loadingButtonPesquisar} size="large" onClick={() => this.pesquisar()}>{this.stringTranslate("Botao.Imprimir")}</Button>
                            </FormGroup> 
                        </Col>
                    </Row>
                     <Row gutter={16} align="bottom" justify="space-between">
                        <Col>
                            <FormGroup> 
                                <Button block type="primary" style={{textTransform: "uppercase"}} loading={this.state.loadingButtonPesquisar} size="large" onClick={() => this.pesquisar()}>{this.stringTranslate("Botao.Visualizar")}</Button>
                            </FormGroup>
                        </Col>
                     </Row>                 
              </CardBody>
            </Card>
            
          </Col>
        </Row>

        <Row gutter={16} type="flex" >
          <Col md={24} sm={24} xs={24}>
                <Card>
                    <CardBody style={{marginTop: "10px"}}>
                        <Row>
                            <Table
                                columns={this.columns}
                                dataSource={this.state.dadosRelatorio}
                                pagination={{hideOnSinglePage: true, itemRender:this.itemRender, size:"small"}}
                                loading={this.state.loading}                            
                                size="small"
                            />
                        </Row>
                    </CardBody>
                </Card>
          </Col>
        </Row>
       </div> 
       </>
    );
  }
}

export default injectIntl(AcessosComuns);
