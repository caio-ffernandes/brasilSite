document.addEventListener("DOMContentLoaded", function () {
    fetchCulturas();

    document.getElementById('culturaFormElement').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevenir o recarregamento da página
        saveCultura();
    });
});

function fetchCulturas() {
    fetch('http://localhost:8000/culturas')
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById('culturasList');
            list.innerHTML = '<ul class="list-group border border-danger">';
            data.culturas.forEach(cultura => {
                list.innerHTML += `
                    <li class="list-group-item m-2 p-2 border-bottom">
                        <div class="row d-flex justify-content-between">
                            <div class="col"><strong>${cultura.nome_cultura}</strong></div>
                            <div class="col"> 
                                <button class="btn btn-info btn-sm float-end ms-2" 
                                    onclick="showEditCulturaForm(${cultura.id_cultura}, '${cultura.nome_cultura}')">Editar</button>
                            </div>
                            <div class="col"> 
                                <button class="btn btn-danger btn-sm float-end" 
                                    onclick="deleteCultura(${cultura.id_cultura})">Deletar</button>
                            </div>
                        </div>
                    </li>`;
            });
            list.innerHTML += '</ul>';
        })
        .catch(error => console.error('Erro ao buscar culturas:', error));
}

function showAddCulturaForm() {
    document.getElementById('culturaForm').classList.remove('d-none');
    document.getElementById('culturaId').value = '';
    document.getElementById('nomeCultura').value = '';
    document.getElementById('formTitle').innerText = 'Adicionar Cultura';
    culturaForm.scrollIntoView({ behavior: 'smooth' });
}

function showEditCulturaForm(id, nome) {
    document.getElementById('culturaForm').classList.remove('d-none');
    document.getElementById('culturaId').value = id;
    document.getElementById('nomeCultura').value = nome;
    document.getElementById('formTitle').innerText = 'Editar Cultura';
}

function saveCultura() {
    const id = document.getElementById('culturaId').value;
    const nome = document.getElementById('nomeCultura').value;
    const method = id ? 'PATCH' : 'POST';
    const url = id ? `http://localhost:8000/culturas/${id}` : `http://localhost:8000/culturas`;

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome_cultura: nome })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao salvar cultura');
        }
        return response.json();
    })
    .then(() => {
        fetchCulturas();
        document.getElementById('culturaForm').classList.add('d-none');
    })
    .catch(error => console.error('Erro ao salvar cultura:', error));
}

function deleteCultura(id) {
    fetch(`http://localhost:8000/culturas/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao deletar cultura');
        }
        fetchCulturas();
    })
    .catch(error => console.error('Erro ao deletar cultura:', error));
}
