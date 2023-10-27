const express = require("express");
const path = require("path");

const app = express();

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;
const initializeDBAndServer = async () => {
    try {
        db = open({
            filename: dbPath,
            driver: sqlite3.Database,
        });
        app.listen(3000, () => {
            console.log("Server running successfully");
        });
    } catch (e) {
        console.log(e.message);
        process.exit(1);
    }
};

app.get("/players/", async (request, response) => {
    const getBooksQuery = `SELECT * FROM cricket_team order by player_id`;
    const players = await db.all(getBooksQuery);
    response.send(players);
});

app.post("/players/", async (request, response) => {
    const playerDetails = request.body;
    const { playerName, jerseyNumber, role } = playerDetails;
    const getUpdatedBooksQuery = `INSERT INTO cricket_team(playerName, jerseyNumber, role) VALUES (${playerName}, ${jerseyNumber}, ${role})`;
    const dbResponse = await db.run(getUpdatedBooksQuery);
    const playerId = dbResponse.lastId;
    response.send("Player Added to the Team");
});

app.get("/players/:playerId/", async (request, response) => {
    const { playerId } = request.params;
    const getPlayerQuery = `SELECT * FROM cricket_team WHERE playerId = ${playerId}`;
    const getPlayerDbResponse = await db.get(getPlayerQuery);
    response.send(getPlayerDbResponse);
});

app.put("/players/:playerId/", async (request, response) => {
    const { playerId } = request.params;
    const playerDetails = request.body;
    const { playerName, jerseyNumber, role } = playerDetails;
    const updatePlayerDetailsQuery = `UPDATE cricket_team SET playerName=${playerName}, jerseyNumber = ${jerseyNumber}, role= ${role} where playerId = ${playerId}`;
    const updateResponse = await updatePlayerDetailsQuery;
    response.send("Player Details Updated");
});

app.delete("/players/playerId/", (request, response) => {
    const { playerId } = request.params;
    const deletePlayerQuery = `DELETE FROM cricket_team WHERE playerId = ${playerId}`;
    deletePlayerQuery.db.run(deletePlayerQuery);
    response.send("Player Removed");
});

module.exports = app;
