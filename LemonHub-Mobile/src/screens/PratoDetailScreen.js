import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView
} from 'react-native';
import { pratosService } from '../services/api';

export default function PratoDetailScreen({ route, navigation }) {
  const { prato } = route.params;

  const handleDelete = () => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir o prato '${prato.nome}'?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          onPress: async () => {
            try {
              await pratosService.deletar(prato.id);
              Alert.alert('Sucesso', 'Prato excluído com sucesso!');
              navigation.goBack(); // Volta para a lista após exclusão
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o prato.');
            }
          },
        },
      ]
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate('PratoForm', { prato: prato })}
          >
            <Text style={styles.headerButtonText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleDelete}
          >
            <Text style={styles.headerButtonText}>Excluir</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, prato]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.nome}>{prato.nome}</Text>
        <Text style={styles.descricao}>{prato.descricao}</Text>
        <Text style={styles.preco}>R$ {prato.preco?.toFixed(2)}</Text>
        <Text style={styles.categoria}>Categoria: {prato.categoria}</Text>
        {prato.disponivel !== undefined && (
          <Text style={[
            styles.disponivel,
            { color: prato.disponivel ? '#4CAF50' : '#F44336' }
          ]}>
            {prato.disponivel ? 'Disponível' : 'Indisponível'}
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginVertical: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  nome: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  descricao: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  preco: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  categoria: {
    fontSize: 14,
    color: '#999',
    marginBottom: 10,
  },
  disponivel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
    marginRight: 10,
  },
  headerButton: {
    marginLeft: 10,
    padding: 5,
  },
  headerButtonText: {
    color: '#667eea',
    fontWeight: 'bold',
  },
});