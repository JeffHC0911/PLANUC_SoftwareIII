import React, { useState } from 'react';
import { View, Button, Text, TextInput, StyleSheet, Alert } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_URL } from '@env';


const RegisterScheduleScreen = () => {
  const apiUrl = 'http://192.168.0.109:4000'

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
      startTime: startTime || null, // Asegúrate de enviar null si no hay valor
      endTime: endTime || null, // Lo mismo para endTime
      details: {
        professor: professor || null,
        classroom: classroom || null,
        notes: notes || null,
      },
    };
  
    try {
      // Obtener el token de AsyncStorage
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'No estás autenticado. Inicia sesión nuevamente.');
        return;
      }
  
      const response = await fetch(`${apiUrl}/api/schedule/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-token': token,  // Agregar el token aquí
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
  
  

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Título</Text>
      <TextInput
        style={styles.input}
        placeholder="Título"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Tipo</Text>
      <TextInput
        style={styles.input}
        placeholder="Tipo"
        value={type}
        onChangeText={setType}
      />

      <Text style={styles.label}>Profesor</Text>
      <TextInput
        style={styles.input}
        placeholder="Profesor"
        value={professor}
        onChangeText={setProfessor}
      />

      <Text style={styles.label}>Aula</Text>
      <TextInput
        style={styles.input}
        placeholder="Aula"
        value={classroom}
        onChangeText={setClassroom}
      />

      <Text style={styles.label}>Notas</Text>
      <TextInput
        style={styles.input}
        placeholder="Notas"
        value={notes}
        onChangeText={setNotes}
      />

      <Text style={styles.label}>Hora de Inicio</Text>
      <Button title="Seleccionar Hora de Inicio" onPress={showStartPicker} />
      <DateTimePickerModal
        isVisible={isStartPickerVisible}
        mode="datetime"
        onConfirm={handleStartConfirm}
        onCancel={hideStartPicker}
      />
      {startTime && <Text style={styles.dateText}>Inicio: {new Date(startTime).toLocaleString()}</Text>}

      <Text style={styles.label}>Hora de Fin</Text>
      <Button title="Seleccionar Hora de Fin" onPress={showEndPicker} />
      <DateTimePickerModal
        isVisible={isEndPickerVisible}
        mode="datetime"
        onConfirm={handleEndConfirm}
        onCancel={hideEndPicker}
      />
      {endTime && <Text style={styles.dateText}>Fin: {new Date(endTime).toLocaleString()}</Text>}

      <Button title="Registrar Evento" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  dateText: {
    marginTop: 10,
    fontSize: 14,
  },
});

export default RegisterScheduleScreen;
