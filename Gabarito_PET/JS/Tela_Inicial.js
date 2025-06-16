// Inicio
/*
window.addEventListener('DOMContentLoaded', () => {
  fetch('/pet/gabarito/')
    .then(response => response.json())
    .then(data => {
      const select = document.getElementById('lista-arquivos');
      select.innerHTML = ''; 

      data.forEach(pdf => {
        const option = document.createElement('option');
        option.textContent = pdf.nome + ' - ' + pdf.data;
        option.value = pdf.id;
        select.appendChild(option);
      });
    });
});


document.getElementById('btn-deletar').addEventListener('click', () => {
  const select = document.getElementById('lista-arquivos');
  const id = select.value;

  fetch(`/pet/gabarito/${id}`, { method: 'DELETE' })
    .then(response => {
      if (response.ok) {
        alert('PDF deletado com sucesso!');
        location.reload();
      } else {
        alert('Erro ao deletar PDF');
      }
    });
});
*/
document.querySelector('.enviar').addEventListener('click', () => {
  const nome = document.getElementById('nome').value;
  const escola = document.getElementById('escola').value;
  const data = document.getElementById('data').value;
  const matricula = document.getElementById('matricula').value;

  sessionStorage.setItem('dadosGabarito', JSON.stringify({ nome, escola, data, matricula }));

  window.location.href = 'Confirmacao.html';
});
//alguns links eu usei onclick e outros addEventListener.
document.querySelector('.ver').addEventListener('click', () => {
  window.location.href = 'Participantes.html';
});

document.addEventListener('DOMContentLoaded', () => {
  carregarGabaritos();

  document.querySelector('.buscar').addEventListener('click', () => {
    const filtro = document.getElementById('busca').value.trim();
    carregarGabaritos(filtro);
  });

  document.getElementById('lista-arquivos').addEventListener('dblclick', (event) => {
    const idSelecionado = event.target.value;
    if (idSelecionado) {
      // Abrir imagem PNG em nova aba aqui
      window.open(`/imagens/${idSelecionado}.png`, '_blank'); 
    }
  });
});

function carregarGabaritos(filtro = '') {
  const url = filtro ? `/pet/gabarito/find/${encodeURIComponent(filtro)}` : `/pet/gabarito/find/null`;

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error('Erro ao buscar gabaritos');
      return res.json();
    })
    .then(gabaritos => {
      const select = document.getElementById('lista-arquivos');
      select.innerHTML = '';

      if (!Array.isArray(gabaritos) || gabaritos.length === 0) {
        const opt = document.createElement('option');
        opt.textContent = 'Nenhum gabarito encontrado.';
        select.appendChild(opt);
        return;
      }

      gabaritos.forEach(gab => {
        const option = document.createElement('option');
        option.value = gab.id;
        option.textContent = `${gab.nome} - ${gab.data}`;
        select.appendChild(option);
      });
    })
    .catch(err => {
      console.error('Erro ao carregar gabaritos:', err);
    });
}
