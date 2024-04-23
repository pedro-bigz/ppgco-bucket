import {
  isValidCnpj,
  isValidCpf,
  isValidDate,
  isValidTime,
  isValidPastDate,
} from '..';

export const isValid = {
  date: isValidDate,
  cpf: isValidCpf,
  cnpj: isValidCnpj,
  time: isValidTime,
  pastDate: isValidPastDate,
};
