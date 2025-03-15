const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 7000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'admin-dash'))); // Serve arquivos estáticos da pasta admin-dash
app.use(express.static(path.join(__dirname, 'analista-dash')));
app.use('/uploads', express.static('uploads')); // Serve arquivos estáticos da pasta uploads

// Configuração do armazenamento do Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Define o diretório de destino
    },
    filename: (req, file, cb) => {
        // Define o nome do arquivo com a extensão original
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Garante que o nome do arquivo seja único
    }
});

// Inicializa o Multer com a configuração de armazenamento
const upload = multer({ storage });

// Conexão com o banco de dados
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Substitua pelo seu usuário do MySQL
    password: '', // Substitua pela sua senha do MySQL
    database: 'sgdl'
});

// Conectar ao banco de dados
db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL.');
});

// Sessão
app.use(session({
    secret: 'secret', // Troque por uma string secreta
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Defina como true se estiver usando HTTPS
}));

// Rota para o Dashboard
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin-dash', 'dashboard.html'));
});

// Rota para o Dashboard
app.get('/gerenciar_pacientes', (req, res) => {
    res.sendFile(path.join(__dirname, 'analista-dash', 'gerenciar_pacientes_ana.html'));
});

// Rota para servir a página de configuração do exame
app.get('/configurar_exame.html', (req, res) => {
    res.sendFile(path.join(__dirname, '/configurar_exame.html')); // Ajuste o caminho conforme necessário
});

// Rota para obter dados do Dashboard
app.get('/api/dashboard', (req, res) => {
    const query = `
        SELECT 
            (SELECT COUNT(*) FROM administrador) AS total_administradores,
            (SELECT COUNT(*) FROM analista) AS total_analistas,
            (SELECT COUNT(*) FROM paciente) AS total_pacientes,
            (SELECT COUNT(*) FROM exame) AS total_exames,
            (SELECT COUNT(*) FROM exame WHERE status = 'Pendente') AS exames_pendentes,
            (SELECT COUNT(*) FROM exame WHERE status = 'Concluído') AS exames_concluidos
    `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results[0]);
    });
});

// Rota para obter todos os administradores
app.get('/api/administradores', (req, res) => {
    db.query('SELECT * FROM administrador', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Rota para adicionar um novo administrador
app.post('/api/administradores', (req, res) => {
    const { nome_completo, email, senha } = req.body;
    const query = 'INSERT INTO administrador (nome_completo, email, senha) VALUES (?, ?, ?)';
    db.query(query, [nome_completo, email, senha], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: results.insertId, nome_completo, email, senha });
    });
});

// Rota para atualizar um administrador
app.put('/api/administradores/:id', (req, res) => {
    const { id } = req.params;
    const { nome_completo, email, senha } = req.body;
    const query = 'UPDATE administrador SET nome_completo = ?, email = ?, senha = ? WHERE id = ?';
    db.query(query, [nome_completo, email, senha, id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id, nome_completo, email, senha });
    });
});

// Rota para deletar um administrador
app.delete('/api/administradores/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM administrador WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(204).send(); // No Content
    });
});

// ------------------------------------------------------------------------

// Rota para obter todos os analistas
app.get('/api/analistas', (req, res) => {
    db.query('SELECT * FROM analista', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Rota para adicionar um novo analista
app.post('/api/analistas', (req, res) => {
    const { nome_completo, email, senha, especialidade } = req.body;
    const query = 'INSERT INTO analista (nome_completo, email, senha, especialidade) VALUES (?, ?, ?, ?)';
    db.query(query, [nome_completo, email, senha, especialidade], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: results.insertId, nome_completo, email, especialidade });
    });
});

// Rota para atualizar um analista
app.put('/api/analistas/:id', (req, res) => {
    const { id } = req.params;
    const { nome_completo, email, senha, especialidade } = req.body;
    const query = 'UPDATE analista SET nome_completo = ?, email = ?, senha = ?, especialidade = ? WHERE id = ?';
    db.query(query, [nome_completo, email, senha, especialidade, id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id, nome_completo, email, especialidade });
    });
});

// Rota para deletar um analista
app.delete('/api/analistas/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM analista WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(204).send(); // No Content
    });
});

// ------------------------------------------------------------------

// Rota para obter todos os pacientes
app.get('/api/pacientes', (req, res) => {
    db.query('SELECT * FROM paciente', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Rota para adicionar um novo paciente
app.post('/api/pacientes', (req, res) => {
    const { nome_completo, email, senha, genero, data_nascimento, telefone    } = req.body;
    const query = 'INSERT INTO paciente (nome_completo, email, senha, genero, data_nascimento, telefone) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [nome_completo, email, senha, genero, data_nascimento, telefone], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: results.insertId, nome_completo, email, genero, data_nascimento, telefone });
    });
});

// Rota para atualizar um paciente
app.put('/api/pacientes/:id', (req, res) => {
    const { id } = req.params;
    const { nome_completo, email, senha, genero, data_nascimento, telefone } = req.body;
    const query = 'UPDATE paciente SET nome_completo = ?, email = ?, senha = ?, genero = ?, data_nascimento = ?, telefone = ? WHERE id = ?';
    db.query(query, [nome_completo, email, senha, genero, data_nascimento, telefone, id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id, nome_completo, email, genero, data_nascimento, telefone });
    });
});

