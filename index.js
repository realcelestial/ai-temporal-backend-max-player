const express = require('express'); //yes, this is by ai, i dont know js 👍
const app = express();
app.use(express.json()); 

const MAX_GORILLAS_PER_ROOM = 10;

app.post('/RoomCreate', (req, res) => {
    const photonData = req.body;

    // 1. Extraemos las propiedades de donde Photon las mande
    const properties = photonData.CustomData || photonData.CreateOptions?.CustomProperties || {};
    
    // 2. Buscamos el valor en custom properties (max_p) O en la propiedad nativa de Photon (MaxPlayers / CreateOptions.MaxPlayers)
    const rawMax = properties.max_p ?? photonData.CreateOptions?.MaxPlayers ?? photonData.MaxPlayers;
    const requestedMaxPlayers = parseInt(rawMax, 10);

    // Si la sala no especifica límite, permitimos la creación asignando el valor máximo por defecto
    if (isNaN(requestedMaxPlayers)) {
        console.log(`[SALA CREADA] Sin límite explícito recibido, asignando por defecto.`);
        return res.json({ ResultCode: 0 });
    }

    // 3. Verificación anti-modders
    if (requestedMaxPlayers > MAX_GORILLAS_PER_ROOM) {
        console.log(`[MODDER DETECTADO] Sala: ${photonData.GameId || 'Desconocida'} intentó crearse con ${requestedMaxPlayers} jugadores.`);
        
        return res.json({
            ResultCode: 1,
            Message: `Acceso denegado. El límite máximo permitido es de ${MAX_GORILLAS_PER_ROOM} jugadores.`
        });
    }

    console.log(`[SALA AUTORIZADA] Sala permitida para ${requestedMaxPlayers} jugadores.`);
    return res.json({ ResultCode: 0 });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Protección Gorilla Tag activa en puerto ${PORT}`));