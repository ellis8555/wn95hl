import { connectToDb } from "@/utils/database";
import queryOneUser from "@/utils/db-queries/query-one/user/queryOneUser";
import nextResponse from "@/utils/api/next-response";

let db;

export const POST = async (req) => {
  const { name } = await req.json();

  try {
    db = await connectToDb();

    const getCoach = await queryOneUser(name);

    if (!getCoach) {
      return NextResponse.json(
        { message: "That coach was not found.." },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(getCoach, {
      status: 200,
    });
  } catch (error) {
    return nextResponse({ message: error.message }, 500, "POST");
  } finally {
    if (db) {
      db.close();
    }
  }
};
