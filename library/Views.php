<?php 
    /**
     * Gestión de las vistas de la aplicación
     */
    class Views {

        # Método 1 para renderizado de vistas de usuario
        public function render($controller, $view, $models) {
            $controllers = get_class($controller);

            require_once VIEWS.DFT.'header.html';

            if ($models === null) {
                require_once VIEWS.$controllers.'/'.$view.'.html';    
            } else {
                require_once VIEWS.$controllers.'/'.$view.'.php';    
            }

            require_once VIEWS.DFT.'footer.html';
        }

        # Renderiza páginas competas de la App (Página de Login)
        public function render2($controller, $view, $models) {
            $controllers = get_class($controller);

            require_once VIEWS.DFT.'header.html';
            require_once VIEWS.DFT.'menusuperior.html';
            require_once VIEWS.DFT.'sidebar.html';
            // require_once VIEWS.DFT.'breadcrumbs.html';

            // Vista correspondiente al controlador
            if ($models === null) {
                require_once VIEWS.$controllers.'/'.$view.'.html';    
            } else {
                require_once VIEWS.$controllers.'/'.$view.'.php';    
            }

            require_once VIEWS.DFT.'sidebarmovil.html';
        }
        
    }
     
?>
