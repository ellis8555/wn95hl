import Link from "next/link";
import Image from "next/image";
import { FaSignInAlt } from "react-icons/fa";

function Navbar() {
  return (
    <>
      <nav className="flex flex-row gap-4 justify-between bg-slate-800 mb-2 p-2">
        <ul className="flex flex-row">
          <li>
            <Link href="/">
              <Image
                src="/images/home-page/NHL95onlineBANNER2-removebg-preview-removebg-preview.png"
                alt="NHL 95 online"
                width={200}
                height={200}
                priority
              />
            </Link>
          </li>
        </ul>
        <ul className="flex flex-row gap-4 items-center">
          <li>
            <Link href="Standings">Standings</Link>
          </li>
          <li>
            <Link href="SignIn">
              <FaSignInAlt />
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Navbar;
