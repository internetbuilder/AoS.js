const BasePacket = require("./BasePacket.js");
const Player = require("../game/Player.js");
const { ByteType, UByteType, LEFloatType, StringType } = require("../types");

class CreatePlayer extends BasePacket {
	constructor(packet) {
		super();

		this.id = 12;
		this.fields = {
			player_id:   new UByteType(),
			weapon:      new UByteType(),
			team:        new ByteType(),
			x:           new LEFloatType(),
			y:           new LEFloatType(),
			z:           new LEFloatType(),
			name:        new StringType(),
		};

		if (packet)
			this.parseInfos(packet);
	}

	organize(game) {
		let pId = this.getValue("player_id");
		if (!game.players[pId]) {
			game.local.emit("PlayerJoin", this.fields);
			game.players[pId] = new Player();
		}

		game.players[pId].playerId = pId;
		game.players[pId].weapon = this.getValue("weapon");

		switch(this.fields.team.value){
		case -1:game.players[pId].team = game.spectatorTeam;break;
		case 0: game.players[pId].team = game.blueTeam;     break;
		case 1: game.players[pId].team = game.greenTeam;    break;
		}

		game.players[pId].position.x = this.getValue("x");
		game.players[pId].position.y = this.getValue("y");
		game.players[pId].position.z = this.getValue("z");

		game.players[pId].name = this.getValue("name");
		game.players[pId].dead = false;
	}
}

module.exports = CreatePlayer;