<?php
    /**
     * Gestión de conexiones con la base de datos
     */
    class Conexion {

        public $db;

        public function __construct() {
            $this->createConnection();
        }

        // Retorna el atributo $view
        public function getDb() {
            return $this->db;
        }

        // Setea el atributo $view
        public function setDb($db) {
            $this->db = $db;
        }

        public function createConnection() {
            $this->db = new Querymanager("localhost", "sa", "acceso001", "Clintos8"); // host, user, pass, database
        }

    }

?>
