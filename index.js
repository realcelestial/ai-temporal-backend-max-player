const express = require('express');
const app = express();
app.use(express.json());

const MAX_PLAYERS = 10;

app.get('/', (req, res) => {
    res.status(200).send("Anti Room Sizer Online!");
});

// Realtime Webhooks llama /CreateGame, no /RoomCreate
app.post('/CreateGame', (req, res) => {
    console.log("--> CREATEGAME RECIBIDO:");
    console.log(JSON.stringify(req.body, null, 2));

    const body = req.body;
    const rawMax =
        body?.MaxPlayers                ??
        body?.CreateOptions?.MaxPlayers ??
        body?.RoomOptions?.MaxPlayers   ??
        body?.CustomData?.max_p         ??
        null;

    const requested = parseInt(rawMax, 10);

    if (rawMax === null || isNaN(requested)) {
        console.warn(`[BLOQUEADO] MaxPlayers ausente. Body: ${JSON.stringify(body)}`);
        // Realtime siempre HTTP 200 — el bloqueo va en ResultCode
        return res.status(200).json({
            ResultCode: 1,
            Message: "MaxPlayers requerido."
        });
    }

    if (requested > MAX_PLAYERS) {
        console.warn(`[BLOQUEADO] Intento con ${requested} jugadores.`);
        return res.status(200).json({
            ResultCode: 1,
            Message: `Límite máximo: ${MAX_PLAYERS} jugadores.`
        });
    }

    console.log(`[AUTORIZADO] Sala con ${requested} jugadores aprobada.`);
    return res.status(200).json({
        ResultCode: 0,
        Message: "OK"
    });
});

// Realtime también llama /CloseGame
app.post('/CloseGame', (req, res) => {
    console.log("--> SALA CERRADA:");
    console.log(JSON.stringify(req.body, null, 2));
    return res.status(200).json({ ResultCode: 0 });
});

// JoinGame — Photon llama esto cuando alguien se une
app.post('/JoinGame', (req, res) => {
    console.log("--> JOIN RECIBIDO:");
    console.log(JSON.stringify(req.body, null, 2));
    return res.status(200).json({ ResultCode: 0 });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Anti Room Sizer corriendo en puerto ${PORT}`);
});
