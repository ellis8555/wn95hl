'use client'
import { useState } from "react"
import Alert from "@/components/server/Alerts/Alert"
import getGamesInCsvFormat from "./get-games-in-csv-format"
import LeagueLogo from "@/components/server/Logos/LeagueLogo"
import "./styles.css"

export default function CsvRequest(){
    const [currentLeague, setCurrentLeague] = useState('w')

    function setLeague(leagueName){
        setCurrentLeague(leagueName)
    }

    return (
        <div className="flex flex-col justify-center gap-4 md:w-1/2 mx-auto">     
        <Alert>Until a fix is made: after submitting be sure to refresh the page</Alert>   
        <div>
            Click league logo to change which league to get data for
        </div>
        <div>
            Current league: <span className="text-green-400">{currentLeague.toUpperCase()}</span>
        </div>
        <div className="flex justify-center gap-2">
            <div  onClick={() => setLeague("w")}>
        <LeagueLogo name={"w"} width={25} height={25}/>
            </div>
        <div onClick={() => setLeague("q")}>
        <LeagueLogo name={"q"} width={25} height={25} />
        </div>
        <div onClick={() => setLeague("v")}>
        <LeagueLogo name={"v"} width={25} height={25}/>
        </div>
        </div>
        <form action={getGamesInCsvFormat}>
            <input type="number" name="numberOfCsvGames" id="numberOfCsvGames" placeholder="Enter game qty: default 10"/>
            <input type="hidden" name="leagueName" value={currentLeague} />
            <br/>
            <button className="w-min p-[1px] rounded-md bg-orange-500" type="submit">Submit</button>
        </form>
        </div>
    )
}