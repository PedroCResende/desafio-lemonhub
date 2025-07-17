import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl
} from 'react-native';
import { pratosService, authService } from '../services/api';

export default function PratosListScreen({ navigation, setIsAuthenticated }) {
  const [pratos, setPratos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    carregarPratos();
  }, []);

  const carregarPratos = async () => {
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
        <Text style={styles.pratoDescricao} numberOfLines={2}>
          {item.descricao}
        </Text>
        <Text style={styles.pratoPreco}>R$ {item.preco?.toFixed(2)}</Text>
        <Text style={styles.pratoCategoria}>{item.categoria}</Text>
        {item.disponivel !== undefined && (
          <Text style={[
            styles.pratoDisponivel,
            { color: item.disponivel ? '#4CAF50' : '#F44336' }
          ]}>
            {item.disponivel ? 'Disponível' : 'Indisponível'}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
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
        <Text>Carregando...</Text>
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
          <RefreshControl refreshing={refreshing} onRefresh={carregarPratos} />
        }
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <Text>Nenhum prato encontrado</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  pratoItem: {
    backgroundColor: '#fff',
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
  },
  pratoDescricao: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  pratoPreco: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
  },
  pratoCategoria: {
    fontSize: 12,
    color: '#999',
    backgroundColor: '#f0f0f0',
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
