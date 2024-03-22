import { FindAndCountOptions, Model as SequelizeModel } from 'sequelize';
import { Where } from 'sequelize/types/utils';
import { insensitiveLike } from 'utils';

interface Model {
  findAndCountAll: <T>(
    options?: Omit<FindAndCountOptions<any>, 'group'> | undefined,
  ) => Promise<{ count: number; rows: T[] }>;
}

export type Query = {
  [x: string]: { [x: string]: Where | any } | number | string;
};

export type QueryModifierCallback = (query: Query) => Query;

export type PaginatedResponseType<M> = {
  data: M;
  page: number;
  perPage: number;
  nextPage?: number;
  prevPage?: number;
  totalPages: number;
  totalItems: number;
};

export type PaginaginatedListingPromise<E> = Promise<
  PaginatedResponseType<E[]> | undefined
>;

export class AppListing<T extends Model> {
  private page: number;
  private perPage: number;
  private orders: [string, 'ASC' | 'DESC'][] = [];
  private search: string;
  private searchIn: string;
  private queryModifier: QueryModifierCallback;

  public static defaultPage = 1;
  public static defaultPerPage = 10;

  public constructor(private readonly model: T) {}

  public static create<T extends Model>(model: T | string) {
    const modelInstance =
      typeof model === 'string' ? eval(`new ${model}()`) : model;
    return new AppListing<T>(modelInstance);
  }

  public attachPagination(page: number, perPage: number) {
    this.page = page;
    this.perPage = perPage;

    return this;
  }

  public resetOrder() {
    this.orders = [];

    return this;
  }

  public attachOrder(orderBy: string, orderDirection: 'ASC' | 'DESC') {
    this.orders.push([orderBy, orderDirection]);

    return this;
  }

  public attachOrderObj(order: Record<string, 'ASC' | 'DESC'>) {
    const entries = Object.entries(order);

    if (!entries || !entries.length) return;

    this.orders.push(entries[0]);

    return this;
  }

  public attachMultipleOrder(order: [string, 'ASC' | 'DESC'][]) {
    this.orders = order;

    return this;
  }

  public attachSearch(search: string, searchIn: string) {
    this.search = search;
    this.searchIn = searchIn;

    return this;
  }

  public modifyQuery(queryModifier: QueryModifierCallback) {
    this.queryModifier = queryModifier;

    return this;
  }

  private buildPagination() {
    if (isNaN(this.page)) this.page = AppListing.defaultPage;
    if (isNaN(this.perPage)) this.perPage = AppListing.defaultPerPage;

    const limit = this.perPage;
    const offset = this.perPage * (this.page - 1);

    return {
      offset,
      limit,
    };
  }

  private buildSearch() {
    const search =
      !this.search || !this.searchIn
        ? {}
        : {
            [this.searchIn]: insensitiveLike(this.search, this.searchIn),
          };

    return { search };
  }

  private buildOrder() {
    const order = this.orders;
    return { order };
  }

  private buildQuery() {
    const { offset, limit } = this.buildPagination();
    const { search } = this.buildSearch();
    const { order } = this.buildOrder();

    const searchQuery = { where: { ...search }, offset, limit, order };
    const modifiedQuery = this?.queryModifier
      ? this.queryModifier(searchQuery)
      : searchQuery;

    return modifiedQuery;
  }

  private prepare<M extends SequelizeModel>(columns?: string[]) {
    const query = this.buildQuery();
    return this.model.findAndCountAll<M>({
      ...query,
      attributes: columns,
    });
  }

  public async get<M extends SequelizeModel>(
    columns?: string[],
  ): PaginaginatedListingPromise<M> {
    const { count: totalItems, rows: data } = await this.prepare<M>(columns);
    const totalPages = Math.ceil(totalItems / this.perPage);

    const result = {
      data,
      totalPages,
      totalItems,
      page: this.page,
      perPage: this.perPage,
      nextPage: this.page < totalPages ? this.page + 1 : undefined,
      prevPage: this.page > 1 ? this.page - 1 : undefined,
    };

    return result;
  }
}
