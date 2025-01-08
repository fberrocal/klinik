// import UserProvider from './providers/userprovider.js'

// --------------------------------------------------------
// PROCESO DE LOGIN DE USUARIO
// --------------------------------------------------------
var principal   = new Principal();
var usuario     = new UserProvider();
var doctor      = new DoctorProvider();

// --------------------------------------------------------
// PROCESO DE LOGIN
// --------------------------------------------------------

var loginUser = () => {
    usuario.loginUser();
}

// --------------------------------------------------------
// PROCESO DE MEDICO
// --------------------------------------------------------

var listarAgendaMedico = () => {
    // const dataGrid   = document.getElementById('dataGrid');
    const filterDate = document.getElementById('filterDate');
    filterDate.valueAsDate = new Date();
    // dataGrid.innerHTML     = ''; // Limpia la grilla
    doctor.listarAgendaMedica();
}

    // const btnLogin = document.getElementById('btnLogin')
    // if (btnLogin) {
    //    btnLogin.addEventListener("click", loginUser);  // <-- Asigna dinámicamente la acción al botón de Log in
    // }

// PAGINA DE LOGIN
$(function(){
    // PAGINA DE LOGIN (Para que el enter envíe el formulario)
    $('#btnLogin').click(function(){
        loginUser()
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

/*
    $(function() {
        $('#btnLogin').click(function(){
            loginUser()
        });
    });
*/

// --------------------------------------------------------
// GESTION DE INSTANCIAS DE LA APLICACION
// --------------------------------------------------------
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
