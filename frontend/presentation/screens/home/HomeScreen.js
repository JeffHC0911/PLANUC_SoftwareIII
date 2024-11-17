import React, { useState } from 'react';
import { View, StyleSheet, Button, Modal, TouchableOpacity, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';
import RegisterScheduleScreen from '../registerSchedule/RegisterScheduleScreen';

const HomeScreen = () => {
  const [markedDates, setMarkedDates] = useState({});
  const [isModalVisible, setModalVisible] = useState(false);

  // Función para agregar eventos al calendario
  const handleAddEvent = (newSchedule) => {
    const { day } = newSchedule;
    setMarkedDates((prev) => ({
      ...prev,
      [day]: { marked: true, dotColor: 'blue' },
    }));
    setModalVisible(false); // Cierra el modal después de registrar el evento
  };

  return (
    <View style={styles.container}>
      <Calendar
        markedDates={markedDates}
        onDayPress={(day) => {
          console.log('Selected day', day);
        }}
      />

      {/* Botón para abrir el formulario */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+ Agregar Evento</Text>
      </TouchableOpacity>

      {/* Modal para el formulario de registro */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContent}>
          <Button title="Cerrar" onPress={() => setModalVisible(false)} />
          <RegisterScheduleScreen onAddEvent={handleAddEvent} />
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
  addButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
});

export default HomeScreen;
