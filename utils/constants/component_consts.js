import TableButton from "@/components/server/Buttons/TableButton";

export const COMPONENT_TABLE_BUTTON = function (
  name,
  { standings, setStandings, divisions, setIsTableFiltered }
) {
  return (
    <TableButton
      standings={standings}
      setStandings={setStandings}
      divisions={divisions}
      setIsTableFiltered={setIsTableFiltered}
    >
      {name}
    </TableButton>
  );
};
