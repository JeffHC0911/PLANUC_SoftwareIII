import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList } from 'react-native';

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
      <Text style={styles.title}>Check Availability</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre Grupo"
        value={groupName}
        onChangeText={setGroupName}
      />
      <TextInput
        style={styles.input}
        placeholder="Persona"
        value={subject}
        onChangeText={setSubject}
      />
      <Button title="Busqueda" onPress={handleSearch} />
      <FlatList
        data={availability}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={styles.result}>
            {item.name} - {item.availability}
          </Text>
        )}
      />
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
  result: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
});

export default CheckAvailabilityScreen;
