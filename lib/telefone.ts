// Máscara de telefone brasileiro: (00) 0000-0000 (fixo) ou (00) 00000-0000 (celular).
export function formatarTelefone(valorDigitado: string): string {
  const digitos = valorDigitado.replace(/\D/g, "").slice(0, 11);
  const tamanho = digitos.length;
  if (tamanho === 0) return "";
  if (tamanho <= 2) return `(${digitos}`;

  const ddd = digitos.slice(0, 2);
  const numero = digitos.slice(2);
  const tamanhoPrefixo = tamanho > 10 ? 5 : 4;

  if (numero.length <= tamanhoPrefixo) return `(${ddd}) ${numero}`;
  return `(${ddd}) ${numero.slice(0, tamanhoPrefixo)}-${numero.slice(tamanhoPrefixo)}`;
}
