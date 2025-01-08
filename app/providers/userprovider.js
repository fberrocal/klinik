class UserProvider {

    constructor () {}

    // USER LOGIN
    // Developed-by: fberrocalmachado - Wed Aug 21, 2024
    loginUser() {

        let usuario = document.getElementById("usuario").value
        let pass    = document.getElementById("password").value

        if(usuario != "" && pass != "") {

            $.post(
                URL2 + "Index/userLogin",
                $('.login').serialize(), // { usuario, pass },
                (response)=>{
                    try {

                        var item = JSON.parse(response) 
                        
                        if (item.code === 201) {

                            if (item.usuario) { // if (item.usuario.isArray()) {

                                // localStorage.setItem("user", response)
                                localStorage.setItem("user", JSON.stringify(item.usuario))

                                if (item.usuario.TIPO === 'M' ) {
                                    window.location.href = URL2 + "Medicos/medicos"
                                }

                            } else {
                                document.getElementById('indexMessage').innerHTML = "Email o contraseña no vAlidos";
                            }

                        } else {
                            document.getElementById('indexMessage').innerHTML = item.message
                        }

                    } catch (error) {
                        document.getElementById('indexMessage').innerHTML = response;
                    }
                }
            );

        } else {
            usuario.focus;
            document.getElementById('indexMessage').innerHTML = "Usuario o contraseña no válido";
        }
    }

    // Datos del usuario actual
    userData(URLactual) {
        if(PATHNAME == URLactual) {
            localStorage.removeItem("user")
            // document.getElementById('menuNavBar1').style.display = 'none';
            // document.getElementById('menuNavBar2').style.display = 'none';
        } else {
            if(null != localStorage.getItem("user")) {

                let user = JSON.parse(localStorage.getItem("user"))

                if(0 < user.USUSUID) {
                    // document.getElementById('menuNavBar1').style.display = 'block';
                    // document.getElementById('menuNavBar2').style.display = 'block';
                    // $("#name1").append(user.pnombre + ' ' + user.apellidos);
                    
                    if (user.TIPO == "M") {
                        document.getElementById('nombre-medico').innerHTML = "Dr. " + user.NOMBRE    
                    } else {
                        document.getElementById('nombre-medico').innerHTML = user.NOMBRE
                    }
                    
                    // $("#role1").append(user.roles);
                    // document.getElementById('role1').innerHTML = user.roles;
                    // $("#name2").append(user.pnombre + ' ' + user.apellidos);
                    // document.getElementById('name2').innerHTML = user.pnombre + ' ' + user.apellidos;
                    // $("#role2").append(user.roles);
                    // document.getElementById('role2').innerHTML = user.roles;
                    // document.getElementById('fotoUser1').innerHTML = ['<img class="responsive-img valign profile-image" src="',URL+FOTOS+'usuarios/'+user.imagen,'" title="',escape(user.imagen),'"/>'].join('');
                    // document.getElementById('fotoUser2').innerHTML = ['<img class="responsive-img valign profile-image" src="',URL+FOTOS+'usuarios/'+user.imagen,'" title="',escape(user.imagen),'"/>'].join('');
                }
            }
        }
    }
}
// export default UserProvider;
