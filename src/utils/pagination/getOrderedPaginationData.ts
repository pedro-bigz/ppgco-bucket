export type OrderedPaginationParams = {
  page?: number;
  perPage?: number;
  order?: Record<string, 'ASC' | 'DESC'> | object;
};

const defaultPage = 1;
const defaultPerPage = 10;

export function getOrderedPaginationData({
  page = defaultPage,
  perPage = defaultPerPage,
  order = {},
}) {
  if (isNaN(page)) page = defaultPage;
  if (isNaN(perPage)) perPage = defaultPerPage;

  const limit = perPage;
  const offset = perPage * (page - 1);

  return {
    offset,
    limit,
    order: Object.entries(order) as any,
  };
}
