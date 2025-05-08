<?php
    // PAcientes Class
    class Pacientes extends Controllers {

        public function __construct() {
            parent::__construct();
        }

        # Información médica del paciente # 17.01.2024 Dev. F. Berrocal Machado
        public function renderInformacionClinicaPaciente() {

            $user = Session::getSession("User");

            if ($user != null) {
                if ( !isset($_POST['idpaciente']) ) {

                    $resp = [
                        'code' => 400,
                        'status' => 'Error',
                        'message' => 'ParAmetro requerido (Id Afiliado) no vAlido o vacIo'
                    ];

                } else {

                    $sIdPAciente         = $_POST['idpaciente'];
                    $infoPaciente        = $this->model->getInformacionBasica($sIdPAciente);
                    $infoHistoriaClinica = $this->model->getRegistrosDeHistoriaClinica($sIdPAciente);
                    $infoOrdenesMedicas  = $this->model->getOrdenesMedicas($sIdPAciente);

                    if ( is_array($infoPaciente) && is_array($infoHistoriaClinica) && is_array($infoOrdenesMedicas) ) {

                        $resp = [
                            'code'          => 201,
                            'status'        => 'Success',
                            'infoafiliado'  => $infoPaciente,
                            'hclinica'      => $infoHistoriaClinica,
                            'ordenes'       => $infoOrdenesMedicas
                        ];

                    } else {
                        $mensajeError = "";

                        if ( !is_array($infoPaciente) ) {
                            $mensajeError = $infoPaciente;
                        } elseif ( !is_array($infoHistoriaClinica) ) {
                            $mensajeError = $infoHistoriaClinica;
                        } elseif ( !is_array($infoOrdenesMedicas) ) {
                            $mensajeError = $infoOrdenesMedicas;
                        }

                        $resp = array(
                            'code' => '500',
                            'datos' => 'Error interno del Servidor (Info Paciente)',
                            'msg' => $mensajeError
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

    }

?>
