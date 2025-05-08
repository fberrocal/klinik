<?php 
    # Modelo de Plantillas (MPL)
    class Mpl_model extends Conexion {

        public function __construct() {
            parent::__construct();
        
        }

        # Retorna la informacion básica de la Plantilla # 08.02.2025 Dev. F. Berrocal Machado
        public function getDatosPlantilla($idPlantilla) {
            $query  = "";
            $query .= "SELECT CLASEPLANTILLA,DESCPLANTILLA,UNICA,PIDEDX,PIDESV,SEXO,EDADINI,EDADFIN,PIDEDXR,ARRASTRADX,MPLID,";
            $query .= "TIPOFORMATO,CONTEXTO,LAPSOMODIFICAHC,IDAGRUPACIONDX,ONCOLOGIA,VERSIONIMP,VERSIONPLT,NUMEROPAGINAS ";
            $query .= "FROM MPL WHERE MPLID=:idplantilla";

            $parametros = array(
                'idplantilla' => $idPlantilla
            );

            $response = $this->db->executeQuerySelect($query, $parametros);
            
            return  $response;
        }

        # Retorna las paginas configuradas para la Plantilla # 08.02.2025 Dev. F. Berrocal Machado
        public function getPaginasPlantilla($idPlantilla) {
            $query  = "";
            $query .= "SELECT MPLPAGID,CLASEPLANTILLA,PAGINANUMERO,TITULO,ESPACIOSOCUPADOS,NUMEROCONTROLESPAG FROM MPLPAG WHERE MPLID=:idplantilla";
            $query .= " ORDER BY PAGINANUMERO";

            $parametros = array(
                'idplantilla' => $idPlantilla
            );

            $response = $this->db->executeQuerySelect($query, $parametros);
            
            return  $response;
        }

        # Retorna los campos de la Plantilla # 08.02.2025 Dev. F. Berrocal Machado
        public function getCamposPlantilla($idPlantilla) {

            $query  = "";
            $query .= "SELECT CLASEPLANTILLA,CAMPO,SECUENCIA,DESCCAMPO,TIPO_CAMPO,DEFAULT1,SEXO,EDADINI,EDADFIN,REQUERIDO,ARRASTRAINFO,MPLDID,";
            $query .= "IMPRIMIR,POSX,POSY,ANCHO,POSCOLUMNA,SECUENCIAIMP,MPLPAGID,PAGINANUMERO ";
            $query .= "FROM MPLD WHERE MPLID=:idplantilla ";
            $query .= "ORDER BY PAGINANUMERO ASC, SECUENCIA ASC";

            $parametros = array(
                'idplantilla' => $idPlantilla
            );

            $response = $this->db->executeQuerySelect($query, $parametros);
            
            if ( is_array($response) && $response["results"] != 0 ) {

                $arrCampos     = $response["results"];
                $registrosMpld = [];

                foreach ($arrCampos as $row) {
                    $idCampo   = $row['MPLDID'];
                    $tipoCampo = trim($row['TIPO_CAMPO']);

                    if ( $tipoCampo === "Lista" || $tipoCampo === "MultiCheck" ) {
                        $valoresLista = $this->getValoresCamposMultivaluados($idCampo);
                    } else {
                        $valoresLista = array("results" => 0);
                    }

                    $registrosMpld[] = array (
                        "CLASEPLANTILLA"	=> $row['CLASEPLANTILLA'],
                        "CAMPO"				=> $row['CAMPO'],
                        "SECUENCIA"			=> $row['SECUENCIA'],
                        "DESCCAMPO"			=> $row['DESCCAMPO'],
                        "TIPO_CAMPO"		=> $row['TIPO_CAMPO'],
                        "DEFAULT1"			=> $row['DEFAULT1'],
                        "SEXO"				=> $row['SEXO'],
                        "EDADINI"			=> $row['EDADINI'],
                        "EDADFIN"			=> $row['EDADFIN'],
                        "REQUERIDO"			=> $row['REQUERIDO'],
                        "ARRASTRAINFO"		=> $row['ARRASTRAINFO'],
                        "MPLDID"			=> $row['MPLDID'],
                        "IMPRIMIR"			=> $row['IMPRIMIR'],
                        "POSX"				=> $row['POSX'],
                        "POSY"				=> $row['POSY'],
                        "ANCHO"             => $row['ANCHO'],
                        "POSCOLUMNA"		=> $row['POSCOLUMNA'],
                        "SECUENCIAIMP"		=> $row['SECUENCIAIMP'],
                        "MPLPAGID"			=> $row['MPLPAGID'],
                        "PAGINANUMERO"		=> $row['PAGINANUMERO'],
                        "valoreslista"      => $valoresLista
                    );

                }

                if ( count($registrosMpld) > 0 ) {
                    $response = array(
                        "results" => $registrosMpld
                    );
                }

            }

            return  $response;
        }

        # Retorna los valores de lista de campos multivaluados de la Plantilla # 08.02.2025 Dev. F. Berrocal Machado
        public function getValoresCamposMultivaluados($idCampo) {
            $query  = "";
            $query .= "SELECT VALORLISTA,MPLDLID FROM MPLDL WHERE MPLDID=:idcampo";

            $parametros = array(
                'idcampo' => $idCampo
            );

            $response = $this->db->executeQuerySelect($query, $parametros);
            
            return  $response;
        }

        # Retorna listado de Plantillas de Historia Clínica informacion básica de la Plantilla # 08.02.2025 Dev. F. Berrocal Machado
        public function getPlantillasPorAmbito($ambitoParam) {
            $where    = " WHERE ESTADO='Activo' AND AMBITO=:ambito";
            $params   = array('ambito' => $ambitoParam);
            $response = $this->db->select1("CLASEPLANTILLA,DESCPLANTILLA,MPLID", 'MPL', $where, $params);

            return $response;
        }
       
    }    
?>
