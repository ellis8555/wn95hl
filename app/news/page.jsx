import "./styles.css"

export default async function Page() {
    return (
      <div className="flex justify-center my-2">
        <div className="text-slate-300">
          <h1 className="text-4xl lg:text-6xl text-center my-8">
            About this project
          </h1>
          <div className="flex flex-col lg:flex-row lg:gap-4 w-11/12 m-auto md:w-3/4">
            <section className="news">
            <h2>Desktop and mobile</h2>
            <p className="text-center my-4">** Updated Mar 26, 2024 **</p>
            <ul>
              <li className="text-green-500">** NEW - Within team game results page now clicking on W, L, T, OTL opens a popup screen. Two ways to close the popover are to either click outside of the popover or clicking or swiping back button **</li>
              <li>Team results page clicking on little boxes with either W, L, T, OTL is link to boxscore for that game</li>
              <li>NHL95online image is a link back to homepage</li>
              <li>Tables are sortable by clicking on any columns header</li>
              <li>Tables scroll horizontally depending on a devices width</li>
              <li>Team logos are links leading to that teams game results</li>
              <li>As of now the only team logo that is not a link is teams logo top of game results page</li>
            </ul>
            </section>
            <section  className="news">
            <h2>Desktop</h2>
            <ul>
              <li>League logos right side navagation bar switch the score ticker to the corresponding league</li>
              <li>On the navbar cloud with upward arrow leads to game upload</li>
              <li>On the navbar rightmost icon leads to login page</li>
            </ul>
            </section>
            <section  className="news">
            <h2>Mobile</h2>
            <ul>
              <li>Orange puck when clicked opens up a drop down menu</li>
            </ul>
            </section>
          </div>
          <div className="w-11/12 m-auto md:w-3/4">
            <section className="news">
            <h2>General</h2>
              <ul>
          <li>It feels most of the underlying code base is functioning properly regarding the proper display of information across multiple league. This includes the adding of new leagues, new seasons and then on top of that having those leagues and seasons display properly when requested. 
          </li>
          <li>There is one underlying piece of the code base that is still missing and that is to have buttons added dynamically for divisions when appropriate. There currently is for conferences but not yet for divisions.</li>
          <li>Moving forward it's just a matter of adding new features and or stats. There is no shortage of these that have not crossed my mind. For instance adding a pop up modal that would display a games opponent and score when hovering over one of the boxes that makes up a teams last 10 games streak which is located inside of a teams games results page. Also as previously mentioned having highlight uploads for a game.</li>
          <li>Over time this project will grow whether it's used by any particular league or not. I just enjoy doing it.</li>
          </ul>
          </section>
          </div>
      </div>
      </div>
    );
  }