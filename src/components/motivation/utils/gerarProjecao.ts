export function gerarProjecao(pesoAtual: number, pesoDesejado: number) {
  const diferenca = pesoDesejado - pesoAtual;
  const pontos = [0, 0.25, 0.5, 0.75, 1];

  return pontos.map((p, i) => ({
    label: ["3 dias", "7 dias", "14 dias", "21 dias", "30 dias"][i],
    value: pesoAtual + diferenca * p,
  }));
}
