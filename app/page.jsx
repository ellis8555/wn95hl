import Link from "next/link";
import LeagueLogo from "@/components/server/Logos/LeagueLogo";

export const metadata = {
  title: "NHL95",
  description: "Test site for NHL95",
};

export default async function Page() {
  return (
    <div className="flex justify-center mt-2">
      <div className="text-slate-300">
        <h1 className="text-4xl lg:text-6xl text-center pt-4">
          NHL95 in development
        </h1>
        <p className="text-center mt-4">
          Temporary demo login:
          <br />
          <span className="underline underline-offset-4">
            username and password
          </span>{" "}
          are both <span className="text-green-400">'admin'</span>
          <br />
          <span className="underline underline-offset-4">Arrow icon</span> on
          navbar is login/out
        </p>
        {/* beginning of league cards */}
        <div className="flex flex-row justify-center mt-3 md:mt-6">
          <Link href="/standings">
            <div className="flex flex-col gap-6 border rounded-md p-8 shadow-2xl text-center">
              <LeagueLogo name="w" width="100" height="100" />
              <div>The W</div>
            </div>
          </Link>
        </div>
        {/* end of league cards */}
      </div>
    </div>
  );
}
