import { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [senha2, setSenha2] = useState('');
    const navigate = useNavigate();

    const cadastrar = async () => {
        if (!email || !senha || !senha2) {
            toast.warn('Preencha todos os campos');
            return;
        }

        if (senha !== senha2) {
            toast.error('As senhas não coincidem');
            return;
        }

        try {
            await api.post('/signup', { email, senha });
            toast.success('Conta criada com sucesso! Faça login.');
            navigate('/login');
        } catch (err) {
            toast.error('Erro ao cadastrar');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
                <h2 className="text-2xl font-bold text-center text-[#906eff] mb-6">
                    Criar Conta
                </h2>

                <input
                    className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Senha"
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                />
                <input
                    className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Repetir Senha"
                    type="password"
                    value={senha2}
                    onChange={(e) => setSenha2(e.target.value)}
                />

                <button
                    onClick={cadastrar}
                    className="w-full bg-[#906eff] text-white py-2 rounded-lg hover:bg-[#7f5df5] transition"
                >
                    Cadastrar
                </button>

                <div className="text-center mt-4">
                    <a
                        href="/login"
                        className="text-sm text-[#906eff] hover:underline"
                    >
                        Já tem conta? Entrar
                    </a>
                </div>
            </div>
        </div>
    );
}
