document.addEventListener("DOMContentLoaded", function () {
    fetchResponsaveis();
    fetchTiposResponsaveis();
    fetchPosts();

    document.getElementById('responsavelFormElement').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevenir o recarregamento da página
        saveResponsavel();
    });
});

function fetchResponsaveis() {
    fetch('http://10.188.35.110:8000/responsaveis') // Altere para o endpoint correto se necessário
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById('responsaveisList');
            list.innerHTML = '<ul class="list-group border border-danger">';
            data.responsaveis.forEach(resp => {
                // Extrair o nome da imagem corretamente
                const imageName = resp.foto.split('/').pop(); // Pegamos apenas o nome da imagem
                const imageUrl = `http://10.188.35.110:8000/responsaveisimg/${imageName}`; // Montamos o caminho correto da imagem

                list.innerHTML += `
                    <li class="list-group-item m-2 p-2 border-bottom">
                        <div class="row d-flex justify-content-between">
                            <div class="col-4">
                                <img src="${imageUrl}" alt="${resp.nome}" class="img-thumbnail" style="max-width: 150px;">
                            </div>
                            <div class="col-8">
                                <strong>${resp.nome}</strong>
                                <p>${resp.biografia}</p>
                                <button class="btn btn-info btn-sm float-end ms-2" 
                                    onclick="showEditResponsavelForm(${resp.id_resposaveis}, '${resp.nome}', '${resp.data_in}', '${resp.data_out}', '${resp.biografia}', '${resp.foto}', ${resp.tipos_resps_id_tipos_resps}, ${resp.posts_id_post})">Editar</button>
                                <button class="btn btn-danger btn-sm float-end" 
                                    onclick="deleteResponsavel(${resp.id_resposaveis})">Deletar</button>
                            </div>
                        </div>
                    </li>`;
            });
            list.innerHTML += '</ul>';
        })
        .catch(error => console.error('Erro ao buscar responsáveis:', error));
}


function fetchTiposResponsaveis() {
    fetch('http://10.188.35.110:8000/tipos-responsaveis') // Altere para o endpoint correto se necessário
        .then(response => response.json())
        .then(data => {
            
            const tiposSelect = document.getElementById('tiposResponsavel');
            data.responsaveis.forEach(tipo => {
            
                tiposSelect.innerHTML += `<option value="${tipo.id_tipos_resps}">${tipo.nome}</option>`;
            });
        })
        .catch(error => console.error('Erro ao buscar tipos de responsáveis:', error));
}

function fetchPosts() {
    fetch('http://10.188.35.110:8000/posts') // Altere para o endpoint correto se necessário
        .then(response => response.json())
        .then(data => {
            const postSelect = document.getElementById('post');
            data.posts.forEach(post => {
                postSelect.innerHTML += `<option value="${post.id_post}">${post.nome_post}</option>`;
            });
        })
        .catch(error => console.error('Erro ao buscar posts:', error));
}

function showAddResponsavelForm() {
    document.getElementById('responsavelForm').classList.remove('d-none');
    document.getElementById('responsavelId').value = '';
    document.getElementById('nomeResponsavel').value = '';
    document.getElementById('dataIn').value = '';
    document.getElementById('dataOut').value = '';
    document.getElementById('biografia').value = '';
    document.getElementById('foto').value = '';
    document.getElementById('tiposResponsavel').value = '';
    document.getElementById('post').value = '';
    document.getElementById('formTitle').innerText = 'Adicionar Novo Responsável';
    responsavelForm.scrollIntoView({ behavior: 'smooth' });
}

function showEditResponsavelForm(id, nome, dataIn, dataOut, biografia, foto, tipoId, postId) {
    document.getElementById('responsavelForm').classList.remove('d-none');
    document.getElementById('responsavelId').value = id;
    document.getElementById('nomeResponsavel').value = nome;
    document.getElementById('dataIn').value = dataIn.split('T')[0]; // Formatar data
    document.getElementById('dataOut').value = dataOut ? dataOut.split('T')[0] : ''; // Formatar data
    document.getElementById('biografia').value = biografia;
    document.getElementById('tiposResponsavel').value = tipoId;
    document.getElementById('post').value = postId;
    document.getElementById('formTitle').innerText = 'Editar Responsável';
}

function hideResponsavelForm() {
    document.getElementById('responsavelForm').classList.add('d-none');
}

function saveResponsavel() {
    const id = document.getElementById('responsavelId').value;
    const nome = document.getElementById('nomeResponsavel').value;
    const dataIn = document.getElementById('dataIn').value;
    const dataOut = document.getElementById('dataOut').value;
    const biografia = document.getElementById('biografia').value;
    const tipoId = document.getElementById('tiposResponsavel').value;
    const postId = document.getElementById('post').value;

    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('data_in', dataIn);
    formData.append('data_out', dataOut);
    formData.append('biografia', biografia);
    formData.append('foto', document.getElementById('foto').files[0]);
    formData.append('tipos_resps_id_tipos_resps', tipoId);
    formData.append('posts_id_post', postId);

    const method = id ? 'PATCH' : 'POST';
    const url = id ? `http://10.188.35.110:8000/responsaveis/${id}` : `http://10.188.35.110:8000/responsaveis`;

    fetch(url, {
        method: method,
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao salvar responsável');
        }
        return response.json();
    })
    .then(() => {
        fetchResponsaveis();
        hideResponsavelForm();
    })
    .catch(error => console.error('Erro ao salvar responsável:', error));
}

function deleteResponsavel(id) {
    fetch(`http://10.188.35.110:8000/responsaveis/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao deletar responsável');
        }
        fetchResponsaveis();
    })
    .catch(error => console.error('Erro ao deletar responsável:', error));
}