// Rota para deletar um paciente
app.delete('/api/pacientes/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM paciente WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(204).send(); // No Content
    });
});

// -----------------------------------------------------------------------

// Rota para obter todos os exames
app.get('/api/exames', (req, res) => {
    db.query('SELECT * FROM exame', (err, results) => {
        if (err) {
            console.error('Erro ao buscar exames:', err);
            return res.status(500).json({ error: err.message });
        }

        console.log('Exames encontrados:', results); // Log para depuração
        res.json(results);
    });
});


// Rota para obter um exame específico
app.get('/api/exames/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM exame WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Exame não encontrado' });
        }
        console.log('Resultado da consulta:', results[0]); // Adicione este log para verificar o resultado
        res.json(results[0]);
    });
});

// Rota para adicionar um novo exame
app.post('/api/exames', upload.single('imagem_exame'), (req, res) => {
    const { paciente_id, tipo_exame, status = 'Pendente', resultado, laudo } = req.body;
    const imagem_exame = req.file ? req.file.filename : null; // Salva o nome do arquivo

    const query = 'INSERT INTO exame (paciente_id, tipo_exame, data_exame, status, resultado, laudo, imagem_exame) VALUES (?, ?, NOW(), ?, ?, ?, ?)';

    db.query(query, [paciente_id, tipo_exame, status, resultado, laudo, imagem_exame], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        res.status(201).json({ 
            message: 'Exame adicionado com sucesso', 
            id: results.insertId,
            imagem_exame: imagem_exame ? `/uploads/${imagem_exame}` : null // Retorna o caminho da imagem
        });
    });
});

// Editar exame existente
app.put('/api/exames/:id', upload.single('imagem_exame'), (req, res) => {
    const { id } = req.params;
    const { tipo_exame, status, resultado, laudo } = req.body;
    const novaImagem = req.file ? req.file.path : null;

    // Primeiro, buscamos a imagem antiga no banco de dados
    db.query('SELECT imagem_exame FROM exame WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'Exame não encontrado' });

        const imagemAntiga = results[0].imagem_exame;

        // Se uma nova imagem foi enviada, deletamos a antiga do sistema de arquivos
        if (novaImagem && imagemAntiga) {
            const fs = require('fs');
            const path = require('path');
            const oldImagePath = path.join(__dirname, imagemAntiga);
            
            fs.unlink(oldImagePath, (err) => {
                if (err && err.code !== 'ENOENT') console.error('Erro ao deletar imagem antiga:', err);
            });
        }

        // Atualiza os dados do exame no banco de dados
        const query = 'UPDATE exame SET tipo_exame = ?, status = ?, resultado = ?, laudo = ?, imagem_exame = ? WHERE id = ?';
        db.query(query, [tipo_exame, status, resultado, laudo, novaImagem, id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Exame atualizado com sucesso' });
        });
    });
});


// Rota para deletar um exame
app.delete('/api/exames/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT imagem_exame FROM exame WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'Exame não encontrado' });

        const imagemExame = results[0].imagem_exame;

        db.query('DELETE FROM exame WHERE id = ?', [id], (err) => {
            if (err) return res.status(500).json({ error: err.message });

            if (imagemExame) {
                const fs = require('fs');
                const path = require('path');

                // Define o caminho correto da imagem
                const imagePath = path.join(__dirname, 'uploads', imagemExame);

                // Deleta a imagem se ela existir
                fs.access(imagePath, fs.constants.F_OK, (err) => {
                    if (!err) {
                        fs.unlink(imagePath, (err) => {
                            if (err) console.error('Erro ao deletar a imagem:', err);
                        });
                    }
                });
            }

            res.status(204).send();
        });
    });
});

app.delete('/api/exames/:id/imagem', (req, res) => {
    const { id } = req.params;

    // Primeiro, buscamos a imagem associada ao exame
    db.query('SELECT imagem_exame FROM exame WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'Exame não encontrado' });

        const imagemExame = results[0].imagem_exame;
        if (!imagemExame) return res.status(400).json({ message: 'Nenhuma imagem para deletar' });

        // Remover a imagem do sistema de arquivos
        const fs = require('fs');
        const path = require('path');
        const imagePath = path.join(__dirname, imagemExame);

        fs.unlink(imagePath, (err) => {
            if (err && err.code !== 'ENOENT') console.error('Erro ao deletar a imagem:', err);
        });

        // Atualizar o exame no banco para remover o caminho da imagem
        db.query('UPDATE exame SET imagem_exame = NULL WHERE id = ?', [id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Imagem deletada com sucesso' });
        });
    });
});
    
    // Iniciar o servidor
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });