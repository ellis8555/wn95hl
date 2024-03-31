import Link from "next/link";

function Page() {
  return (
    <div className="text-slate-300">
      <div className="text-center">
        <ul className="inline-block ps-2 sm:p-0 text-left list-none">
          {/* <li className="text-green-400">
            <Link href="/recent-scores">Edit a game</Link>
          </li> */}
          <li className="text-green-400">
            <Link href="dashboard/csv-request">Get game data in CSV format</Link>
          </li>
          <li className="text-green-400">
            <Link href="dashboard/reverse-submit">Reverse teams submit</Link>
          </li>
        </ul>
      </div>
</div>
  );
}

export default Page;
