/** Valida la estructura de un email */
var validarEmail = (email)=>{
    let regex = /^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/i;

    if(regex.test(email)) {
        return true;
    } else {
        return false
    }
}

/** Función que captura un parámetro enviado por la URL */
var getParameterByName = (name) => {
    // el método replace() busca dentro de una cadena caracteres especificados y los reemplaza por otros nos retorna una nueva cadena con los reemplazos realizados
    
    name      = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    results   = regex.exec(location.search);

    return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, " ")); 
}

/** Visiviliza en la página el div con id (parámetro) */
var printThisDiv = (id) => {
    var printContents    = document.getElementById(id).innerHTML;
    var originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
}

/** Retorna una fecha con el formato especificado */
var fechaMotor = (fechaParam = Date(), tipoFecha) => {
    let resultDate = "";
    var dia        = "" + (fechaParam.getDate() + 1);
    var mes        = "" + (fechaParam.getMonth() +1);

    if ((fechaParam.getDate() + 1) < 10) {
        dia = "0" + (fechaParam.getDate() + 1);
    }

    if ((fechaParam.getMonth() + 1) < 10) {
        mes = "0" + (fechaParam.getMonth() +1);
    }

    if (tipoFecha === "I") {
        resultDate = dia + "-" + mes + "-" + fechaParam.getFullYear() + " 00:00:00.000";
    } else if (tipoFecha === "F") {
        resultDate  = dia + "-" + mes + "-" + fechaParam.getFullYear() + " 23:59:59.997";    
    } else {
        resultDate = dia + "-" + mes + "-" + fechaParam.getFullYear() + " 00:00:00.000";
    }

    return resultDate;
}
