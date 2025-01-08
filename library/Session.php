<?php 
    class Session {
        // Inicia variables de Session
        // Developed-by: Francisco Berrocal Machado
        static function start() {
            @session_start();
        }

        // Retorna el valor almacenado en una variable de Session (Consulta una variable de sesión)
        // Developed-by: Francisco Berrocal Machado
        static function getSession($name) {
            return $_SESSION[$name];
        }
        
        // Crea variables de Session
        // Developed-by: Francisco Berrocal Machado
        static function setSession($name, $data) {
            return $_SESSION[$name] = $data;
        }

        // Destruye las variables de session
        // Developed-by: Francisco Berrocal Machado 
        static function destroy() {
            @session_destroy();
        }

    }
    
?>
