document.addEventListener("DOMContentLoaded", function() {
    const menutop       = document.getElementById('top-menu')
    const sidebarmedico = document.getElementById('sidebar')
    const bread         = document.getElementById('breadcrumbs')
    const foot          = document.getElementById('foot')

    // Add top menu
    if (menutop) {
        menutop.innerHTML += MENUPRINCIPAL
    }
    
    // Add aside menu
    if (sidebarmedico) {
        const contenidohtml = `
            <ul id="sidebarnav">
                <li class="user-profile">
                    <a class="has-arrow waves-effect waves-dark" href="#" aria-expanded="false">
                        <img src="http://localhost/medik/assets/images/users/profile.png" alt="user" />
                        <span class="hide-menu">Steave Jobs</span>
                    </a>
                    <ul aria-expanded="false" class="collapse">
                        <li><a href="javascript:void(0);">My Profile</a></li>
                        <li><a href="javascript:void(0);">My Balance</a></li>
                        <li><a href="javascript:void(0);">Inbox</a></li>
                        <li><a href="javascript:void(0);">Account Setting</a></li>
                        <li><a href="javascript:void(0);">Logout</a></li>
                    </ul>
                </li>
                <li class="nav-devider"></li>
                <li class="nav-small-cap">MENU PRINCIPAL</li>
                <li> 
                    <a class="has-arrow waves-effect waves-dark" href="#" aria-expanded="false">
                        <i class="mdi mdi-gauge"></i>
                        <span class="hide-menu">Inicio
                            <span class="label label-rouded label-themecolor pull-right">4</span>
                        </span>
                    </a>
                    <ul aria-expanded="false" class="collapse">
                        <li><a href="http://localhost/medik/pages/medicosdashboard.html">Dashboard</a></li>
                        <li><a href="index2.html">Analytical</a></li>
                        <li><a href="index3.html">Demographical</a></li>
                        <li><a href="index4.html">Modern</a></li>
                    </ul>
                </li>
                <li> 
                    <a class="has-arrow waves-effect waves-dark" href="#" aria-expanded="false">
                        <i class="mdi mdi-bullseye"></i>
                        <span class="hide-menu">Aplicaciones</span>
                    </a>
                    <ul aria-expanded="false" class="collapse">
                        <li><a href="http://localhost/medik/pages/agendamedica.html">Agenda M&eacute;dica</a></li>
                    </ul>
                </li>
            </ul>`

        sidebarmedico.innerHTML += contenidohtml
    }

    // Add breadcrumbs root
    if (bread) {
        bread.innerHTML += BREADCRUMBS
    }
    
    // Add footer
    if (foot) {
        foot.innerHTML += foot;
    }
    
})
