// searches for a seasons collection that does exist
// param for this method is returned value from method 'queryForIfSeasonExists()'

////////////////////////////////////////////////////////////////////////////////////////
// IMPORTANT: once this function is returned use findOne({}) as below
// this will return the properties for that season
// const getSeasonCollection = await queryForASeason(thisSeasonsCollection);
// const getSeasonData = await getSeasonCollection.findOne({});
////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////
// HOW TO UPDATE THE COLLECTION
// await getSeasonCollection.updateOne(
//   {
//     _id: getSeasonData._id,
//   },
//   {
//     $set: {
//       seasonGames: getSeasonGames,
//     },
//   }
// );
////////////////////////////////////////////////////////////////////////////////////////

import mongoose from "mongoose";

const queryForASeason = async (collectionNameForSeason) => {
  return mongoose.connection.db.collection(collectionNameForSeason);
};

export default queryForASeason;
