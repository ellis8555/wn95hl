import TableButton from "@/components/server/Buttons/TableButton";

export const COMPONENT_TABLE_BUTTON = function (
  name,
  { standings, setStandings, divisions, setIsTableFiltered, setSplitTables }
) {
  return (
    <TableButton
      standings={standings}
      setStandings={setStandings}
      divisions={divisions}
      setIsTableFiltered={setIsTableFiltered}
      setSplitTables={setSplitTables}
    >
      {name}
    </TableButton>
  );
};
