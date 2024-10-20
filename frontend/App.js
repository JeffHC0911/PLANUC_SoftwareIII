import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { BACKEND_URL } from '@env';

const App = () => {
  const [nombre, setNombre] = useState('');
  const [nombres, setNombres] = useState([]);

  const agregarNombre = async () => {
    const response = await fetch(`${BACKEND_URL}/nombres`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre }),
    });
    const nuevoNombre = await response.json();
    setNombres([...nombres, nuevoNombre]);
    setNombre(''); // Limpiar el input después de agregar
  };

  useEffect(() => {
    const obtenerNombres = async () => {
      const response = await fetch(`${BACKEND_URL}/nombres`);
      const data = await response.json();
      setNombres(data);
    };

    obtenerNombres();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lista de Nombres</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresa un nombre"
        value={nombre}
        onChangeText={(text) => setNombre(text)}
      />
      <Button title="Agregar Nombre" onPress={agregarNombre} />
      <FlatList
        style={styles.item }
        data={nombres}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <Text style={styles.item}>{item.nombre}</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
    marginTop: 50,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    width: '80%',
  },
  item: {
    padding: 5,
    fontSize: 18,
    height: 44,
    backgroundColor: '#ddd',
    marginVertical: 5,
    width: '60%',
  },
});

export default App;
