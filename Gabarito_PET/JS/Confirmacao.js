// JS para Tela de Confirmação do Gabarito

window.addEventListener('DOMContentLoaded', () => {
  const dados = JSON.parse(sessionStorage.getItem('dadosGabarito'));
  const nomeInput = document.getElementById('nome');
  const escolaInput = document.getElementById('escola');
  const dataInput = document.getElementById('data');
  const inscricaoInput = document.getElementById('inscricao');
  const btnEditar = document.getElementById('btn-editar');
  const form = document.getElementById('confirmacao-gabarito');

  if (dados) {
    nomeInput.value = dados.nome;
    escolaInput.value = dados.escola;
    dataInput.value = dados.data;
    inscricaoInput.value = dados.matricula;
  }

  let editando = false;

  btnEditar.addEventListener('click', () => {
    if (!editando) {
      nomeInput.removeAttribute('readonly');
      escolaInput.removeAttribute('readonly');
      dataInput.removeAttribute('readonly');
      inscricaoInput.removeAttribute('readonly');

      btnEditar.textContent = 'Salvar Edição';
      editando = true;
    } else {
      
      Swal.fire({
        title: 'Confirmar edição?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sim, editar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          nomeInput.setAttribute('readonly', true);
          escolaInput.setAttribute('readonly', true);
          dataInput.setAttribute('readonly', true);
          inscricaoInput.setAttribute('readonly', true);

          btnEditar.textContent = 'Editar';
          editando = false;

          // Simulando PETCH
          fetch('/pet/gabarito/', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              nome: nomeInput.value,
              escola: escolaInput.value,
              data: dataInput.value,
              matricula: inscricaoInput.value
              // Adicione o ID se necessário
            })
          })
          .then(response => {
            if (response.ok) {
              Swal.fire('Editado com sucesso!', '', 'success');
            } else {
              Swal.fire('Erro ao editar', '', 'error');
            }
          });
        }
      });
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    Swal.fire({
      title: 'Deseja confirmar o envio?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim, enviar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const formData = new FormData();
        formData.append('nome', nomeInput.value);
        formData.append('escola', escolaInput.value);
        formData.append('data', dataInput.value);
        formData.append('matricula', inscricaoInput.value);
        // Adicione a imagem se tiver suporte na confirmação(Backend)

        fetch('/pet/gabarito/', {
          method: 'POST',
          body: formData
        })
        .then(response => {
          if (response.ok) {
            Swal.fire('Dados enviados com sucesso!', '', 'success');
            sessionStorage.clear();
            window.location.href = 'Tela_Inicial.html';
          } else {
            Swal.fire('Erro ao enviar os dados', '', 'error');
          }
        });
      }
    });
  });
});
