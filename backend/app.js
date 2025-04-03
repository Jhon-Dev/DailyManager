import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const autenticarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ erro: 'Token ausente' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'segredo');
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ erro: 'Token inválido' });
  }
};

app.post('/signup', async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) return res.status(400).json({ erro: 'Email e senha obrigatórios.' });
  try {
    const senhaHash = bcrypt.hashSync(senha, 8);
    const novoUsuario = await prisma.user.create({ data: { email, senhaHash } });
    res.status(201).json({ mensagem: 'Usuário criado com sucesso!', id: novoUsuario.id });
  } catch (error) {
    if (error.code === 'P2002') return res.status(400).json({ erro: 'Email já cadastrado.' });
    res.status(500).json({ erro: 'Erro ao criar usuário.' });
  }
});

app.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) return res.status(400).json({ erro: 'Email e senha obrigatórios.' });
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ erro: 'Usuário não encontrado.' });
    const senhaConfere = bcrypt.compareSync(senha, user.senhaHash);
    if (!senhaConfere) return res.status(401).json({ erro: 'Senha inválida.' });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'segredo', { expiresIn: '1d' });
    res.json({ token });
  } catch {
    res.status(500).json({ erro: 'Erro ao fazer login.' });
  }
});

app.post('/participantes', autenticarToken, async (req, res) => {
  const { nome, email } = req.body;
  if (!nome || !email) return res.status(400).json({ erro: 'Nome e email obrigatórios.' });
  try {
    const participante = await prisma.participant.create({
      data: { nome, email, userId: req.userId },
    });
    res.status(201).json(participante);
  } catch {
    res.status(500).json({ erro: 'Erro ao criar participante.' });
  }
});

app.get('/participantes', autenticarToken, async (req, res) => {
  try {
    const participantes = await prisma.participant.findMany({ where: { userId: req.userId } });
    res.json(participantes);
  } catch {
    res.status(500).json({ erro: 'Erro ao buscar participantes.' });
  }
});

app.post('/sortear', autenticarToken, async (req, res) => {
  try {
    const participantes = await prisma.participant.findMany({ where: { userId: req.userId } });
    const sorteio = [...participantes].sort(() => Math.random() - 0.5);
    res.json(sorteio);
  } catch {
    res.status(500).json({ erro: 'Erro ao sortear.' });
  }
});

app.delete('/participantes/:id', autenticarToken, async (req, res) => {
  const { id } = req.params;
  try {
    const participante = await prisma.participant.findUnique({ where: { id: parseInt(id) } });
    if (!participante || participante.userId !== req.userId) {
      return res.status(403).json({ erro: 'Acesso negado.' });
    }
    await prisma.participant.delete({ where: { id: parseInt(id) } });
    res.json({ mensagem: 'Participante removido com sucesso.' });
  } catch {
    res.status(500).json({ erro: 'Erro ao remover participante.' });
  }
});

app.delete('/participantes', autenticarToken, async (req, res) => {
  try {
    await prisma.participant.deleteMany({ where: { userId: req.userId } });
    res.json({ mensagem: 'Todos os participantes foram removidos.' });
  } catch {
    res.status(500).json({ erro: 'Erro ao resetar participantes.' });
  }
});

app.listen(3001, () => {
  console.log('Servidor rodando na porta 3001');
});
