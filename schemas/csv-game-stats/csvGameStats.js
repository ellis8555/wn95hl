import { Schema, model, models } from "mongoose";

const csvGameStats = new Schema({
  csvFormatGameStats: String, 
});

const Csv_game_data =
  models.csv_game_stat ||
  model("csv_game_stat", csvGameStats);

export default Csv_game_data;