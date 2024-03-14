export default async function Page() {
    return (
      <div className="flex justify-center my-2">
        <div className="text-slate-300">
          <h1 className="text-4xl lg:text-6xl text-center my-8">
            Game state upload
          </h1>
          <section className="w-10/12 m-auto md:w-3/4">
          <p className="my-4">**UPDATE**</p>
          <p className="my-4">As per chatGPT, </p>
          <p className="my-4">Following the initial submission of games by the Vintage league, accompanied by successful uploads of game states, it is evident that game state submissions are functioning appropriately. Immediate availability of game data in Google Sheets signifies a smooth operational process. Moreover, this development unveils intriguing possibilities, notably the implementation of shootouts. For instance, in the scenario where a league opts to introduce shootouts, the process is streamlined. Players simply submit a tied game state, and a tailored script can be devised to acknowledge the league's stance against ties. Consequently, an interface would prompt user input of the shootout winner, facilitating subsequent adjustments in statistics to accurately reflect shootout outcomes.</p>
          <p className="my-4">** END UPDATE**</p>
          <p className="my-4">
          Progress toward implementing league-wide game state uploads by all users has been nearly completed. The challenge lies in implementing an update across two data storage systems. One is a NoSQL database that has been created and tested, while the other is the current official league data store, which employs Google Spreadsheets. It's not ideal for players to complete two steps when submitting a game state. Initially, they have to go to Discord and drop a game state into the correct channel, and then proceed to a website to upload a game file.</p>
<p className="my-4">
To streamline this process, a backend API has been developed. Users can navigate to this API via a browser, which produces the required data to update Google Sheets. When a game is uploaded via the website, its data becomes immediately available through the API, facilitating the update of Google Sheets. The creation of this API has reduced the current two-step process to a single step, allowing users to individually upload game states.
    </p>
<p className="my-4">
If you wish to test the API that generates the data needed for Google Sheets, you can visit the following examples that return the most recent leagues' data:
</p>

<p className="my-4 text-orange-400"><a href="https://nhl95.vercel.app/api/league-data/w/4/csv-game-data">W League season 2004</a></p>
<p className="my-4 text-orange-400"><a href="https://nhl95.vercel.app/api/league-data/q/89/csv-game-data">Q League season 1989</a></p>
<p className="my-4 text-orange-400"><a href="https://nhl95.vercel.app/api/league-data/v/1/csv-game-data">Vintage League Season 1</a></p>

<p className="my-4">Specific game returns can be adjusted to return however many games you desire. This will automatically download the data that can be used by admins to update league data in Google Sheets. The option to switch league and season numbers exists as long as those seasons data have been entered into the database</p>

Additionally, there is an option to download the entire season's data for backing up league data, which is available to anyone.

<p className="my-4">The implementation of the Vintage league is pending, which will enable game state uploads via the website or websites across all leagues. 
            </p>
            </section>
      </div>
      </div>
    );
  }