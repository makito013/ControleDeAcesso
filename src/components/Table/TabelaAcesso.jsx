import React from "react";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Button,
  Pagination,
  PaginationItem,
  PaginationLink,
  FormGroup,
  Label,
  CustomInput,
  Form,
} from "reactstrap";

import ModalNeo from "../Modal/Modal02.jsx"
import { injectIntl } from "react-intl";

class TabelaAcesso extends React.Component
{
    constructor(props){
      super(props);
      const { classes, tableHead, tableData,loading, tableHeaderColor } = props;
      this.state = {
        newSelected:"",
        modal:false,
        modalBio: false,
        isDados:false, 
        currentPage:0, 
        pageSize:15, 
        pagesCount:0,
      }
      this.setIsDados = this.setIsDados.bind(this);
      this.handleClick = this.handleClick.bind(this);
      this.setIsModal = this.setIsModal.bind(this);
      this.toggle = this.toggle.bind(this);
      this.toggleBio = this.toggleBio.bind(this);
      this.setPagination = this.setPagination.bind(this);
      this.stringTranslate = this.stringTranslate.bind(this);
      this.pagesCount = 0;
    }

    setIsDados(value){
      this.setState({isDados:value})
    }

    //Evento referente a paginação (reactstrap)
    handleClick(e, index) {
    
      e.preventDefault();
  
      this.setState({currentPage: index});
      
    }
    

    setIsModal(value){
      this.setState({modalBio:value})
    }

    handleLineClick(e, codigo,value) {
        let selectedIndex = codigo;
        let newSelected;
        newSelected=value;

        this.setState({isDados:true,newSelected:newSelected,  modal: !this.state.modal});;
    }

   toggle() {
        this.setState({
          modal: !this.state.modal
        });
      }
  toggleBio() {
        this.setState({
          modalBio: !this.state.modalBio
        });
      }

  setPagination(e){
    this.setState({pageSize: e.target.value,
                    currentPage:0,});
    this.pagesCount = Math.ceil(this.props.tableData.length/this.state.pageSize);
  }


  //Traduz as strings
  stringTranslate(id){
    return this.props.intl.formatMessage({id: id});
  }

  render(){
    this.pagesCount = Math.ceil(this.props.tableData.length/this.state.pageSize);
    return ( 
      <>
              <Card>
              <CardHeader tag="h4">
                {this.stringTranslate("Monitor.tabela.monitoramentoAcesso")}
                </CardHeader>
                <CardBody>
                  <React.Fragment>
                    <div>
                      <Table responsive hover>
                        <thead className="text-primary">
                          <tr>
                          {this.props.tableHead.map((prop, key) => {
                            return (
                                <th>{prop}</th>
                            );
                            })}
                          </tr>
                        </thead>
                        {this.props.tableData !== undefined ? (
                        <tbody>
                          {this.props.tableData.slice(this.state.currentPage * this.state.pageSize, (this.state.currentPage + 1) * this.state.pageSize).map((prop, key) => {
                            return (
                                <tr onClick={event => this.handleLineClick(event, prop[0],prop)}>

                                {prop.map((prop, key) => {
                                  return (
                                    (key>2) ? (
                                        <td className="tableMonitor" style={{textTransform: "capitalize"}}>
                                            {prop}

                                        </td>
                                    ):null
                                  );
                                })}
                              </tr>
                            );
                          })}
                        </tbody>) : null}
                      </Table>
                    </div>
                    <div>
                      <Row>
                        <Col>
                        <Pagination size="sm">
                        <PaginationItem disabled={this.state.currentPage <= 0}>
                            <PaginationLink
                            onClick={e => this.handleClick(e, this.state.currentPage - 1)}
                            previous
                            href="#"
                            />
                            
                        </PaginationItem>
                        {
                            [...Array(this.pagesCount)].map((page, i) => 
                            <PaginationItem active={i === this.state.currentPage} key={i}>
                            <PaginationLink onClick={e => this.handleClick(e, i)} href="#">
                                {i + 1}
                            </PaginationLink>
                            </PaginationItem>
                        )}

                        <PaginationItem disabled={this.state.currentPage >= this.pagesCount - 1}>
                            <PaginationLink
                            onClick={e => this.handleClick(e, this.state.currentPage + 1)}                   
                            next
                            href="#"
                            />
                            
                        </PaginationItem>
                        
                        </Pagination>
                        </Col>
                        <Col>
                        <Form inline style={{float:"right"}}>
                          <FormGroup>
                            <Label></Label>
                          </FormGroup>
                          <FormGroup>
                            <CustomInput style={{color:"#000"}} type="select" onChange={(e) => this.setPagination(e)} bsSize="sm">
                              <option value="10">10</option>
                              <option value="15" selected>15</option>
                              <option value="20">20</option>
                              <option value="50">50</option>
                            </CustomInput >
                          </FormGroup>
                        </Form> 
                        </Col>
                      </Row>
                    </div>
                  </React.Fragment>
                </CardBody>
              </Card>
        <div>
          {this.state.isDados === true ? (
              <ModalNeo modalBio={this.state.modalBio} onclickbio={this.toggleBio} modal={this.state.modal} 
              setIsModal={this.setIsModal} onclick={this.toggle} data={this.state.newSelected} setIsDados={this.setIsDados}/>
          ) : null}
        </div>
      </>
    );
  }
}

export default injectIntl(TabelaAcesso);
