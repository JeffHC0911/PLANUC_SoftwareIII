import React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import CustomInput from '../common/CustomInput';
import { useForm } from '../../../business/hooks';

const RegisterForm = ({ onSubmit }) => {
  // Usamos el hook de formulario y pasamos onSubmit
  const { values, errors, handleChange, handleSubmit } = useForm(
    {
      name: '',
      email: '',
      password: '',
      repeatPassword: '',
      career: '',
      semester: '',
    },
    onSubmit // Esto se ejecutará cuando se llame a handleSubmit
  );

  return (
    <View style={styles.form}>
      <CustomInput
        label="NOMBRE:"
        value={values.name}
        onChangeText={(text) => handleChange('name', text)}
        error={errors.name}
        placeholder="Ejemplo: Juan Pérez"
      />
      <CustomInput
        label="EMAIL"
        value={values.email}
        onChangeText={(text) => handleChange('email', text)}
        error={errors.email}
        keyboardType="email-address"
        placeholder="Ejemplo: pepitoperez@gmail.com"
      />
      <CustomInput
        label="CONTRASEÑA"
        value={values.password}
        onChangeText={(text) => handleChange('password', text)}
        error={errors.password}
        secureTextEntry
      />
      <CustomInput
        label="REPETIR CONTRASEÑA"
        value={values.repeatPassword}
        onChangeText={(text) => handleChange('repeatPassword', text)}
        error={errors.repeatPassword}
        secureTextEntry
      />
      <CustomInput
        label="CARRERA:"
        value={values.career}
        onChangeText={(text) => handleChange('career', text)}
        placeholder="Ejemplo: Geología"
      />
      <CustomInput
        label="SEMESTRE:"
        value={String(values.semester)} // Asegúrate de que sea un string para evitar errores en el input
        onChangeText={(text) => handleChange('semester', text)}
        keyboardType="numeric"
      />

      {/* Botón de envío */}
      <View style={styles.btn}>
        <Button title="Crear Cuenta" onPress={handleSubmit} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    padding: 20,
    backgroundColor: '#fff',
  },
  btn: {
    marginTop: 20,
    backgroundColor: '#007bff',
  },
});

export default RegisterForm;
