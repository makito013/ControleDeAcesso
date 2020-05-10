import React from "react"
import { Toast, ToastBody, ToastHeader } from 'reactstrap';
import { injectIntl } from "react-intl";


function loginState(props) {

    //traduz strings
    function stringTranslate(id){
        return props.intl.formatMessage({id: id});
    }


    const logged = props.logged;
    {logged === 1 ? (

            <div className="p-3 my-2 rounded bg-docs-transparent-grid" style={{position: "absolute", zIndex:"100", marginLeft:"calc(100% - 300px)", float:"Right"}}>
            <Toast>
            <ToastHeader icon="success">
              {stringTranslate("Login.bemVindo")}
            </ToastHeader>
            <ToastBody>
              {stringTranslate("Login.efetivado")}
            </ToastBody>
          </Toast>
          </div>
    ) : (
        <div></div>
    )
  }
}

export default injectIntl(loginState);
