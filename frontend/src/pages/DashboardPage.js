import { useEffect, useState } from 'react';
import api from '../services/api';
import { LogOut, Trash2, Plus, Shuffle } from 'lucide-react';
import { toast } from 'react-toastify';
import ConfirmModal from '../components/ConfirmModal';
import ResultModal from '../components/ResultModal';
import { getAvatar } from '../utils/getAvatar';

export default function DashboardPage() {

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [participantes, setParticipantes] = useState([]);
  const [sorteados, setSorteados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const abrirModalReset = () => setShowModal(true);
  const [confirmDelete, setConfirmDelete] = useState(null); // armazena o participante a ser removido
  const [showResult, setShowResult] = useState(false);

  const listar = async () => {
    setLoading(true);
    const { data } = await api.get('/participantes');
    console.log('Participantes retornados:', data);
    setParticipantes(data);
    setLoading(false);
  };


  const adicionar = async () => {
    if (!nome) return;
    await api.post('/participantes', { nome, email });
    toast.success('Participante adicionado!');
    setNome('');
    listar();
  };

  const remover = async (id) => {
    await api.delete(`/participantes/${id}`);
    toast.info('Participante removido.');
    listar();
  };

  const sortear = async () => {
    setLoading(true);
    const { data } = await api.post('/sortear');
    setSorteados(data);            // sem delay!
    setShowResult(true);
    setLoading(false);
  };


  const resetarParticipantes = async () => {
    await api.delete('/participantes');
    toast.warn('Todos os participantes foram removidos.');
    listar();
    setSorteados([]);
  };

  const logout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  useEffect(() => {
    listar();
    console.log("participantes");
    console.log(participantes);
  }, []);

  return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold text-[#906eff]">Dashboard</h2>
            <button
                onClick={logout}
                className="flex items-center text-sm text-[#906eff] hover:text-[#7f5df5] transition"
            >
              <LogOut className="w-4 h-4 mr-1" /> Sair
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <input
                className="flex-1 bg-gray-100 border border-gray-300 px-3 py-2 rounded-xl"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome do participante"
            />
            <input
                className="flex-1 bg-gray-100 border border-gray-300 px-3 py-2 rounded-xl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email do participante"
            />
            <button
                onClick={adicionar}
                className="flex items-center justify-center gap-2 bg-[#906eff] text-white px-4 py-2 rounded-xl hover:bg-[#7f5df5] transition"
            >
              <Plus size={16} /> Adicionar
            </button>
          </div>

          {/* Lista */}
          <div className="grid gap-3 mb-6">
            {participantes.map((p) => (
                <div
                    key={p.id}
                    className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-xl border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <img
                        src={getAvatar(p.email)}
                        alt={p.nome}
                        className="w-8 h-8 rounded-full border"
                    />
                    <span className="text-gray-800">{p.nome}</span>
                  </div>
                  <button
                      onClick={() => setConfirmDelete(p)}
                      className="text-red-400 hover:text-red-600 transition"
                      title="Remover"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

            ))}
          </div>

          {/* Ações */}
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <button
                onClick={sortear}
                className="flex-1 bg-[#906eff] text-white py-2 rounded-xl hover:bg-[#7f5df5] transition flex items-center justify-center gap-2"
            >
              <Shuffle size={16} /> Sortear
            </button>
            <button
                onClick={abrirModalReset}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-xl hover:bg-gray-300 transition"
            >
              Resetar Todos
            </button>
          </div>

          {/* Resultado */}
          <ResultModal
              show={showResult}
              onClose={() => setShowResult(false)}
              lista={sorteados}
              onResortear={sortear}
          />

        </div>
        <ConfirmModal
            show={showModal}
            onClose={() => setShowModal(false)}
            onConfirm={async () => {
              await resetarParticipantes();
              setShowModal(false);
            }}
            title="Tem certeza?"
            description="Você está prestes a remover todos os participantes."
            color="#906eff"
        />

        <ConfirmModal
            show={!!confirmDelete}
            onClose={() => setConfirmDelete(null)}
            onConfirm={async () => {
              await remover(confirmDelete.id);
              setConfirmDelete(null);
            }}
            title="Remover participante?"
            description={`Deseja realmente remover ${confirmDelete?.nome}?`}
            confirmLabel="Confirmar"
            cancelLabel="Cancelar"
            color="#ef4444"
        />

      </div>
  );
}