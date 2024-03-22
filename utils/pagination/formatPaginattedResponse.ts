export function formatPaginattedResponse(
  { page, perPage },
  { count: totalItems, rows: data },
) {
  const totalPages = Math.ceil(totalItems / perPage);

  return {
    data,
    page,
    perPage,
    totalPages,
    totalItems,
    nextPage: page < totalPages ? page + 1 : undefined,
    prevPage: page > 1 ? page - 1 : undefined,
  };
}
