<?php
    // Medicos Class
    class Medicos extends Controllers {
        
        public function __construct() {
            parent::__construct();
        }

        # Dashboard de usuario Médico # 01.07.2024 Dev. F. Berrocal Machado
        public function medicos() {
            $this->getView()->render2($this, "medicos", null);
        }

        # Agenda médica # 01.07.2024 Dev. F. Berrocal Machado
        public function agendamedica() {
            $this->getView()->render2($this, "agendamedica", null);
        }

        # Listado de Agenda Médica # 31.12.2024 Dev. F. Berrocal Machado
        public function renderGridAgendaMedica() {
            $user = Session::getSession("User");
            if ($user != null) {
                if ( !isset($_POST['idsede']) || !isset($_POST['idmedico']) || !isset($_POST['fechaini']) || !isset($_POST['fechafin']) ) {
                    $resp = [
                        'code' => 400,
                        'status' => 'ERROR',
                        'message' => 'ParAmetros requeridos (Sede, MEdico, Fecha Inicio, Fecha Fin) no vAlidos o vacIos'
                    ];
                } else {
                    $sqlCitas  = "";
                    $sqlCitas .= "SELECT CIT.CONSECUTIVO,CIT.FECHA,CIT.FECHASOL,CIT.FECHAATENCION,CIT.IDAFILIADO,";
                    $sqlCitas .= "COALESCE(AFI.PAPELLIDO,'')+' ' +COALESCE(AFI.SAPELLIDO,'')+' ' +COALESCE(AFI.PNOMBRE,'')+' ' +COALESCE(AFI.SNOMBRE,'') AS NOMAFILIADO,";
                    $sqlCitas .= "CIT.KCNTID,CIT.TIPOCITA,CIT.CLASEORDEN,CIT.TELEFONOAVISO,CIT.IDSERVICIO,CIT.IDMEDICO,CIT.FECHALLEGA ";
                    $sqlCitas .= "FROM CIT WITH (NOLOCK) JOIN AFI WITH (NOLOCK) ON AFI.IDAFILIADO=CIT.IDAFILIADO ";
                    $sqlCitas .= "WHERE CIT.IDMEDICO = :idmedico AND CIT.IDSEDE = :idsede AND CIT.FECHA BETWEEN :fechaini AND :fechafin ";
                    $sqlCitas .= "ORDER BY CIT.FECHA";

                    $arrayParams = array(
                        'idmedico' => $_POST['idmedico'],
                        'idsede'   => $_POST['idsede'],
                        'fechaini' => $_POST['fechaini'],
                        'fechafin' => $_POST['fechafin']
                    );

                    $data = $this->model->renderGridAgendaMedica($sqlCitas, $arrayParams);

                    if (is_array($data)) {
                        $resp = [
                            'code' => 201,
                            'status' => 'SUCCESS',
                            'citas' => $data
                        ];
                    } else {
                        $resp = [
                            'code' => 400,
                            'status' => 'ERROR',
                            'message' => $data
                        ];
                    }
                }
            } else {
                $resp = [
                    'code' => 401,
                    'status' => 'WARNING',
                    'message' => 'El usuario no ha iniciado Sesión en el Servidor'
                ];
            }

            echo json_encode($resp);

        }

        # Vista particular para atención de pacientes
        public function atenderpaciente() {
            $this->getView()->render2($this, "vistapaciente", null);
        }

    }

?>
