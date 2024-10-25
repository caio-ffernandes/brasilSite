document.addEventListener("DOMContentLoaded", function () {
    fetchPosts();
    fetchSubcategorias();

    document.getElementById('postFormElement').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevenir o recarregamento da página
        savePost();
    });
});

function fetchPosts() {
    fetch('http://10.188.35.64:8000/posts')
        .then(response => response.json())
        .then(data => {
            console.log(data); // Verificar o que está sendo retornado

            const list = document.getElementById('postsList');
            if (!data.posts || data.posts.length === 0) {
                list.innerHTML = '<p>Nenhum post encontrado.</p>';
                return;
            }

            list.innerHTML = '<ul class="list-group border border-danger">';

            data.posts.forEach(post => {
                // Verifica se a imagem existe, caso contrário, usa uma imagem padrão ou não exibe a imagem
                const nomeReal = post.imagem_post ? post.imagem_post.split("/").pop() : null;
                const imageUrl = nomeReal ? `http://10.188.35.64:8000/postsimg/${nomeReal}` : 'path/to/default-image.jpg'; // Caminho para uma imagem padrão

                list.innerHTML += `
                    <li class="list-group-item m-2 p-2 border-bottom">
                        <div class="row d-flex justify-content-between">
                            <div class="col-4">
                                ${nomeReal ? `<img src="${imageUrl}" alt="${post.nome_post}" class="img-thumbnail" style="max-width: 150px;">` : ''}
                            </div>
                            <div class="col-8">
                                <strong>${post.nome_post}</strong>
                                <p>${post.descricao_post}</p>
                                <button class="btn btn-info btn-sm float-end ms-2" 
                                    onclick="showEditPostForm(${post.id_post}, '${post.nome_post}', '${encodeURIComponent(post.descricao_post)}', '${post.imagem_post}', ${post.subcategorias_id_subcategoria})">Editar</button>
                                <button class="btn btn-danger btn-sm float-end" 
                                    onclick="deletePost(${post.id_post})">Deletar</button>
                            </div>
                        </div>
                    </li>`;
            });

            list.innerHTML += '</ul>';
        })
        .catch(error => console.error('Erro ao buscar posts:', error));
}

function fetchSubcategorias() {
    fetch('http://10.188.35.64:8000/subcategorias')
        .then(response => response.json())
        .then(data => {
            const subcategoriaSelect = document.getElementById('subcategoria');
            subcategoriaSelect.innerHTML = ''; // Limpar opções existentes
            data.subcategorias.forEach(sub => {
                subcategoriaSelect.innerHTML += `<option value="${sub.id_subcategoria}">${sub.nome_subcategoria}</option>`;
            });
        })
        .catch(error => console.error('Erro ao buscar subcategorias:', error));
}

function showAddPostForm() {
    document.getElementById('postForm').classList.remove('d-none');
    resetPostForm();
    document.getElementById('formTitle').innerText = 'Adicionar Novo Post';
    document.getElementById('postForm').scrollIntoView({ behavior: 'smooth' });
}

function showEditPostForm(id, nome, descricao, imagem, subcategoria) {
    document.getElementById('postForm').classList.remove('d-none');
    document.getElementById('postId').value = id;
    document.getElementById('nomePost').value = nome;
    document.getElementById('descricaoPost').value = decodeURIComponent(descricao); // Decodificar a descrição
    document.getElementById('imagemPost').value = ''; // Limpar o campo de imagem
    document.getElementById('subcategoria').value = subcategoria;
    document.getElementById('formTitle').innerText = 'Editar Post';

    // Pré-visualizar imagem se disponível
    const imageUrl = `http://10.188.35.64:8000/posts/${imagem.split('/').pop()}`;
    const preview = document.getElementById('imagemPostPreview');
    preview.src = imageUrl;
    preview.style.display = 'block';
}

function savePost() {
    const id = document.getElementById('postId').value;
    const nome = document.getElementById('nomePost').value;
    const descricao = document.getElementById('descricaoPost').value;
    const subcategoria = document.getElementById('subcategoria').value;
    const imagem = document.getElementById('imagemPost').files[0];

    const formData = new FormData();
    formData.append('nome_post', nome);
    formData.append('descricao_post', descricao);
    formData.append('subcategorias_id_subcategoria', subcategoria);
    if (imagem) {
        formData.append('imagem', imagem);
    }

    const method = id ? 'PATCH' : 'POST';
    const url = id ? `http://10.188.35.64:8000/posts/${id}` : `http://10.188.35.64:8000/posts`;

    fetch(url, {
        method: method,
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao salvar post');
        }
        return response.json();
    })
    .then(() => {
        fetchPosts();
        hidePostForm();
    })
    .catch(error => console.error('Erro ao salvar post:', error));
}

function hidePostForm() {
    document.getElementById('postForm').classList.add('d-none');
    resetPostForm();
}

function resetPostForm() {
    document.getElementById('postId').value = '';
    document.getElementById('nomePost').value = '';
    document.getElementById('descricaoPost').value = '';
    document.getElementById('imagemPost').value = '';
    document.getElementById('subcategoria').value = '';
    document.getElementById('imagemPostPreview').style.display = 'none'; // Ocultar pré-visualização
}

function deletePost(id) {
    fetch(`http://10.188.35.64:8000/posts/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao deletar post');
        }
        fetchPosts();
    })
    .catch(error => console.error('Erro ao deletar post:', error));
}
