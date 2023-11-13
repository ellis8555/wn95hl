import TableButton from "@/components/client/Buttons/TableButton";

export const COMPONENT_TABLE_BUTTON = function (
  name,
  {
    standings,
    setStandings,
    divisions,
    setIsTableFiltered,
    setSplitTables,
    setConference,
    conferenceDetails,
  }
) {
  return (
    <TableButton
      key={name}
      standings={standings}
      setStandings={setStandings}
      divisions={divisions}
      setIsTableFiltered={setIsTableFiltered}
      setSplitTables={setSplitTables}
      setConference={setConference}
      conferenceDetails={conferenceDetails}
    >
      {name}
    </TableButton>
  );
};
