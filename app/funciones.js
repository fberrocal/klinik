/**
 * Valida la estructura de un email
 * @param {*} email (Email en formato String)
 * @returns true/false
 */
var validarEmail = (email)=>{
    let regex = /^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/i;

    if(regex.test(email)) {
        return true;
    } else {
        return false
    }
}

/**
 * Función que captura un parámetro enviado por la URL
 * @param {*} name (Nombre del parámetro a recuperar)
 * @returns 
 */
var getParameterByName = (name) => {
    // el método replace() busca dentro de una cadena caracteres especificados y los reemplaza por otros nos retorna una nueva cadena con los reemplazos realizados
    
    name      = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    results   = regex.exec(location.search);

    return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, " ")); 
}

/**
 * Visiviliza en la página el div con id (parámetro)
 * @param {*} id (ID de la página a visualizar)
 */
var printThisDiv = (id) => {
    var printContents    = document.getElementById(id).innerHTML;
    var originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
}

/**
 * Retorna una fecha con el formato especificado
 * @param {*} fechaParam (Fecha en formato Date)
 * @param {*} tipoFecha (Tipo de Fecha I - Inicial, F - Final)
 * @param {*} parametro (Orden en que se requieren los componentes de la fecha día, mes anio) 
 * @returns 
 */
var fechaMotor = (fechaParam, tipoFecha, parametro = 1) => {
    
    let resultDate = "";
    var dia        = "" + (fechaParam.getDate() + 1);
    // var dia        = "" + fechaParam.getDate();
    var mes        = "" + (fechaParam.getMonth() + 1);

    if ((fechaParam.getDate() + 1) < 10) {
        dia = "0" + (fechaParam.getDate() + 1);
    }

    if ((fechaParam.getMonth() + 1) < 10) {
        mes = "0" + (fechaParam.getMonth() +1);
    }

    // Manejar la fecha por formato
    switch (parametro) {
        case 1: // Formato mes-día-año
            if (tipoFecha === "I") {
                resultDate = mes + "-" + dia + "-" + fechaParam.getFullYear() + " 00:00:00.000";
            } else if (tipoFecha === "F") {
                resultDate  = mes + "-" + dia + "-" + fechaParam.getFullYear() + " 23:59:59.997";
            } else {
                resultDate = mes + "-" + dia + "-" + fechaParam.getFullYear() + " 00:00:00.000";
            }

            break;

        case 2: // Formato día-mes-año
            if (tipoFecha === "I") {
                resultDate = dia + "-" + mes + "-" + fechaParam.getFullYear() + " 00:00:00.000";
            } else if (tipoFecha === "F") {
                resultDate  = dia + "-" + mes + "-" + fechaParam.getFullYear() + " 23:59:59.997";
            } else {
                resultDate = dia + "-" + mes + "-" + fechaParam.getFullYear() + " 00:00:00.000";
            }

            break;
        
        case 3: // Formato año-mes-día
            if (tipoFecha === "I") {
                resultDate = fechaParam.getFullYear() + "-" + mes + "-" + dia + " 00:00:00.000";
            } else if (tipoFecha === "F") {
                resultDate = fechaParam.getFullYear() + "-" + mes + "-" + dia + " 23:59:59.997";
            } else {
                resultDate = fechaParam.getFullYear() + "-" + mes + "-" + dia + " 00:00:00.000";
            }

            break;
        
        case 4: // Formato año-día-mes
            if (tipoFecha === "I") {
                resultDate = fechaParam.getFullYear() + "-" + dia + "-" + mes + " 00:00:00.000";
            } else if (tipoFecha === "F") {
                resultDate = fechaParam.getFullYear() + "-" + dia + "-" + mes + " 23:59:59.997";
            } else {
                resultDate = fechaParam.getFullYear() + "-" + dia + "-" + mes + " 00:00:00.000";
            }

            break;
        
        default: // Formato día-mes-año
            if (tipoFecha === "I") {
                resultDate = dia + "-" + mes + "-" + fechaParam.getFullYear() + " 00:00:00.000";
            } else if (tipoFecha === "F") {
                resultDate  = dia + "-" + mes + "-" + fechaParam.getFullYear() + " 23:59:59.997";
            } else {
                resultDate = dia + "-" + mes + "-" + fechaParam.getFullYear() + " 00:00:00.000";
            }

            break;
    }

    return resultDate;

}

/**
 * Calcula la edad de una persona comociendo su fecha de nacimiento
 * @param {*} fechaNacimiento (Fecha de nacimiento en formato String)
 * @returns edad de tipo entero
 */
function calcularEdad(fechaNacimiento) {
    
    const fechaNac    = new Date(fechaNacimiento);
    const fechaActual = new Date();
    
    let edad          = fechaActual.getFullYear() - fechaNac.getFullYear();
  
    // Ajustar la edad si aún no ha cumplido años este año
    const mesActual     = (fechaActual.getMonth() + 1);
    const diaActual     = fechaActual.getDate();
    const mesNacimiento = (fechaNac.getMonth() + 1);
    const diaNacimiento = fechaNac.getDate();
  
    if (mesActual < mesNacimiento || (mesActual === mesNacimiento && diaActual < diaNacimiento)) {
      edad--;
    }
  
    return edad;
}

/**
 * Retorna una fecha en formato string [dia-mes-año] para visualizar en vistas
 * @param {*} fechaParam (Fecha que se desa formatear)
 * @returns Fecha formateada de tipo string (resultDate) 
 */
const fechaFormateada = (fechaParam) => {
    let resultDate = "";
    
    dia  = fechaParam.getDate();
    mes  = (fechaParam.getMonth() + 1);
    anio = fechaParam.getFullYear();

    resultDate += dia < 10 ? "0" + dia + "-" : "" + dia + "-";
    resultDate += mes < 10 ? "0" + mes + "-" : "" + mes + "-";
    resultDate += anio;

    return resultDate;
}

// controlsPageFocus: Poner el foco en la primera página de control (Para evitar problemas en IE, enfocar la primera entrada del formulario)

const controlsPageFocus = (pageNumber, formPages) => {
    if (formPages.length > 0) {
        for(let cont=0; cont < formPages[pageNumber-1].elements.length; cont++) {
            let currentControl = formPages[pageNumber-1].elements[cont];
            if (currentControl.nodeName === "INPUT" || currentControl.nodeName === "SELECT" || currentControl.nodeName === "TEXTAREA") {
                currentControl.focus();
                break;
            }
        }
    }
}

// showPage: Muestra la página seleccionada

const showPage = (pageNumber, formPages) => {
    formPages.forEach(page => page.classList.remove('active'));
    formPages[pageNumber - 1].classList.add('active');
    controlsPageFocus(pageNumber, formPages);
}

// clearStyleLinks: Quita los estilos a todos los links

const clearStyleLinks = (arrLiElements) => {
    for(let y=0; y < arrLiElements.length; y++) {
        if (arrLiElements[y].classList.contains("selected")) {
                arrLiElements[y].classList.remove("selected");
        }
    }
}
