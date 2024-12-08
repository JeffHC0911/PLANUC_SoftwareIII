import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';

const CheckAvailabilityScreen = () => {
  const [groupName, setGroupName] = useState('');
  const [subject, setSubject] = useState('');
  const [availability, setAvailability] = useState([]);

  const handleSearch = async () => {
    // Simulación de consulta a un backend
    const mockData = [
      { id: '1', name: 'John Doe', availability: 'Monday 10:00 AM - 12:00 PM' },
      { id: '2', name: 'Jane Smith', availability: 'Tuesday 2:00 PM - 4:00 PM' },
    ];
    setAvailability(mockData);
  };

  return (
    <View style={styles.container}>

      <TextInput
        style={styles.input}
        placeholder="Nombre del Grupo"
        value={groupName}
        onChangeText={setGroupName}
        placeholderTextColor="#888"
      />

      <TextInput
        style={styles.input}
        placeholder="Persona"
        value={subject}
        onChangeText={setSubject}
        placeholderTextColor="#888"
      />

      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>Buscar</Text>
      </TouchableOpacity>

      {availability.length > 0 && (
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
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
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
