// import UserProvider from './providers/userprovider.js'

// Javascript objects
var principal  = new Principal();
var usuario    = new UserProvider();
var doctor     = new DoctorProvider();
var paciente   = new PacientesProvider();
var plantillas = new PlantillasProvider();
var bdLocal    = new LocalDataBaseProvider();

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// 1. Login process
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

var loginUser = () => {
    usuario.loginUser();
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// 2. Doctor process
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// 2.1 Carga en lista desplegable las plantillas de Consulta Externa
var getPlantillasCE = () => {
    plantillas.getPlantillas(AMBITOCONSULTAEXTERNA);
}

// 2.2 Carga en la vista de pacientes su información médica completa
var setInformacionMedicaPaciente = (consecutivo, idpaciente, fatencion) => {
    let nro_cita       = consecutivo;
    let nro_paciente   = idpaciente;
    let fecha_atencion = fatencion;
    paciente.renderInformacionClinicaPaciente(nro_paciente, nro_cita, fecha_atencion);
}

// 2.3 Pasa a la vista de creacion de registro de historia clinica
var renderVistaPlantilla = (arrayDatos) => {
    let citaNumero = arrayDatos[9];
    let pacienteID = arrayDatos[0];

    plantillas.goVistaCreacionRegistrosClinicos(citaNumero, pacienteID);
}

// 2.4 Setea los datos del paciente en la vista de registro clínico
var seterDatosPaciente = (cns_Cita, nro_Pac) => {
    let idpaciente = nro_Pac;
    let cnscita    = cns_Cita;

    if(localStorage.getItem("infopaciente")) {
        let pacientei = JSON.parse(localStorage.getItem("infopaciente"));

        document.getElementById('infopac-id').innerHTML     = pacientei.id;
        document.getElementById('infopac-name').innerHTML   = pacientei.nombre;
        document.getElementById('infopac-doc').innerHTML    = pacientei.documento;
        document.getElementById('infopac-tel').innerHTML    = pacientei.telefonores;
        document.getElementById('infopac-birth').innerHTML  = pacientei.fnacimineto;
        document.getElementById('infopac-age').innerHTML    = pacientei.edad
        document.getElementById('infopac-aten').innerHTML   = pacientei.fechaact
        document.getElementById('infopac-eps').innerHTML    = pacientei.razonsocial
        document.getElementById('infopac-cont').innerHTML   = pacientei.contrato
        document.getElementById('infopac-cita').innerHTML   = pacientei.numerocita
    }    
}

// 2.5 Procedure: dibuja los controles de la Plantilla de registro clínico seleccionada
var dibujaInterfazPlantilla = (arrayDatos) => {
    plantillas.crearVistaPlantillaHC(arrayDatos);
}

// 2.6 Pasa a la vista de creacion de registro de historia clinica
var atenderCita = (consecutivo, idpaciente) => {
    const fechaAtencion = document.getElementById('filterDate').value;
    doctor.restablecerPaciente(consecutivo, idpaciente, fechaAtencion)
}

// 2.7 Marca como anulado o no atendido un registro de agenda médica (CIT) 
var anularCita = (consecutivo, idpaciente) => {
    console.log("Consecutivo: " + consecutivo + " Paciente: " + idpaciente);
}

// 2.8 Lista los registros de agenda médica del médico logueado
var listarAgendaMedico = () => {
    const filterDate = document.getElementById('filterDate');
    filterDate.valueAsDate = new Date();
    doctor.listarAgendaMedica();
}

// 2.9 Carga en un array los datos del paciente seleccionado en la vista de Atención Médica
var arrayDatosPaciente = () => {
    let pacID       = document.getElementById("infopac-id").textContent.trim();     // 0
    let pacName     = document.getElementById("infopac-name").textContent.trim();   // 1    
    let pacDoc      = document.getElementById("infopac-doc").textContent.trim();    // 2
    let pacTel      = document.getElementById("infopac-tel").textContent.trim();    // 3
    let pacNac      = document.getElementById("infopac-birth").textContent.trim();  // 4
    let pacAge      = document.getElementById("infopac-age").textContent.trim();    // 5
    let pacFeaten   = document.getElementById("infopac-aten").textContent.trim();   // 6
    let pacEps      = document.getElementById("infopac-eps").textContent.trim();    // 7
    let pacCont     = document.getElementById("infopac-cont").textContent.trim();   // 8
    let pacCita     = document.getElementById("infopac-cita").textContent.trim();   // 9

    const datosPaciente = [pacID, pacName, pacDoc, pacTel, pacNac, pacAge, pacFeaten, pacEps, pacCont, pacCita];

    return datosPaciente;
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// 3. Procesos para trabajo con Base de Datos Local
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// 3.1 Apertura de Base de Datos
const abrirDatabaseLocal = () => {
    (async () => {
        try {
            await bdLocal.openDB();
        } catch (error) {
            console.error("Error abriendo la base de datos:", error);
        }    
    })();
}

// 3.2 Guardar registro en la Base de Datos
const guardarRegistroLocal = (idafilaidoIn, claseplantillaIn, controlIn, tipocampoIn, valorIn) => {
    (async () => {
        await bdLocal.addCampo(idafilaidoIn, claseplantillaIn, controlIn, tipocampoIn, valorIn);
    })();
}

// 3.3 Leer todos los campos de una plantilla

// 3.4 Limpiar el almacén de datos seleccionado
const limpiarTabla = () => {
    (async () => {
        bdLocal.clearObjectStore();
    })();
}

// 3.5 Cerrar la conexión a la Base de Datos Local
const cerrarDatabase = () => {
    bdLocal.closeDB();
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// 4. Log in page
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

$(function(){
    // PAGINA DE LOGIN (Para que el enter envíe el formulario)
    $('#btnLogin').click(function(){
        loginUser();
    });
    
    $("#usuario").keyup(function(event) {
        if (event.which === 13) {
            $("#btnLogin").click();
        }
    });
    
    $('#password').keyup(function (event) {
        if (event.which === 13) {
            $("#btnLogin").click();
        }
    });
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// 4.1 Página de Agenda Médica
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
$(function(){
    $('#filtro-fecha').click(function(){
        doctor.listarAgendaMedica();
    });
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// 5. Patient page
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

$(function(){
    var container = document.querySelector("#registrosAut");

    if (container) {
        container.addEventListener('click', function(event) {

            if (event.target.closest('.toggle')) {
                const elementoClickado = event.target;
                const detailRow        = elementoClickado.parentNode.closest('tr').nextElementSibling;

                if (detailRow.style.display === 'none' || detailRow.style.display === '') {
                    detailRow.style.display = 'table-row';
                    elementoClickado.textContent = 'Ocultar Detalles';
                } else {
                    detailRow.style.display = 'none';
                    elementoClickado.textContent = 'Mostrar Detalles';
                }
            }
        });
    }

    $('#create-hc').click(function(){
        /* Swal.fire({
            title: "Good job!",
            text: "Acción del boton Crear HC!",
            icon: "success"
        }); */

        const datosPaciente = arrayDatosPaciente();
        renderVistaPlantilla(datosPaciente);
    });

    $('#create-om').click(function(){
        Swal.fire({
            title: "Good job!",
            text: "Acción del boton Crear Orden Médica!",
            icon: "success"
        });
    });
    
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// 6. Clinical record page
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

$(function(){
    $('#create-reghc').click(function(){
        let btnSave      = document.getElementById('save-reghc');
        let plantillasHc = document.getElementById('lista-plt');
        let indice       = plantillasHc.selectedIndex;

        if (indice > 0) {
            let plantilla   = plantillasHc.options[indice].text;
            let idplantilla = plantillasHc.options[indice].value;

            const datosPaciente = arrayDatosPaciente();
            datosPaciente.push(plantilla);      // 10
            datosPaciente.push(idplantilla);    // 11
            plantillasHc.disabled = true;
            this.disabled         = true;

            btnSave.classList.remove('command__button');
            btnSave.classList.add('command__button--active');

            dibujaInterfazPlantilla(datosPaciente);
        }
    });

    $('#cancel-reghc').click(function(){
        if (localStorage.getItem("infopaciente")) {

            let pacienteActual  = JSON.parse(localStorage.getItem("infopaciente"))	
            let numeroCita      = pacienteActual.numerocita;
            let numIdPaciente   = pacienteActual.id;

            limpiarTabla();     // bdLocal.clearObjectStore();
            cerrarDatabase();   // bdLocal.closeDB();

            window.location.href = URL2 + "Medicos/atenderpaciente/?cnscit=" + numeroCita + "&idpac=" + numIdPaciente;

		} else {
            window.location.href = URL2 + "Medicos/agendamedica";
        }
    });

    $('#save-reghc').click(function(){

        Swal.fire({
            title: "Good job!",
            text: "Acción del boton Guardar Registro Clínico",
            icon: "success"
        });

        /*
        if (localStorage.getItem("infopaciente")) {

            window.location.href = URL2 + "Medicos/atenderpaciente/?cnscit=" + numeroCita + "&idpac=" + numIdPaciente;

		} else {
            window.location.href = URL2 + "Medicos/agendamedica";
        }
        */
    });
});

/*
    $(function() {
        $('#btnLogin').click(function(){
            loginUser()
        });
    });
*/

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// GESTION DE INSTANCIAS DE LA APLICACION
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// var principal = new Principal();
/** Incluir los métodos desarrollador para los diferentes módulos */

$().ready(()=>{
    let URLactual = window.location.pathname;   // <-- Caputar la URL actual
    
    // CODIGO DE PRUEBA (PRUEBA DE FUNCIONAMIENTO)
        let ruta = getParameterByName('url');
    // +++++++++++++++++++++++++++++++++++++++++++    

    URLactual = URLactual.trim()                // <-- Eliminamos los espacios
    usuario.userData(URLactual);
    // principal.linkPrincipal(URLactual);         // <-- Principal gestiona la URL

    // CODIGO DE PRUEBA (PRUEBA DE FUNCIONAMIENTO)
        principal.linkPrincipal(ruta);         // <-- Principal gestiona la URL
    // +++++++++++++++++++++++++++++++++++++++++++        
});
