import IMask from "imask";

class Mask {
  constructor() {
    this.masks = [
      {
        class: ".imask-phone",
        mask: [
          {
            mask: "(00) 0000-0000"
          },
          {
            mask: "(00) 00000-0000"
          }
        ]
      },
      {
        class: ".imask-date",
        mask: "00/00/0000"
      },
      {
        class: ".imask-time",
        mask: "00:00"
      },
      {
        class: ".imask-number",
        mask: Number,
        min: 0
      },
      {
        class: ".imask-cpf",
        mask: "000.000.000-00"
      },
      {
        class: ".imask-license-plate",
        mask: "aaa-0000"
      }
    ];
  }

  apply() {
    this.masks.forEach(item => {
      let domElements = document.querySelectorAll(item.class);
      let options = {
        mask: item.mask
      };
      let maskedElements = [];
      domElements.forEach(domElement => {
        maskedElements.push(new IMask(domElement, options));
      });
    });
  }
}

export default new Mask();
