export default async function Page() {
    return (
      <div className="flex justify-center my-2">
        <div className="text-slate-300">
          <h1 className="text-4xl lg:text-6xl text-center my-8">
            Game state upload
          </h1>
          <section className="w-10/12 m-auto md:w-3/4">
          <p className="my-4">
          Progress toward implementing league-wide game state uploads by all users has been nearly completed. The challenge lies in implementing an update across two data storage systems. One is a NoSQL database that has been created and tested, while the other is the current official league data store, which employs Google Spreadsheets. It's not ideal for players to complete two steps when submitting a game state. Initially, they have to go to Discord and drop a game state into the correct channel, and then proceed to a website to upload a game file.</p>
<p className="my-4">
To streamline this process, a backend API has been developed. Users can navigate to this API via a browser, which produces the required data to update Google Sheets. When a game is uploaded via the website, its data becomes immediately available through the API, facilitating the update of Google Sheets. The creation of this API has reduced the current two-step process to a single step, allowing users to individually upload game states.
    </p>
<p className="my-4">
If you wish to test the API that generates the data needed for Google Sheets, you can visit:
</p>

<p className="my-4 text-orange-400"><a href="https://nhl95.vercel.app/api/league-data/w/4/csv-game-data/5">https://nhl95.vercel.app/api/league-data/w/4/csv-game-data/5</a></p>

<p className="my-4">The last digit in that link, "5," can be adjusted to return however many games you desire. This will automatically download the data that can be used by admins to update league data in Google Sheets. The above link is to obtain data for w league season 2004. The option to switch league and season numbers exists as long as those seasons data have been entered into the database</p>

Additionally, there is an option to download the entire season's data for backing up league data, which is available to anyone.

<p className="my-4">The implementation of the Vintage league is pending, which will enable game state uploads via the website or websites across all leagues. 
            </p>
            </section>
      </div>
      </div>
    );
  }