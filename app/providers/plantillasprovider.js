class PlantillasProvider {

    constructor () {
        this.current = 0;
    }

    /* Procedure getPlantillas(ambito): Retorna un listado de plantillas filtrado por su 
       ámbito (CE - Consulta Externa; QX - Urgencias) */

    getPlantillas(ambito) {
        $.post(
            URL2 + "Mpl/listadoPlantillasAmbito",
            { ambitop: ambito },
            (response) => {
                try {
                    let count = 1;
                    let items = JSON.parse(response);
                    document.getElementById('lista-plt').options[0] = new Option("Seleccione un formulario de Historia Clínica",0);

                    if (items.code === 201) {
                        if (0 < items.plantillas.results.length) {
                            for (let i = 0; i < items.plantillas.results.length; i++) {
                                document.getElementById('lista-plt').options[count] = new Option(
                                    items.plantillas.results[i].DESCPLANTILLA + " (" + items.plantillas.results[i].CLASEPLANTILLA + ")",
                                    items.plantillas.results[i].MPLID
                                ); 
                                
                                count++;        // $('select').formSelect(); // Re-inicializar los select de la página
                            }
                        }
                    } else {
                        throw new Error(message);
                    } 
                } catch (error) {
                    console.error("Error:", error.message);
                }
            }
        );
    }

    /* Procedure crearVistaPlantillaHC(parametros) */

    crearVistaPlantillaHC(parametros) {
        $.post(
            URL2 + "Mpl/getConfiguracionPlantilla",
            { idplantilla: parametros[11] },
            (response) => {

                var respuesta = JSON.parse(response);

                if (respuesta.code === 201) {

                    const medicalRecordGrid = document.getElementById("vista-plantilla");   // const medicalRecordGrid = document.querySelector(".registro-clinico");
                    const maxNumberCols     = NUMCOLSVISTAPLANTILLA;
                    const maxNumberRows     = NUMROWSVISTAPLANTILLA;
                    let formClinicalRecord  = "";
                    let firstControl 		= "";
                    let controlName 		= "";
                    let currentRow 	        = 0;
                    let registerRow         = 0;
                    let registerCol         = 0;
                    let rowCount 	        = 0;
                    let columnsCount        = 0;
                    let registerPageNumber  = "";
                    let currentPageNumber   = "";
                    let pageCounter         = 0;
                    let finalizedRow        = 0;
                    let initProccess        = 1;
                    this.current 	        = 1;
                    let estilosCampo        = "";
                    let claseControl        = "";
                    let codigo_registro     = "";
                    var arrayCompFechaAte; 

                    const plantilla         = respuesta.infoplantilla.results;
                    const paginas           = respuesta.paginas.results;
                    const campos            = respuesta.campos.results;

                    var fe_Atencion         = parametros[6];
                    var idpacienteactual    = parametros[0];
                    let claseplantilla      = plantilla[0].CLASEPLANTILLA;
                    let numberOfPagesHC     = plantilla[0].NUMEROPAGINAS;
                    let initialPageNumber   = paginas[0].PAGINANUMERO;

                    if (campos.length > 0) {

                        arrayCompFechaAte  = fe_Atencion.split("-");
                        codigo_registro    = arrayCompFechaAte.join("");

                        abrirDatabaseLocal();

                        formClinicalRecord = '<div id="hcpages">';
                        formClinicalRecord += '<form role="form" id="hca_form">';

                        for (var field of campos) {
                            registerRow        = field.POSX;
                            registerCol        = field.POSY;
                            registerPageNumber = field.PAGINANUMERO;

                            if (registerPageNumber === initialPageNumber && initProccess == 1) {
                                pageCounter = 1;
                                
                                formClinicalRecord += '<fieldset class="step slider-page active" id="page'+pageCounter+'">';
                                formClinicalRecord += '<div id="pagina_'+pageCounter+'" class="grid-layout-plantilla">';
                                
                                initProccess = 0;
                            } else if (registerPageNumber != currentPageNumber) {
                                formClinicalRecord += '</div>';
                                formClinicalRecord += '</fieldset>';
                                
                                pageCounter++;
                                columnsCount = 1;
                                currentRow   = 0;
                                rowCount     = 0;

                                formClinicalRecord += '<fieldset class="step slider-page" id="page'+pageCounter+'">';
                                formClinicalRecord += '<div id="pagina_'+pageCounter+'" class="grid-layout-plantilla">';
                            }

                            switch (field.TIPO_CAMPO.trim()) {
                                case "Titulo":
                                    estilosCampo = 'grid-row:' + registerRow + ';grid-column:' + registerCol + ';';
                                    
                                    controlName = "STC_" + field.CAMPO.trim() + "_" + field.SECUENCIA + "_" + field.MPLDID + "_" + codigo_registro;

                                    formClinicalRecord += '<legend name="' + controlName + '" id="' + controlName + '" class="campo__titulo" style="' + estilosCampo + '">';
                                    formClinicalRecord += field.DESCCAMPO.trim() + '</legend>';
                                    
                                    columnsCount = maxNumberCols;

                                    break;

                                case "Subtitulo":
                                    estilosCampo = 'grid-row:' + registerRow + ';grid-column:' + registerCol + ';';
                                    
                                    controlName = "STC_" + field.CAMPO.trim() + "_" + field.SECUENCIA + "_" + field.MPLDID + "_" + codigo_registro;

                                    formClinicalRecord += '<label name="' + controlName + '" id="' + controlName + '" class="campo__subtitulo" style="' + estilosCampo + '">';
                                    formClinicalRecord += field.DESCCAMPO.trim() + '</label>';
                                    
                                    columnsCount = maxNumberCols;

                                    break;

                                case "Alfanumerico":
                                    estilosCampo = 'grid-row:' + registerRow + ';grid-column:' + registerCol + ';';
                                    claseControl = 'class="campo__alfanumerico"';
                                    
                                    controlName  = "EDT_" + field.CAMPO.trim() + "_" + field.SECUENCIA + "_" + field.MPLDID + "_" + codigo_registro;

                                    formClinicalRecord += '<div class="form-group" style="' + estilosCampo + '">';
                                        formClinicalRecord += '<label class="campo__label" for="' + controlName + '">'+ field.DESCCAMPO.trim() + ':</label>';
                                        formClinicalRecord += '<input type="text" name="' + controlName + '" id="' + controlName + '" ' + claseControl + ' value=""  ';
                                        formClinicalRecord += 'onblur="guardarRegistroLocal(\''+idpacienteactual+'\', \''+claseplantilla+'\', this.id, \'Alfanumerico\', this.value)" ';
                                        formClinicalRecord += 'onfocus="" />';
                                    formClinicalRecord += '</div>';

                                    if (firstControl == "") {
                                        firstControl = controlName;
                                    }

                                    break;

                                case "Numerico":
                                    estilosCampo = 'grid-row:' + registerRow + ';grid-column:' + registerCol + ';';
                                    claseControl = 'class="campo__numerico"';
                                    
                                    controlName  = "EDT_" + field.CAMPO.trim() + "_" + field.SECUENCIA + "_" + field.MPLDID + "_" + codigo_registro;

                                    formClinicalRecord += '<div class="form-group" style="' + estilosCampo + '">';
                                        formClinicalRecord += '<label class="campo__label" for="' + controlName + '">'+ field.DESCCAMPO.trim() + ':</label>';
                                        formClinicalRecord += '<input type="number" ' + claseControl + ' name="' + controlName + '" ';
                                        formClinicalRecord += 'id="' + controlName + '" value="" ';
                                        formClinicalRecord += 'onblur="guardarRegistroLocal(\''+idpacienteactual+'\', \''+claseplantilla+'\', this.id, \'Numerico\', this.value)" ';
                                        formClinicalRecord += 'onfocus="" />';
                                    formClinicalRecord += '</div>';

                                    if (firstControl == "") {
                                        firstControl = controlName;
                                    }

                                    break;

                                case "Memo":
                                    estilosCampo = 'grid-row:' + registerRow + ';grid-column:' + registerCol + ';';
                                    claseControl = 'class="campo__memo"'; // claseControl = 'class="campo__memo--l"'
                                    
                                    controlName  = "TEXT_" + field.CAMPO.trim() + "_" + field.SECUENCIA + "_" + field.MPLDID + "_" + codigo_registro;

                                    /* Nota: ajusto el ancho del campo según la configuración */
                                    if (field.ANCHO == 2) {
                                        estilosCampo = 'grid-row:' + registerRow + ';grid-column:' + registerCol + ' / span 4;';
                                    } else if (field.ANCHO == 3) {
                                        estilosCampo = 'grid-row:' + registerRow + ';grid-column:' + registerCol + ' / span 8;';
                                    } else {
                                        estilosCampo = 'grid-row:' + registerRow + ';grid-column:' + registerCol + ';';
                                    }

                                    formClinicalRecord += '<div class="form-group" style="'+estilosCampo+'">';
                                        formClinicalRecord += '<label class="campo__label" for="'+controlName+'">'+ field.DESCCAMPO.trim() + ':</label>';
                                        formClinicalRecord += '<textarea '+claseControl+' name="'+controlName+'" id="'+controlName+'" ';
                                        formClinicalRecord += 'onblur="guardarRegistroLocal(\''+idpacienteactual+'\', \''+claseplantilla+'\', this.id, \'Memo\', this.value)" onfocus="">';
                                        formClinicalRecord += '</textarea>';
                                    formClinicalRecord += '</div>';

                                    if (firstControl == "") {
                                        firstControl = controlName;
                                    }

                                    break;

                                case "Fecha":
                                    estilosCampo = 'grid-row:' + registerRow + ';grid-column:' + registerCol + ';';
                                    claseControl = 'class="campo__fecha"';
                                    
                                    controlName  = "EDT_" + field.CAMPO.trim() + "_" + field.SECUENCIA + "_" + field.MPLDID + "_" + codigo_registro;
                                    
                                    formClinicalRecord += '<div class="form-group" style="'+estilosCampo+'">';
                                        formClinicalRecord += '<label class="campo__label" for="'+controlName+'">'+ field.DESCCAMPO.trim() + ':</label>';
                                        formClinicalRecord += '<input type="date" ' + claseControl + ' name="' + controlName + '" id="' + controlName + '" value="" ';
                                        formClinicalRecord += 'onblur="guardarRegistroLocal(\''+idpacienteactual+'\', \''+claseplantilla+'\', this.id, \'Fecha\', this.value)" ';
                                        formClinicalRecord += 'onfocus="" />';
                                    formClinicalRecord += '</div>';

                                    if (firstControl == "") {
                                        firstControl = controlName;
                                    }

                                    break;
                                
                                case "Hora":
                                    estilosCampo = 'grid-row:' + registerRow + ';grid-column:' + registerCol + ';';
                                    claseControl = 'class="campo__time"';
                                    
                                    controlName  = "EDT_" + field.CAMPO.trim() + "_" + field.SECUENCIA + "_" + field.MPLDID + "_" + codigo_registro;

                                    formClinicalRecord += '<div class="form-group" style="' + estilosCampo + '">';
                                        formClinicalRecord += '<label class="campo__label" for="' + controlName+'">' + field.DESCCAMPO.trim() + ':</label>';
                                        formClinicalRecord += '<input type="time" ' + claseControl + ' name="' + controlName+'" id="' + controlName + '" value="" ';
                                        formClinicalRecord += 'onblur="guardarRegistroLocal(\''+idpacienteactual+'\', \''+claseplantilla+'\', this.id, \'Hora\', this.value)" ';
                                        formClinicalRecord += 'onfocus="" />';
                                    formClinicalRecord += '</div>';

                                    if (firstControl == "") {
                                        firstControl = controlName;
                                    }

                                    break;
                                
                                case "Fechahora":
                                    // Ajuste: Permitir establecer rangos para los campos de tipo feccha hora
                                    // <input type="datetime-local" id="meeting-time" name="meeting-time" value="2018-06-12T19:30" 
                                    // min="2018-06-07T00:00" max="2018-06-14T00:00" /> 

                                    estilosCampo = 'grid-row:' + registerRow + ';grid-column:' + registerCol + ';';
                                    claseControl = 'class="campo__fechahora"';
                                    
                                    controlName  = "EDT_" + field.CAMPO.trim() + "_" + field.SECUENCIA + "_" + field.MPLDID + "_" + codigo_registro;

                                    formClinicalRecord += '<div class="form-group" style="' + estilosCampo + '">';
                                        formClinicalRecord += '<label class="campo__label" for="' + controlName + '">' + field.DESCCAMPO.trim() + ':</label>';
                                        formClinicalRecord += '<input type="datetime-local" ' + claseControl + ' name="' + controlName + '" id="' + controlName + '" value="" ';
                                        formClinicalRecord += 'onblur="guardarRegistroLocal(\''+idpacienteactual+'\', \''+claseplantilla+'\', this.id, \'Fechahora\', this.value)" ';
                                        formClinicalRecord += 'onfocus="" />';
                                    formClinicalRecord += '</div>';

                                    if (firstControl == "") {
                                        firstControl = controlName;
                                    }

                                    break;

                                case "Lista":
                                    estilosCampo = 'grid-row:' + registerRow + ';grid-column:' + registerCol + ';';
                                    claseControl = 'class="campo__lista"';
                                    
                                    controlName  = "COMBO_" + field.CAMPO.trim() + "_" + field.SECUENCIA + "_" + field.MPLDID + "_" + codigo_registro;

                                    /* Nota: ajusto el ancho del campo según la configuración */
                                    if (field.ANCHO == 2) {
                                        estilosCampo = 'grid-row:' + registerRow + ';grid-column:' + registerCol + ' / span 4;';
                                    } else if (field.ANCHO == 3) {
                                        estilosCampo = 'grid-row:' + registerRow + ';grid-column:' + registerCol + ' / span 8;';
                                    } else {
                                        estilosCampo = 'grid-row:' + registerRow + ';grid-column:' + registerCol + ';';
                                    }

                                    formClinicalRecord += '<div class="form-group" style="' + estilosCampo + '">';
                                        formClinicalRecord += '<label class="campo__label" for="' + controlName + '">' + field.DESCCAMPO.trim() + ':</label>';
                                        formClinicalRecord += '<select name="' + controlName + '" id="' + controlName + '" ' + claseControl;
                                        formClinicalRecord += ' onChange="guardarRegistroLocal(\''+idpacienteactual+'\', \''+claseplantilla+'\', this.id, \'Lista\', this.value)">';

                                            let sel = '';
                                            formClinicalRecord += '<option value=""></option>';
                                            
                                            field.valoreslista.results.forEach(opcion => {
                                                formClinicalRecord += '<option value="' + opcion.VALORLISTA + '" ' + sel + ' >' + opcion.VALORLISTA + '</option>';
                                            });

                                        formClinicalRecord += '</select>';
                                    formClinicalRecord += '</div>';

                                    if (firstControl == "") {
                                        firstControl = controlName;
                                    }

                                    break;

                                case "MultiCheck":

                                    let checksRow;
                                    let checksCol;
                                    let numeroCheck;
                                    let divCerrado;
                                    let estilosCheck;
                                    
                                    checksRow       = registerRow;
                                    checksCol       = (registerCol + 1);
                                    numeroCheck     = 0;
                                    estilosCheck    = "";
                                    estilosCampo    = 'grid-row:' + registerRow + ';grid-column:' + registerCol + ';';
                                    controlName     = "CBOX_" + field.CAMPO.trim() + "_" + field.SECUENCIA + "_" + field.MPLDID + "_" + codigo_registro;

                                    formClinicalRecord += '<div class="form-group" style="' + estilosCampo + '">';
                                        formClinicalRecord += '<label class="labelMemo" for="">' + field.DESCCAMPO.trim() + ':</label>';
                                    formClinicalRecord += '</div>';

                                    if ( field.valoreslista.results ) {
                                        formClinicalRecord += '<div class="form-group" style="' + estilosCampo + '">';

                                        field.valoreslista.results.forEach(opcion => {
                                            estilosCheck  = 'grid-row:' + checksRow + ';grid-column:' + checksCol + ';';

                                            numeroCheck++;
                                            divCerrado = 0;

                                            formClinicalRecord += '<div class="form-group" style="' + estilosCheck + '">';
                                                formClinicalRecord += '<label>';
                                                    formClinicalRecord += '<input type="checkbox" name="' + controlName + '" id="' + (controlName + "_" + numeroCheck) + '"';
                                                    formClinicalRecord += ' value="' + opcion.VALORLISTA + '" ';
                                                    formClinicalRecord += 'onClick="guardarRegistroLocal(\''+idpacienteactual+'\', \''+claseplantilla+'\', this.id, \'MultiCheck\', this.value)"';
                                                    formClinicalRecord += '> ' + opcion.VALORLISTA;
                                                formClinicalRecord += '</label>';
                                            formClinicalRecord += '</div>';

                                            checksCol++;

                                            if (checksCol > 8) {
                                                checksRow++;
                                                checksCol = (registerCol + 1);
                                            }
                                        });
                                    }

                                    if (firstControl == "") {
                                        firstControl = controlName;
                                    }

                                    break;
                            }

                            currentRow        = registerRow;
                            currentPageNumber = registerPageNumber;

                        }

                        // Document completion:
                        formClinicalRecord += '</div>';
                        formClinicalRecord += '</fieldset>';
                        formClinicalRecord += '</form>';
                        formClinicalRecord += '</div>';

                        // Barra de navegación páginas de plantilla
                        formClinicalRecord += '<div id="navigation">';
	                    formClinicalRecord += '<ul>';

                            for (let p=0; p < numberOfPagesHC; p++) {
                                if (p==0) {
                                    formClinicalRecord += '<li id="'+(p+1)+'" class="selected"><a id="'+(p+1)+'" href="#">' + paginas[p].TITULO + '</a></li>';
                                } else {
                                    formClinicalRecord += '<li id="'+(p+1)+'"><a id="'+(p+1)+'" href="#">' + paginas[p].TITULO + '</a></li>';
                                }
                            }

                        formClinicalRecord += '</ul>';
	                    formClinicalRecord += '</div>';
                        
                        medicalRecordGrid.innerHTML = formClinicalRecord;
	                    
                        this.funcionalidadPestannas();
                        const formPages = document.querySelectorAll(".step");
                        showPage(this.current, formPages);

                    } else {
                        Swal.fire({
                            title:"Info!",
                            text: "No existen campos de Plantilla de Historia Clínica!",
                            icon: "info"
                        });
                    }

                } else {
                    Swal.fire({
                        title: "Error!",
                        text: "Error cargando la Plantilla: " + respuesta.message,
                        icon: "success"
                    });
                }
            }
        );
    }

    /* Procedure goVistaCreacionRegistrosClinicos(consecutivoCita, idPaciente) Dev 
       Francisco Berrocal Machado - 14.02.2025 */

    goVistaCreacionRegistrosClinicos(consecutivoCita, idPaciente) {
        // console.log("Cita: " + consecutivoCita, "Paciente: " + idPaciente);
        window.location.href = URL2 + "Mpl/renderVistaPlantillas&cnscit=" + consecutivoCita + "&idpac=" + idPaciente;
    }

    /* Procedure funcionalidadPestannas (Asigna funcionalidad a pestañas de Plantilla 
       de Historia Clínica) Dev Francisco Berrocal Machado - 02.04.2025 */

    funcionalidadPestannas() {
        const linksNavegacion = document.querySelectorAll("#navigation a");

        for(let x=0; x<linksNavegacion.length; x++) {
            linksNavegacion[x].addEventListener( "click", function(e) {
                var currentPage = this;
                this.current    = parseInt(currentPage.parentElement.id);

                const formPagesParam = document.querySelectorAll(".step");
                const arrLiElements  = document.querySelectorAll("#navigation ul li");
                
                showPage(this.current, formPagesParam);
                clearStyleLinks(arrLiElements);
                currentPage.parentElement.classList.add("selected");
                e.preventDefault();
            });
        }
    }

}
