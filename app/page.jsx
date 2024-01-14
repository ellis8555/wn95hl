import Link from "next/link";
import Alert from "@/components/server/Alerts/Alert";
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
        <Alert>Database restructuring occuring</Alert>
        <Alert>Currently standings only</Alert>
        {/* beginning of league cards */}
        <div className="flex flex-col sm:flex-row justify-center mt-3 gap-3 md:gap-6 md:mt-6">
          <Link href="/league/w">
            <div className="flex flex-col gap-6 border rounded-md p-8 shadow-2xl text-center">
              <LeagueLogo name="w" width="100" height="100" />
              <div>W standings</div>
            </div>
          </Link>
        </div>
        {/* end of league cards */}
      </div>
    </div>
  );
}
