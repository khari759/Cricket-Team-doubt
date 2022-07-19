const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;

const intializeDBandServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is Running at http://localHost:3000");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
intializeDBandServer();

//Get Method
app.get("/players/", async (request, response) => {
  const getPlayers = `
    SELECT * FROM cricket_team`;
  response.send(await db.all(getPlayers));
});

//Add player

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;

  const { playerName, jerseyNumber, role } = playerDetails;
  const addPlayerQuery = `
    INSERT INTO 
    cricket_team (player_name,jersey_number,role)
    VALUES
    ( 
      '${playerName}',
      '${jerseyNumber}',
      '${role}'  
    );`;
  const addPlayer = await db.run(addPlayerQuery);
  const playerId = addPlayer.lastID;
  response.send("Player Added to team");
});

//Get player
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `
    SELECT * FROM cricket_team WHERE player_id = '${playerId}'`;
  response.send(await db.get(getPlayerQuery));
});

//Update player

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const UpdatePlayerQuery = `
    UPDATE
    cricket_team
    SET
      player_name ='${playerName}',
      jersey_number = '${jerseyNumber}',
      role = '${role}'  
    WHERE 
    player_id = ${playerId}  ;`;
  await db.run(UpdatePlayerQuery);
  response.send("Player Details Updated");
});

//Delete player
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `
    DELETE FROM
        cricket_team
    WHERE
        player_id = ${playerId};`;

  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});

module.exports = app;
