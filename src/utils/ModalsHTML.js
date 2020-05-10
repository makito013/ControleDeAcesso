/* 

Appends Bootstrap 3 modals HTML content to the end of the BODY tag.

Usage:

modalsHTML.setOptions({
  loadingText: 'Please wait...',
  confirmTitle: 'Confirmation',
  closeText: 'Cancel',
});

*/

class ModalsHTML {
  constructor(options) {
    this.options = {};
    this.setOptions();
  }

  setOptions(options) {
    options = options || {};
    this.options = {
      loadingText: options.loadingText ? options.loadingText : "Carregando...",
      confirmTitle: options.confirmTitle ? options.confirmTitle : "Confirmação",
      closeText: options.closeText ? options.closeText : "Fechar"
    };
    this.appendModals();
  }

  appendModals() {
    let modalsWrap = document.createElement("div");
    modalsWrap.setAttribute("id", "modalsWrap");
    let htmlContent = this.htmlContent();
    window.addEventListener("load", () => {
      let currentModals = document.querySelector("#modalsWrap");
      if (currentModals) {
        currentModals.parentNode.removeChild(currentModals);
      }
      document.querySelector("body").appendChild(modalsWrap);
      modalsWrap.innerHTML = htmlContent;
    });
  }

  htmlContent() {
    return ` 
    <style>
      .spinner {
        display: inline-block;
        width: 14px;
        height: 14px;
        margin-top: -2px;
        border: 2px solid #007bff;
        border-top: none;
        border-right: none;
        border-radius: 50%;
        animation: spin 1s ease-in-out infinite;
        vertical-align: middle;
      }
      @keyframes spin {
        0% { transform: rotate(0deg) }
        25%  { transform: rotate(90deg) } 
        50% { transform: rotate(180deg) }
        75% { transform: rotate(270deg) }
        100% { transform: rotate(360deg) }
      }
    </style>
    <div id="modalLoading" class="modal" tabindex="-1" role="dialog" aria-labelledby="modal-body" aria-hidden="true">
      <div class="modal-dialog modal-sm">
        <div class="modal-content">
          <div class="modal-body">
            <i class="spinner"></i>&nbsp;
            ${this.options.loadingText}
          </div>
        </div>
      </div>
    </div>
    <div id="modalAlert" class="modal" tabindex="-1" role="dialog" aria-labelledby="modal-title" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header" style="border: none">
            <i class="icon-info text-primary" style="margin-right: 5px; line-height:inherit"></i>
            <span id="modalAlertMsg"></span>
            <button type="button" class="close" data-dismiss="modal" aria-label="${this.options.closeText}">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div id="modalConfirm" class="modal" tabindex="-1" role="dialog"
      aria-labelledby="modal-title" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 id="modal-title" class="modal-title">
              <strong>${this.options.confirmTitle}</strong>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="${this.options.closeText}">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <span id="modalConfirmMsg"></span>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">
              ${this.options.closeText}
            </button>
            <button type="button" class="btn btn-primary btn-sm" id="modalConfirmOK">OK</button>
          </div>
        </div>
      </div>
    </div>
    `;
  }
}

window.modalsHTML = new ModalsHTML();
