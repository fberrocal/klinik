class LocalDataBaseProvider {

    constructor () {
        this.db = null;
    }

    /**
     * Apertura y conexión con la Base de Datos
     */
    async openDB() {
        return new Promise((resolve, reject) => {

            const request = indexedDB.open(DBPLT_NAME, DBPLT_VERSION);

            request.onupgradeneeded = (event) => {
                this.db     = event.target.result;
                const store = this.db.createObjectStore(DBPLT_STORE_NAME, { keyPath: "id", autoIncrement: true });

                // Indices de búsqueda
                store.createIndex("idafiliado", "idafiliado", { unique: false });
                store.createIndex("claseplantilla", "claseplantilla", { unique: false });
                store.createIndex("campo", "campo", { unique: true });
                store.createIndex("indicecampo", "indicecampo", { unique: true });
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(this.db);
            };

            request.onerror = (event) => {
                this.displayActionFailure("Error: " + event.target.error);
                reject(event.target.error);
            };

        });
    }

    /**
     * Retora un Object Store
     * @param {*} store_name 
     * @param {*} mode (either "readonly" or "readwrite")
     */
    getObjectStore(store_name, mode) {
        if (!this.db) {
            throw new Error("La base de datos no está abierta.");
        }

        var tx = this.db.transaction(store_name, mode);
        return tx.objectStore(store_name);
    }

    /**
     * Elimina todo el contenido de un Object store
     * @param {*} store_name 
     */
    async clearObjectStore() {
        try {
            var req;
            var store = this.getObjectStore(DBPLT_STORE_NAME, "readwrite");
            req = await this.requestToPromise(store.clear());
        } catch (error) {
            console.log("Error limpiando tabla de campos: " + error);
        }
    }

    /**
     * Crear registro en la Base de Datos
     * console.log("Parametros recibidos:","ID Paciente: " + idafilaidoIn, "Plantilla: " + claseplantillaIn, "Control: " + controlIn, "Tipo: " + tipocampoIn, "Valor: " + valorIn);
     * @param {*} idafilaidoIn 
     * @param {*} claseplantillaIn 
     * @param {*} controlIn 
     * @param {*} tipocampoIn 
     * @param {*} valorIn 
     */
    async addCampo (idafilaidoIn, claseplantillaIn, controlIn, tipocampoIn, valorIn) {
        
        var mpldid;
        var codCampo;
        var campo;
        var secuencia;
        var campoEdit = null;
        var req = null;

        if (!valorIn) return false;

        if (!this.db) {
            await this.openDB();
        }

        try {
            const idafiliado     = idafilaidoIn;
            const claseplantilla = claseplantillaIn;
            const control        = controlIn;
            const tipocampo      = tipocampoIn;
            const valor          = valorIn;

                // (Obs) Tomo datos adicionales del nombre control
            var arrayCampo  = control.split("_");
            campo           = arrayCampo[1];
            secuencia       = arrayCampo[2];
            mpldid          = arrayCampo[3];
            codCampo        = arrayCampo[4];

            const indicecampo = idafilaidoIn + "_" + claseplantillaIn + "_" + campo + "_" + codCampo;
            const regCampo    = { idafiliado, claseplantilla, campo, secuencia, control, indicecampo, tipocampo, mpldid, valor };
            campoEdit         = await this.buscarPorIndiceCampo(indicecampo);

            if (campoEdit) {
                // console.log("ID obtenido: " + campoEdit.id);
                regCampo.id = campoEdit.id;
            }

            var store = this.getObjectStore(DBPLT_STORE_NAME, "readwrite"); // La apertura del almacén de datos y la transacción se deben hacer en el mimos instante
            req = await this.requestToPromise(store.put(regCampo));

        } catch (error) {
            console.error("Error adicionando o actualizando registro IndexedDB: ", error);
        }

    }

    /**
     * Retona Array con todos los campos de un Paciente y una Plantilla
     * @param {*} idafilaidoIn 
     * @param {*} claseplantillaIn 
     */

    // Convertir en Async - Await

    leerTodosLosCampos(idafilaidoIn, claseplantillaIn) {
        const campos_historia = [];

        const store   = this.getObjectStore(DBPLT_STORE_NAME, "readonly");
        const index   = store.index("idafiliado");
        const request = index.openCursor(IDBKeyRange.only(idafilaidoIn));

        request.onsuccess = function (event) {
            const cursor = event.target.result;

            if (cursor) {
                const campohc = cursor.value;

                if (campohc.claseplantilla === claseplantillaIn) {
                    campos_historia.push(campohc);
                }

                cursor.continue();
            }
        };

        request.onerror = function () {
            this.displayActionFailure("Error durante la búsqueda" + this.error)
        };

        return campos_historia;
    }

    /**
     * Retorna el ID de un registro que existe en la Base de Datos
     * @param {*} indicecampoIn (Indice unico armado para cada registro)
     * @returns numId
     */
    async buscarPorIndiceCampo(indicecampoIn) {
        let buscado   = null;
        const store   = this.getObjectStore(DBPLT_STORE_NAME, "readonly");
        const index   = store.index("indicecampo");
        const request = await this.requestToPromise(index.get(indicecampoIn));

        if (request) buscado = request;

        return buscado;
    }

    /**
     * Cierra la conexión con la Base de Datos
     */
    closeDB() {
        if (this.db != null) {
            this.db.close();            
        }
    }

    /**
     * Muestra mensajes éxitos
     * @param {*} msg 
     */
    displayActionSuccess(msg) {
        msg = typeof msg != "undefined" ? "Success: " + msg : "Success";    // $("#msg").html('<span class="action-success">' + msg + "</span>");
        console.log(msg);
    }

    /**
     * Muestra mensajes de error
     * @param {*} msg 
     */
    displayActionFailure(msg) {
        msg = typeof msg != "undefined" ? "Failure: " + msg : "Failure";    // $("#msg").html('<span class="action-failure">' + msg + "</span>");
        console.error(msg);
    }

    /**
     * Función que convierte cualquier operación de IDBRequest en una Promise:
     * @param {*} request 
     * @returns 
     */
    requestToPromise(request) {
        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

}
