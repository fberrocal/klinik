<?php

    /**
     * Todos los controladores extienden de esta Clase
     */

     class Controllers {

        private $view;
        public $model;

        # constructor de la calse Controllers

        public function __construct() {
            Session::start();
            $this->createView();
            $this->loadClassModels();
        }

        # Cargar las clases del Model

        public function loadClassModels() {
            $model = get_class($this) . '_model';
            $path  = 'models/' . $model . '.php';

            if (file_exists($path)) {
                require_once $path;
                $this->createModel($model); // $this->model = new $model();
            }
        }

        # Retorna el atributo $view
        public function getView() {
            return $this->view;
        }

        # Setea el atributo $view
        public function setView($view) {
            $this->view = $view;
        }

        # Retorna el atributo $model
        public function getModel() {
            return $this->model;
        }

        # Setea el atributo $model
        public function setModel($model) {
            $this->model = $model;
        }

        # Crea instancia del atributo $view
        public function createView() {
            $this->view = new Views();
        }

        # Crea instancia de la clase Model
        public function createModel($modeli) {
            $this->model = new $modeli();
        }

    }

?>
