import { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const { data } = await api.post('/login', { email, senha });
      localStorage.setItem('token', data.token);
      toast.success('Login realizado!');
      onLogin();
      navigate('/dashboard');
    } catch (err) {
      toast.error('Erro ao fazer login');
    }
  };

  return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
          <h2 className="text-2xl font-bold text-center text-[#906eff] mb-6">
            Entrar
          </h2>

          <input
              className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
          />
          <input
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
          />

          <button
              onClick={handleLogin}
              className="w-full bg-[#906eff] text-white py-2 rounded-lg hover:bg-[#7f5df5] transition"
          >
            Entrar
          </button>

          <div className="text-center mt-4">
            <a
                href="/signup"
                className="text-sm text-[#906eff] hover:underline"
            >
              Criar nova conta
            </a>
          </div>
        </div>
      </div>
  );
}
