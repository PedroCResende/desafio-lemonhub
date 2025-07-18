import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
  ActivityIndicator,
  TextInput // Adicionado para o campo de busca por nome
} from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Importar o Picker
import { pratosService, authService } from '../services/api';

export default function PratosListScreen({ navigation, route, setIsAuthenticated }) {
  const [pratos, setPratos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filtroNome, setFiltroNome] = useState(''); // Estado para o filtro de nome
  const [filtroCategoria, setFiltroCategoria] = useState(''); // Estado para o filtro de categoria

  // Categorias pré-definidas
  const categorias = ["Entrada", "Prato Principal", "Sobremesa", "Bebida"];

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

  // Adicionado useEffect para buscar pratos quando os filtros mudam
  useEffect(() => {
    carregarPratos();
  }, [filtroNome, filtroCategoria]);

  const carregarPratos = async () => {
    setRefreshing(true);
    try {
      // Ajustado para usar os filtros de nome e categoria
      const data = await pratosService.buscar(filtroNome, filtroCategoria);
      setPratos(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os pratos.');
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
            { color: item.disponivel ? '#8BC34A' : '#F44336' }
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
        backgroundColor: '#212121',
      },
      headerTintColor: '#FDD835',
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
      <View style={styles.filterContainer}> 
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nome..."
          placeholderTextColor="#999"
          value={filtroNome}
          onChangeText={setFiltroNome}
        />
        <Picker
          selectedValue={filtroCategoria}
          onValueChange={(itemValue) => setFiltroCategoria(itemValue)}
          style={styles.pickerInput}
          itemStyle={styles.pickerItem}
        >
          <Picker.Item label="Todas as Categorias" value="" />
          {categorias.map((cat) => (
            <Picker.Item key={cat} label={cat} value={cat} />
          ))}
        </Picker>
      </View>
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
    backgroundColor: '#212121',
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
    color: '#FDD835',
    fontWeight: 'bold',
  },
  pratoItem: {
    backgroundColor: '#3A3A39',
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
    color: '#FDD835',
  },
  pratoPreco: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8BC34A',
    marginBottom: 5,
  },
  pratoCategoria: {
    fontSize: 12,
    color: '#b89f34ff',
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
  filterContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#212121',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#3A3A39',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    color: '#b89f34ff',
  },
  pickerInput: {
    flex: 1,
    backgroundColor: '#3A3A39',
    borderRadius: 8,
    color: '#b89f34ff',
  },
  pickerItem: {
    color: '#212121',
  },
});
