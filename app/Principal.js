class Principal {
    constructor() {}

    linkPrincipal(link) {
        if (link) {
            let url    = "";
            let cadena = link.split("/"); // <-- Divide la cadena por el caracter / y generan un Array con las partes
    
            /* COMENTADO TEMPORALMENTE DEBE SOLUCIONARSE EL HTACCESS ERROR FILE
            // Se arma la URL explícita del controlador recibido
            for (let i = 0; i < cadena.length; i++) {
                if (i >= 2) {
                    if (cadena[i] != '') {
                        url += cadena[i];     
                    }           
                }
            }
            */

            // Se arma la URL explícita del controlador recibido
            for (let i = 0; i < cadena.length; i++) {
                if (cadena[i] != '') {
                    url += cadena[i];     
                }           
            }

            // Casos para cada módulo (link de modulo) del sistema
            switch (url) {
                case "Medicosagendamedica":
                        // Método();
                        listarAgendaMedico()
                        break;
                default:
                    break;
            }
        }
    }    
}        