<?php 
	class Querymanager {
		private $pdo;
		private $lastId;

		public function __construct($HOST, $USER, $PASS, $DB) {
			try {
				// CONEXION CON SQL SEVER
				$this->pdo = new PDO('sqlsrv:Server='.$HOST.';Database='.$DB.';',$USER,$PASS,
				[PDO::ATTR_EMULATE_PREPARES => false,PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
				);

				/* // CONEXION CON MYSQL MARIADB
				$this->pdo = new PDO('mysql:host=localhost;dbname='.$DB.';charset=utf8',$USER,$PASS,
				[PDO::ATTR_EMULATE_PREPARES => false,PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
				);
				*/
			} catch (PDOException $e) {
				print "Error: " . $e->getMessage();
			}
		}

		# Read - Select
		public function select1($campos, $tabla, $condicion, $parametros) {
			try {

				$where = $condicion ?? "";
				$query = "SELECT " . $campos . " FROM " . $tabla . $where;
				$sth   = $this->pdo->prepare($query);
				$sth->execute($parametros);

				$response = $sth->fetchALL(PDO::FETCH_ASSOC);

				return array("results" => $response);
				
			} catch (PDOException $e) {
				print "Error: " . $e->getMessage();  // En caso de error se setorna el mensaje de error
			}
			
			$pdo = null;
		}

		# Create - Insert
		public function insert ($tabla, $params, $values) {
			try {
				$query = "INSERT INTO " . $tabla . $values;
				$sth   = $this->pdo->prepare($query);
				$sth->execute((array)$params);
				$this->lastId = $this->pdo->lastInsertId();

				return true;

			} catch (PDOException $e) {
				return $e->getMessage();
			}

			$pdo = null;
		}
		
		# Update
		public function update ($tabla, $params, $value, $where) {
			try {
				$query = "UPDATE " . $tabla . " SET " . $value . $where;
				$sth   = $this->pdo->prepare($query);
				$sth->execute((array)$params);

				return true;

			} catch (PDOException $e) {
				return $e->getMessage();	
			}

			$pdo = null;
		}

		# Delete
		public function delete ($tabla, $where, $params) {
			try {
				$query = "DELETE FROM " . $tabla . $where;
				$sth   = $this->pdo->prepare($query);
				$sth->execute((array)$params);
				return true;

			} catch (PDOException $e) {
				return $e->getMessage();	
			}

			$pdo = null;
		}
		
		# Ejecutar consultas tipo select
		public function executeQuerySelect($query, $parametros) {
			try {
				if ($query != "") {
					$sth   = $this->pdo->prepare($query);
					$sth->execute($parametros);
					$response = $sth->fetchALL(PDO::FETCH_ASSOC);
					return array("results" => $response);
				} else {
					return array("results" => 0);
				}
			} catch (PDOException $e) {
				return "Error: " . $e->getMessage();
			}
			
			$pdo = null;
		}

		# Obtener el ultimo ID
		public function getLastId () {
			return $this->lastId;
		}

	}
?>
