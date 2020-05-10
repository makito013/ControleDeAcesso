import React from "react";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  Nav,
} from "reactstrap";
import { FormGroup, Label, Input, CustomInput  } from 'reactstrap';
import { post } from "utils/api";
import InputMask from 'react-input-mask';
import { toast, Slide } from 'react-toastify';
import { injectIntl } from "react-intl";
import { Tree, Skeleton, TreeSelect, Spin } from 'antd';
import { Select, Switch, DatePicker, Empty, Row, Col   } from 'antd';
import { Button, Tooltip, Tabs, Table } from 'antd';
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
class HistoricoAlteracaoJornada extends React.Component {
    constructor(props) {
        super(props);
        this.state = {          
            totalColetores: 0,
            toggleQualquerData: false,
            dataTable: [],
            pagination: {},
            loading: false,
            pesquisando: false,
        };
        this.toggleQualquerData = false;
        this.valores = [];
        this.valores.date = moment();
        this.stringTranslate = this.stringTranslate.bind(this);   
        this.handleChange = this.handleChange.bind(this);
        this.pesquisar = this.pesquisar.bind(this);
        this.toggleCollapse = this.toggleCollapse.bind(this);
        this.defaultValue();

        this.columns = [
          {
            title: this.stringTranslate("Label.Pessoa"),            
            dataIndex: 'pessoa',
          },
          {
            title: this.stringTranslate("Label.Jornada"),
            dataIndex: 'jornada',
          },
          {
            title: this.stringTranslate("Label.DataInicioAlteracao"),
            dataIndex: 'dataInicio',      
            align: 'center',       
          },
          {
            title: this.stringTranslate("Label.DataFimAlteracao"),
            dataIndex: 'dataFim',
            align: 'center',       
          },
          {
            title: this.stringTranslate("Label.DataAlteracao"),
            dataIndex: 'dataAlteracao',
            align: 'center',       
          }
        ];
    }

    defaultValue(){
        this.valores.data = moment();
        
    }

    stringTranslate(id){
        return this.props.intl.formatMessage({id: id});
    }

    handleChange(e, key){
        this.valores[key] = e;      
    }

    toggleCollapse(e, index){
        this.toggleQualquerData = e
    }

   
    pesquisar(){      
      this.setState({pesquisando: true});
      const body={
        cmd:"historicoAlteracaoJornada",
        dataInicio: moment(this.valores.date).format("DD-MM-YYYY"),
        token:sessionStorage.getItem("token"),
      }
      post(body).then(lista =>{     
        if(lista.error === undefined)
        {
          console.log(lista)
          this.state.dataTable = lista.dados.historico.map(prop => {
            var dataFim = prop.dataFim === "indeterminado" ? "----------" : prop.dataFim;
            var dataInicio = prop.dataInicio === "indeterminado" ? "----------" : prop.dataInicio;
            
            return{pessoa: <span style={{textTransform: "uppercase", fontWeight: "600"}}>{prop.codigoPessoa} - {prop.nomePessoa}</span>, 
            jornada: prop.codigoJornada + " - " + prop.nomeJornada, 
            dataInicio: dataInicio, dataFim: dataFim, 
            dataAlteracao: prop.dataAlteracao}
          })
         console.log(this.state.dataTable)
          this.setState({dataTable:this.state.dataTable, pesquisando: false});   
          // this.setState({loading: false});              
        }                
        else
        {
          toast.dismiss();
          toast.error(this.stringTranslate("Erro.Servidor"), toastOptions);
          this.setState({pesquisando: false});
        } 
      }).catch(e =>{
        toast.dismiss();
        toast.error(this.stringTranslate("Erro.Servidor"), toastOptions);
        this.setState({pesquisando: false});
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
                 {this.stringTranslate("HistoricoJornadaAlt.Card.Title")}
                 <Button type="primary" style={{float: 'right', marginLeft: "15px"}} loading={this.state.loadingButtonPesquisar} size="small" onClick={() => this.pesquisar()}>{this.stringTranslate("Botao.Exibir")}</Button>
                 <DatePicker id="date" style={{ float: 'right', marginLeft: "7px" }} defaultValue={this.valores.date} 
                 onChange={e => this.handleChange(e, "date")} format={this.stringTranslate("Format.Date")} size="small"  showToday={false}                                       
                 />
                <Label style={{ float: 'right' }}>{this.stringTranslate("Label.Desde")}</Label> 
              </CardHeader>
              
                <CardBody>                  
                    <Row>                        
                        <Table
                            columns={this.columns}
                            dataSource={this.state.dataTable}
                            pagination={{showSizeChanger:true,size:"small",pageSizeOptions:["25","50","100"], hideOnSinglePage: true, itemRender:this.itemRender, defaultPageSize:"25"}}
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

export default injectIntl(HistoricoAlteracaoJornada);
