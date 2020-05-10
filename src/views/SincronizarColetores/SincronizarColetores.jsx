import React from "react";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  
  Collapse,
  Nav,
  UncontrolledTooltip,
} from "reactstrap";
import { FormGroup, Label, Input, CustomInput  } from 'reactstrap';
import { post } from "utils/api";
import InputMask from 'react-input-mask';
import { toast, Slide } from 'react-toastify';
import { injectIntl } from "react-intl";
import { Tree, Skeleton, TreeSelect, Spin } from 'antd';
import { Select, Switch, DatePicker, Empty, Row, Col   } from 'antd';
import { Button, Tooltip, Tabs } from 'antd';
import SelectTreeViewNeo from 'components/SelectTreeViewNeo/SelectTreeViewNeo';

const { Option } = Select;
const { TabPane } = Tabs;
const {TreeNode} = Tree;
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
class SincronizarColetores extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          valores: [], 
          totalColetores: 0,
          locaisAcesso: [],
        };
        this.stringTranslate = this.stringTranslate.bind(this);  
        this.setLocaisAcesso = this.setLocaisAcesso.bind(this); 
        this.handleChangeSelect = this.handleChangeSelect.bind(this);
        this.onChange = this.onChange.bind(this);
        this.pesquisar = this.pesquisar.bind(this);
        this.toggleCollapse = this.toggleCollapse.bind(this);
    }

    componentDidMount(){
      this.setLocaisAcesso();
    }


    stringTranslate(id){
        return this.props.intl.formatMessage({id: id});
    }

    setLocaisAcesso(){
      const body = {
        "cmd": "gerarArvoreSincronizaColetores",
        "token": sessionStorage.getItem("token"),
        "autonomo": this.state.valores["tipo"] !== undefined ? this.state.valores["tipo"] : false,
      }
      post(body).then((data) => {
        if (data.error === undefined){
          this.state.locaisAcesso = data.dados.locaisAcesso;
          this.setState({locaisAcesso: this.state.locaisAcesso});
        }else{
          
        }
      })
    }

    toggleCollapse(e, index){
      this.state.valores[index] = e;
      this.setState({valores: this.state.valores})
   }
    

    handleChangeSelect(e, key){
      this.state.valores[key] = e;
      this.setState({valores: this.state.valores});
      this.setLocaisAcesso();
    } 

    onChange(e){
      this.state.valores[e.target.name] = e.target.value;
      this.setState({valores: this.state.valores});
    }

   
    pesquisar(){
      this.setState({loading: true});
      if((this.state.valores["pesquisa"] !== "") || 
      ((this.state.valores["categoria"] !==undefined) &&
      (this.state.valores["categoria"].length > 0 ))){
        const body={
          cmd:"gerarArvoredePesquisa",
          nome: this.state.valores["pesquisa"],
  
          categoria: this.state.valores["categoria"] !== undefined ? this.state.valores["categoria"].toString() : null,
          incluirresidente: this.state.valores["incluirresidente"] !== undefined ? this.state.valores["incluirresidente"].value : true,
          incluirpreautorizado: this.state.valores["incluirpreautorizado"] !== undefined ? this.state.valores["incluirpreautorizado"].value : true,
          incluirprecisaliberacao: this.state.valores["incluirprecisaliberacao"] !== undefined ? this.state.valores["incluirprecisaliberacao"].value : false,
          incluirnaoresidenteautorizado: this.state.valores["incluirnaoresidenteautorizado"] !== undefined ? this.state.valores["incluirnaoresidenteautorizado"].value : true,
          incluirinativos: this.state.valores["incluirinativos"] !== undefined ? this.state.valores["incluirinativos"].value : false,
          qualquerparte: this.state.valores["qualquerparte"] !== undefined ? this.state.valores["qualquerparte"].value : false,
          token:sessionStorage.getItem("token"),
        }
        post(body).then(lista =>{     
          console.log(lista);
          if(lista.error === undefined)
          {
            var filhosSecao= lista.dados.ListaPessoas;
            this.state.expand=[];
            this.filhosSecao =[];
             lista.dados.ListaPessoas.forEach((item) => {
              if(this.filhosSecao[item.codSecao] === undefined){
                this.filhosSecao[item.codSecao]= [];
              }
              (this.genTreeNode(item.codigo,item.nome))
              this.filhosSecao[item.codSecao].push(this.genTreeNode(item.codigo,item.nome));
              this.setState({loading: false});
              this.state.expand.push((item.codigo));
            })
         //   this.reloadArvore();
            this.state.update= true;
            this.state.pesquisou = true;
            console.log(this.state);
            this.setState({pesquisou:this.state.pesquisou,update: this.state.update,expand: this.state.expand});   
            this.setState({loading: false});              
          }                
          else
          {
            this.state.mensagemErro = this.stringTranslate("Error: "+lista.error);
            this.setState({loading: false});
          } 
        });
      }
    }


  render() {    
      
    return (
      <>      
      <div className="content">


        <Row>
          <Col>
            <Card>
              <CardHeader tag="h4">
              <Tooltip placement="top" target="impressaoV" title={this.stringTranslate("Autorizado.Pesquisar.Imprimir")} overlayStyle={{fontSize: "12px"}}>             
                <Nav 
                  onClick={this.imprime}
                  block 
                  id="impressaoV"
                  className="fad fa-print" 
                  style={{ color:"grey", 
                  background:"transparent", 
                  fontSize:"20px",
                  margin:"8px 12px 0 12px", 
                  padding:"0", 
                  maxWidth:"fit-content",
                  float: "right",
                  cursor: "pointer"}} />
                 </Tooltip>
                
                 {this.stringTranslate("Ajustes.SincColetor.Card.Titulos")}
              </CardHeader>
              <CardBody style={{marginTop: "5px"}}>
              
              
              <Row type="flex" justify="space-between" align="bottom" gutter={16}>
                <Col md={12} sm={24} xs={24}>
                  <FormGroup>                      
                    <Label>{this.stringTranslate("Veiculo.Pesquisar")}</Label>                        
                    <Input type="text"
                      name= "pesquisa" 
                      value= {this.state.valores["pesquisa"]}
                      onChange={(e) => this.onChange(e)}
                      onKeyPress={this.onKeyPress}
                      id="textBox"
                    />                        
                  </FormGroup>
                </Col>
                <Col md={8} sm={24} xs={24}>
                
                  <FormGroup> 
                    <Label for="categoria">{this.stringTranslate("Ajustes.SincColetor.Select.TitleTipo")}</Label>  
                    <Select                            
                      style={{ width: '100%' }}
                      placeholder=""
                      size="large"    
                      defaultValue={true}
                      value={this.state.valores["tipo"]}
                      onChange={e => this.handleChangeSelect(e, "tipo")}        
                    >
                      <Option value={false}>{this.stringTranslate("Ajustes.SincColetor.Select.TipoOpcao1")}</Option>          
                      <Option value={true}>{this.stringTranslate("Ajustes.SincColetor.Select.TipoOpcao2")}</Option>                     
                    </Select>             
                  </FormGroup>
                </Col>
                <Col md={4} sm={24} xs={24}>
                  <Button block type="primary" loading={this.state.loadingButtonPesquisar} size="large" style={{float:"right", marginLeft:"10px", top:"4px", marginBottom: "15px"}} onClick={() => this.pesquisar()}>PESQUISAR</Button>
                </Col>
              </Row>            
                {/* <SelectTreeViewNeo treeData={this.state.arvore} arrayempresa={this.empresa} arraylotacao={this.lotacao} arraysecao = {this.secao} update = {this.state.update}/>                */}
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row gutter={16} type="flex">           
          <Col md={12} sm={24} xs={24}>
              <Card style={{maxHeight:"500px",overflow: 'auto', paddingTop: "10px"}}>
                <CardBody>
                 {Boolean(this.state.locaisAcesso) === false || (this.state.locaisAcesso.length === 0) ? (
                   <Empty
                   image={require("../../assets/img/no-data-found.gif")}
                   imageStyle={{
                     height: "100%",
                   }}
                   description={
                     <Label style={{fontWeight: "500", fontSize: "16px", color: "#a1a1a1"}}>
                       {this.stringTranslate("Warning.semResultado")}
                     </Label>
                   }
                 >
                 </Empty>                 
                 ) : 
                 <Tree
                 checkable
                 >
                    {this.state.locaisAcesso.map((prop) =>{
                      return(
                        <TreeNode title={prop.nome} key={prop.codigo}>
                            {prop.coletores.map((prop) => {
                              return(
                                <TreeNode title={prop.nome} key={prop.codigo} />
                              )
                            })}
                        </TreeNode>
                      )
                    })}
                  </Tree>
                 }
                </CardBody>
              </Card>
          </Col>

          <Col md={12} sm={24} xs={24}>
              <Card>
                <CardBody>
                  <Tabs defaultActiveKey="2"
                  tabBarStyle={{paddingLeft: "20px"}}
                  >
                    <TabPane disabled
                      tab={<span><i className="fad fa-download" style={{marginRight:"8px"}}/>Importar</span> }                  
                      key="1"
                    >
                      <Row style={{marginTop: "15px"}}>
                        <Col md={12} sm={24} xs={24}>
                          <FormGroup style={{minWidth: "100%"}}>    
                            <Label for="formato">Formato</Label>  
                                <Select                            
                                style={{ minWidth: '100%' }}
                                placeholder=""
                                size="large"    
                                id="formato"
                                value={this.state.tipo}                  
                                onChange={e => this.setState({tipo: e})}               
                                >
                                  <Option value={0}>Configurados</Option>   
                                  <Option value={1}>Específicos</Option>                         
                                </Select>
                          </FormGroup>                       
                        </Col> 
                        <Col md={12} sm={24} xs={24}>                      
                          <FormGroup>    
                            <Label for="periodo">Período</Label>                                       
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6} sm={24} xs={24}>
                          <FormGroup>    
                            <Label for="formato">Layout</Label>  
                          </FormGroup>                       
                        </Col> 
                        
                      </Row>         
                    </TabPane>
                    <TabPane
                      tab={<span><i className="fad fa-upload" style={{marginRight:"8px"}}/>Exportar</span> }
                      key="2"
                    >
                      <Row type="flex" justify="space-around" align="middle" justify="center">
                        <Col md={12} sm={24} xs={24}>
                          
                          <Switch defaultChecked size="small" style={{marginRight: "5px"}} onChange={e => this.toggleCollapse(e, "pessoas")} />
                          <Label>Pessoas</Label>
                          <Row></Row>
                          <Switch defaultChecked size="small" style={{marginRight: "5px"}} onChange={e => this.toggleCollapse(e, "mestres")} />
                          <Label>Mestres</Label>
                          <Row></Row>                          
                        </Col>
                        <Col md={12} sm={24} xs={24}>       
                        <Switch defaultChecked size="small" style={{marginRight: "5px"}} onChange={e => this.toggleCollapse(e, "jornadaHorario")} />
                          <Label>Jornadas e Horários</Label>
                          <Row></Row>
                          <Switch defaultChecked size="small" style={{marginRight: "5px"}} onChange={e => this.toggleCollapse(e, "coletores")} />
                          <Label>Coletores</Label>
                        </Col>
                      </Row>
                    </TabPane>
                  </Tabs>  
                  <Row type="flex" justify="space-around" align="middle" style={{marginTop:"15px"}}>
                  <Col md={8} sm={24} xs={24}>
                          <Button type="primary" block style={{top: "calc(100% - 48px)", marginBottom: "15px"}} onClick={() => this.pesquisar()}>Sincronizar</Button>
                  </Col>       
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

export default injectIntl(SincronizarColetores);
