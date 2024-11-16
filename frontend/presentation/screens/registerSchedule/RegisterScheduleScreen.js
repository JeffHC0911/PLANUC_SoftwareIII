import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';

const RegisterScheduleScreen = () => {
  const [groupName, setGroupName] = useState('');
  const [day, setDay] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [description, setDescription] = useState('');

  const handleRegister = async () => {
    // Simulación de envío al backend
    const newSchedule = {
      groupName,
      day,
      startTime,
      endTime,
      description,
    };
    console.log('Materia Registrada:', newSchedule);
    Alert.alert('Exito', 'La materia fue registrada.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register Schedule</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre Materia"
        value={groupName}
        onChangeText={setGroupName}
      />
      <TextInput
        style={styles.input}
        placeholder="Dia"
        value={day}
        onChangeText={setDay}
      />
      <TextInput
        style={styles.input}
        placeholder="Hora Inicio (HH:MM AM/PM)"
        value={startTime}
        onChangeText={setStartTime}
      />
      <TextInput
        style={styles.input}
        placeholder="Hora Fin (HH:MM AM/PM)"
        value={endTime}
        onChangeText={setEndTime}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción de la materia"
        value={description}
        onChangeText={setDescription}
      />
      <Button title="Registrar" onPress={handleRegister} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
});

export default RegisterScheduleScreen;
