import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather'; // Asegúrate de tener instalado react-native-vector-icons

const CustomInput = ({ label, value, onChangeText, error, placeholder, secureTextEntry, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.inputContainer}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputWrapper}>
        <TextInput
          {...props}
          style={[styles.input, error && styles.errorInput]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry && !showPassword} // Muestra/oculta la contraseña según el estado
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIconContainer}>
            <Icon 
              name={showPassword ? 'eye-off' : 'eye'}  // Cambia el ícono entre ojo y ojo cerrado
              size={24}
              color="#666"
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  inputWrapper: {
    position: 'relative', // Necesario para posicionar el ícono dentro del campo
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
    paddingRight: 40, // Deja espacio para el ícono
  },
  errorInput: {
    borderColor: 'red',
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -12 }], // Centra el ícono verticalmente
  },
  errorText: {
    fontSize: 12,
    color: 'red',
    marginTop: 5,
  },
});

export default CustomInput;
