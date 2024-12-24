import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Pic } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

import CONFIG from '../../../config';

const RegisterScheduleScreen = () => {

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
    // Convertir a UTC
    const utcDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    setStartTime(utcDate.toISOString());
    hideStartPicker();
  };
  
  const handleEndConfirm = (date) => {
    // Convertir a UTC
    const utcDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    setEndTime(utcDate.toISOString());
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

      const response = await fetch(`${CONFIG.API_URL}/api/schedule/`, {
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
        placeholder="Nombre de la actividad"
        value={title}
        onChangeText={setTitle}
      />

    <Text style={styles.label}>Tipo*</Text>
    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={type}
        onValueChange={(itemValue) => setType(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Selecciona un tipo" value="" />
        <Picker.Item label="Clase" value="Clase" />
        <Picker.Item label="Actividad" value="Actividad" />
        <Picker.Item label="Reunión" value="Reunión " />
        <Picker.Item label="Otro" value="Otro" />
      </Picker>
    </View>

    {/* Campo de profesor solo si el tipo es Clase */}
    {type === 'Clase' && (
      <>
        <Text style={styles.label}>Profesor</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre del docente"
          value={professor}
          onChangeText={setProfessor}
        />
      </>
    )}

      <Text style={styles.label}>Lugar</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre del lugar"
        value={classroom}
        onChangeText={setClassroom}
      />

      <Text style={styles.label}>Notas (Recordatorio)</Text>
      <TextInput
        style={styles.input}
        placeholder="Descripción"
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
      {startTime && <Text style={styles.dateText}>Inicio: {new Date(startTime).toLocaleString('es-CO', { timeZone: 'America/Bogota' })}</Text>}

      <Text style={styles.label}>Hora de Fin</Text>
      <CustomButton title="Seleccionar Hora de Fin" onPress={showEndPicker} />
      <DateTimePickerModal
        isVisible={isEndPickerVisible}
        mode="datetime"
        onConfirm={handleEndConfirm}
        onCancel={hideEndPicker}
      />
      {endTime && <Text style={styles.dateText}>Fin: {new Date(endTime).toLocaleString('es-CO', { timeZone: 'America/Bogota' })}</Text>}

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
