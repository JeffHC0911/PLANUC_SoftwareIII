import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import CONFIG from '../../../config';

const RegisterRecurringScheduleScreen = () => {

  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [semesterStart, setSemesterStart] = useState(null);
  const [semesterEnd, setSemesterEnd] = useState(null);
  const [days, setDays] = useState([]);
  const [details, setDetails] = useState('');

  const [isStartPickerVisible, setStartPickerVisible] = useState(false);
  const [isEndPickerVisible, setEndPickerVisible] = useState(false);
  const [isSemesterStartPickerVisible, setSemesterStartPickerVisible] = useState(false);
  const [isSemesterEndPickerVisible, setSemesterEndPickerVisible] = useState(false);

  const toggleDaySelection = (day) => {
    setDays((prevDays) =>
      prevDays.includes(day) ? prevDays.filter((d) => d !== day) : [...prevDays, day]
    );
  };

  const handlePickerConfirm = (setter, date) => {
    setter(date.toISOString());
  };

  const handleSubmit = async () => {
    if (!title || !startTime || !endTime || !semesterStart || !semesterEnd || days.length === 0) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios.');
      return;
    }

    const recurringEvent = {
      title,
      type: 'Recurrente',
      startTime,
      endTime,
      days,
      semesterStart,
      semesterEnd,
      details,
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
        body: JSON.stringify(recurringEvent),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error desconocido al registrar el evento recurrente.');
      }

      Alert.alert('Éxito', 'El evento recurrente fue registrado correctamente.');
      setTitle('');
      setStartTime(null);
      setEndTime(null);
      setSemesterStart(null);
      setSemesterEnd(null);
      setDays([]);
      setDetails('');
    } catch (error) {
      Alert.alert('Error', error.message || 'No se pudo registrar el evento recurrente.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Título*</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre de la actividad"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Días*</Text>
      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(
        (day) => (
          <TouchableOpacity
            key={day}
            style={[styles.dayButton, days.includes(day) && styles.dayButtonSelected]}
            onPress={() => toggleDaySelection(day)}
          >
            <Text style={styles.dayButtonText}>{day}</Text>
          </TouchableOpacity>
        )
      )}

      <Text style={styles.label}>Hora de Inicio*</Text>
      <TouchableOpacity style={styles.button} onPress={() => setStartPickerVisible(true)}>
        <Text style={styles.buttonText}>
          {startTime ? new Date(startTime).toLocaleString() : 'Seleccionar Hora'}
        </Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isStartPickerVisible}
        mode="datetime"
        onConfirm={(date) => handlePickerConfirm(setStartTime, date)}
        onCancel={() => setStartPickerVisible(false)}
      />

      <Text style={styles.label}>Hora de Fin*</Text>
      <TouchableOpacity style={styles.button} onPress={() => setEndPickerVisible(true)}>
        <Text style={styles.buttonText}>
          {endTime ? new Date(endTime).toLocaleString() : 'Seleccionar Hora'}
        </Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isEndPickerVisible}
        mode="datetime"
        onConfirm={(date) => handlePickerConfirm(setEndTime, date)}
        onCancel={() => setEndPickerVisible(false)}
      />

      <Text style={styles.label}>Inicio del Semestre*</Text>
      <TouchableOpacity style={styles.button} onPress={() => setSemesterStartPickerVisible(true)}>
        <Text style={styles.buttonText}>
          {semesterStart ? new Date(semesterStart).toLocaleDateString() : 'Seleccionar Fecha'}
        </Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isSemesterStartPickerVisible}
        mode="date"
        onConfirm={(date) => handlePickerConfirm(setSemesterStart, date)}
        onCancel={() => setSemesterStartPickerVisible(false)}
      />

      <Text style={styles.label}>Fin del Semestre*</Text>
      <TouchableOpacity style={styles.button} onPress={() => setSemesterEndPickerVisible(true)}>
        <Text style={styles.buttonText}>
          {semesterEnd ? new Date(semesterEnd).toLocaleDateString() : 'Seleccionar Fecha'}
        </Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isSemesterEndPickerVisible}
        mode="date"
        onConfirm={(date) => handlePickerConfirm(setSemesterEnd, date)}
        onCancel={() => setSemesterEndPickerVisible(false)}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Registrar Evento Recurrente</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f5f5f5', flex: 1 },
  input: { borderWidth: 1, borderColor: '#ccc', marginBottom: 15, padding: 10, borderRadius: 5 },
  textArea: { height: 80 },
  label: { fontSize: 16, marginBottom: 5 },
  button: { backgroundColor: '#007bff', padding: 5, borderRadius: 5, alignItems: 'center', marginBottom: 15 },
  buttonText: { color: '#fff', fontSize: 16 },
  dayButton: { padding: 5, marginVertical: 5, borderWidth: 1, borderRadius: 5, alignItems: 'center' },
  dayButtonSelected: { backgroundColor: '#007bff', borderColor: '#007bff', color: '#fff' },
  dayButtonText: { fontSize: 16 },
  submitButton: { backgroundColor: '#28a745', padding: 15, borderRadius: 5, alignItems: 'center', marginTop: 20 },
  submitButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
});

export default RegisterRecurringScheduleScreen;
