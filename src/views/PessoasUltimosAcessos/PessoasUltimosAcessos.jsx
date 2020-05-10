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
import { post,postAdonis } from "utils/api";
import InputMask from 'react-input-mask';
import { toast, Slide } from 'react-toastify';
import { injectIntl } from "react-intl";
import { Tree, Skeleton, TreeSelect, Spin } from 'antd';
import { Select, Switch, DatePicker, Empty, Row, Col   } from 'antd';
import { Button, Tooltip, Tabs, Table, Input } from 'antd';

import { CSVLink } from "react-csv";
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


const vazio = {value: "", label: ""};                
class PessoasUltimosAcessos extends React.Component {
    constructor(props) {
        super(props);
        this.state = {          
            totalColetores: 0,
            toggleQualquerData: false,
            dataTable: [],
            pagination: {},
            loading: false,
            filtrosPage: false,
            loadingLocais: true,
            locais: [],
            arvore: [],
            fetching: false,
            dataProprietario: [],
            dados:[],
        };
        this.toggleQualquerData = false;
        this.qualquerParte = false;
        this.valores = [];
        this.timePost = [];
        this.contErro = 0;
        this.stringTranslate = this.stringTranslate.bind(this);   
        this.handleChangeSelect = this.handleChangeSelect.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.pesquisar = this.pesquisar.bind(this);
        this.onToggled = this.onToggled.bind(this);
        this.toggleCollapse = this.toggleCollapse.bind(this);
        this.consultaDadosELT = this.consultaDadosELT.bind(this);
        this.filtrosToggle = this.filtrosToggle.bind(this);
        this.loadLocais = this.loadLocais.bind(this);
        this.reloadArvore = this.reloadArvore.bind(this);
        this.loadOptionsSelect = this.loadOptionsSelect.bind(this);
        this.arraysecao = [];
        this.arrayempresa = [];
        this.arraylotacao = [];        
        this.defaultValue();
        this.consultaDadosELT(); 
      //  this.loadLocais();  

        this.columns = [
            {
                title: this.stringTranslate("Label.Nome"),
                label: this.stringTranslate("Label.Nome"),
                dataIndex: 'name',
                key: 'name',
                width: '25%',
            },
            {
                title: this.stringTranslate("Label.EntradaColetor"),
                label: this.stringTranslate("Label.EntradaColetor"),
                dataIndex: 'in',
                key: 'in',
                width: '20%',
            },
            {
                title: this.stringTranslate("Label.SaidaColetor"),
                label: this.stringTranslate("Label.SaidaColetor"),
                dataIndex: 'out',
                key: 'out',
                width: '20%',
            },
            {
                title: this.stringTranslate("Label.PontoColetor"),
                label: this.stringTranslate("Label.PontoColetor"),
                dataIndex: 'point',
                key: 'point',
                width: '20%',
            },
            {
                title: this.stringTranslate("Label.UltimoAcesso"),
                label: this.stringTranslate("Label.UltimoAcesso"),
                dataIndex: 'least',
                key: 'least',
                width: '15%',
            },
        ];
    }

    filtrosToggle(){
        this.setState({filtrosPage: !this.state.filtrosPage})
      }

    defaultValue(){
        this.valores.posicao = 4;
        this.valores.usoCartao = 1;
        this.valores.tipoPessoa = [1, 2];
        this.valores.ELS = "";
        this.valores.data = moment();
        this.valores.toggleQualquerData = false;
        
    }

    onToggled(e){
        this.setState({})
    }

    stringTranslate(id){
        return this.props.intl.formatMessage({id: id});
    }

    toggleCollapse(e, index){
        if(index ===  "qualquerParte")
            this.qualquerParte = e;
        else if(index ===  "toggleQualquerData"){
            this.valores.toggleQualquerData = e;
            this.setState({})
        }             
    }
    

    handleChangeSelect(e, key){   
      this.valores[key] = e;      
    } 

    handleChange(e, key){
        this.valores[key] = e;      
      }
    
