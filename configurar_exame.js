// // ⬇️ Função para abrir o modal de edição e preencher os dados ⬇️
// function openEditModal(id) {
//     fetch(`/api/exames/${id}`)
//         .then(response => {
//             if (!response.ok) throw new Error('Erro ao carregar exame para edição');
//             return response.json();
//         })
//         .then(exame => {
//             document.getElementById('editExameId').value = exame.id;
//             document.getElementById('editTipoExame').value = exame.tipo_exame;
//             document.getElementById('editStatus').value = exame.status;
//             document.getElementById('editResultado').value = exame.resultado || '';
//             document.getElementById('editLaudo').value = exame.laudo;
//             document.getElementById('editModal').style.display = 'block';
//         })
//         .catch(error => console.error('Erro ao carregar exame para edição:', error));
// }

// // ⬇️ Função para deletar um exame ⬇️
// function deleteExame(id) {
//     if (confirm('Tem certeza que deseja excluir este exame?')) {
//         fetch(`/api/exames/${id}`, { method: 'DELETE' })
//             .then(response => {
//                 if (!response.ok) throw new Error('Erro ao excluir exame');
//                 return response.json();
//             })
//             .then(() => {
//                 alert('Exame deletado com sucesso!');
//                 window.location.reload(); // Recarrega a página para refletir a exclusão
//             })
//             .catch(error => console.error('Erro ao excluir exame:', error));
//     }
// }

// document.addEventListener('DOMContentLoaded', () => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const exameId = urlParams.get('id');

//     if (exameId) {
//         fetch(`/api/exames/${exameId}`)
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('Erro ao carregar os dados do exame');
//                 }
//                 return response.json();
//             })
//             .then(exame => {
//                 atualizarDadosExame(exame);
//             })
//             .catch(error => console.error('Erro ao carregar os dados do exame:', error));
//     } else {
//         console.error('ID do exame não fornecido na URL');
//     }

//     function atualizarDadosExame(exame) {
//         const examImage = document.getElementById('examImage');

//         // Verifica se há imagem e adiciona o caminho correto
//         const imagemSrc = exame.imagem_exame ? `/uploads/${exame.imagem_exame}` : 'default-image.jpg';
//         examImage.src = imagemSrc;
//         examImage.dataset.id = exame.id;

//         const examDetails = document.getElementById('examDetails');
//         examDetails.innerHTML = `
//             <tr>
//                 <td>${exame.id}</td>
//                 <td>${exame.paciente_nome || 'Nome não disponível'}</td>
//                 <td>${exame.analista_nome || 'Nome não disponível'}</td>
//                 <td>${exame.tipo_exame}</td>
//                 <td>${new Date(exame.data_exame).toLocaleDateString('pt-BR')}</td>
//                 <td>${exame.status}</td>
//                 <td>${exame.resultado || 'Resultado não disponível'}</td>
//                 <td>${exame.laudo || 'Laudo não disponível'}</td>
//                 <td>
//                     <button class="edit-btn" onclick="openEditModal(${exame.id})">Editar</button>
//                     <button class="delete-btn" onclick="deleteExame(${exame.id})">Deletar</button>
//                 </td>
//             </tr>
//         `;
//     }

//     document.getElementById('deleteImageBtn').addEventListener('click', () => {
//         if (confirm('Tem certeza que deseja excluir esta imagem?')) {
//             fetch(`/api/exames/${exameId}/imagem`, { method: 'DELETE' })
//                 .then(response => {
//                     if (!response.ok) throw new Error('Erro ao deletar imagem');
//                     return response.json();
//                 })
//                 .then(() => {
//                     document.getElementById('examImage').src = 'default-image.jpg';
//                     alert('Imagem deletada com sucesso!');
//                 })
//                 .catch(error => console.error('Erro ao deletar imagem:', error));
//         }
//     });

