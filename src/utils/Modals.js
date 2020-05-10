/* 

Controls the modals appended by modalsHTML.js

Usage:

modals.loading.show();
modals.loading.hide();

modals.alert.show("My message...");
modals.alert.hide();

modals.confirm.show("My message...", function() {
  alert("Confirmed!")
});
modals.confirm.hide();

*/

const $ = window.jQuery;

class Modals {
  constructor() {
    this.ids = {
      loading: "#modalLoading",
      alert: "#modalAlert",
      alertMsg: "#modalAlertMsg",
      confirm: "#modalConfirm",
      confirmMsg: "#modalConfirmMsg",
      confirmOK: "#modalConfirmOK"
    };

    this.loading = {
      show: () => {
        this.showModal(this.ids.loading);
      },
      hide: () => {
        this.hideModal(this.ids.loading);
      }
    };

    this.alert = {
      show: msg => {
        this.setMessage(this.ids.alertMsg, msg);
        this.showModal(this.ids.alert, false);
      },
      hide: () => {
        this.hideModal(this.ids.alert);
      }
    };

    this.confirm = {
      show: (msg, callback) => {
        this.setMessage(this.ids.confirmMsg, msg);
        this.showModal(this.ids.confirm);
        let confirmOK = document.querySelector(this.ids.confirmOK);
        const handleConfirm = () => {
          callback();
          confirmOK.removeEventListener("click", handleConfirm)
          this.hideModal(this.ids.confirm);
        } 
        confirmOK.addEventListener("click", handleConfirm);

      },
      hide: () => {
        this.hideModal(this.ids.confirm);
      }
    };
  }

  showModal(id, backdropStatic = true) {
    const options = backdropStatic
      ? { backdrop: "static", keyboard: false }
      : "show";
    $(id).modal(options);
  }

  hideModal(id) {
    $(id).modal("hide");
  }

  setMessage(id, msg) {
    document.querySelector(id).innerHTML = msg || "...";
  }
}

window.modals = new Modals();
