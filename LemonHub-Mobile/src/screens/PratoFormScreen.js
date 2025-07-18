import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Switch
} from 'react-native';
import { pratosService } from '../services/api';

export default function PratoFormScreen({ navigation, route }) {
  const prato = route.params?.prato;
  const isEditing = !!prato;

  const [nome, setNome] = useState(prato?.nome || '');
  const [descricao, setDescricao] = useState(prato?.descricao || '');
  const [preco, setPreco] = useState(prato?.preco?.toString() || '');
  const [categoria, setCategoria] = useState(prato?.categoria || '');
  const [disponivel, setDisponivel] = useState(prato?.disponivel === 1 || prato?.disponivel === 0 ? prato.disponivel === 1 : true);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!nome || !preco) {
      Alert.alert('Erro', 'Nome e preço são obrigatórios');
      return;
    }

    if (parseFloat(preco) <= 0) {
      Alert.alert('Erro', 'Preço deve ser maior que zero');
      return;
    }

    setLoading(true);
    try {
      const pratoData = {
        nome,
        descricao,
        preco: parseFloat(preco),
        categoria,
        disponivel
      };

      if (isEditing) {
        const updatedPrato = await pratosService.atualizar(prato.id, pratoData);
        Alert.alert("Sucesso", "Prato atualizado com sucesso!");
        navigation.navigate("PratoDetail", { prato: { ...prato, ...pratoData } }); // Passa o prato atualizado de volta
      } else {
        const newPrato = await pratosService.criar(pratoData);
        Alert.alert("Sucesso", "Prato criado com sucesso!");
        navigation.navigate("PratoDetail", { prato: newPrato }); // Passa o novo prato para a tela de detalhes
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o prato');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Nome *</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          placeholder="Nome do prato"
        />

        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={descricao}
          onChangeText={setDescricao}
          placeholder="Descrição do prato"
          multiline
          numberOfLines={3}
        />

        <Text style={styles.label}>Preço *</Text>
        <TextInput
          style={styles.input}
          value={preco}
          onChangeText={setPreco}
          placeholder="0.00"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Categoria</Text>
        <TextInput
          style={styles.input}
          value={categoria}
          onChangeText={setCategoria}
          placeholder="Ex: Entrada, Prato Principal, Sobremesa"
        />

        <View style={styles.switchContainer}>
          <Text style={styles.label}>Disponível</Text>
          <Switch
            value={disponivel}
            onValueChange={setDisponivel}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={disponivel ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Criar')}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#212121', // Fundo escuro
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#FFFFFF', // Branco para labels
  },
  input: {
    backgroundColor: '#FFFFFF', // Branco
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#FDD835', // Amarelo Limão para borda
    color: '#212121', // Texto escuro no input
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FDD835', // Amarelo Limão
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#212121', // Cinza Escuro/Fundo
    fontSize: 16,
    fontWeight: 'bold',
  },
});
