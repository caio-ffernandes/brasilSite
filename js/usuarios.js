document.addEventListener("DOMContentLoaded", function () {
    fetchUsuarios();

    document.getElementById('usuarioFormElement').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevenir o recarregamento da página
        saveUsuario();
    });
});

function fetchUsuarios() {
    fetch('http://10.188.35.110:8000/usuarios')
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById('usuariosList');
            list.innerHTML = '<ul class="list-group border border-danger">';
            data.usuarios.forEach(usuario => {
                list.innerHTML += `
                    <li class="list-group-item m-2 p-2 border-bottom">
                        <div class="row d-flex justify-content-between">
                            <div class="col"><strong>${usuario.nome}</strong> - ${usuario.email}</div>
                            <div class="col"> 
                                <button class="btn btn-info btn-sm float-end ms-2" 
                                    onclick="showEditUsuarioForm(${usuario.id}, '${usuario.nome}', '${usuario.email}', '${usuario.senha}', '${usuario.telefone}')">Editar</button>
                            </div>
                            <div class="col"> 
                                <button class="btn btn-danger btn-sm float-end" 
                                    onclick="deleteUsuario(${usuario.id})">Deletar</button>
                            </div>
                        </div>
                    </li>`;
            });
            list.innerHTML += '</ul>';
        })
        .catch(error => console.error('Erro ao buscar usuários:', error));
}

function showAddUsuarioForm() {
    document.getElementById('usuarioForm').classList.remove('d-none');
    document.getElementById('usuarioId').value = '';
    document.getElementById('usuarioNome').value = '';
    document.getElementById('usuarioEmail').value = '';
    document.getElementById('usuarioSenha').value = '';
    document.getElementById('usuarioTelefone').value = '';
    document.getElementById('formTitle').innerText = 'Adicionar Usuário';
    usuarioForm.scrollIntoView({ behavior: 'smooth' });
}

function showEditUsuarioForm(id, nome, email, senha, telefone) {
    document.getElementById('usuarioForm').classList.remove('d-none');
    document.getElementById('usuarioId').value = id;
    document.getElementById('usuarioNome').value = nome;
    document.getElementById('usuarioEmail').value = email;
    document.getElementById('usuarioSenha').value = senha;
    document.getElementById('usuarioTelefone').value = telefone;
    document.getElementById('formTitle').innerText = 'Editar Usuário';
}

function saveUsuario() {
    const id = document.getElementById('usuarioId').value;
    const nome = document.getElementById('usuarioNome').value;
    const email = document.getElementById('usuarioEmail').value;
    const senha = document.getElementById('usuarioSenha').value;
    const telefone = document.getElementById('usuarioTelefone').value;
    const method = id ? 'PATCH' : 'POST';
    const url = id ? `http://10.188.35.110:8000/usuarios/${id}` : `http://10.188.35.110:8000/usuarios`;

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome: nome, email: email, senha: senha, telefone: telefone })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao salvar usuário');
        }
        return response.json();
    })
    .then(() => {
        fetchUsuarios();
        document.getElementById('usuarioForm').classList.add('d-none');
    })
    .catch(error => console.error('Erro ao salvar usuário:', error));
}

function deleteUsuario(id) {
    fetch(`http://10.188.35.110:8000/usuarios/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao deletar usuário');
        }
        fetchUsuarios();
    })
    .catch(error => console.error('Erro ao deletar usuário:', error));
}
