import React, { useEffect, useState } from 'react';
import './App.css';
import { FaTrash, FaEdit } from 'react-icons/fa';

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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editando) {
      fetch(`http://localhost:3000/pratos/${editandoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: formData.nome,
          descricao: formData.descricao,
          preco: parseFloat(formData.preco),
          categoria: formData.categoria
        })
      })
        .then(response => response.json())
        .then(() => {
          buscarPratos();
          setFormData({ nome: '', descricao: '', preco: '', categoria: '' });
          setEditando(false);
          setEditandoId(null);
        })
        .catch(error => console.error('Erro ao atualizar prato:', error));
    } else {
      fetch('http://localhost:3000/pratos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: formData.nome,
          descricao: formData.descricao,
          preco: parseFloat(formData.preco),
          categoria: formData.categoria
        })
      })
        .then(response => response.json())
        .then(data => {
          setPratos([...pratos, data]);
          setFormData({ nome: '', descricao: '', preco: '', categoria: '' });
        })
        .catch(error => console.error('Erro ao cadastrar prato:', error));
    }
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:3000/pratos/${id}`, {
      method: 'DELETE'
    })
      .then(() => {
        setPratos(pratos.filter(prato => prato.id !== id));
      })
      .catch(error => console.error('Erro ao deletar prato:', error));
  };

  const handleEditClick = (prato) => {
    setFormData({
      nome: prato.nome || '',
      descricao: prato.descricao || '',
      preco: prato.preco !== undefined && prato.preco !== null ? prato.preco : '',
      categoria: prato.categoria || ''
    });
    setEditando(true);
    setEditandoId(prato.id);
  };

  return (
    <div className="App">
      <h1 className='title'>Cardápio Lemon<span className='hub'>Hub</span></h1>

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
  );
}

export default App;
