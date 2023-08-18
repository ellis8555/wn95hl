// searches for a seasons collection to see if it exists.
// if it does exist this returns the season's collection name
// the returned name of a collection is used as a argument in 'queryForASeason()'

import mongoose from "mongoose";

const queryForIfSeasonExists = async (seasonNumber) => {
  const thisSeasonsCollection = `season${seasonNumber}details`;
  const doesCollectionExist = await mongoose.connection.db
    .listCollections({ name: thisSeasonsCollection })
    .toArray();

  if (doesCollectionExist.length === 0) {
    return false;
  }

  return thisSeasonsCollection;
};

export default queryForIfSeasonExists;
