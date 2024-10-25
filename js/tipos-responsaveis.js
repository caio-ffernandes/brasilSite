document.addEventListener("DOMContentLoaded", function () {
    fetchTiposResponsaveis();

    document.getElementById('tipoRespFormElement').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevenir o recarregamento da página
        saveTipoResp();
    });
});

function fetchTiposResponsaveis() {
    fetch('http://10.188.35.64:8000/tipos-responsaveis')
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById('tiposRespList');
            list.innerHTML = '<ul class="list-group border border-danger">';
            data.responsaveis.forEach(tipoResp => {
                list.innerHTML += `
                    <li class="list-group-item m-2 p-2 border-bottom">
                        <div class="row d-flex justify-content-between">
                            <div class="col"><strong>${tipoResp.nome}</strong></div>
                            <div class="col"> 
                                <button class="btn btn-info btn-sm float-end ms-2" 
                                    onclick="showEditTipoRespForm(${tipoResp.id_tipos_resps}, '${tipoResp.nome}')">Editar</button>
                            </div>
                            <div class="col"> 
                                <button class="btn btn-danger btn-sm float-end" 
                                    onclick="deleteTipoResp(${tipoResp.id_tipos_resps})">Deletar</button>
                            </div>
                        </div>
                    </li>`;
            });
            list.innerHTML += '</ul>';
        })
        .catch(error => console.error('Erro ao buscar tipos responsáveis:', error));
}

function showAddTipoRespForm() {
    document.getElementById('tipoRespForm').classList.remove('d-none');
    document.getElementById('tipoRespId').value = '';
    document.getElementById('nomeTipoResp').value = '';
    document.getElementById('formTitle').innerText = 'Adicionar Tipo Responsável';
    tipoRespForm.scrollIntoView({ behavior: 'smooth' });
}

function showEditTipoRespForm(id, nome) {
    document.getElementById('tipoRespForm').classList.remove('d-none');
    document.getElementById('tipoRespId').value = id;
    document.getElementById('nomeTipoResp').value = nome;
    document.getElementById('formTitle').innerText = 'Editar Tipo Responsável';
}

function saveTipoResp() {
    const id = document.getElementById('tipoRespId').value;
    const nome = document.getElementById('nomeTipoResp').value;
    const method = id ? 'PATCH' : 'POST';
    const url = id ? `http://10.188.35.64:8000/tipos-responsaveis/${id}` : `http://10.188.35.64:8000/tipos-responsaveis`;

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome: nome })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao salvar tipo responsável');
        }
        return response.json();
    })
    .then(() => {
        fetchTiposResponsaveis();
        document.getElementById('tipoRespForm').classList.add('d-none');
    })
    .catch(error => console.error('Erro ao salvar tipo responsável:', error));
}

function deleteTipoResp(id) {
    fetch(`http://10.188.35.64:8000/tipos-responsaveis/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao deletar tipo responsável');
        }
        fetchTiposResponsaveis();
    })
    .catch(error => console.error('Erro ao deletar tipo responsável:', error));
}
