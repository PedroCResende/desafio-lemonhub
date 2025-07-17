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
  const [prato, setPrato] = React.useState(route.params?.prato);

  React.useEffect(() => {
    if (route.params?.prato) {
      setPrato(route.params.prato);
    }
  }, [route.params?.prato]);

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
              navigation.navigate('PratosList', { refresh: true }); // Sinaliza para PratosListScreen recarregar
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
    backgroundColor: '#212121', // Fundo escuro
    padding: 10,
  },
  card: {
    backgroundColor: '#3A3A39', // Fundo branco para o card
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
    color: '#FDD835', // Texto escuro
  },
  descricao: {
    fontSize: 16,
    color: '#b89f34ff', // Cinza para descrição
    marginBottom: 10,
  },
  preco: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8BC34A', // Verde Folha para preço
    marginBottom: 10,
  },
  categoria: {
    fontSize: 14,
    color: '#b89f34ff', // Cinza para categoria
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
    color: '#FDD835', // Amarelo Limão para texto do cabeçalho
    fontWeight: 'bold',
  },
});
