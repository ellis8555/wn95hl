import GeneralLogo from "@/components/server/Logos/GeneralLogo";

// returns formatted stat
function DisplayStat() {
  return (
    <div className="flex flex-row justify-center items-center gap-2 py-3 lg:w-1/2 mx-auto">
      <div className="w-4/12 bg-slate-800"></div>
      <div className="w-8/12 bg-slate-800 font-bold"></div>
      <div className="w-4/12 bg-slate-800"></div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="text-center text-slate-300  w-11/12 md:w-3/4 mx-auto">
      {/* team logos */}
      <div className="flex flex-row justify-center items-center gap-12 pt-3 md:pt-6 lg:w-1/2 mx-auto">
        <div className="w-5/12 flex justify-end ">
          <GeneralLogo name={`sega-controller`} width="50" height="50" />
        </div>
        <div className="w-2/12 font-bold text-xl">@</div>
        <div className="w-5/12 flex justify-start">
          <GeneralLogo name={`sega-controller`} width="50" height="50" />
        </div>
      </div>

      {/* teams records */}
      <div className="flex flex-row justify-center items-center gap-12 py-3 lg:w-1/2 mx-auto">
        <div className="w-5/12 flex justify-end ">
          <div>{`(  Loading  )`}</div>
        </div>
        <div className="w-2/12 font-bold text-xl"></div>
        <div className="w-5/12 flex justify-start">
          <div>{`(  Boxscore  )`}</div>
        </div>
      </div>
      {/* game stats begin */}
      {/* score */}

      <div className="flex flex-row justify-center items-center gap-2 py-3 lg:w-1/2 mx-auto">
        <div className="w-4/12 bg-slate-800">-</div>
        <div className="w-8/12 bg-slate-800 font-bold">Score</div>
        <div className="w-4/12 bg-slate-800">-</div>
      </div>
      <div className="flex flex-row justify-center items-center gap-2 py-3 lg:w-1/2 mx-auto">
        <div className="w-4/12 bg-slate-800">-</div>
        <div className="w-8/12 bg-slate-800 font-bold">Shots</div>
        <div className="w-4/12 bg-slate-800">-</div>
      </div>
      <div className="flex flex-row justify-center items-center gap-2 py-3 lg:w-1/2 mx-auto">
        <div className="w-4/12 bg-slate-800">-</div>
        <div className="w-8/12 bg-slate-800 font-bold">Shooting</div>
        <div className="w-4/12 bg-slate-800">-</div>
      </div>
      <div className="flex flex-row justify-center items-center gap-2 py-3 lg:w-1/2 mx-auto">
        <div className="w-4/12 bg-slate-800">-</div>
        <div className="w-8/12 bg-slate-800 font-bold">PP</div>
        <div className="w-4/12 bg-slate-800">-</div>
      </div>
      <div className="flex flex-row justify-center items-center gap-2 py-3 lg:w-1/2 mx-auto">
        <div className="w-4/12 bg-slate-800">-</div>
        <div className="w-8/12 bg-slate-800 font-bold">Penalties</div>
        <div className="w-4/12 bg-slate-800">-</div>
      </div>
      <div className="flex flex-row justify-center items-center gap-2 py-3 lg:w-1/2 mx-auto">
        <div className="w-4/12 bg-slate-800">-</div>
        <div className="w-8/12 bg-slate-800 font-bold">SHG</div>
        <div className="w-4/12 bg-slate-800">-</div>
      </div>
      <div className="flex flex-row justify-center items-center gap-2 py-3 lg:w-1/2 mx-auto">
        <div className="w-4/12 bg-slate-800">-</div>
        <div className="w-8/12 bg-slate-800 font-bold">Breakaways</div>
        <div className="w-4/12 bg-slate-800">-</div>
      </div>
      <div className="flex flex-row justify-center items-center gap-2 py-3 lg:w-1/2 mx-auto">
        <div className="w-4/12 bg-slate-800">-</div>
        <div className="w-8/12 bg-slate-800 font-bold">Penalty Shots</div>
        <div className="w-4/12 bg-slate-800">-</div>
      </div>
      <div className="flex flex-row justify-center items-center gap-2 py-3 lg:w-1/2 mx-auto">
        <div className="w-4/12 bg-slate-800">-</div>
        <div className="w-8/12 bg-slate-800 font-bold">Checks</div>
        <div className="w-4/12 bg-slate-800">-</div>
      </div>
      <div className="flex flex-row justify-center items-center gap-2 py-3 lg:w-1/2 mx-auto">
        <div className="w-4/12 bg-slate-800">-</div>
        <div className="w-8/12 bg-slate-800 font-bold">Attack</div>
        <div className="w-4/12 bg-slate-800">-</div>
      </div>
    </div>
  );
}
