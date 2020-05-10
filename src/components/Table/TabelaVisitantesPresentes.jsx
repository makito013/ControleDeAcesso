import React from "react";
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
    Nav,
    UncontrolledTooltip,
  } from "reactstrap";
  import { injectIntl } from "react-intl";


class TabelaVisitantesPresentes extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            currentPage:0, 
            pageSize:15, 
            pagesCount:0,
        }
        this.setCabecalho = this.setCabecalho.bind(this);
        this.imprime = this.imprime.bind(this);

        //Traduz as strings
        this.stringTranslate = this.stringTranslate.bind(this);

        this.setPagination = this.setPagination.bind(this);
        this.stringTranslate = this.stringTranslate.bind(this);
        this.pagesCount = 0;
    }

    stringTranslate(id){
        return this.props.intl.formatMessage({id: id});
    }

    //Função que define um cabeçalho usado para gerar a impressão da tabela
    setCabecalho(){
        var cabecalho = null;
        this.imprime(cabecalho);
    }

    imprime(cabecalho){
        if (cabecalho !== null)
            var conteudo = cabecalho + document.getElementById("tableVisitantes").innerHTML;
        else
            var conteudo = document.getElementById("tableVisitantes").innerHTML;
        var telaImpressao = window.open();
        telaImpressao.document.write(conteudo);
        telaImpressao.window.print();
        telaImpressao.window.close();
    }

    setPagination(e){
        this.setState({pageSize: e.target.value,
                        currentPage:0,});
        this.pagesCount = Math.ceil(this.props.dataTable.length/this.state.pageSize);
      }
  
    handleClick(e, index) {
    
    e.preventDefault();

    this.setState({currentPage: index});
    
    }

    render(){
        this.pagesCount = Math.ceil(this.props.dataTable.length/this.state.pageSize);
        return(
            <Card>
                <CardHeader>
                    <Nav 
                            onClick={this.setCabecalho}
                            block 
                            id="impressao"
                            className="fas fa-print" 
                            style={{ color:"black", 
                            background:"transparent", 
                            fontSize:"20px",
                            margin:"0px 12px 0 12px", 
                            padding:"0", 
                            maxWidth:"fit-content",
                            float: "right",
                            cursor: "pointer"}} />
                            <UncontrolledTooltip placement="top" target="impressao">       
                                {this.stringTranslate("Relatorios.table.imprimirRelatorios")}
                            </UncontrolledTooltip>     
                    <div>
                         {this.stringTranslate("Relatorios.tableVisitantes.titulo")}                 
                    </div>
                </CardHeader>
                <CardBody >
                    <React.Fragment>
                        <div id="tableVisitantes">
                        <Table responsive>
                            {/*nomes das colunas da tabela */}
                            <thead className="text-primary">
                                <tr>
                                    <th>{this.stringTranslate("Relatorios.tableVisitantes.nome")}</th>
                                    <th>{this.stringTranslate("Relatorios.tableVisitantes.entrada")}</th>
                                    <th>{this.stringTranslate("Relatorios.tableVisitantes.coletor")}</th>
                                </tr>
                            </thead>
                            {/*Inserindo dados na tabela */}
                            {this.props.dataTable !== undefined ? (
                                <tbody>
                                    {this.props.dataTable.map((prop, key) => {
                                        return(
                                            <tr>
                                                {prop.map((prop) => {
                                                    return(
                                                        (Boolean(prop) !== false) ? (
                                                            <td>{prop}</td>
                                                        ) : null
                                                    )
                                                })}
                                            </tr>
                                        )
                                    })}
                                </tbody>) : null
                            }
                            <tbody>
                                
                            </tbody>
                        </Table>
                    </div>
                    <div>
                        <Row>
                            <Col style={{fontSize:"18px"}}>
                                <strong>{this.stringTranslate("Relatorios.tableVisitantes.total")}:</strong>
                            </Col>
                            <Col style={{fontSize:"18px"}}>
                                <strong>{this.props.dataTable.length}</strong>
                            </Col>
                        </Row>
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
        )
    }
}
export default injectIntl(TabelaVisitantesPresentes);