<?php
    // Index Class
    class Index extends Controllers {        

        public function __construct() {
            parent::__construct();
        }

        public function index() {
            $this->getView()->render($this, "index", null);
        }

        // Función para el logueo de usuarios
        // Códigos de error: 1 - Password vacío, 2 - password menor a 8 caracteres
        // Developed-by: Francisco Berrocal Machado - 23.DIC.2024
        public function userLogin() {

            if ( !isset($_POST['usuario']) || !isset($_POST['password']) ) {

                $resp = [
                    'code' => 400,
                    'status' => 'ERROR',
                    'message' => 'ParAmetros Usuario y Password no vAlidos o vacIos'
                ];

            } else {

                if( empty($_POST['password']) ) {
                    // echo 1;
                    $resp = [
                        'code' => 400,
                        'status' => 'ERROR',
                        'message' => 'Password no vAlido o vacIo'
                    ];

                } else {
                    
                    $data = $this->model->userLogin($_POST['usuario'], $_POST['password']);

                    if (is_array($data)) {

                        $resp = [
                            'code' => 201,
                            'status' => 'SUCCESS',
                            'usuario' => $data
                        ];

                    } else {

                        $resp = [
                            'code' => 400,
                            'status' => 'ERROR',
                            'message' => $data
                        ];

                    }
                }
            }

            // echo json_encode($resp); 
            echo json_encode($resp); 

            /*
            if(isset($_POST['usuario'])) {
                if (!empty($_POST['password'])) {

                    if (8 <= strlen($_POST['password'])) {

                        $data = $this->model->userLogin($_POST['usuario'], $_POST['password']);

                        if (is_array($data)) {
                            echo json_encode($data);        // <-- Se manda la data resultado del proceso de login (datos del usuario logueado)
                        } else {
                            echo $data;                     // <-- Se manda la data resultado del proceso de login (Mensage de error)
                        }

                    } else {
                        echo 2;                       
                    }

                } else {
                    echo 1;                    
                }
            }
            */

        }

    }

?>
