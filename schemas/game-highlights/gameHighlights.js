import { Schema, model, models } from "mongoose";
import GameHighlightSchema from "../games/game-result/game-result-sub-schemas/gameHighlights";

const HighlightsSchema = new Schema(GameHighlightSchema);

const gamesHighlightsSchema = new Schema({
  highlights: [HighlightsSchema], // Array of goalie objects
});

const Game_Highlights =
  models.game_highlight || model("game_highlight", gamesHighlightsSchema);

export default Game_Highlights;
