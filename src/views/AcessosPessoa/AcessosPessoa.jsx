import React from "react";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,  
} from "reactstrap";
import { Button, FormGroup, Label } from 'reactstrap';
import { postAdonis } from "utils/api";
import { toast, Slide } from 'react-toastify';

import { injectIntl } from "react-intl";
import { Row, Col, DatePicker, Table, Select, Spin, Skeleton } from 'antd';
import '../../assets/css/antd.css';
import { Switch } from 'antd';
import moment from 'moment';
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
const { Option } = Select;           
class AcessosPessoa extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          valores: [],      
          timePost:[],   
          data: [],
          reload: false,
          toggleFiltro: [],
          dataPessoas: [],
          fetching:false,
          dadosRelatorio:[],
          loading: false
      };

      this.onToggled = this.onToggled.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.onChange = this.onChange.bind(this);
      this.stringTranslate = this.stringTranslate.bind(this);
      this.toggle = this.toggle.bind(this);
      this.pesquisar = this.pesquisar.bind(this); 
      this.loadOptionsSelect = this.loadOptionsSelect.bind(this);
      this.gerarRelatorio = this.gerarRelatorio.bind(this);
      this.state.toggleFiltro["permanentes"] = this.state.toggleFiltro["visitantes"] = false;  

      this.columns = [
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
            title: this.stringTranslate("Label.Visitou"),
            dataIndex: 'visitou',
        },
        {
            title: this.stringTranslate("Label.Coletor"),
            dataIndex: 'coletor',
        },
    ];
  }

  validador(){
    if(!Boolean(this.state.valores["Pessoas"])){
      toast.dismiss();
      toast.warning(this.stringTranslate("Warning.selecioneUmaPessoa"), toastOptions);
      return 0;
    }
    else if(!Boolean(this.state.valores["prazo"])){
      toast.dismiss();
      toast.warning(this.stringTranslate("Warning.PreenchaUmPrazo"), toastOptions);
      return 0;
    }

    return 1;
  }

  gerarRelatorio(){
    if(!this.validador())    
      return;

    this.setState({loading:true});
    
    const body={
      "cmd":"acessosPorPessoa",
      "dataInicio": this.state.valores["prazo"][0] !== undefined ? this.state.valores["prazo"][0].format("YYYY-MM-DD") : null,
      "dataFim": this.state.valores["prazo"][1] !== undefined ? this.state.valores["prazo"][1].format("YYYY-MM-DD"): null,
      "soVisitantes": this.state.toggleFiltro["visitantes"],
      "soPermanentes": this.state.toggleFiltro["permanentes"],
      "nome": this.state.valores["Pessoas"] !== undefined ? this.state.valores["Pessoas"].label : null,
      "codigo": this.state.valores["Pessoas"] !== undefined ? this.state.valores["Pessoas"].key : null,
      "token": sessionStorage.getItem("token")
    };
    postAdonis(body,"/Relatorio/AcessosPorPessoa").then((data) => {      
      if (!data.error){
        this.state.dadosRelatorio = [];
        data.dados.map((prop) =>{
          this.state.dadosRelatorio.push(
            {
              data:  moment(prop.Datahora ).format('DD/MM/YYYY'),
              horario:moment(prop.Datahora ).format('HH:MM:SS'),
              direcao: prop.Direcao == 1 ?  this.stringTranslate("Entrada"): this.stringTranslate("Saida"), /*this.stringTranslate(prop.Direcao.split("_")[1]),*/ 
              visitou: prop.Visitou,
              coletor: prop.Coletor, 
            }
          )
        });
        this.setState({dadosRelatorio: this.state.dadosRelatorio, loading:false});
      }else{
        this.setState({loading:false});
        toast.dismiss();
        toast.error(this.stringTranslate("Erro.Servidor"), toastOptions);
      }
    }).catch((error) => {
      if(this.contErro++ >= 3){
        toast.dismiss();
        toast.error(this.stringTranslate("Erro.Servidor"), toastOptions);
        this.setState({loading:false});
      }                  
    })      
  }

  pesquisar(){
    this.gerarRelatorio();
  }

  handleChangeSelect(e, key){
    if(key === "locaisAcesso" && e.indexOf(9999) !== -1 ){
        this.state.valores.locaisAcesso = [];
        this.state.locais.map((prop) => { 
            if(prop.value !== 9999)              
                this.state.valores.locaisAcesso.push(prop.value)
        })
        this.setState({valores: this.state.valores});
        return true;
    }
    this.state.valores[key] = e;
    this.setState({valores: this.state.valores});
}


  onToggled(toggle){
    this.state.toggleFiltro[toggle] = !this.state.toggleFiltro[toggle];
    if (this.state.toggleFiltro[toggle]){
      if (toggle === "permanentes"){
        this.state.toggleFiltro["visitantes"] = false;
      }else{
        this.state.toggleFiltro["permanentes"] = false;
      }
    }
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


  handleChange(e, campo){
    this.state.valores[campo] = e;
    this.setState({valores: this.state.valores});
  }


  onChange(e){
    this.state.valores[e.target.name] = e.target.value;
    this.setState({valores: this.state.valores});
  }

  loadOptionsSelect = value => {
    if(value.length > 2){
      this.setState({fetching: true});
      clearInterval(this.state.timePost);
      this.state.timePost = setTimeout(() => {
        const body={
          cmd:"consultaPessoas",          
          nome: value,
          resumo: true,
          token: sessionStorage.getItem("token"),
        }
        postAdonis(body,'/Geral/ConsultaPessoaP').then(lista =>{     
          if(lista.error === undefined)
          {                  
            var array = lista.dados.map((item) => {
              return{value: item.codigo, text: item.nome}
            })
            
            this.setState({dataPessoas: array, fetching: false});
          }                
          else
          {
            this.state.mensagemErro = this.stringTranslate("Liberacao.erro");
          } 
        });
        
      }, 500);
    }    
  };

  
  render() {    
    return (
      <>      
        <div className="content">
          <Row>
            <Col md={24} sm={24} xs={24}>
              <Card>
                <CardHeader tag="h4"> {this.stringTranslate("Routes.relatorio6")} </CardHeader>
                <CardBody>
                  <Row type="flex"  justify="space-between" align="center" gutter={16}>
                    <Col md={16} sm={24} xs={24}>
                      <FormGroup>                      
                        <Label>{this.stringTranslate("Label.Pesquisar")}</Label>                        
                        <Select
                          mode="default"
                          showSearch={true}
                          labelInValue
                          size="large"
                          value={this.state.valores["Pessoas"]}
                          placeholder=""
                          notFoundContent={this.state.fetching ? <Spin size="small" /> : null}
                          filterOption={false}
                          onSearch={this.loadOptionsSelect}
                          onChange={(e) => this.handleChange(e, "Pessoas")}
                          style={{ width: '100%' }}
                          allowClear={true}
                        >
                          {this.state.dataPessoas.map(d => (
                            <Option key={d.value}>{d.text}</Option>
                          ))}
                        </Select>
                        <Switch 
                            onChange={() => this.onToggled("visitantes")} 
                            checked={this.state.toggleFiltro["visitantes"]}
                            size="small"    
                        /> 
                        <Label style={{marginLeft: "7px", marginRight: "15px"}} onClick={() => this.onToggled("visitantes")}>{this.stringTranslate("Label.SoVisitantes")}</Label>    
                        <Switch 
                            onChange={() => this.onToggled("permanentes")} 
                            checked={this.state.toggleFiltro["permanentes"]}
                            size="small"    
                        /> 
                        <Label style={{marginLeft: "7px"}} onClick={() => this.onToggled("permanentes")}>{this.stringTranslate("Label.SoPermanentes")}</Label>                                                                                       
                      </FormGroup>
                    </Col>
                    <Col md={8} sm={24} xs={24}>
                        <FormGroup>    
                            <Label for="periodo">{this.stringTranslate("Label.Prazo")}</Label>                  
                            <RangePicker 
                            size="large" 
                            id="prazo" 
                            style={{ width: '100%' }} 
                            placeholder={[this.stringTranslate("Label.DataInicio"), this.stringTranslate("Label.DataFim")]} 
                            value={this.state.valores["prazo"]} 
                            onChange={(e) => this.handleChangeSelect(e, "prazo")} 
                            format="DD-MM-YYYY"
                            />
                        </FormGroup>                                                               
                    </Col>
                  </Row>                                         
                </CardBody>
                <CardFooter style={{paddingTop:"0px"}}>
                <Row type="flex" justify="space-between" align="bottom" gutter={16}>  
                    <Col md={16} sm={24} xs={24}>
                    </Col>                 
                    <Col md={4} sm={24} xs={24}>
                        <Button block color="warning" onClick={() => this.pesquisar()}>{this.stringTranslate("Botao.Exibir")}</Button>
                    </Col>
                    <Col md={4} sm={24} xs={24}>
                        <Button block color="primary" onClick={() => this.pesquisar()}>{this.stringTranslate("Botao.Imprimir")}</Button>
                    </Col>
                </Row>
                </CardFooter>
              </Card>
            </Col>
          </Row>
          <Row>
              <Col>
                <Card>
                    <CardBody style={{marginTop: "10px"}}>
                      <Skeleton loading={this.state.loading} active> 
                        <Table
                              columns={this.columns}
                              dataSource={this.state.dadosRelatorio}
                              pagination={{hideOnSinglePage: true, itemRender:this.itemRender, size:"small"}}
                              loading={this.state.loading}                            
                              size="small"
                        />
                      </Skeleton>
                    </CardBody>
                </Card>
              </Col>
          </Row>
        </div> 
      </>
    );
  }
}

export default injectIntl(AcessosPessoa);
