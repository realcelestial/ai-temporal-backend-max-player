const express = require('express'); //yes this is by ai, i dont know js, this is for my testing game 👍
const app = express();

app.use(express.json());

const MAX_GORILLAS_PER_ROOM = 10;

app.post('/RoomCreate', (req, res) => {
    const photonData = req.body;

    const rawMax = photonData.CreateOptions?.MaxPlayers ?? photonData.MaxPlayers;
    const requestedMaxPlayers = parseInt(rawMax, 10);

    if (isNaN(requestedMaxPlayers)) {
        return res.status(200).json({ ResultCode: 0, Message: "OK" });
    }

    if (requestedMaxPlayers > MAX_GORILLAS_PER_ROOM) {
        console.log(`[MODDER DETECTADO] Intento de sala con ${requestedMaxPlayers} jugadores.`);
        
        return res.status(200).json({
            ResultCode: 1,
            Message: `Acceso denegado. Máximo permitido: ${MAX_GORILLAS_PER_ROOM}.`
        });
    }

    console.log(`[SALA AUTORIZADA] Jugadores: ${requestedMaxPlayers}`);
    return res.status(200).json({ ResultCode: 0, Message: "OK" });
});

// Necesario para que funcione en Render (asigna un puerto dinámico)
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => {
    res.status(200).send("Anti Room Sizer Online!");
});
app.listen(PORT, () => {
    console.log(`Webhook escuchando en el puerto ${PORT}`);
});