//     document.getElementById('editExameForm').addEventListener('submit', (e) => {
//         e.preventDefault();
//         const exameId = document.getElementById('editExameId').value;
//         const formData = new FormData();
//         formData.append('tipo_exame', document.getElementById('editTipoExame').value);
//         formData.append('status', document.getElementById('editStatus').value);
//         formData.append('resultado', document.getElementById('editResultado').value);
//         formData.append('laudo', document.getElementById('editLaudo').value);

//         const imagemInput = document.getElementById('editImagemExame');
//         if (imagemInput.files.length > 0) {
//             formData.append('imagem_exame', imagemInput.files[0]); // Adiciona nova imagem se selecionada
//         }

//         fetch(`/api/exames/${exameId}`, {
//             method: 'PUT',
//             body: formData,
//         })
//         .then(response => {
//             if (!response.ok) throw new Error('Erro ao editar exame');
//             return response.json();
//         })
//         .then(data => {
//             alert(data.message);
//             return fetch(`/api/exames/${exameId}`);
//         })
//         .then(response => response.json())
//         .then(exameAtualizado => {
//             atualizarDadosExame(exameAtualizado);
//             document.getElementById('editModal').style.display = 'none';
//         })
//         .catch(error => console.error('Erro ao editar exame:', error));
//     });

//     document.getElementById('closeEditModalBtn').addEventListener('click', () => {
//         document.getElementById('editModal').style.display = 'none';
//     });
// });

// // ⬇️ Atualizar imagem após edição ⬇️
// function updateExamImage(id) {
//     fetch(`/api/exames/${id}`)
//         .then(response => {
//             if (!response.ok) throw new Error('Erro ao carregar imagem do exame');
//             return response.json();
//         })
//         .then(exame => {
//             const examImage = document.getElementById('examImage');
//             examImage.src = exame.imagem_exame ? `/uploads/${exame.imagem_exame}?t=${new Date().getTime()}` : 'default-image.jpg';
//         })
//         .catch(error => console.error('Erro ao atualizar imagem do exame:', error));
// }

// document.addEventListener('DOMContentLoaded', () => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const exameId = urlParams.get('id');
//     if (exameId) {
//         carregarDadosExame(exameId);
//     }

//     document.getElementById('deleteImageBtn').addEventListener('click', () => abrirModalConfirmacao('Tem certeza que deseja excluir esta imagem?', () => deletarImagem(exameId)));
//     document.getElementById('editExameForm').addEventListener('submit', (e) => editarExame(e, exameId));
//     document.getElementById('closeModalBtn').addEventListener('click', fecharModal);
// });

// // Função para carregar os dados do exame e preencher a tabela e o modal
// function carregarDadosExame(id) {
//     fetch(`/api/exames/${id}`)
//         .then(response => response.json())
//         .then(exame => {
//             if (!exame.id) {
//                 alert('Exame não encontrado.');
//                 return;
//             }
//             document.getElementById('examImage').src = exame.imagem_exame ? `/uploads/${exame.imagem_exame}` : 'default-image.jpg';
//             document.getElementById('examDetails').innerHTML = `
//                 <tr>
//                     <td>${exame.id}</td>
//                     <td>${exame.paciente_nome || 'N/A'}</td>
//                     <td>${exame.analista || 'Nome indisponível'}</td>
//                     <td>${exame.data_exame ? new Date(exame.data_exame).toLocaleDateString('pt-BR') : '---'}</td>
//                     <td>${exame.tipo_exame}</td>
//                     <td>${exame.status}</td>
//                     <td>${exame.resultado || 'Sem resultado'}</td>
//                     <td>${exame.laudo || 'Nenhum'}</td>
//                     <td>
//                         <button class="edit-btn" onclick="abrirModalEdicao(${exame.id})">Editar</button>
//                         <button class="delete-btn" onclick="abrirModalConfirmacao(${exame.id}, 'exame')">Excluir</button>
//                     </td>
//                 </tr>
//             `;
//         })
//         .catch(error => console.error('Erro ao carregar os dados do exame:', error));
// }

