import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { BACKEND_URL } from '@env';

const App = () => {
  const [nombre, setNombre] = useState('');
  const [nombres, setNombres] = useState([]);
  const [error, setError] = useState('');

  const agregarNombre = async () => {
    try {
      console.log('URL de la API para POST:', `${BACKEND_URL}/nombres`);
      const response = await fetch(`${BACKEND_URL}/nombres`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre }),
      });

      if (!response.ok) {
        throw new Error('Error al agregar nombre');
      }

      const nuevoNombre = await response.json();
      setNombres([...nombres, nuevoNombre]);
      setNombre('');
    } catch (error) {
      console.error('Error al agregar nombre:', error);
      setError(error.message);
    }
  };

  useEffect(() => {
    const obtenerNombres = async () => {
      try {
        console.log('URL de la API para GET:', `${BACKEND_URL}/nombres`);
        const response = await fetch(`${BACKEND_URL}/nombres`);

        if (!response.ok) {
          throw new Error('Error al obtener nombres');
        }

        const data = await response.json();
        setNombres(data);
      } catch (error) {
        console.error('Error al obtener nombres:', error);
        setError(error.message);
      }
    };

    obtenerNombres();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lista de Nombres</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Ingresa un nombre"
        value={nombre}
        onChangeText={(text) => setNombre(text)}
      />
      <Button title="Agregar Nombre" onPress={agregarNombre} />
      <FlatList
        style={styles.list}
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
  list: {
    width: '80%',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    backgroundColor: '#ddd',
    marginVertical: 5,
  },
  error: {
    color: 'red',
    marginBottom: 20,
  },
});

export default App;
