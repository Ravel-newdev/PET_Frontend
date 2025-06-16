document.addEventListener('DOMContentLoaded', () => {
  const tabela = document.getElementById('tabela-participantes');

  // Carrega participantes ao abrir a tela
  fetch('/pet/gabarito/find/')
    .then(response => {
      if (!response.ok) throw new Error('Erro ao buscar participantes');
      return response.json();
    })
    .then(data => {
      tabela.innerHTML = '';
        data.forEach(participante => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${participante.nome}</td>
            <td>${participante.escola}</td>
            <td>${participante.matricula}</td>
            <td>
                <button class="btn-editar" data-id="${participante.id}" title="Editar participante">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-deletar" data-id="${participante.id}" title="Deletar participante">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;
        tabela.appendChild(tr);
        });
    })
    .catch(error => {
      console.error(error);
      Swal.fire('Erro!', 'Não foi possível carregar os participantes.', 'error');
    });
  document.getElementById('btn-buscar').addEventListener('click', () => {
  const campoFiltro = document.getElementById('campo-filtro').value;
  const termoBusca = prompt(`Digite o valor para buscar por ${campoFiltro}:`);
  if (!termoBusca) return;

  const termo = termoBusca.trim().toLowerCase();
  const linhas = document.querySelectorAll('#tabela-participantes tr');

  linhas.forEach(linha => {
    const colunas = linha.querySelectorAll('td');
    if (colunas.length < 3) return;

    const valor = {
      nome: colunas[0].textContent.toLowerCase(),
      escola: colunas[1].textContent.toLowerCase(),
      matricula: colunas[2].textContent.toLowerCase()
    }[campoFiltro];

    linha.style.display = valor.includes(termo) ? '' : 'none';
  });
});

});

/*
#O back terá algo parecido com isso, imagino
router.get("/pet/gabarito/find/", (req, res) => {
  // Simula a resposta
  res.json([
    { id: 1, nome: "João", escola: "Escola A", matricula: "12345" },
    { id: 2, nome: "Maria", escola: "Escola B", matricula: "54321" }
  ]);
});

*/
document.addEventListener('click', function (event) {
  if (event.target.closest('.btn-deletar')) {
    const btn = event.target.closest('.btn-deletar');
    const id = btn.getAttribute('data-id');

    Swal.fire({
      title: 'Tem certeza?',
      text: 'Essa ação não poderá ser desfeita.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EC644C',
      cancelButtonColor: '#696666',
      confirmButtonText: 'Sim, deletar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`/pet/gabarito/${id}`, {
          method: 'DELETE'
        })
        .then(response => {
          if (response.ok) {
            Swal.fire('Deletado', 'O participante foi removido.', 'success');
            btn.closest('tr').remove(); // Remove a linha da tabela
          } else {
            Swal.fire('Erro', 'Não foi possível deletar.', 'error');
          }
        })
        .catch(() => {
          Swal.fire('Erro', 'Houve um problema na conexão.', 'error');
        });
      }
    });
  }
});
