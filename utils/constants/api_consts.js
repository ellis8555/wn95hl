export const API_READ_SEASON_DATA = async function (
  domain,
  league,
  seasonNumber,
  field
) {
  const response = await fetch(
    `${domain}/api/season-data?league=${league}&season-number=${seasonNumber}&field=${field}`,
    {
      next: {
        revalidate: 0,
      },
    }
  );
  if (!response.ok) {
    const errorMessage = await response.json();
    throw new Error(errorMessage.message);
  }

  const responseData = await response.json();
  return responseData;
};
