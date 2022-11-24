const httpsServer = require("../../mesModules/httpsServer/httpsServer")();
const { Server } = require("socket.io");
const { getLatLongUserFromRevisionId, updateRevisionStatus, toConnectBdd, toDisconnectBdd } = require("../bdd/controllersBdd");

const io = new Server(httpsServer, {
    cors: {
        origin: "*",
    }
});

io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("revisionId", async ({id, admin, type}) => {
        console.log(id);
        const userLatLong = await getLatLongUserFromRevisionId(id);
        if (admin) {
            await toConnectBdd();
            await updateRevisionStatus(id, type, "enCours");
        }

        socket.on(id + "arrived", async () => {
            await toConnectBdd();
            await updateRevisionStatus(id, type, "end");
        })

        socket.emit(id + "userPos", userLatLong);
    });

    socket.on("lastPos", (data) => {
        console.log(data);
        socket.broadcast.emit(data.id + "lastPos", data.latLong);
    });

    socket.on("disconnect", () => {
        console.log("a user disconnect");
    })
})

module.exports = io;