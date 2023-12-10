import { FaCircleArrowRight } from "react-icons/fa6";
import { FaCircleArrowLeft } from "react-icons/fa6";

export default function Loading() {
  return (
    <>
      <h1 className="text-xl text-center text-orange-400 my-3 md:text-3xl md:my-6">
        Recent Scores
      </h1>
      <div className="flex flex-row justify-center gap-24">
        <FaCircleArrowLeft className="text-2xl cursor-pointer text-slate-300 hover:text-orange-400" />
        <FaCircleArrowRight className="text-2xl cursor-pointer text-slate-300 hover:text-orange-400" />
      </div>
    </>
  );
}