// // Função para abrir o modal de edição
// function abrirModalEdicao(id) {
//     fetch(`/api/exames/${id}`)
//         .then(response => response.json())
//         .then(exame => {
//             document.getElementById('editExameId').value = exame.id;
//             document.getElementById('editTipoExame').value = exame.tipo_exame;
//             document.getElementById('editStatus').value = exame.status;
//             document.getElementById('editResultado').value = exame.resultado || '';
//             document.getElementById('editLaudo').value = exame.laudo || '';
            
//             let examImage = document.getElementById('examImage');
//             examImage.src = exame.imagem_exame ? `/uploads/${exame.imagem_exame}` : 'default-image.jpg';
//             document.getElementById('editModal').style.display = 'block';
//         })
//         .catch(error => console.error('Erro ao carregar exame:', error));
// }

// // Função para deletar imagem do exame
// function deletarImagem() {
//     mostrarConfirmacao('Tem certeza que deseja excluir esta imagem?', () => {
//         fetch(`/api/exames/${exameId}/imagem`, { method: 'DELETE' })
//             .then(response => response.json())
//             .then(() => {
//                 document.getElementById('examImage').src = 'default-image.jpg';
//                 exibirMensagem('Imagem deletada com sucesso!');
//             })
//             .catch(error => console.error('Erro ao deletar imagem:', error));
//     });
// }

// document.getElementById('deleteImageBtn').addEventListener('click', deletarImagem);

// // Função para enviar os dados atualizados do exame
// function atualizarExame(event) {
//     event.preventDefault();
//     const exameId = document.getElementById('editExameId').value;
//     const formData = new FormData();
    
//     formData.append('tipo_exame', document.getElementById('editTipoExame').value);
//     formData.append('status', document.getElementById('editStatus').value);
//     formData.append('resultado', document.getElementById('editResultado').value);
//     formData.append('laudo', document.getElementById('editLaudo').value);
    
//     const imagemInput = document.getElementById('editImagemExame');
//     if (imagemInput.files.length > 0) {
//         formData.append('imagem_exame', imagemInput.files[0]);
//     }

//     fetch(`/api/exames/${exameId}`, {
//         method: 'PUT',
//         body: formData
//     })
//     .then(response => response.json())
//     .then(data => {
//         exibirMensagem('Exame atualizado com sucesso!');
//         carregarDadosExame(exameId);
//         fecharModal();
//     })
//     .catch(error => console.error('Erro ao atualizar exame:', error));
// }

// document.getElementById('editExameForm').addEventListener('submit', atualizarExame);

// document.getElementById('deleteImageBtn').addEventListener('click', () => {
//     mostrarConfirmacao('Tem certeza que deseja excluir esta imagem?', () => {
//         fetch(`/api/exames/${exameId}/imagem`, { method: 'DELETE' })
//             .then(response => response.json())
//             .then(() => {
//                 document.getElementById('examImage').src = 'default-image.jpg';
//                 exibirMensagem('Imagem deletada com sucesso!');
//                 location.reload();
//             })
//             .catch(error => console.error('Erro ao deletar imagem:', error));
//     });
// });

// document.getElementById('closeEditModalBtn').addEventListener('click', () => {
//             document.getElementById('editModal').style.display = 'none';
//         });





// ⬇️ Função para abrir modal de edição ⬇️
function openEditModal(id) {
    fetch(`/api/exames/${id}`)
        .then(response => {
            if (!response.ok) throw new Error('Erro ao carregar exame para edição');
            return response.json();
        })
        .then(exame => {
            document.getElementById('editExameId').value = exame.id;
            document.getElementById('editTipoExame').value = exame.tipo_exame;
            document.getElementById('editStatus').value = exame.status;
            document.getElementById('editResultado').value = exame.resultado;
            document.getElementById('editLaudo').value = exame.laudo;
            document.getElementById('editModal').style.display = 'block';
        })
        .catch(error => console.error('Erro ao carregar exame para edição:', error));
}

