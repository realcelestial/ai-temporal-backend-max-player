const express = require('express');
const app = express();
app.use(express.json());

const MAX_PLAYERS = 10;

app.get('/', (req, res) => {
    res.status(200).send("Anti Room Sizer Online!");
});

// Ruta correcta segun la doc oficial
app.post('/game/create', (req, res) => {
    console.log("--> CREATE GAME RECIBIDO:");
    console.log(JSON.stringify(req.body, null, 2));

    const body = req.body;

    // Extraemos lo que el cliente pidio — puede venir aqui
    const clientMax = body?.EnterRoomParams?.RoomOptions?.MaxPlayers ?? null;
    console.log(`Cliente solicitó MaxPlayers: ${clientMax}`);

    // Si el cliente pidio mas de 10 — lo bloqueamos con 400
    if (clientMax !== null && parseInt(clientMax, 10) > MAX_PLAYERS) {
        console.warn(`[BLOQUEADO] Cliente intentó ${clientMax} jugadores.`);
        return res.status(400).json({
            Status: 400,
            Error: "RoomSizeExceeded",
            Message: `Límite máximo: ${MAX_PLAYERS} jugadores.`
        });
    }

    // Siempre forzamos MaxPlayers=10 en la respuesta — Photon lo aplica
    // Esto cubre el caso donde el cliente no manda MaxPlayers en absoluto
    console.log(`[AUTORIZADO] Sala creada — forzando cap a ${MAX_PLAYERS}.`);
    return res.status(200).json({
        EnterRoomParams: {
            RoomOptions: {
                MaxPlayers: MAX_PLAYERS
            }
        }
    });
});

app.post('/game/join', (req, res) => {
    console.log("--> JOIN GAME:");
    console.log(JSON.stringify(req.body, null, 2));
    return res.status(200).json({});
});

app.post('/game/close', (req, res) => {
    console.log("--> CLOSE GAME:");
    console.log(JSON.stringify(req.body, null, 2));
    return res.status(200).json({});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Anti Room Sizer corriendo en puerto ${PORT}`);
});
