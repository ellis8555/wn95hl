function TestingMessage() {
  return (
    <div className="w-full mt-4 mx-auto sm:rounded-lg p-3 sm:w-10/12 md:w-8/12">
      <ol className="ms-4 mx-auto list-decimal text-justify lg:w-7/12 md:mx-auto ">
        <li>
          Duplicate game states have been enabled soley for testing purposes
        </li>
        <li>
          Clicking reset button returns all numbers to zero and deletes all game
          states from the database. This will be seen from all users.
        </li>
      </ol>
    </div>
  );
}

export default TestingMessage;
