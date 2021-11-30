const fs = require("fs");

const { default: axios } = require("axios");
const { pausa } = require("../helpers/inquirer");


class Busquedas {

    historial = [];

    dbPath = './db/database.json'

    constructor() {
        this.leerDB();
    }

    get historialCapitalizado() {
        return this.historial.map( lugar => {
            let palabras = lugar.split(' ');
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1) );
            return palabras.join(' ');
        } );
    }

    get paramsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es',
        };
    }

    get paramsOpenWeather() {
        return {
            units: 'metric',
            lang: 'es',
            appid: process.env.OPENWEATHER_KEY,
        }

    }

    async clima( lat, lon ) {

        try {

            const instance = axios.create({
                baseURL: 'https://api.openweathermap.org/data/2.5/weather',
                params: {...this.paramsOpenWeather, lat, lon}
            });

            const resp = await instance.get();
            const { description } = resp.data.weather[0];
            const { temp_min, temp_max, temp } = resp.data.main;


            return {
                desc: description,
                min: temp_min,
                max: temp_max,
                temp,
            }

        } catch (error) {
            console.log(error);
        }
    }

    async ciudad( lugar = '' ) {
        try {

            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params : this.paramsMapbox,
            });

            const resp = await instance.get();
            return resp.data.features.map( lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1],
            })); // Se está retornando un objeto de forma implicita.

        } catch(e) {
            console.log(e);
            return [];
        }
    }

    agregarHistorial( lugar = '' ) {
        // TODO: prevenir duplicidad

        if( this.historial.includes( lugar.toLowerCase() )) {
            return
        }

        this.historial.unshift( lugar.toLowerCase() );

        this.guardarDB();

        // Grabar en DB (JSON)

    }

    guardarDB() {

        const payload =  {
            historial: this.historial,
        }

        fs.writeFileSync(this.dbPath, JSON.stringify( payload ));
    }

     leerDB() {



        try {

            const data =  fs.readFileSync(this.dbPath, 'utf8');

            const { historial } = JSON.parse(data);
            this.historial.push(...historial);
            console.log(this.historial);

        } catch (error) {
            console.log( error );
        }

    }
}


module.exports = Busquedas;
