import {
    Card,
    CardBody,
    //CardFooter,
    Row,
    Col,
  } from "reactstrap";
  import React from "react";
  import { injectIntl } from "react-intl";
  import {Link} from 'react-router-dom'
  import logoDokeo from "../assets/img/logo-admin.png";

  class indexDokeo extends React.Component {
      constructor(props) {
      super(props);
      this.state = {

      };

      //Traduz as strings
      this.stringTranslate = this.stringTranslate.bind(this);
    }
  
    stringTranslate(id){
      return this.props.intl.formatMessage({id: id});
    }
  
  
    render() {
      const {ultimoAcesso} = this.state;
      return (
          <>        
          <div className="content">
            <Row>
              <Col md="12">
                <Card className="card-chart">
                    <CardBody style={{paddingLeft:"15px"}}>
                        {/* <Card className="card-chart" >                             */}
                            <img style={{top:"50%", maxWidth:"400px"}} src={logoDokeo} class="pulse"/>
                        {/* </Card>                         */}
                    </CardBody>             
                </Card>
              </Col>
            </Row> 
          </div>
          </>
      );
    }
  }
  
  export default injectIntl(indexDokeo);