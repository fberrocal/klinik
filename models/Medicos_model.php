<?php 
    # Modelo de Médicos
    class Medicos_model extends Conexion {

        public function __construct() {
            parent::__construct();
        }

        # Listado de Agenda Médica # 31.12.2024 Dev. F. Berrocal Machado
        public function renderGridAgendaMedica($query, $parametros) {
            $response = $this->db->executeQuerySelect($query, $parametros);
            return  $response;
        }

    }

?>    
    