'use server'
import { MOST_RECENT_SEASON, MOST_RECENT_Q_SEASON, MOST_RECENT_V_SEASON } from "@/utils/constants/constants";
import { redirect } from "next/navigation";

export default async function getGamesInCsvFormat(formData){
    const leagueName = formData.get("leagueName") 
    const howManyGamesToReturn = formData.get("numberOfCsvGames")

    let seasonNumber;
    switch(leagueName){
        case "w":
            seasonNumber = MOST_RECENT_SEASON;
            break;
        case "q":
            seasonNumber = MOST_RECENT_Q_SEASON;
            break;
        case "v":
            seasonNumber = MOST_RECENT_V_SEASON;
            break;
    }

    redirect(`/api/league-data/${leagueName}/${seasonNumber}/csv-game-data/${howManyGamesToReturn}`)
}