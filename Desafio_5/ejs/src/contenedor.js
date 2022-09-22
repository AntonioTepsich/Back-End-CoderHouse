const fs = require("fs");

class Contenedor{
    constructor(archivo){
        this._archivo =archivo;
        this._leerOCrear();
    }

    async _leerOCrear(){
        try{
            await fs.promises.readFile(this._archivo,"utf-8");
        } catch(error){
            error.code==="ENOENT" ? this._crearArchivo() : console.log(`Error cuando intentamos abrir ${this._archivo}`);
        }
    }

    async _crearArchivo() {
        fs.writeFile(this._archivo, "[]", (error) => {error ? console.log(error) : console.log(`Archivo ${this._archivo} fue creado ya que no existia`);});
    }
    async getById(id){
        try{
            const data = await this.getData();
            const parsedData = JSON.parse(data);

            return parsedData.find((producto) => producto.id === id);
        } catch(error){
            console.log(`Error cuando intentamos encontrar ID: ${id}`)
        }
    }
    async deleteById(id){
        try {
            const data = await this.getData();
            const parsedData = JSON.parse(data);
            const objectIdToBeRemoved = parsedData.find((producto) => producto.id === id);

            if (objectIdToBeRemoved) {
                const index = parsedData.indexOf(objectIdToBeRemoved);
                parsedData.splice(index, 1);
                await fs.promises.writeFile(this._archivo, JSON.stringify(parsedData));
            } else {
                console.log(`ID: ${id} no existe`);
                return null;
            }
        } catch (error) {
            console.log(`Error cuando intentamos borrar ID: ${id}`)
        }
    }


    async updateById(id, newData) {
        try {
        id = Number(id);
        const data = await this.getData();
        const parsedData = JSON.parse(data);
        const objectIdToBeUpdated = parsedData.find(
            (producto) => producto.id === id
        );
        if (objectIdToBeUpdated) {
            const index = parsedData.indexOf(objectIdToBeUpdated);
            const {title, price, thumbnail} = newData;

            parsedData[index]['title'] = title;
            parsedData[index]['price'] = price;
            parsedData[index]['thumbnail'] = thumbnail;
            await fs.promises.writeFile(this._archivo, JSON.stringify(parsedData));
            return true;
        } else {
            console.log(`ID ${id} no existe en el archivo`);
            return null;
        }

        } catch (error) {
        `Error Code: ${error.code} | Error al intentar cargar el ID (${id})`
        }
    }

    async save(item){
        try {
            const allData = await this.getData();
            const parsedData = JSON.parse(allData);
            item.id = parsedData.length + 1;
            parsedData.push(item);
            await fs.promises.writeFile(this._archivo, JSON.stringify(parsedData));
            return item.id;

        } catch (error) {
            console.log("Error cuando intentamos guardar");
        }
    }

    async deleteAll() {
        try {
            await this._crearArchivo();
        } catch (error) {
            console.log("Error cuando intentamos borrar todo");
        }
    }
    
    async getData() {
        const data = await fs.promises.readFile(this._archivo, "utf-8");
        return data;
    }
    
    async getAll() {
        const data = await this.getData();
        return JSON.parse(data);
    }
}

module.exports = Contenedor;