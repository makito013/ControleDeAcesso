import React from "react";
import ModalVisitantes from 'components/Modal/ModalVisitantes';
import { injectIntl } from "react-intl";


//reacr strap componentes
import {
    Card,
    CardHeader,
    CardBody,
    Table,
    Row,
    Col,
    Nav, 
    Pagination,
    PaginationItem,
    PaginationLink,
    UncontrolledTooltip,
    Form,
    FormGroup,
    Label,
    CustomInput
  } from "reactstrap";



class TabelaRelatorio extends React.Component{

    constructor(props){
        super(props);
        this.state={
        //dados de paginação
            currentPage: 0,
            pageSize: 100,
            pagesCount:0,
       }
        //funções para gerar doc de impressão do relatório
        this.imprime = this.imprime.bind(this);
        this.setCabecalho = this.setCabecalho.bind(this);
        //funções e dados relacionados a paginação
        this.handleClick = this.handleClick.bind(this);
        //Traduz as strings
        this.stringTranslate = this.stringTranslate.bind(this);
        this.setPagination = this.setPagination.bind(this);
        this.pagesCount = 0;
    }

    stringTranslate(id){
        return this.props.intl.formatMessage({id: id});
    }

    setCabecalho(){
        var cabecalho = null;
        this.imprime(cabecalho);
    }

    imprime(cabecalho){
        if (cabecalho !== null)
            var conteudo = cabecalho + document.getElementById("table").innerHTML;
        else
            var conteudo = document.getElementById("table").innerHTML;
        var telaImpressao = window.open();
        telaImpressao.document.write(conteudo);
        telaImpressao.window.print();
        telaImpressao.window.close();
    }

    //Evento referente a paginação (reactstrap)
    handleClick(e, index) {
    
        e.preventDefault();
    
        this.setState({
          currentPage: index
        });
        
      }

    setPagination(e){
        console.log(e.target.value)
        this.setState({pageSize: e.target.value});
        this.pagesCount = Math.ceil(this.props.dataTable.length/this.state.pageSize);
    }

    render(){
        this.pagesCount = Math.ceil(this.props.dataTable.length/this.state.pageSize);
      //  console.log(this.state.currentPage,this.props.dataTable);
        return(
            <Card>
                <CardHeader tag="h4">
                <Nav 
                        onClick={this.setCabecalho}
                        block 
                        id="impressaoV"
                        className="fas fa-print" 
                        style={{ color:"black", 
                        background:"transparent", 
                        fontSize:"20px",
                        margin:"0px 12px 0 12px", 
                        padding:"0", 
                        maxWidth:"fit-content",
                        float: "right",
                        cursor: "pointer"}} />
                        <UncontrolledTooltip placement="top" target="impressaoV">       
                           {this.stringTranslate("Relatorios.table.imprimirRelatorios")}
                        </UncontrolledTooltip>    
                        <ModalVisitantes dataTable={this.props.dataTableVisitantes} buscaDados={this.props.buscaDados}/>    
                <div>
                        {this.stringTranslate("Relatorios.table.titulo")}                   
                </div>
                </CardHeader>
                <CardBody>
                    <React.Fragment>                                                
                        <div id="table">
                            <Table responsive>
                                {/*Monta os titulos das colunas na tabela */}
                                <thead className="text-primary">
                                    <tr>
                                        {this.props.headTable.map((prop, key) => {
                                            return (
                                                (prop !== null) ?(
                                                <th>{prop}</th>):null
                                            );
                                        })}
                                    </tr>
                                </thead>
                                {this.props.dataTable !== undefined ? (
                                    <tbody>
                                        {/*Monta os dados na tabela
                                          A função slice está ligada a paginação */}
                                        {this.props.dataTable.slice(this.state.currentPage * this.state.pageSize,
                                        (this.state.currentPage + 1) * this.state.pageSize).map((prop, key) => {
                                            return(
                                                (prop !== null) ?(
                                                    <tr>
                                                        {prop.map((prop, key) => {
                                                            return(
                                                                (prop !== null) ? (
                                                                    <td>{prop}</td>
                                                                ) : null
                                                            )
                                                        })}
                                                    </tr>
                                                ) : null
                                            )
                                        })}
                                    </tbody>) : null
                                }
                            </Table>
                        </div>
                        {/*Div que monta a barra de paginação acima da tabela*/}
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
                                        //[...Array(this.pagesCount)].map((page, i) => 
                                        <PaginationItem active={true} key={this.state.currentPage}>
                                        <PaginationLink onClick={e => this.handleClick(e, this.state.currentPage)} href="#">
                                            {this.state.currentPage + 1}
                                        </PaginationLink>
                                        </PaginationItem>
                                    //)
                                    }

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
                                        <option value="15" >15</option>
                                        <option value="20">20</option>
                                        <option value="50">50</option>
                                        <option value="100" selected>100</option>
                                        </CustomInput>
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
export default injectIntl(TabelaRelatorio);