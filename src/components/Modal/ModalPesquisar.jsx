


import React from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Detalhes from "components/CardList/Detalhes.jsx";
import Veiculos  from "components/CardList/Veiculos.jsx";
import { injectIntl } from "react-intl";



var head = ["Registro","Nome","Tipo","Último Acesso","Direção","Veículo","Placa","Lotação-Seção","Empresa"];
function ModalNeo({...props}){

  function stringTranslate(id){
    return props.intl.formatMessage({id: id});
  }


  const {modal,modalBio,onclickbio,data,onclick,className,setIsDados,setIsModal,newData}= props;

  const [state, setState]= React.useState({
      dropdownOpen:false,
      cadastrarbiometria: false
    })

  function toggle() {
    this.setState({
      dropdownOpen: !state.dropdownOpen
    });
  }

  function registrarEntrada(){
    console.log("registrar Entrada"); 
    props.registraEntrada();
  } 

  function clickfalse(){
    setIsDados(false);
  }
  function cadastroBiometria(){
    setIsModal(true);
  }

console.log("******    data    ****");
console.log(props.data);
console.log("******------------****");

    return(
      <>
     <Modal modalTransition={{timeout:0}} backdropTransition={{timeout:0}}  isOpen={modal} toggle={onclick} className={className} size="lg">

     <ModalHeader toggle={this.toggle}></ModalHeader>
        <ModalBody style={{padding:"0"}}>
          <Tabs>

            <TabList>
              <Tab>{stringTranslate("ModalPesquisa.tab.geral")}</Tab>
              <Tab>{stringTranslate("ModalPesquisa.tab.detalhes")}</Tab>
              <Tab>{stringTranslate("ModalPesquisa.tab.veiculos")}</Tab>
            </TabList>

            <TabPanel className="react-tab__panel-content">

            </TabPanel>

            <TabPanel className="react-tab__panel-content">
              <Detalhes
              data={data}
              head={head}/>
            </TabPanel>

            <TabPanel className="react-tab__panel-content">
              <Veiculos
              data={data}
              head={head}/>
            </TabPanel>

          </Tabs>
        </ModalBody>

        <ModalFooter style={{borderColor:"#9c9c9c", padding:"0 15px 0 0"}}>
            <Button color='ranger' onClick={cadastroBiometria}>{stringTranslate("ModalPesquisa.botao.cadastrarBiometria")}</Button>
            <Button color='dark' onClick={clickfalse}>{stringTranslate("ModalPesquisa.botao.cancelar")}</Button>
            <Button color='danger' onClick={clickfalse}>{stringTranslate("ModalPesquisa.botao.registrarSaida")}</Button>
            <Button color='success' onClick={registrarEntrada}>{stringTranslate("ModalPesquisa.botao.registrarEntrada")}</Button>{' '}                
        </ModalFooter>
      </Modal>
 
      {/* <Modal modalTransition={{timeout:0}} backdropTransition={{timeout:0}}  isOpen={modalBio} toggle={onclickbio} className={className} size="lg">


        <ModalBody style={{padding:"0"}}>
        <Simulador/>
        </ModalBody> */}
{/* 
        <ModalFooter style={{borderColor:"#9c9c9c", padding:"0 15px 0 0"}}>
        <Button color='info' onClick={clickfalse}>Registrar Entrada</Button>{' '}
        <Button color='warning' onClick={clickfalse}>Registrar Saída</Button>
        <Button color='ranger' onClick={cadastroBiometria}>Cadastrar Biometria</Button>
        <Button color='dark' onClick={clickfalse}>Cancelar</Button>
        </ModalFooter> 
        </Modal>*/}
        </>
   
    );
}
export default injectIntl(ModalNeo);
