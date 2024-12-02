import React, { useState, useEffect } from "react";
import { supabase } from "../supabase";
import FormularioGenerico from "./FormularioGenerico";
import ListaGenerica from "./ListaGenerica";
import ModalGenerico from "./ModalGenerico";
import Validaciones from "./Validaciones";

const GestionarProductos = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [coloresDisponibles, setColoresDisponibles] = useState([]);
  const [tallasDisponibles, setTallasDisponibles] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categorias_id: "",
    img_url: "",
    colores: [],
    tallas: [],
  });
  const [imagen, setImagen] = useState(null);
  const [modalConfig, setModalConfig] = useState({
    show: false,
    mode: "",
    producto: null,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = async () => {
    try {
      const [productosData, categoriasData, coloresData, tallasData] =
        await Promise.all([
          supabase.from("productos").select("*"),
          supabase.from("categorias").select("*"),
          supabase.from("colores").select("*"),
          supabase.from("tallas").select("*"),
        ]);

      if (
        productosData.error ||
        categoriasData.error ||
        coloresData.error ||
        tallasData.error
      ) {
        throw new Error("Error cargando datos iniciales");
      }

      setProductos(productosData.data);
      setCategorias(categoriasData.data);
      setColoresDisponibles(coloresData.data);
      setTallasDisponibles(tallasData.data);
    } catch (error) {
      console.error("Error al cargar datos iniciales:", error);
    }
  };

  const validarFormulario = (valores) => {
    const nuevosErrores = {
      nombre: Validaciones.texto(valores?.nombre || '', "Nombre"),
      precio: Validaciones.precio(valores?.precio || ''),
      categoria: Validaciones.seleccion(valores?.categorias_id || '', "Categoría"),
    };
    setErrors(nuevosErrores);
    return !Object.values(nuevosErrores).some((error) => error);
  };
  

  const manejarImagen = async (imagen) => {
    if (!imagen) return "";

    try {
      const fileExt = imagen.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `productos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("productos")
        .upload(filePath, imagen);

      if (uploadError) {
        console.error("Error al subir imagen:", uploadError);
        throw uploadError;
      }

      const {
        data: { publicUrl },
        error: urlError,
      } = await supabase.storage.from("productos").getPublicUrl(filePath);

      if (urlError) {
        console.error("Error al obtener URL pública:", urlError);
        throw urlError;
      }

      return publicUrl;
    } catch (error) {
      console.error("Error en el proceso de manejo de imagen:", error);
      return "";
    }
  };

  const agregarProducto = async (e) => {
    e.preventDefault();
    if (!validarFormulario(nuevoProducto)) return;
  
    try {
      const imgUrl = await manejarImagen(imagen);
  
      const { error: insertError } = await supabase.from("productos").insert([
        {
          ...nuevoProducto,
          img_url: imgUrl,
        },
      ]);
  
      if (insertError) throw insertError;
  
      setNuevoProducto({
        nombre: "",
        descripcion: "",
        precio: "",
        categorias_id: "",
        img_url: "",
        colores: [],
        tallas: [],
      });
      setImagen(null);
      setErrors({});
      cargarDatosIniciales();
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  };
  

  const actualizarProducto = async () => {
    if (!validarFormulario(modalConfig.producto)) return;
  
    const { id, ...datosActualizados } = modalConfig.producto;
  
    if (imagen) {
      datosActualizados.img_url = await manejarImagen(imagen);
    }
  
    try {
      const { error } = await supabase
        .from("productos")
        .update(datosActualizados) 
        .eq("id", id);
  
      if (error) {
        console.error("Error al actualizar producto:", error);
        return;
      }
  
      setModalConfig({ show: false, mode: "", producto: null });
      cargarDatosIniciales(); 
    } catch (error) {
      console.error("Error al actualizar producto:", error);
    }
  };
  
  

  const eliminarProducto = async () => {
    if (!modalConfig.producto?.id) return;
  
    try {
      const { error } = await supabase
        .from("productos")
        .delete()
        .eq("id", modalConfig.producto.id);
  
      if (error) {
        if (error.code === "23503") {
          alert(
            "No puedes eliminar este producto porque está asociado a pedidos. Elimina los pedidos relacionados antes de continuar."
          );
        } else {
          console.error("Error al eliminar producto:", error);
        }
        return;
      }
  
      setModalConfig({ show: false, mode: "", producto: null });
      cargarDatosIniciales(); // Actualizar la lista de productos
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  };
  

  const camposProducto = [
    { nombre: "nombre", etiqueta: "Nombre", tipo: "text", error: errors.nombre },
    { nombre: "descripcion", etiqueta: "Descripción", tipo: "textarea" },
    { nombre: "precio", etiqueta: "Precio", tipo: "number", error: errors.precio },
    {
      nombre: "categorias_id",
      etiqueta: "Categoría",
      tipo: "select",
      opciones: categorias.map((categoria) => ({
        value: categoria.id,
        label: categoria.nombre,
      })),
      error: errors.categoria,
    },
    { nombre: "img_url", etiqueta: "Imagen", tipo: "file" },
    {
      nombre: "colores",
      etiqueta: "Colores",
      tipo: "checkbox",
      opciones: coloresDisponibles,
    },
    {
      nombre: "tallas",
      etiqueta: "Tallas",
      tipo: "checkbox",
      opciones: tallasDisponibles,
    },
  ];

  const columnasProducto = [
    { nombre: "nombre", etiqueta: "Nombre" },
    { nombre: "descripcion", etiqueta: "Descripción" },
    { nombre: "precio", etiqueta: "Precio" },
    {
      nombre: "img_url",
      etiqueta: "Imagen",
      render: (producto) => (
        <img
          src={producto.img_url}
          alt={producto.nombre}
          style={{ width: "50px", height: "50px", objectFit: "cover" }}
        />
      ),
    },
    { nombre: "colores", etiqueta: "Colores" },
    { nombre: "tallas", etiqueta: "Tallas" },
  ];

  return (
    <div>
      <FormularioGenerico
        titulo="Agregar Producto"
        campos={camposProducto}
        valores={nuevoProducto}
        setValores={setNuevoProducto}
        onSubmit={agregarProducto}
        onImageChange={(e) => setImagen(e.target.files[0])}
      />
      <ListaGenerica
        datos={productos}
        columnas={columnasProducto}
        onEditar={(producto) =>
          setModalConfig({
            show: true,
            mode: "edit",
            producto: { ...producto },
          })
        }
        onEliminar={(producto) =>
          setModalConfig({ show: true, mode: "delete", producto })
        }
      />
      <ModalGenerico
  show={modalConfig.show}
  handleClose={() => setModalConfig({ show: false, mode: "", producto: null })}
  title={modalConfig.mode === "edit" ? "Editar Producto" : "Eliminar Producto"}
  handleConfirm={
    modalConfig.mode === "edit" ? actualizarProducto : eliminarProducto
  }
  confirmText={modalConfig.mode === "edit" ? "Guardar Cambios" : "Eliminar"}
>
  {modalConfig.mode === "edit" && modalConfig.producto ? (
    <FormularioGenerico
      titulo="Editar Producto"
      campos={camposProducto}
      valores={modalConfig.producto}
      setValores={(valores) =>
        setModalConfig((prev) => ({
          ...prev,
          producto: { ...prev.producto, ...valores },
        }))
      }
      onSubmit={(e) => {
        e.preventDefault();
        actualizarProducto();
      }}
      onImageChange={(e) => setImagen(e.target.files[0])}
    />
  ) : modalConfig.mode === "delete" ? (
    <p>¿Estás seguro de que deseas eliminar este producto?</p>
  ) : (
    <p>Cargando...</p>
  )}
</ModalGenerico>

    </div>
  );
};

export default GestionarProductos;
