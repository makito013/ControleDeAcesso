import React from "react";
import {Table, Row, Col } from 'reactstrap';

class Geral extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            data:props.data,
            head:props.head,
        }

        console.log("this.state.data");
        console.log(this.state.data);
        console.log("-------------------");
    }

  render() {
    return (
        <Row style={{marginTop:"10px"}}>
            <Col md="4">
            <img
              alt="..."
              className="border-gray"
              src={require("assets/img/default-avatar.png")}
            />

            </Col>
            <Col md="8">

                <Row>
                    <Col md="auto" className="table__pesquise-Modal">
                        <span style={{fontWeight:"bold"}}>Nome:  </span><span>{this.state.data.Pessoa.Nome}</span>
                    </Col>
                </Row>
                <Row>
                    <Col md="6" className="table__pesquise-Modal">
                        <span style={{fontWeight:"bold"}}>Matrícula:  </span><span>{this.state.data.Autorizado.Matricula}</span>
                    </Col>
                    <Col md="6" className="table__pesquise-Modal">
                        <span style={{fontWeight:"bold"}}>CPF:  </span><span>{this.state.data.Pessoa.CPF}</span>
                    </Col>
                </Row>
                <Row>
                    <Col md="6" className="table__pesquise-Modal">
                        <span style={{fontWeight:"bold"}}>Documento:  </span><span>{this.state.data.Autorizado.NumDocumento}</span>
                    </Col>
                    <Col md="6" className="table__pesquise-Modal">
                        <span style={{fontWeight:"bold"}}>Sexo:  </span><span>{this.state.data.Pessoa.sexo}</span>
                    </Col>
                </Row>
                <Row>
                    <Col md="auto" className="table__pesquise-Modal">
                        <span style={{fontWeight:"bold"}}>Endereço:  </span><span>{this.state.data.Pessoa.Endereco}</span>
                    </Col>
                </Row>
                <Row>
                    <Col md="6" className="table__pesquise-Modal">
                        <span style={{fontWeight:"bold"}}>Função:  </span><span>{this.state.data.Autorizado.Funcao}</span>
                    </Col>
                    <Col md="6" className="table__pesquise-Modal">
                        <span style={{fontWeight:"bold"}}>Telefone:  </span><span>{this.state.data.Pessoa.Telefone}</span>
                    </Col>
                </Row>
                <Row>
                    <Col md="12" className="table__pesquise-Modal">
                        <span style={{fontWeight:"bold"}}>Tipo Aut.:  </span><span>{this.state.data.Autorizado.TipoAutorizacao}</span>
                    </Col>
                </Row>
                <Row>
                    <Col md="12" className="table__pesquise-Modal">
                        <span style={{fontWeight:"bold"}}>Categoria:  </span><span>{this.state.data.Pessoa.CategoriaPessoa.CodCategoriaPessoa} - {this.state.data.Pessoa.CategoriaPessoa.Nome}</span>
                    </Col>
                </Row>
                <span> </span>
                {this.state.data.AcessoExtra !== undefined && this.state.data.AcessoExtra !== ""   ? (
                    <Row>
                        <Col md="6" className="table__pesquise-Modal">
                            <span style={{fontWeight:"bold"}}>Modelo:  </span><span>{this.state.data.AcessoExtra.ModeloCarro}</span>
                        </Col>
                        <Col md="6" className="table__pesquise-Modal">
                            <span style={{fontWeight:"bold"}}>Placa:  </span><span>{this.state.data.AcessoExtra.PlacaCarro}</span>
                        </Col>
                    </Row>
                ) : null }
            </Col>
        </Row>
    );
  }
}

export default Geral;
