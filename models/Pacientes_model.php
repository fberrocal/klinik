<?php 
    # Modelo de Pacientes
    class Pacientes_model extends Conexion {

        public function __construct() {
            parent::__construct();
        }

        /*
        # Retorna la informacion básica del paciente # 25.01.2025 Dev. F. Berrocal Machado
        public function getInformacionBasica($query, $parametros) {
            $response = $this->db->executeQuerySelect($query, $parametros);
            return  $response;
        }
        */

        # Retorna la informacion básica del paciente # 25.01.2025 Dev. F. Berrocal Machado
        public function getInformacionBasica($idPaciente) {
            $query  = "";
            $query .= "SELECT A.IDAFILIADO,A.PNOMBRE,A.SNOMBRE,A.PAPELLIDO,A.SAPELLIDO,A.TIPO_DOC,A.DOCIDAFILIADO,A.SEXO,A.ESTADO_CIVIL,T1.DESCRIPCION AS ESTADOCIVIL,";
            $query .= "CONVERT(VARCHAR, A.FNACIMIENTO, 120) AS FNACIMIENTO,A.CELULAR,A.TELEFONORES,A.TELEFONOLAB,A.EMAIL,A.DIRECCION,A.DIRECCIONLAB,A.CIUDAD,C.NOMBRE AS NOMCIUDAD,";
            $query .= "A.IDBARRIO,A.IDADMINISTRADORA,T.RAZONSOCIAL, A.TIPOAFILIADO, T2.DESCRIPCION AS TIPOAFILIACION, A.NIVELSOCIOEC,";
            $query .= "D.NOMBRE AS DEPARTAMENTO, COALESCE(B.NOMBRE, '') AS BARRIO ";
            $query .= "FROM AFI A WITH (NOLOCK) LEFT JOIN TGEN T1 WITH (NOLOCK) ON T1.CODIGO=A.ESTADO_CIVIL AND T1.TABLA='AFI' AND T1.CAMPO='ESTADO_CIVIL' ";
            $query .= "LEFT JOIN TGEN T2 WITH (NOLOCK) ON T2.CODIGO=A.TIPOAFILIADO AND T2.TABLA='AFI' AND T2.CAMPO='TIPOAFILIADO' ";
            $query .= "LEFT JOIN CIU C WITH (NOLOCK) ON C.CIUDAD=A.CIUDAD LEFT JOIN TER T WITH (NOLOCK) ON T.IDTERCERO=A.IDADMINISTRADORA ";
            $query .= "LEFT JOIN DEP D ON D.DPTO=C.DPTO ";
            $query .= "LEFT JOIN CIUB B ON B.CIUDAD=A.IDBARRIO ";
            $query .= "WHERE A.IDAFILIADO =:idpaciente";

            $parametros = array(
                'idpaciente' => $idPaciente
            );

            $response = $this->db->executeQuerySelect($query, $parametros);
            
            return  $response;
        }

        /*
        # Retorna los registros de historia clínica del paciente # 25.01.2025 Dev. F. Berrocal Machado
        public function getRegistrosDeHistoriaClinica($query, $parametros) {
            $response = $this->db->executeQuerySelect($query, $parametros);
            return  $response;
        }
        */

        # Retorna los registros de historia clínica del paciente # 25.01.2025 Dev. F. Berrocal Machado
        public function getRegistrosDeHistoriaClinica($idPaciente) {
            $query = "";
            $query .= "SELECT H.CONSECUTIVO,H.CLASEPLANTILLA,M.DESCPLANTILLA,CONVERT(VARCHAR, H.FECHA, 120) AS FECHA,H.IDMEDICO,ME.NOMBRE,H.IDAFILIADO,";
            $query .= "H.NOADMISION,H.IDDX,D.DESCRIPCION AS DIAGNOSTICO,H.TIPODX,H.IMPRESO,H.EDAD,H.PROCEDENCIA,T1.DESCRIPCION AS DESCPROCEDE,H.CNSCITA,";
            $query .= "H.MPLID,H.IDSEDE,H.IDADMINISTRADORA "; // ,T.RAZONSOCIAL
            $query .= "FROM HCA H WITH (NOLOCK) JOIN MPL M WITH (NOLOCK) ON M.CLASEPLANTILLA=H.CLASEPLANTILLA "; 
            $query .= "JOIN MED ME WITH (NOLOCK) ON ME.IDMEDICO=H.IDMEDICO JOIN MDX D WITH (NOLOCK) ON D.IDDX=H.IDDX ";
            $query .= "JOIN TGEN T1 ON T1.CODIGO=H.PROCEDENCIA AND T1.TABLA='MPL' AND T1.CAMPO='AMBITO' ";
            // $query .= "JOIN TER T WITH (NOLOCK) ON T.IDTERCERO=H.IDADMINISTRADORA ";
            $query .= "WHERE H.ESTADO='Activa' AND H.IDAFILIADO =:idpaciente ";
            $query .= "ORDER BY H.FECHA DESC";

            $parametros = array(
                'idpaciente' => $idPaciente
            );

            $response = $this->db->executeQuerySelect($query, $parametros);

            return  $response;
        }

        /*
        # Retorna los registros de órdenes médicas (recetas) del paciente # 25.01.2025 Dev. F. Berrocal Machado
        public function getOrdenesMedicas($query, $parametros) {
            $response = $this->db->executeQuerySelect($query, $parametros);
            return  $response;
        }
        */

        # Retorna los registros de órdenes médicas (recetas) del paciente # 25.01.2025 Dev. F. Berrocal Machado
        public function getOrdenesMedicas($idPaciente) {
            $query = "";
            $query .= "SELECT A.IDAUT,A.NOAUT,CONVERT(VARCHAR,A.FECHA,120) AS FECHA,CONVERT(VARCHAR,A.FECHAVENCE,120) AS FECHAVENCE,A.IDAFILIADO,";
            $query .= "A.PREFIJO,P.NOM_PREFIJO,A.IDSEDE,A.TIPOAUTORIZACION,A.IDSOLICITANTE,M.NOMBRE,A.IDPROVEEDOR,A.ESTADO,A.AUTORIZADO,A.DXPPAL,";
            $query .= "D.DESCRIPCION AS DIAGNOSTICO,CONVERT(VARCHAR,A.FECHAGEN,120) AS FECHAGEN,A.CNSCITA ";
            $query .= "FROM AUT A WITH (NOLOCK) JOIN PRE P WITH (NOLOCK) ON P.PREFIJO=A.PREFIJO JOIN MED M WITH (NOLOCK) ON M.IDMEDICO=A.IDSOLICITANTE ";
            $query .= "LEFT JOIN MDX D WITH (NOLOCK) ON D.IDDX=A.DXPPAL WHERE A.IDAFILIADO =:idpaciente";

            $parametros = array(
                'idpaciente' => $idPaciente
            );

            $response = $this->db->executeQuerySelect($query, $parametros);

            if ( is_array($response) && $response["results"] != 0 ) {
                
                $arrOrdenes   = $response["results"];
                $registrosAut = [];

                foreach ($arrOrdenes as $row) {
                    $numeroOrden  = $row['IDAUT'];
                    $detalleOrden = $this->getDetallesOrdenesMedicas($numeroOrden);

                    $registrosAut[] = array (
                        "IDAUT"             => $row['IDAUT'],
                        "NOAUT"             => $row['NOAUT'],
                        "FECHA"             => $row['FECHA'],
                        "FECHAVENCE"        => $row['FECHAVENCE'],
                        "IDAFILIADO"        => $row['IDAFILIADO'],
                        "PREFIJO"           => $row['PREFIJO'],
                        "NOM_PREFIJO"       => $row['NOM_PREFIJO'],
                        "IDSEDE"            => $row['IDSEDE'],
                        "TIPOAUTORIZACION"  => $row['TIPOAUTORIZACION'],
                        "IDSOLICITANTE"     => $row['IDSOLICITANTE'],
                        "NOMBRE"            => $row['NOMBRE'],
                        "IDPROVEEDOR"       => $row['IDPROVEEDOR'],
                        "ESTADO"            => $row['ESTADO'],
                        "AUTORIZADO"        => $row['AUTORIZADO'],
                        "DXPPAL"            => $row['DXPPAL'],
                        "DIAGNOSTICO"       => $row['DIAGNOSTICO'],
                        "FECHAGEN"          => $row['FECHAGEN'],
                        "CNSCITA"           => $row['CNSCITA'],
                        "Detalles"          => $detalleOrden
                    );
                }

                if ( count($registrosAut) > 0 ) {
                    $response = array(
                        "results" => $registrosAut
                    );
                }
            }

            return  $response;
        }

        # Retorna los servicios o tecnologías ordenadas al paciente # 25.01.2025 Dev. F. Berrocal Machado
        public function getDetallesOrdenesMedicas($numeroOrdenMedica) {

            $query = "";
            $query .= "SELECT A.IDAUT,A.NO_ITEM,A.IDSERVICIO,S.DESCSERVICIO,A.CANTIDAD,A.VALOR,A.VALORCOPAGO,A.VALORCOPAGOCOSTO,A.VALOREXCEDENTE,";
            $query .= "A.VALORTOTALCOSTO,A.IMPRESO,A.AUTORIZADO,A.COMENTARIOS,A.PCOBERTURA,A.CCOSTO,A.MARCAPAGO,A.ESDELAB,A.ENLAB,A.IDTERCEROCA,";
            $query .= "A.FACTURADA,A.AQUIENCOBRO,A.MARCACOPAGOORDEN,A.VALORPROV,A.PCOSTO,A.DOSISAPL,A.AUTDID,A.CANTIDAD_AUTORIZADA,A.REQAUTORIZACION,";
            $query .= "A.FACTURABLE,A.NOPOS,A.TIPOCONTRATO,A.KNEGID,A.IDTARIFA,A.ITEM_TAR,A.COBRARA,A.ACCION,A.NOCOBRABLE,A.KCNTRID,A.REALIZADO,";
            $query .= "A.LABO_ORDID FROM AUTD A WITH (NOLOCK) JOIN SER S WITH (NOLOCK) ON S.IDSERVICIO=A.IDSERVICIO WHERE A.IDAUT =:numorden";

            $parametros = array(
                'numorden' => $numeroOrdenMedica
            );

            $response = $this->db->executeQuerySelect($query, $parametros);

            return  $response;
        }

    }

?>
