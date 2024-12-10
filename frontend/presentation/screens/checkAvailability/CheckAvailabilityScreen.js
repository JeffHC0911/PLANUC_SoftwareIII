import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Modal, Alert } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CheckAvailabilityScreen = () => {
  const apiUrl = 'http://192.168.0.109:4000';

  const [email, setEmail] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isStartPickerVisible, setStartPickerVisible] = useState(false);
  const [isEndPickerVisible, setEndPickerVisible] = useState(false);
  const [availability, setAvailability] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const showStartPicker = () => setStartPickerVisible(true);
  const hideStartPicker = () => setStartPickerVisible(false);

  const showEndPicker = () => setEndPickerVisible(true);
  const hideEndPicker = () => setEndPickerVisible(false);

  const handleStartConfirm = (date) => {
    setStartDate(date);
    hideStartPicker();
  };

  const handleEndConfirm = (date) => {
    setEndDate(date);
    hideEndPicker();
  };

  const handleSearch = async () => {
    if (!email || !startDate || !endDate) {
      Alert.alert('Error', 'Por favor completa los campos obligatorios.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'No estás autenticado. Inicia sesión nuevamente.');
        return;
      }

      const url = `${apiUrl}/api/availability?email=${encodeURIComponent(email)}&startRange=${encodeURIComponent(new Date(startDate).toISOString())}&endRange=${encodeURIComponent(new Date(endDate).toISOString())}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: { 'x-token': token },
      });

      const data = await response.json();
      console.log('Datos:', data);

      if (data.available === false) {
        setModalMessage('El usuario NO está disponible');
      } else {
        setAvailability(data);
        setModalMessage('El usuario está disponible.');
      }

      setModalVisible(true); // Mostrar el modal
    } catch (error) {
      console.error(error);
      setModalMessage('Ocurrió un error al buscar la disponibilidad.');
      setModalVisible(true); // Mostrar el modal
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Correo"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>Fecha de Inicio</Text>
      <TouchableOpacity style={styles.button} onPress={showStartPicker}>
        <Text style={styles.buttonText}>Seleccionar Fecha de Inicio</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isStartPickerVisible}
        mode="datetime"
        onConfirm={handleStartConfirm}
        onCancel={hideStartPicker}
      />
      {startDate && (
        <Text style={styles.dateText}>
          Inicio: {new Date(startDate).toLocaleString()}
        </Text>
      )}

      <Text style={styles.label}>Fecha de Fin</Text>
      <TouchableOpacity style={styles.button} onPress={showEndPicker}>
        <Text style={styles.buttonText}>Seleccionar Fecha de Fin</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isEndPickerVisible}
        mode="datetime"
        onConfirm={handleEndConfirm}
        onCancel={hideEndPicker}
      />
      {endDate && (
        <Text style={styles.dateText}>
          Fin: {new Date(endDate).toLocaleString()}
        </Text>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>Buscar Disponibilidad</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#f5f5f5' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 15, marginBottom: 15 },
  label: { fontSize: 16, fontWeight: 'bold', marginVertical: 5 },
  dateText: { fontSize: 14, color: '#555', marginBottom: 10 },
  button: { backgroundColor: '#007BFF', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContainer: { width: 300, backgroundColor: 'white', borderRadius: 10, padding: 20, alignItems: 'center' },
  modalMessage: { fontSize: 16, marginBottom: 20, textAlign: 'center' },
  modalButton: { backgroundColor: '#007BFF', padding: 10, borderRadius: 5 },
  modalButtonText: { color: 'white', fontSize: 16 },
});

export default CheckAvailabilityScreen;