     //MARK: Consulta Dados ELT
   consultaDadosELT(){
    const body = {
      "cmd": "listasecaolotacaoempresa",
      "token": sessionStorage.getItem("token"),
    }
    //post(body).then((data) =>{
    postAdonis(body,'/Index/PessoaseUltimosAcessos').then((data) =>{
    if(data.error === undefined){
        
        data.secao.forEach(secao =>{
          this.arraysecao.push({value: secao.CodSecao,  title: secao.Nome, pai: secao.CodLotacao})                          
        })

        data.lotacao.forEach(lotacao => {
          this.arraylotacao.push({value: lotacao.CodLotacao, title: lotacao.Nome,pai: lotacao.CodEmpresa})        
        });

        data.empresa.forEach(empresa => {
          this.arrayempresa.push({value: empresa.CodEmpresa, title: empresa.Nome})  
        });
       
        var dataTable = [];
        data.ListaLocaisAcesso.map((prop) => {
            dataTable.push({value: parseInt( prop.CodLocalAcesso), title: prop.Nome})
        })
        this.state.locais = dataTable;
        //this.state.loadingLocais = false;
        this.setState({loadingLocais: false});

        this.reloadArvore()
        this.setState({reload: !this.state.reload}); // para recarregar os valores recebido do servidor para o select
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

  loadOptionsSelect = value => {
    if(value.length > 2){      
      clearInterval(this.timePost);
      
      this.timePost = setTimeout(() => this.consultaPessoa(value), 500);
    }    
  };

  consultaPessoa(value){
    const body={
        cmd:"consultaPessoas",          
        nome: value,
        resumo: true,
        token: sessionStorage.getItem("token"),
      }
      postAdonis(body,'/Geral/ConsultaPessoaP').then(lista =>{     
        if(lista.error === undefined)
        {            
          console.log(lista.dados);
          
          var array = lista.dados.map((item) => {
            return{value: item.codigo, text: item.nome, name: "Proprietario", name2: "novoMotorista"}
          })
          
          this.setState({dataProprietario: array, fetching: false});
        }                
        else
        {
          this.state.mensagemErro = this.stringTranslate("Liberacao.erro");
        } 
      });
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


      
    loadLocais(){
    let body = {
        cmd: "consultaLocaisAcesso",
        token: sessionStorage.getItem("token"),
    }
    post(body).then((data) => {
        if (data.error === undefined){
            var data = data.dados.ListaLocaisAcesso;
            var dataTable = [];
            data.map((prop) => {
                dataTable.push({value: parseInt( prop.CodLocalAcesso), title: prop.Nome})
            })
            this.state.locais = dataTable;
            //this.state.loadingLocais = false;
            this.setState({loadingLocais: false});
            //this.setState({locais: this.state.locais, loadLocais: false});
        }else{
            if(this.contErro++ >= 3){
                this.contErro = 0;
                toast.dismiss();
                toast.error(this.stringTranslate("Erro.Servidor"), toastOptions);
                }            
                else
                this.loadLocais() 
            }
    }).catch((error) => {
        if(this.contErro++ >= 3){
            this.contErro = 0;
            toast.dismiss();
            toast.error(this.stringTranslate("Erro.Servidor"), toastOptions);
        }            
        else
            this.loadLocais()
        }) 
    }
   
    pesquisar(){
      this.setState({loading: true});
    
        const body={
            cmd:"historicoUltimosAcessos",
            autorizado: this.valores.tipoPessoa.indexOf(1) > -1 ? true : false,
            visitantes: this.valores.tipoPessoa.indexOf(2) > -1 ? true : false,
            qualquerData: this.valores.toggleQualquerData,
            posicao: this.valores.posicao,
            // "qualquerParte": boolean,
            usoCartao: this.valores.usoCartao,
            nome:this.valores.nome,
            localAcesso: this.valores.local,
            dataInicio: moment(this.valores.data).format("YYYY-MM-DD"),
            pessoas: {
                secaov: this.valores.ELS.indexOf("_secao") > -1 ? parseInt(this.valores.ELS.replace(/_secao/g, "")) : "",
                lotacaov: this.valores.ELS.indexOf("_lotacao") > -1 ? parseInt(this.valores.ELS.replace(/_lotacao/g, "")) : "",
                empresav: this.valores.ELS.indexOf("_empresa") > -1 ? parseInt(this.valores.ELS.replace(/_empresa/g, "")) : "",
            },
            token:sessionStorage.getItem("token"),
        }
        console.log(body);
        postAdonis(body,'/Relatorio/PessoaseUltimosAcessos').then(lista =>{     
          console.log(lista);
          if(lista.error === undefined)
          {
              var data = [];
         
              lista.dados.forEach((prop) =>{
                data.push({
                  "name": prop.name,
                  "in": prop.in  !== undefined && prop.in !==null ? moment(prop.in).format('DD/MM/YY HH:MM:SS') + " - " + prop.inC : "----",
                  "out": prop.out !== undefined && prop.out !==null ? moment(prop.out).format('DD/MM/YY HH:MM:SS') + " - " + prop.outC :"----",
               //   "point": prop.point !== undefined ? prop.point : null,
                 "least": prop.in > prop.out  ?  this.stringTranslate("Label.Entrada") : this.stringTranslate("Label.Saida"),
                })
                
              });   
              this.setState({loading: false, dataTable: data});          
          }                
          else
          {
            this.state.mensagemErro = this.stringTranslate("Liberacao.erro");
            this.setState({loading: false});
          } 
        });      
    }


  render() {    

    return (
      <>      
      <div className="content">


        <Row>
          <Col>
            <Card>
              <CardHeader tag="h4">  

          
                 {this.stringTranslate("PessoasUltimosAcessos.Card.Title")}
              </CardHeader>
              <CardBody style={{paddingBottom: "5px"}}>                            
                <Row type="flex" justify="space-between" align="bottom" gutter={16}>
                    <Col md={7} sm={24} xs={24}>
                        <FormGroup>                      
                            <Label for="local">{this.stringTranslate("PessoasUltimosAcessos.Select.Title.Local")}</Label>  
                            <Spin spinning={this.state.loadingLocais}>
                            <Select  
                                id="local"                          
                                style={{ width: '100%' }}
                                placeholder=""
                                size="large"    
                                onChange={e => this.handleChangeSelect(e, "local")}   
                                defaultValue={0}     
                            >
                                <Option value={0} style={{textTransform:"uppercase"}}>{this.stringTranslate("Botao.Todos")}</Option> 
                                {this.state.locais.map(prop => {
                                    return(
                                        <Option value={prop.value}>{prop.title}</Option>
                                    )
                                })}                     
                            </Select>    
                            </Spin>            
                        </FormGroup>
                    </Col>
                    <Col md={7} sm={24} xs={24}>
                        <FormGroup> 
                            <Label for="posicao">{this.stringTranslate("PessoasUltimosAcessos.Select.Title.Posicao")}</Label>  
                            <Select         
                                id="posicao"
                                style={{ width: '100%' }}
                                placeholder=""
                                size="large"   
                                defaultValue={3} 
                                onChange={e => this.handleChangeSelect(e, "posicao")}        
                            >
                                <Option value={1}>{this.stringTranslate("PessoasUltimosAcessos.Select.Posicao.Option1")}</Option>          
                                <Option value={2}>{this.stringTranslate("PessoasUltimosAcessos.Select.Posicao.Option2")}</Option> 
                                <Option value={3}>{this.stringTranslate("PessoasUltimosAcessos.Select.Posicao.Option3")}</Option>       
                                <Option value={4}>{this.stringTranslate("PessoasUltimosAcessos.Select.Posicao.Option4")}</Option>                  
                            </Select>             
                        </FormGroup>
                    </Col>      
                    <Col md={5} sm={24} xs={24}>
                        <FormGroup> 
                            <Label for="usoCartao">{this.stringTranslate("PessoasUltimosAcessos.Select.Title.UsoCartao")}</Label>  
                            <Select   
                                id="usoCartao"                         
                                style={{ width: '100%' }}
                                placeholder=""
                                size="large"    
                                defaultValue={1}
                                onChange={e => this.handleChangeSelect(e, "usoCartao")}        
                            >
                                <Option value={1}>{this.stringTranslate("PessoasUltimosAcessos.Select.UsoCartao.Option1")}</Option>          
                                <Option value={2}>{this.stringTranslate("PessoasUltimosAcessos.Select.UsoCartao.Option2")}</Option>
                                <Option value={3}>{this.stringTranslate("PessoasUltimosAcessos.Select.UsoCartao.Option3")}</Option>
                            </Select>             
                        </FormGroup>
                    </Col> 
                    <Col md={5} sm={24} xs={24}>
                        <FormGroup> 
                            <Label for="date">{this.stringTranslate("Label.Data")}</Label>  
                            {this.valores.toggleQualquerData === false ? ( 
                            <DatePicker allowClear={false} placeholder={this.stringTranslate("PessoasUltimosAcessos.Switch.QualquerData")} 
                            id="date" style={{ width: '100%' }} 
                            defaultValue={this.valores.data} onChange={e => this.handleChange(e, "data")} 
                            format={this.stringTranslate("Format.Date")} size="large"  showToday={false}
                            renderExtraFooter={() => <> <Switch                                
                                onChange={(e) => this.toggleCollapse(e, "toggleQualquerData")} 
                                defaultChecked={this.valores.toggleQualquerData}     
                                size="small"                              
                                /> 
                                <Label style={{marginLeft: "7px"}} onClick={() => this.toggleCollapse(!this.valores.toggleQualquerData, "toggleQualquerData")}>{this.stringTranslate("Label.QualquerData")}</Label>             
                            </>}
                            />) : ( 
                            
                            <Input size="large" defaultValue={this.stringTranslate("Label.QualquerData")} 
                            onClick={() => this.toggleCollapse(!this.valores.toggleQualquerData, "toggleQualquerData")} />                                                           
                            )}                                                                  
                        </FormGroup>
                    </Col>                 
                </Row>    
                <Row type="flex" justify="space-between" align="bottom" gutter={16}>
                    <Col md={16} sm={24} xs={24}>
                        <FormGroup> 
                            <Label for="tipoPessoa">{this.stringTranslate("PessoasUltimosAcessos.Label.TipoPessoa")}</Label>  
                            <Select             
                                id="tipoPessoa"               
                                style={{ width: '100%' }}
                                mode="multiple"
                                defaultValue={this.valores.tipoPessoa}
                                placeholder=""
                                size="large" 
                                onChange={e => this.handleChangeSelect(e, "tipoPessoa")}        
                            >
                                <Option value={1}>{this.stringTranslate("PessoasUltimosAcessos.Select.TipoPessoa.Option1")}</Option>          
                                <Option value={2}>{this.stringTranslate("PessoasUltimosAcessos.Select.TipoPessoa.Option2")}</Option>
                            </Select>             
                        </FormGroup>
                    </Col>      
                    <Col md={8} sm={24} xs={24}>
                        <FormGroup> 
                            <Label for="categoria" style={{textTransform:"uppercase"}}>{this.stringTranslate("Label.ELS")}</Label>  
                            <Spin spinning={this.state.loadingELS}>
                                <TreeSelect
                                style={{ width: '100%' }}                                
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                treeData={this.state.arvore}
                                placeholder={this.stringTranslate("Botao.Todos")}                 
                                onChange={(v) => this.handleChangeSelect(v, "ELS")}
                                size="large"
                                allowClear={true}
                                />
                            </Spin>                    
                        </FormGroup>             
                    </Col>       
                </Row>   
                          
                <Collapse isOpen={this.state.filtrosPage}>                 
                    <Row type="flex" justify="space-between" align="bottom" gutter={16}>
                                <Col md={24} sm={24} xs={24}>
                                <FormGroup>                      
                                <Label>{this.stringTranslate("Label.Nome")}</Label>    
                                <Select
                                    mode="default"
                                    showSearch={true}
                                    labelInValue
                                    size="large"
                                    placeholder=""
                                    notFoundContent={this.state.fetching ? <Spin size="small" /> : null}
                                    filterOption={false}
                                    onSearch={this.loadOptionsSelect}
                                    onChange={(e) => this.handleChangeSelect(e, "nome")}
                                    style={{ width: '100%' }}
                                    allowClear={true}
                                    >
                                    {this.state.dataProprietario.map(d => (
                                        <Option key={d.value}>{d.text}</Option>
                                    ))}
                                </Select>
                            </FormGroup>  
                            <Switch 
                                onChange={(e) => this.toggleCollapse(e, "qualquerParte")} 
                                size="small"    
                            /> 
                            <Label style={{marginLeft: "7px"}} onClick={() => this.toggleCollapse(!this.qualquerParte, "qualquerParte")} > Incluir Inativos</Label>
                        </Col>
                    </Row>
                </Collapse>

                <Row type="flex" justify="space-between" align="bottom" gutter={16} style={{marginTop: "5px"}}>
                    <Col md={4} sm={24} xs={24}>
                        <FormGroup> 
                        <Button block color="link" style={{color:"#b5b5b5", borderColor:"transparent", boxShadow: "0px 0px 0px rgba(0, 0, 0, 0.0)"}} onClick={() => this.filtrosToggle()}> {this.state.filtrosPage === false ? (<>VER FILTROS <i className="fad fa-chevron-double-down"></i></>) : (<>ESCONDER FILTROS <i className="fad fa-chevron-double-up"></i></>)}</Button>
                        </FormGroup> 
                    </Col> 
                    <Col md={9} sm={24}>
                    </Col>
                    <Col md={5} sm={24} xs={24}>
                        <FormGroup>
                        {this.state.dataTable.length > 0 ?(
                        <CSVLink  
                                data={this.state.dataTable}
                                headers={this.columns}
                                filename={this.stringTranslate("PessoasUltimosAcessos.Card.Title")+".csv"}
                                style={{ //pass other props, like styles
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
                    <Col md={5} sm={24} xs={24}>
                        <FormGroup> 
                            <Button  block type="primary"  style={{ //pass other props, like styles
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
                                  }} loading={this.state.loadingButtonPesquisar} size="large" onClick={() => this.pesquisar()}
                            
                            >
                            {this.stringTranslate("Botao.Visualizar")}</Button>
                        </FormGroup>
                    </Col>
                </Row>                
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row gutter={16} type="flex">
          <Col md={24} sm={24} xs={24}>
              <Card>
                <CardBody>
                    <Row>
                        <Table
                            columns={this.columns}
                            dataSource={this.state.dataTable}
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

export default injectIntl(PessoasUltimosAcessos);
