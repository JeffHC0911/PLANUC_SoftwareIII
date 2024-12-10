import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, FlatList, Alert, TouchableOpacity, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from 'react-native-calendars';
import { useFocusEffect } from '@react-navigation/native'; // Importar useFocusEffect

const EventCard = ({ event }) => (
  <View style={styles.eventCard}>
    <Text style={styles.eventTitle}>{event.title}</Text>
    <Text style={styles.eventDetail}>Tipo: {event.type}</Text>
    <Text style={styles.eventDetail}>
    Hora de inicio: {new Date(event.startTime).toLocaleTimeString('es-CO', { timeZone: 'America/Bogota' })}
   </Text>
  <Text style={styles.eventDetail}>
    Hora de fin: {new Date(event.endTime).toLocaleTimeString('es-CO', { timeZone: 'America/Bogota' })}
  </Text>

    <Text style={styles.eventDetail}>Detalles: {event.details?.notes || 'Sin notas'}</Text>
  </View>
);

const HomeScreen = () => {
  const apiUrl = 'http://192.168.0.109:4000';

  const [markedDates, setMarkedDates] = useState({});
  const [allEvents, setAllEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [userId, setUserId] = useState(null);

  // Obtener el ID del usuario
  const getUserId = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'No estás autenticado. Inicia sesión nuevamente.');
        return null;
      }

      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setUserId(decodedToken.uid);
      return decodedToken.uid;
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      Alert.alert('Error', 'Error al obtener la información del usuario');
      return null;
    }
  };

  // Función para obtener los eventos
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
        headers: { 'x-token': token },
      });

      const data = await response.json();
      if (!data.ok || !Array.isArray(data.schedules)) {
        throw new Error('La respuesta del backend no contiene eventos válidos.');
      }

      const userEvents = data.schedules.filter((event) => event.user._id === currentUserId);
      setAllEvents(userEvents);

      const formattedEvents = userEvents.reduce((acc, event) => {
        const day = event.startTime.split('T')[0];
        acc[day] = { marked: true, dotColor: '#007BFF' };
        return acc;
      }, {});

      setMarkedDates(formattedEvents);
    } catch (error) {
      console.error('Error al cargar los eventos:', error);
      Alert.alert('Error', error.message || 'No se pudo cargar los eventos.');
    }
  };

  // Manejar la selección de una fecha en el calendario
  const handleDayPress = (day) => {
    const date = day.dateString;
    setSelectedDate(date);
    const eventsOfTheDay = allEvents.filter(
      (event) => event.startTime.startsWith(date) && event.user._id === userId
    );
    setSelectedEvents(eventsOfTheDay);
    setModalVisible(true);
  };

  // Usar useFocusEffect para recargar los eventos cada vez que se enfoque la pantalla
  useFocusEffect(
    React.useCallback(() => {
      fetchEvents(); // Recargar eventos al enfocarse en la pantalla
    }, [])
  );

  return (
    <View style={styles.container}>
      <Calendar
        markedDates={markedDates}
        onDayPress={handleDayPress}
        theme={{
          todayTextColor: '#007BFF',
          selectedDayBackgroundColor: '#007BFF',
          selectedDayTextColor: '#ffffff',
        }}
      />

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Eventos del {selectedDate}</Text>
            {selectedEvents.length > 0 ? (
              <FlatList
                data={selectedEvents}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => <EventCard event={item} />}
              />
            ) : (
              <Text style={styles.noEventsText}>No hay eventos para esta fecha.</Text>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  closeButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  eventCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  eventDetail: {
    fontSize: 14,
    color: '#666',
  },
  noEventsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
  },
});

export default HomeScreen;