// ⬇️ Função para deletar exame ⬇️
function deleteExame(id) {
    if (confirm('Tem certeza que deseja excluir este exame?')) {
        fetch(`/api/exames/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) throw new Error('Erro ao excluir exame');
            alert('Exame deletado com sucesso!');
            window.location.href = 'gerenciar_exames.html'; // Redireciona após a exclusão
        })
        .catch(error => console.error('Erro ao excluir exame:', error));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const exameId = urlParams.get('id');

    if (exameId) {
        fetch(`/api/exames/${exameId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao carregar os dados do exame');
                }
                return response.json();
            })
            .then(exame => {
                atualizarDadosExame(exame);
            })
            .catch(error => console.error('Erro ao carregar os dados do exame:', error));
    } else {
        console.error('ID do exame não fornecido na URL');
    }

    function atualizarDadosExame(exame) {
        const examImage = document.getElementById('examImage');
        examImage.src = exame.imagem_exame ? exame.imagem_exame : 'default-image.jpg';
        examImage.dataset.id = exame.id;

        const examDetails = document.getElementById('examDetails');
        examDetails.innerHTML = `
            <tr>
                <td>${exame.id}</td>
                <td>${exame.paciente_nome || 'Nome não disponível'}</td>
                <td>${exame.analista_nome || 'Nome não disponível'}</td>
                <td>${exame.tipo_exame}</td>
                <td>${new Date(exame.data_exame).toLocaleDateString('pt-BR')}</td>
                <td>${exame.status}</td>
                <td>${exame.resultado || 'Resultado não disponível'}</td>
                <td>${exame.laudo || 'Laudo não disponível'}</td>
                <td>
                    <button class="edit-btn" onclick="openEditModal(${exame.id})">Editar</button>
                    <button class="delete-btn" onclick="deleteExame(${exame.id})">Deletar</button>
                </td>
            </tr>
        `;
    }

    document.getElementById('deleteImageBtn').addEventListener('click', () => {
        if (confirm('Tem certeza que deseja excluir esta imagem?')) {
            fetch(`/api/exames/${exameId}/imagem`, { method: 'DELETE' })
                .then(response => {
                    if (!response.ok) throw new Error('Erro ao deletar imagem');
                    return response.json();
                })
                .then(() => {
                    document.getElementById('examImage').src = 'default-image.jpg';
                    alert('Imagem deletada com sucesso!');
                })
                .catch(error => console.error('Erro ao deletar imagem:', error));
        }
    });

    document.getElementById('editExameForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const exameId = document.getElementById('editExameId').value;
        const formData = new FormData();
        formData.append('tipo_exame', document.getElementById('editTipoExame').value);
        formData.append('status', document.getElementById('editStatus').value);
        formData.append('resultado', document.getElementById('editResultado').value);
        formData.append('laudo', document.getElementById('editLaudo').value);

        const imagemInput = document.getElementById('editImagemExame');
        if (imagemInput.files.length > 0) {
            formData.append('imagem_exame', imagemInput.files[0]); // Adiciona nova imagem se selecionada
        }

        fetch(`/api/exames/${exameId}`, {
            method: 'PUT',
            body: formData,
        })
        .then(response => {
            if (!response.ok) throw new Error('Erro ao editar exame');
            return response.json();
        })
        .then(data => {
            alert(data.message);
            return fetch(`/api/exames/${exameId}`);
        })
        .then(response => response.json())
        .then(exameAtualizado => {
            atualizarDadosExame(exameAtualizado);
            document.getElementById('editModal').style.display = 'none';
        })
        .catch(error => console.error('Erro ao editar exame:', error));
    });

    document.getElementById('closeEditModalBtn').addEventListener('click', () => {
        document.getElementById('editModal').style.display = 'none';
    });
});
