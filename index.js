const express = require('express');
const app = express();
app.use(express.json());

const MAX_PLAYERS = 10;

// Healthcheck
app.get('/', (req, res) => {
    res.status(200).send("Anti Room Sizer Online!");
});

app.post('/RoomCreate', (req, res) => {
    console.log("--> PETICION RECIBIDA DESDE PHOTON:");
    console.log(JSON.stringify(req.body, null, 2));

    const body = req.body;

    // Fusion v2 manda MaxPlayers en CreateOptions — cubrimos todos los niveles conocidos
    const rawMax =
        body?.CreateOptions?.MaxPlayers ??
        body?.RoomOptions?.MaxPlayers   ??
        body?.MaxPlayers                ??
        body?.CustomData?.max_p         ??
        null;

    const requested = parseInt(rawMax, 10);

    // Si no viene el campo o no es parseable — BLOQUEAR por defecto
    // Un cliente legítimo siempre manda el número; si no lo manda, algo raro pasa
    if (rawMax === null || isNaN(requested)) {
        console.warn(`[BLOQUEADO] MaxPlayers ausente o ilegible. Body: ${JSON.stringify(body)}`);
        return res.status(400).json({
            ResultCode: 1,
            Message: "MaxPlayers requerido y no fue enviado."
        });
    }

    if (requested > MAX_PLAYERS) {
        console.warn(`[BLOQUEADO] Intento con ${requested} jugadores — límite ${MAX_PLAYERS}.`);
        return res.status(400).json({
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

// PathClose requerido por el plugin — Photon llama esto al cerrar sala
app.post('/RoomClose', (req, res) => {
    console.log("--> SALA CERRADA:");
    console.log(JSON.stringify(req.body, null, 2));
    return res.status(200).json({ ResultCode: 0, Message: "OK" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Anti Room Sizer corriendo en puerto ${PORT}`);
});
