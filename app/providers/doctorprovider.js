class DoctorProvider {

    constructor () {}

    // LISTADO DE AGENDA MEDICO
    // Developed-by: fberrocalmachado - Tue Jan 07, 2024
    listarAgendaMedica() {
        // OBS: Id sede, se debe seleccionar en el login y cargar en el Local Storage
        let user = JSON.parse(localStorage.getItem("user"));

        if (0 < user.USUSUID && user.IDMEDICO) {
            
            var selectedDate = new Date();

            const filterDate = document.getElementById('filterDate');
            selectedDate     = filterDate.valueAsDate

            let fehcaIni = fechaMotor(selectedDate, "I");
            let fehcaFin = fechaMotor(selectedDate, "F");

            $.post(
                URL2 + "Medicos/renderGridAgendaMedica",
                { idsede: '01', idmedico: user.IDMEDICO, fechaini: fehcaIni, fechafin: fehcaFin },
                (response) => {
                    try {
                        const dataGrid     = document.getElementById('agendaGrid');
                        dataGrid.innerHTML = '';
                        var item = JSON.parse(response);

                        if (item.code === 201) {
                            if (item.citas) {
                                // console.log(item.citas.results[0].CONSECUTIVO);
                                item.citas.results.forEach(item => {
                                    const row = document.createElement('tr');
                                    let telAviso = item.TELEFONOAVISO != null ? item.TELEFONOAVISO : "No";

                                    row.innerHTML = `
                                        <td>*</td>
                                        <td>${item.CONSECUTIVO}</td>
                                        <td>${item.FECHA}</td>
                                        <td>${item.IDAFILIADO}</td>
                                        <td>${item.NOMAFILIADO}</td>
                                        <td>Tipo Contrato</td>
                                        <td>${item.TIPOCITA}</td>
                                        <td>${item.CLASEORDEN}</td>
                                        <td>${telAviso}</td>
                                        <td>
                                            <button class="btn btn-light btn-sm me-2" onclick="atenderCita('${item.CONSECUTIVO}','${item.IDAFILIADO}')" title="Atender cita">
                                                <i class="fa-solid fa-stethoscope" style="color:blue;"></i>
                                            </button>
                                            <button class="btn btn-light btn-sm" onclick="anularCita('${item.CONSECUTIVO}','${item.IDAFILIADO}')" title="No atendida">
                                                <i class="fa-regular fa-circle-xmark" style="color:red;"></i>
                                            </button>
                                        </td>
                                    `;

                                    dataGrid.appendChild(row);
                                });

                            } else {
                                document.getElementById('agendaMessage').innerHTML = "No existen registros de citas";
                            }

                        } else {
                            document.getElementById('agendaMessage').innerHTML = item.message
                        }

                    } catch (error) {
                        document.getElementById('agendaMessage').innerHTML = error;
                    }
                   
                }
            );
        }

    }

    /* Mostrar en pantalla información del paciente que se está atendiendo */
    restablecerPaciente(consecutivoCita, idPaciente, fechaAtencion) {
        window.location.href = URL2 + "Medicos/atenderpaciente/?cnscit=" + consecutivoCita + "&idpac=" + idPaciente + "&fatencion=" + fechaAtencion;
    }

}
