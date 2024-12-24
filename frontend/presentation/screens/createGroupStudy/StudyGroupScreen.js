import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import CONFIG from '../../../config';

const StudyGroupsScreen = () => {
  const [studyGroups, setStudyGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const getUserId = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'No estás autenticado. Por favor, inicia sesión.');
        return null;
      }
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      return decodedToken.uid;
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      Alert.alert('Error', 'No se pudo obtener la información del usuario.');
      return null;
    }
  };

  const fetchStudyGroups = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const currentUserId = await getUserId();
  
      if (!token || !currentUserId) return;
  
      const response = await fetch(`${CONFIG.API_URL}/api/studygroup/`, {
        method: 'GET',
        headers: { 'x-token': token },
      });
  
      const data = await response.json();
      console.log('Respuesta del servidor:', data);
  
      if (!data.ok || !Array.isArray(data.studyGroups)) {
        throw new Error('Respuesta inesperada del servidor.');
      }
  
      // Filtrar grupos en los que el usuario es miembro
      const userGroups = data.studyGroups.filter(group =>
        group.members.some(member => member._id === currentUserId)
      );
  
      if (!userGroups.length) {
        Alert.alert('Sin grupos', 'No estás asociado a ningún grupo de estudio.');
      }
  
      setStudyGroups(userGroups);
    } catch (error) {
      console.error('Error al cargar los grupos:', error);
      Alert.alert('Error', 'No se pudieron cargar los grupos de estudio. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchStudyGroups();
  }, []);

  const renderGroup = ({ item }) => (
    <TouchableOpacity style={styles.groupCard}>
      <Text style={styles.groupName}>{item.name}</Text>
      <Text style={styles.groupType}>{item.type}</Text>
      <Text style={styles.groupDate}>Fecha: {new Date(item.schedule.startTime).toLocaleDateString()}</Text>
      <Text style={styles.groupType}>{item.meetLink}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <Text style={styles.loadingText}>Cargando grupos de estudio...</Text>
      ) : (
        <FlatList
          data={studyGroups}
          keyExtractor={item => item._id}
          renderItem={renderGroup}
          ListEmptyComponent={<Text style={styles.emptyText}>No tienes grupos de estudio.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
    color: '#888',
  },
  groupCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  groupType: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  groupDate: {
    fontSize: 12,
    color: '#999',
  },
});

export default StudyGroupsScreen;
