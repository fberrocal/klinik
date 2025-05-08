class Principal {
    constructor() {}

    linkPrincipal(link) {
        if (link) {
            let url    = "";
            let cadena = link.split("/");
    
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

            // Ojo se arma una palabra tomando de la URL explícita el controlador y el método recibidos
            for (let i = 0; i < cadena.length; i++) {
                if (i < 2) {
                    if (cadena[i] != '') {
                        url += cadena[i];     
                    }
                }
            }

            switch (url) {
                case "Medicosagendamedica":
                        listarAgendaMedico();
                        break;
                case "Medicosatenderpaciente":
                        let cnsCita = getParameterByName('cnscit');
                        let nroPac  = getParameterByName('idpac');
                        let fatenc  = getParameterByName('fatencion');
                        setInformacionMedicaPaciente(cnsCita, nroPac, fatenc);
                        break;
                case "MplrenderVistaPlantillas":
                        let cns_Cita = getParameterByName('cnscit');
                        let nro_Pac  = getParameterByName('idpac');
                        getPlantillasCE();
                        seterDatosPaciente(cns_Cita, nro_Pac);
                default:
                    break;
            }
        }
    }
}
