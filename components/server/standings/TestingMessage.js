function TestingMessage() {
  return (
    <div className="w-full mt-4 mx-auto sm:rounded-lg p-3 sm:w-10/12 md:w-8/12">
      <ol className="ms-4 mx-auto list-decimal text-justify lg:w-3/4 md:mx-auto lg:text-center">
        <li>
          Duplicate game states have been enabled soley for testing purposes
        </li>
        <li>Only states with the listed teams will be accepted</li>
        <li>Clicking reset table button returns all numbers to zero</li>
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
