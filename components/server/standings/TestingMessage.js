function TestingMessage() {
  return (
    <div className="w-full mt-4 mx-auto sm:rounded-lg p-3 sm:w-10/12 md:w-8/12">
      <ol className="ms-4 mx-auto list-decimal text-justify lg:w-7/12 md:mx-auto ">
        <li>
          Duplicate game states have been enabled soley for testing purposes
        </li>
        <li>
          A game that includes an over time loss requires column 'BJ', 'GAME
          LENGTH' to have a value greater than 15:00 in order for proper pts and
          to increase the OTL category
        </li>
        <li>
          Clicking reset button returns all numbers to zero and deletes the game
          state from the database
        </li>
        <li>
          Game state can be edited to include the following team abbreviations
        </li>
        <ul>
          <li>AHC, MHA, MGG, AUT, BAY, ROM, HIG, CDA</li>
        </ul>
      </ol>
    </div>
  );
}

export default TestingMessage;
