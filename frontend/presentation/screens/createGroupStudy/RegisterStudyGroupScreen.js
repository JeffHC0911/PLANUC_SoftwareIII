import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import CONFIG from '../../../config';

const RegisterStudyGroupScreen = () => {

  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [members, setMembers] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [description, setDescription] = useState('');
  const [meetLink, setMeetLink] = useState(''); // Enlace de Google Meet
  const [isStartPickerVisible, setStartPickerVisibility] = useState(false);
  const [isEndPickerVisible, setEndPickerVisibility] = useState(false);

  const showStartPicker = () => setStartPickerVisibility(true);
  const hideStartPicker = () => setStartPickerVisibility(false);
  const showEndPicker = () => setEndPickerVisibility(true);
  const hideEndPicker = () => setEndPickerVisibility(false);

  const handleStartConfirm = (date) => {
    const utcDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    setStartTime(utcDate.toISOString());
    hideStartPicker();
  };

  const handleEndConfirm = (date) => {
    const utcDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    setEndTime(utcDate.toISOString());
    hideEndPicker();
  };

  const handleSubmit = async () => {
    if (!name || !subject || !startTime || !endTime || !members) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }

    const newGroup = {
      name,
      subject,
      members: members.split(',').map(email => email.trim()),  // Separar los correos
      schedule: {
        startTime: startTime || null,
        endTime: endTime || null,
      },
      description: description || null,
      meetLink: meetLink || null, // Incluir el enlace de Google Meet
    };

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'No estás autenticado. Inicia sesión nuevamente.');
        return;
      }

      const response = await fetch(`${CONFIG.API_URL}/api/studygroup/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-token': token,
        },
        body: JSON.stringify(newGroup),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Respuesta del backend:', errorData);
        throw new Error(errorData.error || 'Error desconocido al registrar el grupo de estudio.');
      }

      Alert.alert('Éxito', 'El grupo de estudio fue registrado correctamente.');
    } catch (error) {
      console.error('Error al registrar el grupo de estudio:', error.message);
      Alert.alert('Error', error.message || 'No se pudo registrar el grupo de estudio.');
    }
  };

  const CustomButton = ({ onPress, title }) => (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nombre del Grupo*</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. Grupo de Estudio de Programación"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Asignatura*</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. Matemáticas"
        value={subject}
        onChangeText={setSubject}
      />

      <Text style={styles.label}>Miembros (correos separados por coma)*</Text>
      <TextInput
        style={styles.input}
        placeholder="correo1@example.com, correo2@example.com"
        value={members}
        onChangeText={setMembers}
      />

      <Text style={styles.label}>Hora de Inicio*</Text>
      <CustomButton title="Seleccionar Hora de Inicio" onPress={showStartPicker} />
      <DateTimePickerModal
        isVisible={isStartPickerVisible}
        mode="datetime"
        onConfirm={handleStartConfirm}
        onCancel={hideStartPicker}
      />

      <Text style={styles.label}>Hora de Fin*</Text>
      <CustomButton title="Seleccionar Hora de Fin" onPress={showEndPicker} />
      <DateTimePickerModal
        isVisible={isEndPickerVisible}
        mode="datetime"
        onConfirm={handleEndConfirm}
        onCancel={hideEndPicker}
      />

      <Text style={styles.label}>Descripción (Opcional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Descripción del grupo de estudio"
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Enlace de Google Meet (Opcional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. https://meet.google.com/xyz-abcd-efg"
        value={meetLink}
        onChangeText={setMeetLink}
      />

      <CustomButton title="Registrar Grupo" onPress={handleSubmit} />
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
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
  },
});

export default RegisterStudyGroupScreen;
