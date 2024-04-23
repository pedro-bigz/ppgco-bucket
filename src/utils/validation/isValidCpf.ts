import { allCharactersAreSame, onlyNumbers } from '..';

export function isValidCpf(cpfInput: string): boolean {
  const cpf = onlyNumbers(cpfInput);

  if (cpf.length < 11 || allCharactersAreSame(cpf)) {
    return false;
  }

  let Soma = 0;
  let Resto: number;

  for (let i = 1; i <= 9; i++) {
    Soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  Resto = (Soma * 10) % 11;

  if (Resto == 10 || Resto == 11) Resto = 0;
  if (Resto != parseInt(cpf.substring(9, 10))) return false;

  Soma = 0;
  for (let i = 1; i <= 10; i++) {
    Soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  Resto = (Soma * 10) % 11;

  if (Resto == 10 || Resto == 11) Resto = 0;
  if (Resto != parseInt(cpf.substring(10, 11))) return false;

  return true;
}
