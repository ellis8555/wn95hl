function Page() {
  return (
    <>
      <h1 className="text-4xl text-center pt-4 mb-4">Dashboard</h1>
      <div className="text-center">
        <ul className="inline-block ps-2 sm:p-0 text-left list-none">
          <li>You have been redirected to the future dashboard page</li>
          <li>
            Admins will be able to access this protected page and edit the
            database from here
          </li>
          <li>You can sign out via the green arrow on the navigation bar</li>
        </ul>
      </div>
    </>
  );
}

export default Page;
