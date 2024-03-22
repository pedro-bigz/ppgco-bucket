export const numberFormat = (num: number, options = {}, locale = 'pt-BR') => {
  const defaultOptions = {
    currency: 'BRL',
    style: 'decimal',
  };
  return new Intl.NumberFormat(locale, {
    ...defaultOptions,
    ...options,
  }).format(num);
};
