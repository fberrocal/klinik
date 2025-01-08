import UserProvider from '../providers/userprovider.js'

// -----------------------------------------------------------
// Proceso de autenticación y loguin de usuarios del sistema
// -----------------------------------------------------------

var usuarioService = new UserProvider()
const btnLogin = document.getElementById('btnLogin')

var loginUser = () => {
    usuarioService.loginUser();
}

if (btnLogin) {
    btnLogin.addEventListener("click", loginUser);
}
