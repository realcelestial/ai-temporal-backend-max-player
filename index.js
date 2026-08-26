const express = require('express'); //yes, this is by ai, i dont know js 👍
const app = express();
app.use(express.json()); 

const MAX_GORILLAS_PER_ROOM = 10;

app.post('/RoomCreate', (req, res) => {
    const photonData = req.body;

    const sessionProperties = photonData.CreateOptions?.CustomProperties;
    
    if (!sessionProperties || sessionProperties.max_p === undefined) {
        return res.json({ 
            ResultCode: 1, 
            Message: "Petición inválida. Faltan parámetros de configuración." 
        });
    }

    const requestedMaxPlayers = sessionProperties.max_p;

    if (requestedMaxPlayers > MAX_GORILLAS_PER_ROOM) {
        console.log(`[MODDER DETECTADO] Sala: ${photonData.GameId} intentó configurarse para ${requestedMaxPlayers} jugadores.`);
        
        // ResultCode: 1 le dice a Photon que DESTRUYA la sala de inmediato
        return res.json({
            ResultCode: 1,
            Message: `Acceso denegado. El límite máximo del juego es de ${MAX_GORILLAS_PER_ROOM} jugadores.`
        });
    }

    console.log(`[SALA LEGAL] Sala ${photonData.GameId} creada correctamente para ${requestedMaxPlayers} jugadores.`);
    return res.json({ ResultCode: 0 });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Protección Gorilla Tag activa en puerto ${PORT}`));