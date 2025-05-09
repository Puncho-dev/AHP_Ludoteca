import { Client } from "../../client/model/Client";
import { Game } from "../../game/model/Game";

export class Loan {
  id: number;
  dateStart: Date;
  dateEnd: Date;
  game: Game;
  client: Client;
}