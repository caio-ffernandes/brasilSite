document.addEventListener("DOMContentLoaded", function () {
    fetchResponsaveis();
    fetchTiposResponsaveis();
    fetchPosts();

    document.getElementById('responsavelFormElement').addEventListener('submit', function (event) {
        event.preventDefault();
        saveResponsavel();
    });
});

function fetchResponsaveis() {
    fetch('http://10.188.35.101:8000/responsaveis')
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById('responsaveisList');
            list.innerHTML = '<ul class="list-group border border-danger">';
            data.responsaveis.forEach(resp => {
                const imageName = resp.foto.split('/').pop();
                const imageUrl = `http://10.188.35.101:8000/responsaveisimg/${imageName}`;

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
                                    onclick="showEditResponsavelForm(${resp.id_resposaveis}, '${resp.nome}', '${resp.data_in}', '${resp.data_out || ''}', '${encodeURIComponent(resp.biografia)}', '${resp.foto}', ${resp.tipos_resps_id_tipos_resps}, ${resp.posts_id_post})">Editar</button>
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
    fetch('http://10.188.35.101:8000/tipos-responsaveis')
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
    fetch('http://10.188.35.101:8000/posts')
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
    resetResponsavelForm();
    document.getElementById('formTitle').innerText = 'Adicionar Novo Responsável';
    document.getElementById('responsavelForm').scrollIntoView({ behavior: 'smooth' });
}

function showEditResponsavelForm(id, nome, dataIn, dataOut, biografia, foto, tipoId, postId) {
    document.getElementById('responsavelForm').classList.remove('d-none');
    document.getElementById('responsavelId').value = id;
    document.getElementById('nomeResponsavel').value = nome;
    document.getElementById('dataIn').value = dataIn ? dataIn.split('T')[0] : '';
    document.getElementById('dataOut').value = dataOut ? dataOut.split('T')[0] : ''; // Certifique-se de que a data está correta
    document.getElementById('biografia').value = decodeURIComponent(biografia);
    document.getElementById('tiposResponsavel').value = tipoId || '';
    document.getElementById('post').value = postId || '';
    document.getElementById('formTitle').innerText = 'Editar Responsável';
    document.getElementById('responsavelForm').scrollIntoView({ behavior: 'smooth' });
}

function saveResponsavel() {
    const id = document.getElementById('responsavelId').value;
    const nome = document.getElementById('nomeResponsavel').value;
    const dataIn = document.getElementById('dataIn').value;
    const dataOut = document.getElementById('dataOut').value;
    const biografia = document.getElementById('biografia').value;
    const tipoId = document.getElementById('tiposResponsavel').value;
    const postId = document.getElementById('post').value;
    const fotoFile = document.getElementById('foto').files[0];

    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('data_in', dataIn);
    if (dataOut) formData.append('data_out', dataOut);
    formData.append('biografia', biografia || '');
    if (fotoFile) formData.append('foto', fotoFile); // Somente adiciona a foto se houver um arquivo
    formData.append('tipos_resps_id_tipos_resps', tipoId);
    formData.append('posts_id_post', postId);

    const method = id ? 'PATCH' : 'POST';
    const url = id ? `http://10.188.35.101:8000/responsaveis/${id}` : `http://10.188.35.101:8000/responsaveis`;

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

function hideResponsavelForm() {
    document.getElementById('responsavelForm').classList.add('d-none');
    resetResponsavelForm();
}

function resetResponsavelForm() {
    document.getElementById('responsavelId').value = '';
    document.getElementById('nomeResponsavel').value = '';
    document.getElementById('dataIn').value = '';
    document.getElementById('dataOut').value = '';
    document.getElementById('biografia').value = '';
    document.getElementById('foto').value = ''; // Limpa o campo de foto
    document.getElementById('tiposResponsavel').value = '';
    document.getElementById('post').value = '';
}

function deleteResponsavel(id) {
    fetch(`http://10.188.35.101:8000/responsaveis/${id}`, {
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
