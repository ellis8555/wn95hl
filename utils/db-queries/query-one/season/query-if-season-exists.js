// searches for a seasons collection to see if it exists.
// if it does exist this returns the season's collection name
// the returned name of a collection is used as a argument in 'queryForASeason()'
import getSeasonsModel from "@/schemas/season/season";

const queryForIfSeasonExists = async (leagueName, seasonNumber) => {
  const leagueCollection = `${leagueName}_seasons`;
  const SeasonModel = getSeasonsModel(leagueCollection);

  const doesSeasonExist = await SeasonModel.findOne({
    seasonNumber: seasonNumber,
  });
};

export default queryForIfSeasonExists;
