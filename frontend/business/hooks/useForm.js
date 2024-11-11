// src/business/hooks/useForm.js
import { useState } from 'react';
import { validateRegisterForm } from '../validators/authValidators';  // Importar las validaciones

export const useForm = (initialValues = {}, onSubmit) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  // Manejador de cambios de cada input
  const handleChange = (name, value) => {
    setValues({
      ...values,
      [name]: value,
    });
  };

  // Validar el formulario cuando se envía
  const validateForm = () => {
    const newErrors = validateRegisterForm(values);  // Usar la función de validación externa

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0; // Devuelve true si no hay errores
  };

  // Manejador del envío del formulario
  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(values);
    }
  };

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
  };
};
