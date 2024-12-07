import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_URL } from '@env';

const RegisterScheduleScreen = () => {
  const apiUrl = 'http://192.168.0.109:4000';

  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [professor, setProfessor] = useState('');
  const [classroom, setClassroom] = useState('');
  const [notes, setNotes] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isStartPickerVisible, setStartPickerVisibility] = useState(false);
  const [isEndPickerVisible, setEndPickerVisibility] = useState(false);

  const showStartPicker = () => setStartPickerVisibility(true);
  const hideStartPicker = () => setStartPickerVisibility(false);
  const showEndPicker = () => setEndPickerVisibility(true);
  const hideEndPicker = () => setEndPickerVisibility(false);

  const handleStartConfirm = (date) => {
    setStartTime(date.toISOString());
    hideStartPicker();
  };

  const handleEndConfirm = (date) => {
    setEndTime(date.toISOString());
    hideEndPicker();
  };

  const handleSubmit = async () => {
    if (!title || !type) {
      Alert.alert('Error', 'Por favor completa los campos obligatorios.');
      return;
    }

    const newEvent = {
      title,
      type,
      startTime: startTime || null,
      endTime: endTime || null,
      details: {
        professor: professor || null,
        classroom: classroom || null,
        notes: notes || null,
      },
    };

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'No estás autenticado. Inicia sesión nuevamente.');
        return;
      }

      const response = await fetch(`${apiUrl}/api/schedule/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-token': token,
        },
        body: JSON.stringify(newEvent),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Respuesta del backend:', errorData);
        throw new Error(errorData.error || 'Error desconocido al registrar el evento.');
      }

      Alert.alert('Éxito', 'El evento fue registrado correctamente.');
    } catch (error) {
      console.error('Error al registrar el evento:', error.message);
      Alert.alert('Error', error.message || 'No se pudo registrar el evento.');
    }
  };

  const CustomButton = ({ onPress, title }) => (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Título*</Text>
      <TextInput
        style={styles.input}
        placeholder="Ejemplo: Clase de Matemáticas"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Tipo*</Text>
      <TextInput
        style={styles.input}
        placeholder="Ejemplo: Clase, Reunión"
        value={type}
        onChangeText={setType}
      />

      <Text style={styles.label}>Profesor</Text>
      <TextInput
        style={styles.input}
        placeholder="Ejemplo: Prof. Juan Pérez"
        value={professor}
        onChangeText={setProfessor}
      />

      <Text style={styles.label}>Aula</Text>
      <TextInput
        style={styles.input}
        placeholder="Ejemplo: A101"
        value={classroom}
        onChangeText={setClassroom}
      />

      <Text style={styles.label}>Notas</Text>
      <TextInput
        style={styles.input}
        placeholder="Ejemplo: Llevar materiales"
        value={notes}
        onChangeText={setNotes}
      />

      <Text style={styles.label}>Hora de Inicio</Text>
      <CustomButton title="Seleccionar Hora de Inicio" onPress={showStartPicker} />
      <DateTimePickerModal
        isVisible={isStartPickerVisible}
        mode="datetime"
        onConfirm={handleStartConfirm}
        onCancel={hideStartPicker}
      />
      {startTime && <Text style={styles.dateText}>Inicio: {new Date(startTime).toLocaleString()}</Text>}

      <Text style={styles.label}>Hora de Fin</Text>
      <CustomButton title="Seleccionar Hora de Fin" onPress={showEndPicker} />
      <DateTimePickerModal
        isVisible={isEndPickerVisible}
        mode="datetime"
        onConfirm={handleEndConfirm}
        onCancel={hideEndPicker}
      />
      {endTime && <Text style={styles.dateText}>Fin: {new Date(endTime).toLocaleString()}</Text>}

      <CustomButton title="Registrar Evento" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#333',
  },
  dateText: {
    marginTop: 10,
    fontSize: 14,
    color: '#555',
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RegisterScheduleScreen;
