(function(){
  const form = document.getElementById('form-simulador');
  const resultado = document.getElementById('resultado');
  const cardVencedor = document.getElementById('card-vencedor');

  function parseCampo(id, erroId, nomeCampo){
    const el = document.getElementById(id);
    const erroEl = document.getElementById(erroId);
    const bruto = (el.value || '').trim().replace(',', '.');
    const valor = parseFloat(bruto);
    if (bruto === '' || isNaN(valor) || valor <= 0){
      erroEl.textContent = `Informe um valor válido para "${nomeCampo}".`;
      el.setAttribute('aria-invalid', 'true');
      return null;
    }
    erroEl.textContent = '';
    el.removeAttribute('aria-invalid');
    return valor;
  }

  function formatarMoeda(v){
    return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function calcular(e){
    if (e) e.preventDefault();

    const c1Valor = parseCampo('c1-valor', 'erro-c1-valor', 'valor do Carro 1');
    const c1Km = parseCampo('c1-km', 'erro-c1-km', 'KM por litro do Carro 1');
    const c2Valor = parseCampo('c2-valor', 'erro-c2-valor', 'valor do Carro 2');
    const c2Km = parseCampo('c2-km', 'erro-c2-km', 'KM por litro do Carro 2');
    const distancia = parseCampo('sim-dist', 'erro-sim-dist', 'distância percorrida');
    const preco = parseCampo('sim-preco', 'erro-sim-preco', 'preço do combustível');

    if ([c1Valor, c1Km, c2Valor, c2Km, distancia, preco].includes(null)){
      resultado.classList.remove('mostrar');
      cardVencedor.classList.remove('mostrar');
      return;
    }

    const c1Combustivel = (distancia / c1Km) * preco;
    const c2Combustivel = (distancia / c2Km) * preco;
    const c1Total = c1Valor + c1Combustivel;
    const c2Total = c2Valor + c2Combustivel;

    document.getElementById('res-c1-combustivel').textContent = formatarMoeda(c1Combustivel);
    document.getElementById('res-c2-combustivel').textContent = formatarMoeda(c2Combustivel);
    document.getElementById('res-c1-total').textContent = formatarMoeda(c1Total);
    document.getElementById('res-c2-total').textContent = formatarMoeda(c2Total);

    const cardC1 = document.getElementById('card-c1');
    const cardC2 = document.getElementById('card-c2');
    cardC1.classList.remove('vencedor');
    cardC2.classList.remove('vencedor');

    const nomeVencedor = document.getElementById('nome-vencedor');
    const detalheVencedor = document.getElementById('detalhe-vencedor');
    const categoria = document.getElementById('categoria');
    const veredito = document.getElementById('veredito');

    const diferencaPreco = Math.abs(c1Valor - c2Valor);
    const economiaPorKm = Math.abs((preco / c1Km) - (preco / c2Km));

    if (c1Total === c2Total){
      nomeVencedor.textContent = 'Empate';
      detalheVencedor.textContent = 'Os dois carros têm o mesmo custo total para essa distância.';
      veredito.innerHTML = 'Os dois carros apresentam o mesmo custo total para essa distância — é um empate.';
    } else {
      const c1Vence = c1Total < c2Total;
      const vencedorTotal = c1Vence ? c1Total : c2Total;
      const perdedorTotal = c1Vence ? c2Total : c1Total;
      const economia = perdedorTotal - vencedorTotal;
      const nome = c1Vence ? 'Carro 1' : 'Carro 2';

      (c1Vence ? cardC1 : cardC2).classList.add('vencedor');

      nomeVencedor.textContent = nome;

      const custoPorKm = preco / (c1Vence ? c1Km : c2Km);

  if (custoPorKm <= 2) {
      categoria.textContent = '🟢 Econômico';
    } else if (custoPorKm <= 3) {
      categoria.textContent = '🟡 Não Econômico';
  } else {
      categoria.textContent = '🔴 Não Compensa';
  }
      detalheVencedor.textContent = `Economia total de ${formatarMoeda(economia)} em relação ao outro carro, para ${distancia.toLocaleString('pt-BR')} km rodados.`;

      let texto = `🏆 O <strong>${nome}</strong> é a melhor opção: considerando o valor de compra e o combustível para ${distancia.toLocaleString('pt-BR')} km, ele sai mais barato.`;
      if (economiaPorKm > 0){
        const kmEquilibrio = diferencaPreco / economiaPorKm;
        texto += ` A partir de aproximadamente <strong>${kmEquilibrio.toLocaleString('pt-BR', {maximumFractionDigits: 0})} km</strong> rodados, a diferença no preço de compra é compensada pela economia de combustível.`;
      }
      veredito.innerHTML = texto;
    }

    cardVencedor.classList.add('mostrar');
    resultado.classList.add('mostrar');
    cardVencedor.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  form.addEventListener('submit', calcular);

  form.addEventListener('submit', calcular);

  // 👇 COLE O CÓDIGO AQUI
  document.getElementById('limpar').addEventListener('click', function () {
    form.reset();

    resultado.classList.remove('mostrar');
    cardVencedor.classList.remove('mostrar');

    document.getElementById('card-c1').classList.remove('vencedor');
    document.getElementById('card-c2').classList.remove('vencedor');

    document.querySelectorAll('.erro').forEach(function (erro) {
      erro.textContent = '';
    });
  });

})();