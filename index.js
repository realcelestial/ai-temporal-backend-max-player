const express = require('express');
const app = express();

app.use(express.json());

const MAX_GORILLAS_PER_ROOM = 10;

// Ruta de healthcheck para UptimeRobot
app.get('/', (req, res) => {
    res.status(200).send("Anti Room Sizer Online!");
});

app.post('/RoomCreate', (req, res) => {
    // Imprime todo lo que llega desde Photon para inspeccionar
    console.log("--> PETICION RECIBIDA DESDE PHOTON:");
    console.log(JSON.stringify(req.body, null, 2));

    const photonData = req.body;

    // Photon puede enviar MaxPlayers en varios niveles del JSON
    const rawMax = photonData.MaxPlayers ?? 
                   photonData.CreateOptions?.MaxPlayers ?? 
                   photonData.RoomOptions?.MaxPlayers ??
                   photonData.CustomData?.max_p;

    const requestedMaxPlayers = parseInt(rawMax, 10);

    console.log(`Jugadores solicitados parseados: ${requestedMaxPlayers}`);

    // Si detecta un valor superior al límite permitido
    if (!isNaN(requestedMaxPlayers) && requestedMaxPlayers > MAX_GORILLAS_PER_ROOM) {
        console.log(`[BLOQUEADO] Intento de sala ilegal con ${requestedMaxPlayers} jugadores.`);
        
        // HTTP 400 indica a Photon que CANCELE la creación de la sala inmediatamente
        return res.status(400).json({
            ResultCode: 1,
            Message: `Acceso denegado. El límite máximo es ${MAX_GORILLAS_PER_ROOM}.`
        });
    }

    console.log(`[AUTORIZADO] Sala aprobada con ${requestedMaxPlayers || 'default'} jugadores.`);
    return res.status(200).json({
        ResultCode: 0,
        Message: "OK"
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor Webhook corriendo en el puerto ${PORT}`);
});
