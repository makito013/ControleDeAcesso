import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter,ListGroup, ListGroupItem } from 'reactstrap';


function ModalNeo({...props}){
  const {modal,data,onclick,setIsDados}= props;
  function clickfalse(){
    setIsDados(false);
  }
    return(
      <Modal modalTransition={{timeout:0}} backdropTransition={{timeout:0}}  isOpen={modal} toggle={onclick} className={props.className}>
        <ModalHeader toggle={onclick}>Modal title</ModalHeader>
        <ModalBody>
        {data}
        {(data !== undefined) && (data !== null) ? (
        <ListGroup>

        {data.map((prop, key) => {
          return (
              <ListGroupItem className="justify-content-between">

              {prop}
            </ListGroupItem>
          );
        })}
         </ListGroup>
        ):null}
        </ModalBody>
        <ModalFooter>
        <Button color='primary' onClick={clickfalse}>Incluir Liberação</Button>{' '}
        <Button color='secondary' onClick={clickfalse}>Cancel</Button>
        </ModalFooter>
      </Modal>
    )
}
export default ModalNeo;
