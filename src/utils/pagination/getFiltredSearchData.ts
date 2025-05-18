import { insensitiveLike } from '../database/insensitiveLike';

interface filtredSearchDataInterface {
  search?: string;
  searchIn?: string;
}

export function getFiltredSearchData({
  search,
  searchIn,
}: filtredSearchDataInterface) {
  return !search || !searchIn
    ? {}
    : {
        where: {
          [searchIn]: insensitiveLike(search, searchIn),
        },
      };
}
