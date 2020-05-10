import React from "react";
import { Result, Button } from 'antd';
import { injectIntl } from "react-intl";
import {  
    Card,
    CardBody
  } from "reactstrap";

class error404 extends React.Component {
    constructor() {
        super();
        this.stringTranslate = this.stringTranslate.bind(this);    
    }

    stringTranslate(id){
        return this.props.intl.formatMessage({id: id});
    }

    render() { 
        return (
            <div className="content">
                <Card>
                    <CardBody>
                    <Result
                        status="404"
                        title="404"
                        subTitle={this.stringTranslate("Erro.PaginaNãoExiste")}      
                    />
                    </CardBody>
                </Card>
            </div>
            )
    }
}

export default injectIntl(error404);
