import React, { useEffect, useState } from 'react';
import './App.css';
import { FaTrash, FaEdit } from 'react-icons/fa';
import Login from './components/Login';
import Header from './components/Header';

function App() {
  const [pratos, setPratos] = useState([]);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    categoria: ''
  });
  const [editando, setEditando] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

  const [filtroNome, setFiltroNome] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');

  // Estados de autenticação
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Verificar se há token salvo no localStorage ao carregar a página
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // Função para fazer requisições com token
  const fetchWithAuth = (url, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return fetch(url, {
      ...options,
      headers
    });
  };

  const buscarPratos = () => {
    let url = 'http://localhost:3000/pratos/search?';
    if (filtroNome) url += `nome=${encodeURIComponent(filtroNome)}&`;
    if (filtroCategoria) url += `categoria=${encodeURIComponent(filtroCategoria)}&`;

    fetch(url)
      .then(response => response.json())
      .then(data => setPratos(data))
      .catch(error => console.error('Erro ao buscar pratos:', error));
  };

  useEffect(() => {
    buscarPratos();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      alert('Você precisa estar logado para realizar esta ação!');
      return;
    }

    try {
      if (editando) {
        const response = await fetchWithAuth(`http://localhost:3000/pratos/${editandoId}`, {
          method: 'PUT',
          body: JSON.stringify({
            nome: formData.nome,
            descricao: formData.descricao,
            preco: parseFloat(formData.preco),
            categoria: formData.categoria
          })
        });

        if (response.ok) {
          buscarPratos();
          setFormData({ nome: '', descricao: '', preco: '', categoria: '' });
          setEditando(false);
          setEditandoId(null);
        } else {
          const errorData = await response.json();
          alert(errorData.error || 'Erro ao atualizar prato');
        }
      } else {
        const response = await fetchWithAuth('http://localhost:3000/pratos', {
          method: 'POST',
          body: JSON.stringify({
            nome: formData.nome,
            descricao: formData.descricao,
            preco: parseFloat(formData.preco),
            categoria: formData.categoria
          })
        });

        if (response.ok) {
          const data = await response.json();
          setPratos([...pratos, data]);
          setFormData({ nome: '', descricao: '', preco: '', categoria: '' });
        } else {
          const errorData = await response.json();
          alert(errorData.error || 'Erro ao cadastrar prato');
        }
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('Erro de conexão com o servidor');
    }
  };

  const handleDelete = async (id) => {
    if (!isAuthenticated) {
      alert('Você precisa estar logado para realizar esta ação!');
      return;
    }

    if (!window.confirm('Tem certeza que deseja deletar este prato?')) {
      return;
    }

    try {
      const response = await fetchWithAuth(`http://localhost:3000/pratos/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setPratos(pratos.filter(prato => prato.id !== id));
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Erro ao deletar prato');
      }
    } catch (error) {
      console.error('Erro ao deletar prato:', error);
      alert('Erro de conexão com o servidor');
    }
  };

  const handleEditClick = (prato) => {
    if (!isAuthenticated) {
      alert('Você precisa estar logado para realizar esta ação!');
      return;
    }

    setFormData({
      nome: prato.nome || '',
      descricao: prato.descricao || '',
      preco: prato.preco !== undefined && prato.preco !== null ? prato.preco : '',
      categoria: prato.categoria || ''
    });
    setEditando(true);
    setEditandoId(prato.id);
  };

  const handleLogin = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setFormData({ nome: '', descricao: '', preco: '', categoria: '' });
    setEditando(false);
    setEditandoId(null);
  };

  // Se não estiver autenticado, mostrar tela de login
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      <Header user={user} onLogout={handleLogout} />

      <div className="app-content">
        <div className="forms-container">
          <div className="form-cadastro">
            <h2>{editando ? 'Editar Prato' : 'Adicionar Prato'}</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="nome"
                placeholder="Nome"
                value={formData.nome}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="descricao"
                placeholder="Descrição"
                value={formData.descricao}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                step="0.01"
                name="preco"
                placeholder="Preço"
                value={formData.preco === '' ? '' : Number(formData.preco)}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="categoria"
                placeholder="Categoria"
                value={formData.categoria}
                onChange={handleChange}
                required
              />
              <button className='button' type="submit">{editando ? 'Atualizar' : 'Cadastrar'}</button>
            </form>
          </div>

          <div className="form-busca">
            <h2>Buscar Pratos</h2>
            <form
              onSubmit={e => {
                e.preventDefault();
                buscarPratos();
              }}
            >
              <input
                type="text"
                placeholder="Buscar por nome"
                value={filtroNome}
                onChange={e => setFiltroNome(e.target.value)}
              />
              <input
                type="text"
                placeholder="Buscar por categoria"
                value={filtroCategoria}
                onChange={e => setFiltroCategoria(e.target.value)}
              />
              <button type="submit" className="button">Buscar</button>
            </form>
          </div>
        </div>

        <h2>Pratos</h2>
        <ul>
          {pratos.map(prato => (
            <li key={prato.id}>
              <strong className='product-name'>{prato.nome}</strong> - {prato.descricao} - R${prato.preco} ({prato.categoria})
              <button className="button-edit" onClick={() => handleEditClick(prato)}> <FaEdit /></button>
              <button className="button-delete" onClick={() => handleDelete(prato.id)}><FaTrash /></button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;