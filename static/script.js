function definirSaldo() {
  const input = document.getElementById("saldo-inicial").value.replace(",", ".");
  const saldo = parseFloat(input);

  if (isNaN(saldo) || saldo < 0) {
    alert("❌ Saldo inválido. Use números com vírgula ou ponto.");
    return;
  }

  localStorage.setItem("saldo_inicial", saldo);
  atualizarInterface();
}

function adicionarGasto() {
  const valor = parseFloat(document.getElementById("valor").value.replace(",", "."));
  const categoria = document.getElementById("categoria").value;
  let data = document.getElementById("data").value.trim();

  // Validação do valor
  if (isNaN(valor) || valor <= 0) {
    alert("❌ Valor inválido. Use números com vírgula ou ponto.");
    return;
  }

  // Formatar data se estiver no formato 8 dígitos (ex: 25102025)
  if (data && /^\d{8}$/.test(data)) {
    data = `${data.slice(0, 2)}/${data.slice(2, 4)}/${data.slice(4)}`;
  }

  if (data && !dataValida(data)) {
    alert("❌ Data inválida. Use o formato DD/MM/AAAA.");
    return;
  }

  const gastos = JSON.parse(localStorage.getItem("gastos")) || [];
  gastos.push({ valor, categoria, data });
  localStorage.setItem("gastos", JSON.stringify(gastos));
  atualizarInterface();

  document.getElementById("valor").value = "";
  document.getElementById("categoria").value = "";
  document.getElementById("data").value = "";
}

// Função para validar datas reais no formato DD/MM/AAAA
function dataValida(dataStr) {
  const [dia, mes, ano] = dataStr.split("/").map(Number);
  const data = new Date(ano, mes - 1, dia);
  return (
    data.getFullYear() === ano &&
    data.getMonth() === mes - 1 &&
    data.getDate() === dia
  );
}

function excluirGasto(indice) {
  const gastos = JSON.parse(localStorage.getItem("gastos")) || [];
  gastos.splice(indice, 1);
  localStorage.setItem("gastos", JSON.stringify(gastos));
  atualizarInterface();
}

function atualizarInterface() {
  const saldoInicial = parseFloat(localStorage.getItem("saldo_inicial")) || 0;
  const gastos = JSON.parse(localStorage.getItem("gastos")) || [];

  let total = 0;
  const tabela = document.getElementById("tabela-gastos");
  tabela.innerHTML = `
    <tr>
      <th>Valor</th>
      <th>Categoria</th>
      <th>Data</th>
      <th>Ações</th>
    </tr>
  `;

  gastos.forEach((g, i) => {
    total += g.valor;
    const linha = tabela.insertRow();
    linha.insertCell(0).textContent = `R$ ${g.valor.toFixed(2)}`;
    linha.insertCell(1).textContent = g.categoria;
    linha.insertCell(2).textContent = g.data;
    const btn = document.createElement("button");
    btn.textContent = "Excluir";
    btn.setAttribute("onclick", `excluirComAnimacao(this, ${i})`);
    linha.insertCell(3).appendChild(btn);
  });

  const saldoRestante = saldoInicial - total;

  // Corrigido: agora são elementos DOM
  const saldoDisponivelEl = document.getElementById("saldo-disponivel");
  const saldoInicialFinalEl = document.getElementById("saldo-inicial-final");
  const saldoRestanteEl = document.getElementById("saldo-restante");

  saldoDisponivelEl.textContent = saldoInicial.toFixed(2);
  saldoInicialFinalEl.textContent = saldoInicial.toFixed(2);
  saldoRestanteEl.textContent = saldoRestante.toFixed(2);
  document.getElementById("total-gastos").textContent = total.toFixed(2);

  // Limpa classes anteriores
  saldoRestanteEl.classList.remove("saldo-verde", "saldo-laranja", "saldo-vermelho");

  const porcentagem = (saldoRestante / saldoInicial) * 100;
  if (porcentagem >= 50) {
    saldoRestanteEl.classList.add("saldo-verde");
  } else if (porcentagem >= 15) {
    saldoRestanteEl.classList.add("saldo-laranja");
  } else {
    saldoRestanteEl.classList.add("saldo-vermelho");
  }

  // Limpa campos de entrada após adicionar gasto
  document.getElementById("valor").value = "";
  document.getElementById("categoria").value = "";
  document.getElementById("data").value = "";
}

function exportarCSV() {
  const gastos = JSON.parse(localStorage.getItem("gastos")) || [];
  const agora = new Date();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const ano = agora.getFullYear();
  const nomeArquivo = `relatorio-${mes}-${ano}.csv`;

  let csv = `Relatório gerado em: ${mes}/${ano}\n\n`;
  csv += "Valor,Categoria,Data\n";
  gastos.forEach(g => {
    csv += `${g.valor},${g.categoria},${g.data}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nomeArquivo;
  a.click();
  URL.revokeObjectURL(url);
}

function exportarExcel() {
  const gastos = JSON.parse(localStorage.getItem("gastos")) || [];
  const agora = new Date();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const ano = agora.getFullYear();
  const nomeArquivo = `relatorio-${mes}-${ano}.xlsx`;

  const dados = [
    [`Relatório gerado em: ${mes}/${ano}`],
    [],
    ["Valor", "Categoria", "Data"],
    ...gastos.map(g => [g.valor, g.categoria, g.data])
  ];

  const ws = XLSX.utils.aoa_to_sheet(dados);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Relatório");

  XLSX.writeFile(wb, nomeArquivo);
}

document.addEventListener("DOMContentLoaded", atualizarInterface);

function excluirComAnimacao(botao, indice) {
  const linha = botao.closest("tr");
  linha.classList.add("fade-out");

  setTimeout(() => {
    excluirGasto(indice);
  }, 500);
}
