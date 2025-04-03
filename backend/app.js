const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const prisma = require('./prisma');
const jwt = require('jsonwebtoken');
const autenticarToken = require('./middlewares/auth');

const app = express();
app.use(cors());
app.use(express.json());

// Rota de cadastro
app.post('/signup', async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ erro: 'Email e senha obrigatórios.' });
    }

    try {
        const senhaHash = bcrypt.hashSync(senha, 8);

        const novoUsuario = await prisma.user.create({
            data: {
                email,
                senhaHash
            }
        });

        res.status(201).json({ mensagem: 'Usuário criado com sucesso!', id: novoUsuario.id });
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(400).json({ erro: 'Email já cadastrado.' });
        }

        console.error(error);
        res.status(500).json({ erro: 'Erro ao criar usuário.' });
    }
});

app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ erro: 'Email e senha obrigatórios.' });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(401).json({ erro: 'Usuário não encontrado.' });
        }

        const senhaConfere = require('bcryptjs').compareSync(senha, user.senhaHash);

        if (!senhaConfere) {
            return res.status(401).json({ erro: 'Senha inválida.' });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao fazer login.' });
    }
});

app.post('/participantes', autenticarToken, async (req, res) => {
    const { nome } = req.body;

    if (!nome) return res.status(400).json({ erro: 'Nome obrigatório.' });

    try {
        const participante = await prisma.participant.create({
            data: {
                nome,
                userId: req.userId,
            },
        });

        res.status(201).json(participante);
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao criar participante.' });
    }
});

app.get('/participantes', autenticarToken, async (req, res) => {
    try {
        const participantes = await prisma.participant.findMany({
            where: { userId: req.userId },
        });

        res.json(participantes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao buscar participantes.' });
    }
});

app.post('/sortear', autenticarToken, async (req, res) => {
    try {
        const participantes = await prisma.participant.findMany({
            where: { userId: req.userId },
        });

        const sorteio = [...participantes].sort(() => Math.random() - 0.5);

        res.json(sorteio);
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao sortear.' });
    }
});

app.delete('/participantes/:id', autenticarToken, async (req, res) => {
    const { id } = req.params;

    try {
        // Verifica se o participante é do usuário logado
        const participante = await prisma.participant.findUnique({
            where: { id: parseInt(id) },
        });

        if (!participante || participante.userId !== req.userId) {
            return res.status(403).json({ erro: 'Acesso negado.' });
        }

        await prisma.participant.delete({
            where: { id: parseInt(id) },
        });

        res.json({ mensagem: 'Participante removido com sucesso.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao remover participante.' });
    }
});

app.delete('/participantes', autenticarToken, async (req, res) => {
    try {
        await prisma.participant.deleteMany({
            where: { userId: req.userId },
        });

        res.json({ mensagem: 'Todos os participantes foram removidos.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao resetar participantes.' });
    }
});


app.listen(3001, () => {
    console.log('Servidor rodando na porta 3001');
});