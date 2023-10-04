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
  }
) {
  return (
    <TableButton
      standings={standings}
      setStandings={setStandings}
      divisions={divisions}
      setIsTableFiltered={setIsTableFiltered}
      setSplitTables={setSplitTables}
      setConference={setConference}
    >
      {name}
    </TableButton>
  );
};
