<?php 
    require "config.php";

    $url = $_GET['url'] ?? 'Index/index';
    $url = explode('/', $url);

    $controller = '';
    $method     = '';
    $params     = '';

    if(isset($url[0])) {                        // Controlador
        $controller = $url[0];
    }

    if(isset($url[1])) {                        // Método
        if(isset($url[1]) != '') {
            $method = $url[1];
        }
    }

    if(isset($url[2])) {                        // Parámetros
        if(isset($url[1]) != '') {
            $params = $url[2];
        }
    }

    // [ FUNCION DE AUTOCARGA DEFINIDA ]
    // $object = new MyClass(); // Se usa para instanciar sin necesidad del require
    spl_autoload_register(function($class){
        if(file_exists(LBS.$class.'.php')) {
            require_once LBS.$class.'.php';
        }
    });

    // require_once 'controller/Errors.php';
    // $error = new Errors();
    // $obj = new Controllers();
    // echo $controller . ' ' . $method;
    
    $controllersPath = 'controller/'.$controller.'.php';

    if(file_exists($controllersPath)) {

        require_once $controllersPath;
        $contr = new $controller();

        if (isset($method)) {
            if (method_exists($controller, $method)) {      // $contr->{$method}();

                if (isset($params)) {
                    $contr->{$method}($params);
                } else {
                    $contr->{$method}();
                }
                
            } else {
                // $error->error();
            }
        }
    }

    // if(!file_exists($controllersPath)) {
    //     $error->error();
    // }

?>
