import swal from "sweetalert2";

window.toast = swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  backdrop: false,
  timer: 7000
});
