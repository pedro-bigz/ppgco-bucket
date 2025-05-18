import sequelize from 'sequelize';

export function insensitiveLike(search: string, searchIn: string) {
  return sequelize.where(
    sequelize.fn('LOWER', sequelize.col(searchIn)),
    'LIKE',
    `%${search.toLowerCase()}%`,
  );
}
