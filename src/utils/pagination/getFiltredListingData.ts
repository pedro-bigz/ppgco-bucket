import { getFiltredSearchData } from './getFiltredSearchData';
import { getOrderedPaginationData } from './getOrderedPaginationData';

interface filtredListingDataInterface {
  page: number;
  perPage: number;
  search?: string;
  searchIn?: string;
  order: Record<string, 'ASC' | 'DESC'>;
}

export type PaginatedResponseType<T> = {
  data: T;
  page: number;
  perPage: number;
  nextPage?: number;
  prevPage?: number;
  totalPages: number;
  totalItems: number;
};

export function getFiltredListingData({
  page,
  perPage,
  search,
  searchIn,
  order,
}: filtredListingDataInterface) {
  const pagination = getOrderedPaginationData({ page, perPage, order });
  const attachSearch = getFiltredSearchData({ search, searchIn });

  return {
    ...pagination,
    ...attachSearch,
  };
}
