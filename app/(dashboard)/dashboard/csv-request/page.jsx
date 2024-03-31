'use client'
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DOMAIN } from "@/utils/constants/connections"
import { MOST_RECENT_SEASON, MOST_RECENT_Q_SEASON, MOST_RECENT_V_SEASON } from "@/utils/constants/constants"
import LeagueLogo from "@/components/server/Logos/LeagueLogo"
import "./styles.css"

export default function CsvRequest(){
    const [currentLeague, setCurrentLeague] = useState('w')
    const [seasonNumber, setSeasonNumber] = useState(MOST_RECENT_SEASON)
    const router = useRouter()

    useEffect(() => {
        switch(currentLeague){
            case "w":
                setSeasonNumber(MOST_RECENT_SEASON)
                break;
            case "q":
                setSeasonNumber(MOST_RECENT_Q_SEASON)
                break;
            case "v":
                setSeasonNumber(MOST_RECENT_V_SEASON)
                break;
        }
    }, [currentLeague])

function handleSubmit(e){
    e.preventDefault();
    const formData = new FormData(e.target)
    const howManyGames = formData.get("numberOfCsvGames")
    e.target.reset()
    router.push(`${DOMAIN}/api/league-data/${currentLeague}/${seasonNumber}/csv-game-data/${howManyGames}`)
}

    return (
        <div className="flex flex-col justify-center gap-4 md:w-1/2 mx-auto">      
        <div>
            Click league logo to change which league to get data for
        </div>
        <div>
            Current league: <span className="text-green-400 text-lg">{currentLeague.toUpperCase()}</span>
        </div>
        <div className="flex justify-center gap-2">
            <div  onClick={() => setCurrentLeague("w")}>
        <LeagueLogo name={"w"} width={25} height={25}/>
            </div>
        <div onClick={() => setCurrentLeague("q")}>
        <LeagueLogo name={"q"} width={25} height={25} />
        </div>
        <div onClick={() => setCurrentLeague("v")}>
        <LeagueLogo name={"v"} width={25} height={25}/>
        </div>
        </div>
        <form onSubmit={handleSubmit}>
            <input type="number" name="numberOfCsvGames" id="numberOfCsvGames" placeholder="Enter game qty: default 10"/>
            <input type="hidden" name="leagueName" value={currentLeague} />
            <br/>
            <button className="w-min p-[1px] mt-2 rounded-md bg-orange-500" type="submit">Submit</button>
        </form>
        </div>
    )
}