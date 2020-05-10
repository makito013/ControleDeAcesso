import React from "react";
import {
  Card,
  CardBody,
  CardTitle,
  Row,
  Col
} from "reactstrap";
import { post } from "utils/api.js";
import { injectIntl } from "react-intl";
import { postAdonis } from "../../utils/api";


class CardVisitantes extends React.Component { 
    constructor(props) {
      super(props);
      this.state = {
        p24: 0,
        v24: 0,
        ph: 0,
        vh: 0
      };
      this.consultPost = this.consultPost.bind(this);
    //Traduz as strings
    this.stringTranslate = this.stringTranslate.bind(this);
    }

    stringTranslate(id){
      return this.props.intl.formatMessage({id: id});
    }

    componentDidMount(){
        //setInterval(this.consultPost(), 60000);
    }

    componentDidUpdate(){     
      if(this.props.novo() === true)
        this.consultPost();
    }

    consultPost(){      
        const body={
          cmd: "acessoresumo",
          token: sessionStorage.getItem("token"),
          id: navigator.productSub,
        };
        postAdonis(body,'/Portaria/Monitor/ResumoAcesso').then(data => {
          if(data.error === undefined)
          {
            const dados= data.dados;
            this.setState({p24:dados.Permanente.ultimas24, ph:dados.Permanente.doDia, v24:dados.Visitantes.ultimas24, vh:dados.Visitantes.doDia});
          }                           
        });
    }


  render() {
    return (
        <Col md="4">
          <Card className="card-info">
            <CardBody style={{paddingTop: "10px", paddingBottom: "5px"}}>
                <Row>
                    <Col md="7">
                      <div className="top-info">
                        <h6>{this.stringTranslate("Monitor.card.permanente")}</h6>
                        <div className="stats top-info-icon-cinza">
                          <p className="far fa-clock"/> {this.stringTranslate("Monitor.card.ultimas24")}
                        </div>
                      </div>
                    </Col>
                    <Col md="5">
                      <div className="numbers">
                          <p className="card-category"></p>
                          <CardTitle tag="h1" style={{textAlign: "right", marginRight:"20px"}}>{this.state.p24}</CardTitle>
                      </div>
                    </Col>

                </Row>
                </CardBody>
                 </Card>
                <Card>
                  <CardBody style={{paddingTop: "10px", paddingBottom: "5px"}}>
                <Row>
                    <Col md="7" className="top-info-card">
                      <div className="top-info">
                        <h6>{this.stringTranslate("Monitor.card.visitante")}</h6>
                        <div className="stats top-info-icon-cinza">
                          <p className="far fa-clock"/> {this.stringTranslate("Monitor.card.ultimas24")}
                        </div>
                      </div>
                    </Col>
                    <Col md="5" className="top-card-cel">
                      <div className="numbers">
                          <p className="card-category"></p>
                          <CardTitle tag="h1" style={{textAlign: "right", marginRight:"20px"}}>{this.state.v24}</CardTitle>
                      </div>
                    </Col>
                </Row>
                </CardBody>
                 </Card>
                <Card>
                  <CardBody style={{paddingTop: "10px", paddingBottom: "5px"}}>
                <Row>
                    <Col md="7" className="top-info-card">
                      <div className="top-info">
                        <h6>{this.stringTranslate("Monitor.card.permanente")}</h6>
                        <div className="stats top-info-icon-cinza">
                          <p className="far fa-calendar"/> {this.stringTranslate("Monitor.card.hoje")}
                        </div>
                      </div>
                    </Col>
                    <Col md="5" className="top-card-cel">
                  <div className="numbers">
                      <p className="card-category"></p>
                      <CardTitle tag="h1" style={{textAlign: "right", marginRight:"20px"}}>{this.state.ph}</CardTitle>
                  </div>
                </Col>
                </Row>
                </CardBody>
                 </Card>
                <Card>
                  <CardBody style={{paddingTop: "10px", paddingBottom: "5px"}}>
                <Row>
                    <Col md="7" className="top-info-card">
                      <div className="top-info">
                        <h6>{this.stringTranslate("Monitor.card.visitante")}</h6>
                        <div className="stats top-info-icon-cinza">
                          <p className="far fa-calendar"/> {this.stringTranslate("Monitor.card.hoje")}
                        </div>
                      </div>
                    </Col>
                    <Col md="5" className="top-card-cel">
                      <div className="numbers">
                          <p className="card-category"></p>
                          <CardTitle tag="h1" style={{textAlign: "right", marginRight:"20px"}}>{this.state.vh}</CardTitle>
                      </div>
                    </Col>
          </Row>
          </CardBody>
        </Card>
        </Col>
    );
  }
}

export default injectIntl(CardVisitantes);
