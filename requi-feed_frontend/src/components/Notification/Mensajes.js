import swal from "sweetalert";

const mensajes = (titulo, texto, tipo = "success") => {
  swal(titulo, texto, tipo, {
    button: "ACEPTAR",
    timer: 5000,
    closeOnEsc: true,
  });
};

export default mensajes;
