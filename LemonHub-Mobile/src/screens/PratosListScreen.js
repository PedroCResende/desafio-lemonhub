import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { pratosService, authService } from '../services/api';

export default function PratosListScreen({ navigation, route, setIsAuthenticated }) {
  const [pratos, setPratos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      carregarPratos();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (route.params?.refresh) {
      carregarPratos();
      navigation.setParams({ refresh: false }); // Resetar o parâmetro para evitar recargas desnecessárias
    }
  }, [route.params?.refresh]);

  const carregarPratos = async () => {
    setRefreshing(true);
    try {
      const data = await pratosService.listar();
      setPratos(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os pratos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Deseja realmente sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          onPress: async () => {
            await authService.logout();
            // Remove token e desloga via estado global
            setIsAuthenticated(false);
          }
        }
      ]
    );
  };

  const renderPrato = ({ item }) => (
    <TouchableOpacity
      style={styles.pratoItem}
      onPress={() => navigation.navigate('PratoDetail', { prato: item })}
    >
      <View style={styles.pratoInfo}>
        <Text style={styles.pratoNome}>{item.nome}</Text>
        <Text style={styles.pratoPreco}>R$ {item.preco?.toFixed(2)}</Text>
        <Text style={styles.pratoCategoria}>{item.categoria}</Text>
        {item.disponivel !== undefined && (
          <Text style={[
            styles.pratoDisponivel,
            { color: item.disponivel ? '#8BC34A' : '#F44336' } // Verde para disponível, Vermelho para indisponível
          ]}>
            {item.disponivel ? 'Disponível' : 'Indisponível'}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#212121', // Fundo escuro para o cabeçalho
      },
      headerTintColor: '#FDD835', // Cor do texto e ícones do cabeçalho
      headerRight: () => (
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate('PratoForm')}
          >
            <Text style={styles.headerButtonText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleLogout}
          >
            <Text style={styles.headerButtonText}>Sair</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FDD835" />
        <Text style={styles.loadingText}>Carregando pratos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={pratos}
        renderItem={renderPrato}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={carregarPratos} tintColor="#FDD835" />
        }
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <Text style={styles.emptyListText}>Nenhum prato encontrado</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212121', // Fundo escuro
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#212121',
  },
  loadingText: {
    color: '#FDD835',
    marginTop: 10,
    fontSize: 16,
  },
  emptyListText: {
    color: '#FFFFFF',
    fontSize: 16,
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
    fontSize: 18,
  },
  pratoItem: {
    backgroundColor: '#3A3A39', // Fundo branco para os itens da lista
    margin: 10,
    padding: 15,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  pratoInfo: {
    flex: 1,
  },
  pratoNome: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#FDD835', // Texto escuro
  },
  pratoPreco: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8BC34A', // Verde Folha para preço
    marginBottom: 5,
  },
  pratoCategoria: {
    fontSize: 12,
    color: '#FDD835', // Cinza para categoria
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  pratoDisponivel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 5,
  },
});