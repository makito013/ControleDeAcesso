import React from "react";
import {Table, Row, Col } from 'reactstrap';

class Veiculos extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            data:props.data,
            head:props.head,
        }
    }

  render() {
    return (
        <Row style={{marginTop:"10px"}}>
            <Col xs="12">
            <Table size="sm">



                 {/*///////Última linha///////*/}
                 <tr>
                 <td></td>
                 <td></td>
                 </tr>

                </Table>
            </Col>
        </Row>
    );
  }
}

export default Veiculos;
