class PacientesProvider {

    constructor () {}

    async renderInformacionClinicaPaciente(idPaciente, citaNumero, feAtencion) {
        $.post(
            URL2 + "Pacientes/renderInformacionClinicaPaciente",
            { idpaciente: idPaciente },
            (response) => {
                try {
                    const historiaGrid      = document.getElementById('registrosHca');
                    historiaGrid.innerHTML  = '';

                    const ordenesGrid       = document.getElementById('registrosAut');
                    ordenesGrid.innerHTML   = '';

                    var datosPaciente = JSON.parse(response);
                    
                    if ( datosPaciente.code === 201 ) {
                        // Datos del paciente
                        if (datosPaciente.infoafiliado) {
                            let nombrePaciente = "";
                            nombrePaciente     = datosPaciente.infoafiliado.results[0].PAPELLIDO + " " + datosPaciente.infoafiliado.results[0].SAPELLIDO;
                            nombrePaciente     += " " + datosPaciente.infoafiliado.results[0].PNOMBRE + " " + datosPaciente.infoafiliado.results[0].SNOMBRE;

                            const fnacimiento = datosPaciente.infoafiliado.results[0].FNACIMIENTO.substring(0, 10);
                            let fecha         = feAtencion;

                            document.getElementById('infopac-id').innerHTML     = datosPaciente.infoafiliado.results[0].IDAFILIADO;
                            document.getElementById('infopac-name').innerHTML   = nombrePaciente;
                            document.getElementById('infopac-doc').innerHTML    = datosPaciente.infoafiliado.results[0].DOCIDAFILIADO;
                            document.getElementById('infopac-tel').innerHTML    = datosPaciente.infoafiliado.results[0].TELEFONORES;
                            document.getElementById('infopac-birth').innerHTML  = fnacimiento;
                            document.getElementById('infopac-age').innerHTML    = calcularEdad(fnacimiento) + " años";
                            document.getElementById('infopac-aten').innerHTML   = fecha;
                            document.getElementById('infopac-eps').innerHTML    = datosPaciente.infoafiliado.results[0].RAZONSOCIAL;
                            document.getElementById('infopac-cont').innerHTML   = "Información del contrato";
                            document.getElementById('infopac-cita').innerHTML   = citaNumero;

                            const infopaciente = { 
                                id:          datosPaciente.infoafiliado.results[0].IDAFILIADO,
                                nombre:      nombrePaciente,
                                documento:   datosPaciente.infoafiliado.results[0].DOCIDAFILIADO,
                                telefonores: datosPaciente.infoafiliado.results[0].TELEFONORES,
                                fnacimineto: fnacimiento,
                                edad:        calcularEdad(fnacimiento) + " años",
                                fechaact:    fecha,
                                razonsocial: datosPaciente.infoafiliado.results[0].RAZONSOCIAL,
                                contrato:    "Información del contrato",
                                numerocita:  citaNumero
                            };

                            if (localStorage.getItem("infopaciente")) {
                                localStorage.removeItem("infopaciente");
                            }
                            
                            localStorage.setItem("infopaciente", JSON.stringify(infopaciente));

                            // Información de perfil
                            document.getElementById('perfil-name').innerHTML 	 = datosPaciente.infoafiliado.results[0].PNOMBRE + " " + datosPaciente.infoafiliado.results[0].SNOMBRE;
                            document.getElementById('perfil-lastname').innerHTML = datosPaciente.infoafiliado.results[0].PAPELLIDO + " " + datosPaciente.infoafiliado.results[0].SAPELLIDO;
                            document.getElementById('perfil-typedoc').innerHTML  = datosPaciente.infoafiliado.results[0].TIPO_DOC;
                            document.getElementById('perfil-numdoc').innerHTML   = datosPaciente.infoafiliado.results[0].DOCIDAFILIADO;
                            document.getElementById('perfil-birth').innerHTML 	 = fnacimiento;
                            document.getElementById('perfil-age').innerHTML 	 = calcularEdad(fnacimiento) + " años";
                            document.getElementById('perfil-sex').innerHTML 	 = datosPaciente.infoafiliado.results[0].SEXO;	
                            document.getElementById('perfil-ecivil').innerHTML 	 = datosPaciente.infoafiliado.results[0].ESTADOCIVIL;
                            document.getElementById('perfil-phone').innerHTML 	 = datosPaciente.infoafiliado.results[0].TELEFONORES;
                            document.getElementById('perfil-wphone').innerHTML   = datosPaciente.infoafiliado.results[0].TELEFONOLAB;
                            document.getElementById('perfil-address').innerHTML  = datosPaciente.infoafiliado.results[0].DIRECCION;
                            document.getElementById('perfil-waddress').innerHTML = datosPaciente.infoafiliado.results[0].DIRECCIONLAB;
                            document.getElementById('perfil-depto').innerHTML    = datosPaciente.infoafiliado.results[0].DEPARTAMENTO;
                            document.getElementById('perfil-city').innerHTML 	 = datosPaciente.infoafiliado.results[0].NOMCIUDAD;
                            document.getElementById('perfil-local').innerHTML 	 = datosPaciente.infoafiliado.results[0].BARRIO;
                            document.getElementById('perfil-email').innerHTML 	 = datosPaciente.infoafiliado.results[0].EMAIL;
                            document.getElementById('perfil-eps').innerHTML 	 = datosPaciente.infoafiliado.results[0].RAZONSOCIAL;
                            document.getElementById('perfil-typeafi').innerHTML  = datosPaciente.infoafiliado.results[0].TIPOAFILIACION;
                            document.getElementById('perfil-levelafi').innerHTML = datosPaciente.infoafiliado.results[0].NIVELSOCIOEC;
                        }

                        // Regsitros de historia clínica
                        if (datosPaciente.hclinica) {
                            document.getElementById('hcaMessage').innerHTML = "";

                            datosPaciente.hclinica.results.forEach(item => {
                                const row = document.createElement('tr');
                                
                                row.innerHTML = `
                                    <td>${item.CONSECUTIVO}</td>
                                    <td>${item.CLASEPLANTILLA}</td>
                                    <td>${item.DESCPLANTILLA}</td>
                                    <td>${item.FECHA}</td>
                                    <td>${item.TIPODX}</td>
                                    <td>${item.IDDX}</td>
                                    <td>${item.DIAGNOSTICO}</td>
                                    <td>${item.NOMBRE}</td>
                                    <td>
                                        <button class="btn btn-light btn-sm me-2" onclick="" title="Editar">
                                            <i class="fa-solid fa-stethoscope" style="color:blue;"></i>
                                        </button>
                                        <button class="btn btn-light btn-sm" onclick="" title="Visualizar">
                                            <i class="fa-solid fa-circle-xmark" style="color:red;"></i>
                                        </button>
                                    </td>
                                `;

                                historiaGrid.appendChild(row);
                            });
                        } else {
                            document.getElementById('hcaMessage').innerHTML = "No existen registros de Historia Cl&iacute;nica";
                        }

                        // Registros Ordenes Médicas
                        if (datosPaciente.ordenes) {
                            document.getElementById('autMessage').innerHTML = "";

                            datosPaciente.ordenes.results.forEach(item => {
                                const rowmain       = document.createElement('tr');
                                const rowdetail     = document.createElement('tr');
                                rowmain.className   = "main-row";
                                rowdetail.className = "detail-row";

                                // <i class="fa-solid fa-chevron-down toggle text-primary"></i>
                                
                                rowmain.innerHTML = `
                                    <td>${item.IDAUT}</td>
                                    <td>${item.FECHA}</td>
                                    <td>${item.PREFIJO}</td>
                                    <td>${item.NOM_PREFIJO}</td>
                                    <td>${item.AUTORIZADO}</td>
                                    <td>
                                        <span class="toggle">Mostrar Detalles</span>
                                    </td>
                                     <td>
                                        <button class="btn btn-light btn-sm me-2" onclick="" title="Editar">
                                            <i class="fa-solid fa-pencil" style="color:blue;"></i>
                                        </button>
                                        <button class="btn btn-light btn-sm" onclick="" title="Visualizar">
                                            <i class="fa-solid fa-eye" style="color:red;"></i>
                                        </button>
                                        <button class="btn btn-light btn-sm" onclick="" title="Imprimir">
                                            <i class="fa-solid fa-print" style="color:blue;"></i>
                                        </button>
                                    </td>
                                `;
                                
                                item.Detalles.results.forEach(detail => {
                                    rowdetail.innerHTML = `
                                        <td colspan="7">
                                            <table class="table table-sm table-bordered bg-white">
                                                <thead class="table-light">
                                                    <tr>
                                                        <th>No. Item</th>
                                                        <th>ID Servicio</th>
                                                        <th>Servicio</th>
                                                        <th>Cantidad</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>${detail.NO_ITEM}</td>
                                                        <td>${detail.IDSERVICIO}</td>
                                                        <td>${detail.DESCSERVICIO}</td>
                                                        <td>${detail.CANTIDAD}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    `;
                                });
                                ordenesGrid.appendChild(rowmain);
                                ordenesGrid.appendChild(rowdetail);
                            });
                            
                        } else {
                            document.getElementById('autMessage').innerHTML = "No existen registros de Ordenes M&eacute;dicas";
                        }

                    } else {
                        document.getElementById('pacienteMessage').innerHTML = datosPaciente.message
                    }
                } catch (error) {
                    document.getElementById('pacienteMessage').innerHTML = error;
                }

            }
        );

    }
}
