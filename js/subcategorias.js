document.addEventListener("DOMContentLoaded", function () {
    fetchSubcategorias();
    fetchCulturas(); // Chama a função para buscar as culturas

    document.getElementById('subcategoriaFormElement').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevenir o recarregamento da página
        saveSubcategoria();
    });
});

function fetchSubcategorias() {
    fetch('http://10.188.35.101:8000/subcategorias') // Altere para o endpoint correto se necessário
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById('subcategoriasList');
            list.innerHTML = '<ul class="list-group border border-danger">';
            data.subcategorias.forEach(sub => {
                list.innerHTML += `
                    <li class="list-group-item m-2 p-2 border-bottom">
                        <div class="row d-flex justify-content-between">
                            <div class="col"><strong>${sub.nome_subcategoria}</strong></div>
                            <div class="col"> 
                                <button class="btn btn-info btn-sm float-end ms-2" 
                                    onclick="showEditSubcategoriaForm(${sub.id_subcategoria}, '${sub.nome_subcategoria}')">Editar</button>
                            </div>
                            <div class="col"> 
                                <button class="btn btn-danger btn-sm float-end" 
                                    onclick="deleteSubcategoria(${sub.id_subcategoria})">Deletar</button>
                            </div>
                        </div>
                    </li>`;
            });
            list.innerHTML += '</ul>';
        })
        .catch(error => console.error('Erro ao buscar subcategorias:', error));
}

function fetchCulturas() {
    fetch('http://10.188.35.101:8000/culturas') // Altere para o endpoint correto se necessário
        .then(response => response.json())
        .then(data => {
            const culturaSelect = document.getElementById('culturaSelect');
            culturaSelect.innerHTML = '<option value="">Selecione uma cultura</option>'; // Opcional: Reseta o select
            data.culturas.forEach(cultura => {
                const option = document.createElement('option');
                option.value = cultura.id_cultura; // Supondo que o ID da cultura seja 'id_cultura'
                option.textContent = cultura.nome_cultura; // Supondo que o nome da cultura seja 'nome_cultura'
                culturaSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Erro ao buscar culturas:', error));
}

function showAddSubcategoriaForm() {
    document.getElementById('subcategoriaForm').classList.remove('d-none');
    document.getElementById('subcategoriaId').value = '';
    document.getElementById('nomeSubcategoria').value = '';
    document.getElementById('culturaSelect').value = ''; // Reseta a seleção da cultura
    document.getElementById('formTitle').innerText = 'Adicionar Nova Subcategoria';
    subcategoriaForm.scrollIntoView({ behavior: 'smooth' });
}

function showEditSubcategoriaForm(id, nome) {
    document.getElementById('subcategoriaForm').classList.remove('d-none');
    document.getElementById('subcategoriaId').value = id;
    document.getElementById('nomeSubcategoria').value = nome;
    document.getElementById('formTitle').innerText = 'Editar Subcategoria';
    // Aqui você pode adicionar lógica para selecionar a cultura correspondente, se necessário.
}

function hideSubcategoriaForm() {
    document.getElementById('subcategoriaForm').classList.add('d-none');
}

function saveSubcategoria() {
    const id = document.getElementById('subcategoriaId').value;
    const nome = document.getElementById('nomeSubcategoria').value;
    const culturaId = document.getElementById('culturaSelect').value; // Obtém o valor da cultura selecionada

    const method = id ? 'PATCH' : 'POST';
    const url = id ? `http://10.188.35.101:8000/subcategorias/${id}` : `http://10.188.35.101:8000/subcategorias`;

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            nome_subcategoria: nome,
            culturas_id_cultura: culturaId // Inclui o ID da cultura no corpo da requisição
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao salvar subcategoria');
        }
        return response.json();
    })
    .then(() => {
        fetchSubcategorias();
        hideSubcategoriaForm();
    })
    .catch(error => console.error('Erro ao salvar subcategoria:', error));
}

function deleteSubcategoria(id) {
    fetch(`http://10.188.35.101:8000/subcategorias/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao deletar subcategoria');
        }
        fetchSubcategorias();
    })
    .catch(error => console.error('Erro ao deletar subcategoria:', error));
}
