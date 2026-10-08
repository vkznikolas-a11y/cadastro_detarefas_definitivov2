const campoTarefa = document.getElementById('campo-tarefa');
const botaoAdicionar = document.getElementById('botao-adicionar');
const listaTarefas = document.getElementById('lista-tarefas');
const contadorTarefas = document.getElementById('contador-tarefas');
const botaoTema = document.getElementById('botao-tema');
const body = document.body;

const botaoAjuda = document.getElementById('botao-ajuda');
const modalAjuda = document.getElementById('modal-ajuda');
const fecharModal = document.getElementById('fechar-modal');
const formularioCadastro = document.getElementById('formulario-cadastro');
const nomeUsuario = document.getElementById('nome-usuario');
const emailUsuario = document.getElementById('email-usuario');
const mensagemSucesso = document.getElementById('mensagem-sucesso');

// Elementos da nova aba de Perfil
const perfilNome = document.getElementById('perfil-nome');
const perfilEmail = document.getElementById('perfil-email');
const botaoLimparDados = document.getElementById('botao-limpar-dados');

// ===================================================
//  1. PERSISTÊNCIA DAS TAREFAS (LOCALSTORAGE)
// ===================================================

document.addEventListener('DOMContentLoaded', carregarTarefasSalvas);

function salvarTarefasNoStorage() {
    const tarefas = [];
    const itens = listaTarefas.querySelectorAll('.item-tarefa');

    itens.forEach(item => {
        const texto = item.querySelector('span').textContent;
        const concluida = item.classList.contains('concluida');
        tarefas.push({ texto, concluida });
    });

    localStorage.setItem('tarefas_guardadas', JSON.stringify(tarefas));
}

function carregarTarefasSalvas() {
    const tarefasSalvas = localStorage.getItem('tarefas_guardadas');
    if (tarefasSalvas) {
        const tarefas = JSON.parse(tarefasSalvas);
        tarefas.forEach(tarefa => {
            criarElementoTarefa(tarefa.texto, tarefa.concluida);
        });
    }
    atualizarContador();
}

// ===================================================
//  2. LÓGICA DAS TAREFAS
// ===================================================

function atualizarContador() {
    const totalTarefas = listaTarefas.children.length;
    if (totalTarefas === 1) {
        contadorTarefas.textContent = '1 tarefa na lista';
    } else {
        contadorTarefas.textContent = `${totalTarefas} tarefas na lista`;
    }
}

function criarElementoTarefa(textoTarefa, concluida = false) {
    const itemTarefa = document.createElement('li');
    itemTarefa.classList.add('item-tarefa');
    if (concluida) {
        itemTarefa.classList.add('concluida');
    }

    const spanTexto = document.createElement('span');
    spanTexto.textContent = textoTarefa;

    const divAcoes = document.createElement('div');
    divAcoes.classList.add('acoes');

    const botaoConcluir = document.createElement('button');
    botaoConcluir.innerHTML = '<i class="fa-solid fa-check"></i>';
    botaoConcluir.classList.add('botao-concluir');
    botaoConcluir.addEventListener('click', () => {
        itemTarefa.classList.toggle('concluida');
        salvarTarefasNoStorage();
    });

    const botaoExcluir = document.createElement('button');
    botaoExcluir.innerHTML = '<i class="fa-solid fa-trash"></i>';
    botaoExcluir.classList.add('botao-excluir');
    botaoExcluir.addEventListener('click', () => {
        itemTarefa.remove();
        atualizarContador();
        salvarTarefasNoStorage();
    });

    divAcoes.appendChild(botaoConcluir);
    divAcoes.appendChild(botaoExcluir);

    itemTarefa.appendChild(spanTexto);
    itemTarefa.appendChild(divAcoes);

    listaTarefas.appendChild(itemTarefa);
}

function adicionarTarefa() {
    const textoTarefa = campoTarefa.value.trim();

    if (textoTarefa === '') {
        alert('Por favor, digite uma tarefa!');
        return;
    }

    criarElementoTarefa(textoTarefa);
    salvarTarefasNoStorage();

    campoTarefa.value = '';
    campoTarefa.focus();
    atualizarContador();
}

botaoAdicionar.addEventListener('click', adicionarTarefa);

campoTarefa.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        adicionarTarefa();
    }
});

// Alternar Tema Light/Dark
botaoTema.addEventListener('click', () => {
    body.classList.toggle('modo-escuro');

    const icone = botaoTema.querySelector('i');

    if (body.classList.contains('modo-escuro')) {
        icone.classList.remove('fa-moon');
        icone.classList.add('fa-sun');
    } else {
        icone.classList.remove('fa-sun');
        icone.classList.add('fa-moon');
    }
});

// ===================================================
//  3. MODAL DE AJUDA, TABS E PERFIL
// ===================================================

function atualizarDadosPerfil() {
    const nomeSalvo = localStorage.getItem('usuario_nome');
    const emailSalvo = localStorage.getItem('usuario_email');

    perfilNome.textContent = nomeSalvo ? nomeSalvo : 'Nenhum nome salvo';
    perfilEmail.textContent = emailSalvo ? emailSalvo : 'Nenhum e-mail salvo';
}

// Salva o rascunho enquanto o usuário digita nos campos
nomeUsuario.addEventListener('input', () => {
    localStorage.setItem('usuario_nome', nomeUsuario.value);
});

emailUsuario.addEventListener('input', () => {
    localStorage.setItem('usuario_email', emailUsuario.value);
});

// Carrega os dados salvos nos campos assim que a página é aberta
document.addEventListener('DOMContentLoaded', () => {
    if (nomeUsuario && emailUsuario) {
        nomeUsuario.value = localStorage.getItem('usuario_nome') || '';
        emailUsuario.value = localStorage.getItem('usuario_email') || '';
    }
});

botaoAjuda.addEventListener('click', () => {
    modalAjuda.classList.add('visivel');

    nomeUsuario.value = localStorage.getItem('usuario_nome') || '';
    emailUsuario.value = localStorage.getItem('usuario_email') || '';
    atualizarDadosPerfil();
});

fecharModal.addEventListener('click', () => {
    modalAjuda.classList.remove('visivel');
});

window.addEventListener('click', (e) => {
    if (e.target === modalAjuda) {
        modalAjuda.classList.remove('visivel');
    }
});

function abrirAba(evento, abaId) {
    const conteudos = document.querySelectorAll('.conteudo-aba');
    conteudos.forEach(conteudo => conteudo.classList.remove('ativa'));

    const botoes = document.querySelectorAll('.botao-aba');
    botoes.forEach(botao => botao.classList.remove('ativa'));

    document.getElementById(abaId).classList.add('ativa');
    evento.currentTarget.classList.add('ativa');
}

formularioCadastro.addEventListener('submit', (e) => {
    e.preventDefault();

    localStorage.setItem('usuario_nome', nomeUsuario.value.trim());
    localStorage.setItem('usuario_email', emailUsuario.value.trim());

    atualizarDadosPerfil();

    mensagemSucesso.style.display = 'block';
    setTimeout(() => {
        mensagemSucesso.style.display = 'none';
    }, 3000);
});

// Limpar dados do perfil no localStorage
if (botaoLimparDados) {
    botaoLimparDados.addEventListener('click', () => {
        localStorage.removeItem('usuario_nome');
        localStorage.removeItem('usuario_email');

        nomeUsuario.value = '';
        emailUsuario.value = '';

        atualizarDadosPerfil();
        alert('Dados do perfil removidos com sucesso!');
    });
}