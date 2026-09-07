// Formatação e validação de CPF/CNPJ, incluindo o CNPJ alfanumérico
// (Nota Técnica COCAD/RFB): 12 caracteres alfanuméricos + 2 dígitos
// verificadores numéricos.

function valorCaractere(c: string): number {
  // '0'-'9' -> 0-9, 'A'-'Z' -> 17-42 (código ASCII - 48), conforme spec da RFB.
  return c.charCodeAt(0) - 48;
}

function calcularDigito(base: string, pesos: number[]): number {
  const soma = base.split("").reduce((acc, c, i) => acc + valorCaractere(c) * pesos[i], 0);
  const resto = soma % 11;
  return resto < 2 ? 0 : 11 - resto;
}

function validarCPF(cpf: string): boolean {
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  const calcularDv = (tamanho: number) => {
    let soma = 0;
    for (let i = 0; i < tamanho; i++) soma += parseInt(cpf[i], 10) * (tamanho + 1 - i);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };
  return calcularDv(9) === parseInt(cpf[9], 10) && calcularDv(10) === parseInt(cpf[10], 10);
}

function validarCNPJ(cnpj: string): boolean {
  if (cnpj.length !== 14 || /^(.)\1{13}$/.test(cnpj)) return false;
  const base = cnpj.slice(0, 12);
  const dvInformado = cnpj.slice(12);
  if (!/^\d{2}$/.test(dvInformado)) return false;

  const dv1 = calcularDigito(base, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const dv2 = calcularDigito(base + String(dv1), [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  return dvInformado === `${dv1}${dv2}`;
}

/** Aceita CPF (11 dígitos) ou CNPJ (12 caracteres alfanuméricos + 2 dígitos), com ou sem máscara. */
export function validarCpfCnpj(valor: string): boolean {
  const limpo = valor.toUpperCase().replace(/[^0-9A-Z]/g, "");
  if (limpo.length === 11) return validarCPF(limpo);
  if (limpo.length === 14) return validarCNPJ(limpo);
  return false;
}

/** Aplica máscara de CPF (000.000.000-00) ou CNPJ (00.000.000/0000-00, alfanumérico) conforme o usuário digita. */
export function formatarCpfCnpj(valorDigitado: string): string {
  const bruto = valorDigitado.toUpperCase().replace(/[^0-9A-Z]/g, "");
  const temLetra = /[A-Z]/.test(bruto);

  if (!temLetra && bruto.length <= 11) {
    let saida = "";
    for (let i = 0; i < bruto.length; i++) {
      if (i === 3 || i === 6) saida += ".";
      if (i === 9) saida += "-";
      saida += bruto[i];
    }
    return saida;
  }

  const cortado = bruto.slice(0, 14);
  const base = cortado.slice(0, 12);
  const dv = cortado.slice(12).replace(/[^0-9]/g, "");

  let saida = "";
  for (let i = 0; i < base.length; i++) {
    if (i === 2 || i === 5) saida += ".";
    if (i === 8) saida += "/";
    saida += base[i];
  }
  if (dv.length > 0) saida += "-" + dv;
  return saida;
}
