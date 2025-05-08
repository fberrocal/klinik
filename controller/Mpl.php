<?php
    // Mpl Class
    class Mpl extends Controllers {

        public function __construct() {
            parent::__construct();
        }

        # Configuración de la Plantilla de Historia Clínica # 10.02.2025 Dev. F. Berrocal Machado
        public function getConfiguracionPlantilla() {

            $user = Session::getSession("User");

            if ($user != null) {
                if ( !isset($_POST['idplantilla']) ) {
                    $resp = [
                        'code' => 400,
                        'status' => 'Error',
                        'message' => 'ParAmetro requerido (idplantilla) no vAlido o vacIo'
                    ];
                } else {
                    $sIdPlantilla     = $_POST['idplantilla'];
                    $infoPlantilla    = $this->model->getDatosPlantilla($sIdPlantilla);
                    $paginasPlantilla = $this->model->getPaginasPlantilla($sIdPlantilla);
                    $camposPlantilla  = $this->model->getCamposPlantilla($sIdPlantilla);

                    if ( is_array($infoPlantilla) && is_array($paginasPlantilla) && is_array($camposPlantilla) ) {

                        $resp = [
                            'code'          => 201,
                            'status'        => 'Success',
                            'infoplantilla' => $infoPlantilla,
                            'paginas'       => $paginasPlantilla,
                            'campos'        => $camposPlantilla
                        ];

                    } else {
                        $mensajeError = "";

                        if ( !is_array($infoPlantilla) ) {
                            $mensajeError = "1 - " . $infoPlantilla;
                        } elseif ( !is_array($paginasPlantilla) ) {
                            $mensajeError = "2 - " . $paginasPlantilla;
                        } elseif ( !is_array($camposPlantilla) ) {
                            $mensajeError = "3 - " . $camposPlantilla;
                        }

                        $resp = array(
                            'code' => '500',
                            'status' => 'Error interno del Servidor (Info Plantilla)',
                            'message' => $mensajeError
                        );
                    }
                }
            } else {
                $resp = [
                    'code' => 401,
                    'status' => 'Unauthorized',
                    'message' => 'El usuario no ha iniciado sesión en el Servidor'
                ];
            }

            echo json_encode($resp, JSON_UNESCAPED_UNICODE);
        }

        # Retorna un listado de Plantillas de Historia Clínica filtradoas por su Ambito
        public function listadoPlantillasAmbito() {
            if ( !isset($_POST['ambitop']) ) {
                $resp = [
                    'code' => 400,
                    'status' => 'Error',
                    'message' => 'ParAmetro requerido (ambito) no vAlido o vacIo'
                ];
            } else {
                $ambito = $_POST['ambitop'];
                $data = $this->model->getPlantillasPorAmbito($ambito);

                if(is_array($data)) {
                    $resp = [
                        'code'       => 201,
                        'status'     => 'Success',
                        'plantillas' => $data
                    ];
                } else {
                    $resp = array(
                        'code' => '500',
                        'datos' => 'Error interno del Servidor (Listado de Plantillas)',
                        'msg' => $data
                    );
                }
            }

            echo json_encode($resp, JSON_UNESCAPED_UNICODE);
        }

        // Vista particular para creación de registro clínico
        public function renderVistaPlantillas() {
            $this->getView()->render2($this, "vistaplantilla", null);
        }

    }
?>
