// Validaciones.js
const Validaciones = {
    // Validación para campos de texto
    texto: (valor, campo) => {
      if (!valor.trim()) return `${campo} es obligatorio.`;
      if (valor.length < 3) return `${campo} debe tener al menos 3 caracteres.`;
      if (/[<>]/.test(valor)) return `El campo ${campo} contiene caracteres no permitidos.`;
      return null;
    },
  
    // Validación para precios
    precio: (valor) => {
      if (!valor) return 'El precio es obligatorio.';
      if (isNaN(valor) || parseFloat(valor) <= 0) return 'El precio debe ser un número positivo.';
      return null;
    },
  
    // Validación para campos de selección
    seleccion: (valor, campo) => {
      if (!valor) return `Selecciona una opción para ${campo}.`;
      return null;
    },
  
    // Validación para números de teléfono
    telefono: (valor) => {
      if (!valor) return 'El teléfono es obligatorio.';
      if (!/^[\d\s+()-]{7,15}$/.test(valor)) return 'Formato de teléfono inválido.';
      return null;
    },
  
    // Validación para direcciones (campo opcional)
    direccion: (valor) => {
      if (valor && valor.length < 5) return 'La dirección es demasiado corta.';
      if (/[<>]/.test(valor)) return 'La dirección contiene caracteres no permitidos.';
      return null;
    },
  
    // Validación para correos electrónicos
    email: (valor) => {
      if (!valor) return 'El correo electrónico es obligatorio.';
      if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(valor)) return 'Formato de correo electrónico inválido.';
      return null;
    },
  
    // Validación para contraseñas
    password: (valor) => {
      if (!valor) return 'La contraseña es obligatoria.';
      if (valor.length < 6) return 'La contraseña debe tener al menos 6 caracteres.';
      if (!/[A-Z]/.test(valor) || !/[a-z]/.test(valor) || !/\d/.test(valor)) {
        return 'La contraseña debe contener mayúsculas, minúsculas y números.';
      }
      return null;
    },
  
    // Validación para confirmación de contraseñas
    confirmPassword: (valor, password) => {
      if (valor !== password) return 'Las contraseñas no coinciden.';
      return null;
    },
  };
  
  export default Validaciones;
  