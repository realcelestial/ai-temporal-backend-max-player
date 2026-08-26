const express = require('express'); //yes, this is by ai, i dont know js 👍
const app = express();
app.use(express.json()); 

const MAX_GORILLAS_PER_ROOM = 10;

app.post('/RoomCreate', (req, res) => {
    const photonData = req.body;

    // Se extrae la información enviada por Photon
    const properties = photonData.CustomData || photonData.CreateOptions?.CustomProperties || {};
    const rawMax = properties.max_p ?? photonData.CreateOptions?.MaxPlayers ?? photonData.MaxPlayers;
    const requestedMaxPlayers = parseInt(rawMax, 10);

    // Si no viene definido el número de jugadores, se aprueba la sala por defecto
    if (isNaN(requestedMaxPlayers)) {
        return res.status(200).json({
            ResultCode: 0,
            Message: "OK"
        });
    }

    // Detección de modders (> 10 jugadores)
    if (requestedMaxPlayers > MAX_GORILLAS_PER_ROOM) {
        console.log(`[MODDER DETECTADO] Intento de crear sala para ${requestedMaxPlayers} jugadores.`);
        
        // Respuesta estructurada requerida por Photon para rechazar la sala
        return res.status(200).json({
            ResultCode: 1,
            Message: `Acceso denegado. El límite máximo es ${MAX_GORILLAS_PER_ROOM}.`
        });
    }

    console.log(`[SALA AUTORIZADA] Límite: ${requestedMaxPlayers}`);
    
    // Respuesta estructurada requerida por Photon para autorizar la sala
    return res.status(200).json({
        ResultCode: 0,
        Message: "OK"
    });
});
