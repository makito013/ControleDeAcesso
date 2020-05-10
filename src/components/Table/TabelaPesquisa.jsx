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
  Pagination,
  PaginationItem,
  PaginationLink,
  FormGroup,
  Label,
  CustomInput,
  Form,
} from "reactstrap";
import { post } from "utils/api";
import ModalNeo from "../Modal/ModalPesquisar.jsx";
import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";
import { injectIntl } from "react-intl";


class TabelaPesquisa extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        newSelected:"",
        modal:false,
        isDados:false,
        data:"",
        cadastroPessoa:true, 
        resultado:"", 
        redirect:false, 
        index: 0,
        tableHead: "",
        tableData: "",
        redirect: false,
        link: "",
        currentPage:0, 
        pageSize:15, 
        pagesCount:0,
      }
    //Traduz as strings
    this.stringTranslate = this.stringTranslate.bind(this);
    this.setPagination = this.setPagination.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.pagesCount = 0;
  }

    stringTranslate(id){
      return this.props.intl.formatMessage({id: id});
    }
    

    setIsDados(value){
      this.setState({isDados:value})
    }



    toggle() {
        this.setState(prevState => ({
          modal: prevState.modal
        }))
      }

    enviaDados()
    {
      this.props.pegaDados(this.state.newSelected);
    }


    setRedirect(e , codigo,value){
      this.state.index = codigo;
      var redirect = "";

      if(typeof(Storage) !== "undefined"){
        sessionStorage.setItem("id", codigo);
        redirect = "/admin/Liberacao";    
      }
      else{
        redirect = "/admin/Liberacao?id=" + codigo;        
      }

      this.setState({index: this.state.index, link: redirect, redirect: true});
    }

    setPagination(e){
      this.setState({pageSize: e.target.value,
                      currentPage:0,});
      this.pagesCount = Math.ceil(this.props.tableData.length/this.state.pageSize);
    }

    handleClick(e, index) {
    
      e.preventDefault();
  
      this.setState({currentPage: index});
      
    }
  


  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.link} />
    }
    else{
      this.pagesCount = Math.ceil(this.props.tableData.length/this.state.pageSize);
      return (
        <>
              <span style={{marginLeft:"10px", fontWeight:"bold"}}>{this.encontrados} </span>
                <Card>              
                <CardHeader className="card-table-header">
                    <Row><Col md="4"><h4>{this.stringTranslate("TabPesquisa.listaPessoas")}</h4></Col>                  
                    <Col>                  
                    </Col></Row>
                </CardHeader>
                  <CardBody style={{marginTop:"-10px", marginTop:"5px"}}>
                    <React.Fragment>
                      <div>
                        {this.props.tableData.lenght > 0 ? (<span>{this.props.tableData.lenght} {this.stringTranslate("TabPesquisa.pessoasEncontradas")} </span>) : null}
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
                                  <tr onClick={event => this.setRedirect(event, prop[0],prop)} style={{padding: "5px 7 px"}}>
                                    {prop.map((prop, key) => {
                                      return (
                                        (key!==0) ? (
                                            <td className="tableMonitor" style={{textTransform: "capitalize"}}>
                                                {prop}
                                            </td>
                                        ):null
                                      );
                                    })}
                                    {/*<td className="tableMonitor">
                                        <span className="fas fa-caret-up top-icon-green" style={{fontSize:"25px"}}/><span className="fas fa-caret-down top-icon-red"style={{fontSize:"25px"}}/>
                                  </td>*/}
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
                              <option value="100">100</option>
                            </CustomInput >
                          </FormGroup>
                        </Form>
                        </Col>
                      </Row>
                    </div>
                  </React.Fragment>
                  </CardBody>
                </Card>
        </>
      );
    }
    
  }
}

export default injectIntl(TabelaPesquisa);
