<?php 
    # Modelo de Index
    class Index_model extends Conexion {

        public function __construct() {
            parent::__construct();
        }

        // proceso de encriptación de Password BD Clintos
        // Developed-by: Francisco Berrocal Machado - 23.DIC.2024
        private function codificar($password) {
            $claveLimpia = "";
            $encriptada  = "";
            $char1		 = 0;
            $char2		 = 0;
        
            $claveLimpia = substr(strtolower(trim($password)), 0, 8);
        
            for($i=0; $i<strlen($claveLimpia); $i++) {
                $char1 = ord($claveLimpia[$i]);
        
                if($char1 >= 48 && $char1 <= 57) {
                    $char2 = $char1 - 31;
                } else {
                    $char2 = $char1 - 63;
                }
        
                $encriptada .= chr($char2);
            }
        
            return $encriptada;
        }

        // Procedimiento para login de usuarios
        // Developed-by: Francisco Berrocal Machado - 13.DIC.2024
        public function userLogin($user, $password) {

            $encryptedPass = "";

            $where = " WHERE USUARIO = :user AND ESTADO = 'Activo'";
            $param = array('user' => $user);
            $response = $this->db->select1("*", 'USUSU', $where, $param);

            if(is_array($response)) {

                $response = $response['results'];

                if(0 != count($response)) {

                    $encryptedPass = $this->codificar($password);     // <-- ENCRIPTAR EL PASSWORD RECIBIDO
                    $dbPass = trim($response[0]['CLAVE']);

                    if ($encryptedPass === $dbPass) {           // if (password_verify($encryptedPass, $dbPass)) {

                        $data = array(
                            "USUSUID"       => $response[0]['USUSUID'],
                            "USUARIO"       => $response[0]['USUARIO'],
                            "NOMBRE"        => $response[0]['NOMBRE'],
                            "TIPO"          => $response[0]['TIPO'],
                            "IDMEDICO"      => $response[0]['IDMEDICO'],
                            "PSUPERVISOR"   => $response[0]['PSUPERVISOR'],
                        );

                        Session::setSession("User", $data);

                        return $data;

                    } else {
                        return "ContraseNa incorrecta";      // $data = array(//"idUsuario" => 0// ); // return $data;
                    }

                } else {
                    return "Usuario no registrado";
                }

            } else {
                return $response;
            }

        }
        
    }
    
?>
