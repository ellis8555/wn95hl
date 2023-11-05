import Link from "next/link";

function Page() {
  return (
    <>
      <h1 className="text-4xl text-center pt-4 mb-4">Dashboard</h1>
      <div className="text-center">
        <ul className="inline-block ps-2 sm:p-0 text-left list-none">
          <li>You can sign out via the green arrow on the navigation bar</li>
          <li className="text-green-400">
            <Link href="/recent-scores">Edit a game</Link>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Page;
