import { useState } from 'react';
import { validateRegisterForm } from '../validators';  // Importar las validaciones

export const useForm = (onSubmit, initialValues = {}) => {
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
      if (typeof onSubmit === 'function') {
        onSubmit(values);
      } else {
        console.warn("onSubmit no está definido o no es una función");
      }
    }
  };

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
  };
};
