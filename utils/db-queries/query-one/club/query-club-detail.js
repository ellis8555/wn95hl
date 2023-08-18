// returns a requested club detail filtered by field that is input.
// example qeury args ('teamAcronym', 'AHC', 'name') returns name of club with acronym matching 'AHC'
// example would return 'Alberta'

import Club from "@/schemas/club";
const queryClubDetatail = async (filterByProp, value, returnProp) => {
  const findClub = await Club.findOne({ [filterByProp]: value });
  return findClub[returnProp];
};

export default queryClubDetatail;
