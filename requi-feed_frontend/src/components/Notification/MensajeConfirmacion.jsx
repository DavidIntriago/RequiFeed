import Swal from "sweetalert2";

const MensajeConfirmacion = (texto, titulo, tipo = "success") => {
    return new Promise((resolve, reject) => {
        Swal.fire({
            title: titulo,
            text: texto,
            icon: tipo,
            showCancelButton: true,
            confirmButtonText: 'ACEPTAR',
            cancelButtonText: 'CANCELAR'
        }).then((result) => {
            if (result.isConfirmed) {
                resolve(true); // Resuelve la promesa si el usuario confirma
            } else {
                reject(false); // Rechaza la promesa si el usuario cancela
            }
        });
    });
};

export default MensajeConfirmacion;