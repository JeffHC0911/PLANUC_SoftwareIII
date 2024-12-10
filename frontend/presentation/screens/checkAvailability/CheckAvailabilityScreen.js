import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
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
  const [noResults, setNoResults] = useState(false); // Estado para manejar "sin resultados"
  const [errorMessage, setErrorMessage] = useState(''); // Estado para manejar errores
  const [successMessage, setSuccessMessage] = useState(''); // Estado para manejar mensaje de éxito

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

      // Construir URL con parámetros
      const url = `${apiUrl}/api/availability?email=${encodeURIComponent(email)}&startRange=${encodeURIComponent(new Date(startDate).toISOString())}&endRange=${encodeURIComponent(new Date(endDate).toISOString())}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: { 'x-token': token },
      });

      const data = await response.json();
      console.log('Datos:', data);

      if (data.available == false) {
        setNoResults(true);
        setSuccessMessage('El usuario NO está disponible');
      } else {
        setNoResults(false);
        setAvailability(data);
        setSuccessMessage('El usuario está disponible.');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Ocurrió un error al buscar la disponibilidad.');
      setSuccessMessage(''); // Limpiar mensaje de éxito en caso de error
    }
  };

  const CustomButton = ({ onPress, title }) => (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

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
      <CustomButton title="Seleccionar Fecha de Inicio" onPress={showStartPicker} />
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
      <CustomButton title="Seleccionar Fecha de Fin" onPress={showEndPicker} />
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

      {errorMessage && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}

      {successMessage && !noResults && (
        <Text style={styles.successText}>{successMessage}</Text>
      )}

      {noResults && (
        <Text style={styles.noResultsText}>{successMessage}</Text>
      )}

      {!noResults && availability.length > 0 && (
        <Text style={styles.resultHeader}>Disponibilidad:</Text>
      )}

      <FlatList
        data={availability}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.resultItem}>
            <Text style={styles.resultName}>{item.name}</Text>
            <Text style={styles.resultAvailability}>{item.availability}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    color: '#333',
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
    color: '#333',
  },
  dateText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  successText: {
    fontSize: 16,
    color: 'green',
    textAlign: 'center',
    marginTop: 20,
  },
  noResultsText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  resultHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#555',
  },
  resultItem: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  resultName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  resultAvailability: {
    fontSize: 14,
    color: '#555',
  },
});

export default CheckAvailabilityScreen;
