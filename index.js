
require('dotenv').config();
const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");



const main = async() => {

    let opt;
    let busqueda = new Busquedas();

    do {

        opt = await inquirerMenu();

        switch (opt) {
            case 1:

                // Obtener lugar a buscar
                const lugar = await leerInput('Ciudad: ');

                // Buscar lugares
                const lugares = await busqueda.ciudad( lugar  );
                const id = await listarLugares(lugares);

                const { nombre, lng, lat } = lugares.find( lugar => lugar.id === id );

                const {desc, min, max, temp} = await busqueda.clima(lat, lng);



                // Clima

                // Resultados
                console.clear();
                console.log('\n Información de la ciudad:\n'.green);
                console.log('Ciudad:', nombre.yellow);
                console.log('Lat:', lat);
                console.log('Long:', lng);
                console.log('Temperatura:', temp);
                console.log('Mín:', min);
                console.log('Máx:', max);
                console.log('Como está el clima:', desc.yellow);
                //busqueda.ciudad( lugar );
                break;
            case 2:
                console.log('Historial');
                break;

        }

        if(opt !== 0) await pausa();

    } while(opt !== 0);
}

main();
