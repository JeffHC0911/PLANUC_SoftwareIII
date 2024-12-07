import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button, Modal, Text, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from 'react-native-calendars';
import { BACKEND_URL } from '@env';

const HomeScreen = () => {
  const apiUrl = 'http://192.168.0.109:4000'

  const [markedDates, setMarkedDates] = useState({});
  const [allEvents, setAllEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [userId, setUserId] = useState(null); // Nuevo estado para almacenar el ID del usuario

  // Obtener el ID del usuario desde el token
  const getUserId = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'No estás autenticado. Inicia sesión nuevamente.');
        return null;
      }

      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const uid = decodedToken.uid;
      setUserId(uid); // Guardar el ID del usuario en el estado
      return uid;
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      Alert.alert('Error', 'Error al obtener la información del usuario');
      return null;
    }
  };

  // Cargar los eventos desde el backend
  const fetchEvents = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const currentUserId = await getUserId();
      
      if (!token || !currentUserId) {
        Alert.alert('Error', 'No estás autenticado. Inicia sesión nuevamente.');
        return;
      }

      const response = await fetch(`${apiUrl}/api/schedule/`, {
        method: 'GET',
        headers: {
          'x-token': token,
        },
      });

      const data = await response.json();
      

      if (!data.ok || !Array.isArray(data.schedules)) {
        throw new Error('La respuesta del backend no contiene eventos válidos.');
      }

      // Filtrar los eventos para mostrar solo los del usuario actual
      const userEvents = data.schedules.filter(event => event.user._id === currentUserId);
      console.log('Eventos del usuario:', userEvents);
      
      
      

      
      
      
      
      // Guardar solo los eventos del usuario actual
      setAllEvents(userEvents);

      // Marcar las fechas solo para los eventos del usuario actual
      const formattedEvents = userEvents.reduce((acc, event) => {
        const day = event.startTime.split('T')[0];
        acc[day] = { marked: true, dotColor: 'blue' };
        return acc;
      }, {});

      setMarkedDates(formattedEvents);
    } catch (error) {
      console.error('Error al cargar los eventos:', error);
      Alert.alert('Error', error.message || 'No se pudo cargar los eventos.');
    }
  };

  // Manejar la selección de un día en el calendario
  const handleDayPress = (day) => {
    const date = day.dateString;
    setSelectedDate(date);

    // Filtrar eventos de esa fecha (solo para el usuario actual)
    const eventsOfTheDay = allEvents.filter(
      event => event.startTime.startsWith(date) && event.user._id === userId
    );
    setSelectedEvents(eventsOfTheDay);
    setModalVisible(true);
  };

  // Efecto para cargar los eventos cuando se monta el componente
  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <View style={styles.container}>
      <Calendar
        markedDates={markedDates}
        onDayPress={handleDayPress}
      />

      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContent}>
          <Button title="Cerrar" onPress={() => setModalVisible(false)} />
          <Text style={styles.modalTitle}>Eventos del {selectedDate}</Text>
          {selectedEvents.length > 0 ? (
            <FlatList
              data={selectedEvents}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View style={styles.eventCard}>
                  <Text style={styles.eventTitle}>{item.title}</Text>
                  <Text>Tipo: {item.type}</Text>
                  <Text>Hora de inicio: {new Date(item.startTime).toLocaleTimeString()}</Text>
                  <Text>Hora de fin: {new Date(item.endTime).toLocaleTimeString()}</Text>
                  <Text>Detalles: {item.details?.notes || 'Sin notas'}</Text>
                </View>
              )}
            />
          ) : (
            <Text>No hay eventos para esta fecha.</Text>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 10,
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  eventCard: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;