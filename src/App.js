
import React, { useState, useEffect } from "react";
import "./App.css";


function App() {
  // ============================
  // Estados principales (Inputs)
  // ============================
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("Plato Principal");
  const [tiempo, setTiempo] = useState("");
  const [dificultad, setDificultad] = useState("Fácil");
  const [descripcion, setDescripcion] = useState("");

  // Estados de control de la colección de recetas
  const [recetas, setRecetas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });
  const [consejo, setConsejo] = useState("");
  
  // Accesibilidad (Modo Daltonismo de Alto Contraste)
  const [modoDaltonico, setModoDaltonico] = useState(false);
  
  const [idEdicion, setIdEdicion] = useState(null);

  const consejos = [
    "🍅 Usa ingredientes frescos para un mejor sabor.",
    "🧂 Prueba la comida antes de servir.",
    "🥬 Lava siempre las verduras.",
    "🧈 No cocines a fuego demasiado alto.",
    "🍋 Un poco de limón puede cambiar una receta.",
    "🧄 El ajo fresco siempre aporta mejor aroma.",
    "🌿 Las hierbas frescas hacen la diferencia."
  ];

  // ============================
  // Cargar desde Local Storage (Criterio 3.1.3)
  // ============================
  useEffect(() => {
    try {
      const datos = localStorage.getItem("recetas_astrochef");
      if (datos) {
        setRecetas(JSON.parse(datos));
      }
    } catch (error) {
      console.error("Error al leer datos de Local Storage", error);
    }
  }, []);

  // Persistir cambios automáticamente
  useEffect(() => {
    localStorage.setItem("recetas_astrochef", JSON.stringify(recetas));
  }, [recetas]);

  // Rotador automático de consejos
  useEffect(() => {
    const cambiarConsejo = () => {
      const random = consejos[Math.floor(Math.random() * consejos.length)];
      setConsejo(random);
    };
    cambiarConsejo();
    const intervalo = setInterval(cambiarConsejo, 6000);
    return () => clearInterval(intervalo);
  }, []);

  // ============================
  // Criterio 3.1.2: Desarrollo Seguro (Sanitización de Inputs)
  // ============================
  const sanitizarEntrada = (cadena) => {
    return cadena
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;");
  };

  // ============================
  // Criterio 3.1.3: Operaciones CRUD Completas
  // ============================
  const guardarReceta = (e) => {
    e.preventDefault();

    // Validaciones robustas
    if (!nombre.trim() || !String(tiempo).trim() || !descripcion.trim()) {
      setMensaje({ texto: "⚠ Error de validación: Todos los campos son obligatorios.", tipo: "danger" });
      return;
    }

    if (isNaN(tiempo) || Number(tiempo) <= 0) {
      setMensaje({ texto: "⚠ El tiempo de preparación debe ser un número positivo.", tipo: "danger" });
      return;
    }

    const nombreSeguro = sanitizarEntrada(nombre);
    const descSegura = sanitizarEntrada(descripcion);

    if (idEdicion) {
      // Operación: UPDATE (Actualizar)
      const modificadas = recetas.map((r) =>
        r.id === idEdicion
          ? { ...r, nombre: nombreSeguro, categoria, tiempo: Number(tiempo), dificultad, descripcion: descSegura }
          : r
      );
      setRecetas(modificadas);
      setMensaje({ texto: "💚 Bitácora estelar actualizada con éxito.", tipo: modoDaltonico ? "info" : "success" });
      setIdEdicion(null);
    } else {
      // Operación: CREATE (Crear)
      const nuevaReceta = {
        id: Date.now(),
        nombre: nombreSeguro,
        categoria,
        tiempo: Number(tiempo),
        dificultad,
        descripcion: descSegura,
        favorita: false
      };
      setRecetas([...recetas, nuevaReceta]);
      setMensaje({ texto: "💚 Nueva receta sincronizada en la memoria local.", tipo: modoDaltonico ? "info" : "success" });
    }

    // Resetear formulario
    setNombre("");
    setCategoria("Plato Principal");
    setTiempo("");
    setDificultad("Fácil");
    setDescripcion("");

    setTimeout(() => setMensaje({ texto: "", tipo: "" }), 4000);
  };

  // Operación: Cargar datos para editar
  const prepararEdicion = (receta) => {
    setIdEdicion(receta.id);
    setNombre(receta.nombre);
    setCategoria(receta.categoria);
    setTiempo(receta.tiempo);
    setDificultad(receta.dificultad);
    setDescripcion(receta.descripcion);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Operación: DELETE (Eliminar)
  const eliminarReceta = (id) => {
    if (window.confirm("¿Segura que deseas purgar esta receta de la base de datos?")) {
      const nuevas = recetas.filter((r) => r.id !== id);
      setRecetas(nuevas);
      setMensaje({ texto: "🗑 Receta eliminada correctamente.", tipo: "warning" });
      if (idEdicion === id) setIdEdicion(null);
      setTimeout(() => setMensaje({ texto: "", tipo: "" }), 4000);
    }
  };

  // ============================
  // Integración API (Funcionalidad Rúbrica)
  // ============================
  const invocarRecetaApi = async () => {
    setMensaje({ texto: "📡 Sincronizando receta desde la red estelar...", tipo: "info" });
    try {
      const response = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
      const data = await response.json();
      const meal = data.meals[0];
      
      const nuevaReceta = {
        id: Date.now(),
        nombre: `${meal.strMeal} (API)`,
        categoria: meal.strCategory,
        tiempo: 30,
        dificultad: "Intermedio",
        descripcion: meal.strInstructions.substring(0, 300) + "...",
        favorita: false
      };
      
      setRecetas([...recetas, nuevaReceta]);
      setMensaje({ texto: "✅ Receta externa sincronizada con éxito.", tipo: modoDaltonico ? "info" : "success" });
    } catch (error) {
      setMensaje({ texto: "❌ Error al conectar con el servidor externo.", tipo: "danger" });
    }
    setTimeout(() => setMensaje({ texto: "", tipo: "" }), 4000);
  };

  const alternarFavorito = (id) => {
    const nuevas = recetas.map((r) =>
      r.id === id ? { ...r, favorita: !r.favorita } : r
    );
    setRecetas(nuevas);
  };

  const invocarRecetaSorpresa = () => {
    if (recetas.length === 0) {
      alert("No hay recetas almacenadas en tu base de datos estelar.");
      return;
    }
    const random = recetas[Math.floor(Math.random() * recetas.length)];
    alert(`🌌 Sugerencia de la Galaxia:\nHoy deberías cocinar: "${random.nombre}"`);
  };

  const recetasFiltradas = recetas.filter((r) =>
    r.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const total = recetas.length;
  const favoritasCount = recetas.filter((r) => r.favorita).length;
  const tiempoTotal = recetas.reduce((acc, r) => acc + (Number(r.tiempo) || 0), 0);

  return (
    <div className={`container py-4 astro-container ${modoDaltonico ? "modo-daltonico" : ""}`}>
      
      {/* Selector Flotante de Accesibilidad */}
      <div className="position-fixed top-0 start-0 m-3 z-3">
        <button 
          onClick={() => setModoDaltonico(!modoDaltonico)} 
          className={`btn fw-bold shadow-lg text-uppercase px-3 ${modoDaltonico ? "btn-warning text-dark border-warning" : "btn-outline-info"}`}
          style={{ fontSize: "0.8rem", letterSpacing: "1px" }}
        >
          👁️ {modoDaltonico ? "Filtro: Activo (Alto Contraste)" : "Filtro Daltonismo"}
        </button>
      </div>

      {mensaje.texto && (
        <div className={`alert alert-${mensaje.tipo} position-fixed top-0 end-0 m-4 shadow-lg z-3 astro-toast`} role="alert">
          {mensaje.texto}
        </div>
      )}

      {/* Cabecera Principal */}
      <header className="text-center mb-5 astro-hero">
        <h1 className="display-4 astro-title">AstroChef </h1>
        <p className="lead text-muted-claro astro-subtitle">Centro de Comando Culinario para la Tripulación Bascuñán y Casté</p>
        <div className="astro-banner-consejo px-4 py-2 rounded-pill d-inline-block">
          <small>{consejo}</small>
        </div>
      </header>

      {/* Grid de Trabajo */}
      <div className="row g-4 astro-workspace">
        {/* Formulario */}
        <div className="col-12 col-lg-7">
          <div className="card p-4 h-100 astro-card">
            <h2 className="h4 mb-4 text-turquoise">
              <i className={`fas ${idEdicion ? "fa-edit" : "fa-plus-circle"} me-2`}></i>
              {idEdicion ? "Editar Receta Estelar" : "Registrar Nueva Receta"}
            </h2>
            
            <form onSubmit={guardarReceta}>
              <div className="mb-3">
                <label className="form-label text-secondary-claro small fw-bold">Nombre del Platillo</label>
                <input
                  type="text"
                  className="form-control astro-input"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Alfajores de Maicena Estelares"
                  maxLength="60"
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-12 col-sm-6">
                  <label className="form-label text-secondary-claro small fw-bold">Categoría</label>
                  <select className="form-select astro-input" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                    <option>Plato Principal</option>
                    <option>Pastelería</option>
                    <option>Alfajores</option>
                    <option>Panadería</option>
                    <option>Entradas</option>
                    <option>Ensaladas</option>
                    <option>Postres</option>
                    <option>Salsas</option>
                    <option>Bebidas/Tragos</option>
                  </select>
                </div>

                <div className="col-12 col-sm-6">
                  <label className="form-label text-secondary-claro small fw-bold">Tiempo (minutos)</label>
                  <input
                    type="number"
                    className="form-control astro-input"
                    value={tiempo}
                    onChange={(e) => setTiempo(e.target.value)}
                    placeholder="Ej: 45"
                    min="1"
                    max="999"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label text-secondary-claro small fw-bold">Grado de Dificultad</label>
                <select className="form-select astro-input" value={dificultad} onChange={(e) => setDificultad(e.target.value)}>
                  <option>Fácil</option>
                  <option>Intermedio</option>
                  <option>Experto</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label text-secondary-claro small fw-bold">Descripción e Ingredientes</label>
                <textarea
                  className="form-control astro-input"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Escribe los ingredientes clave y pasos de preparación..."
                  rows="5"
                  maxLength="1000"
                />
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-turquoise w-100 fw-bold py-2 text-uppercase btn-astro-submit">
                  {idEdicion ? "Guardar Cambios Galácticos" : "Sincronizar Receta"}
                </button>
                {idEdicion && (
                  <button 
                    type="button" 
                    className="btn btn-outline-danger px-4"
                    onClick={() => {
                      setIdEdicion(null);
                      setNombre("");
                      setCategoria("Plato Principal");
                      setTiempo("");
                      setDificultad("Fácil");
                      setDescripcion("");
                    }}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Panel de Control Lateral */}
        <div className="col-12 col-lg-5">
          <div className="d-flex flex-column gap-4 h-100 justify-content-start">
            {/* Indicadores de Control */}
            <div className="card p-4 astro-card">
              <h3 className="h6 text-uppercase tracking-wider mb-3 text-light-claro">📊 Indicadores de la Estación</h3>
              <div className="row text-center g-2">
                <div className="col-4">
                  <div className="p-2 rounded astro-metric-box">
                    <span className="d-block h3 mb-0 text-turquoise font-bold">{total}</span>
                    <small className="text-secondary-claro x-small fw-bold">Recetas</small>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-2 rounded astro-metric-box">
                    <span className="d-block h3 mb-0 text-warning font-bold">{favoritasCount}</span>
                    <small className="text-secondary-claro x-small fw-bold">Favoritas</small>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-2 rounded astro-metric-box">
                    <span className="d-block h3 mb-0 text-magenta font-bold">{tiempoTotal}m</span>
                    <small className="text-secondary-claro x-small fw-bold">Tiempo</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Filtrado */}
            <div className="card p-4 astro-card">
              <h3 className="h6 text-uppercase tracking-wider mb-3 text-light-claro">🔍 Filtrado Avanzado</h3>
              <input
                type="text"
                className="form-control astro-input mb-3"
                placeholder="Buscar receta por nombre..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <div className="d-grid gap-2">
                <button className="btn btn-magenta fw-bold" onClick={invocarRecetaSorpresa}>
                  🎲 Invocar Receta Sorpresa
                </button>
                <button className="btn btn-outline-info fw-bold" onClick={invocarRecetaApi}>
                  🚀 Sincronizar API Externa (inglés)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Catálogo Inferior */}
      <main className="mt-5 astro-catalog">
        <h2 className="h4 mb-4 text-turquoise pb-2 border-bottom-cyan">📋 Historial Gastronómico Registrado</h2>
        
        {recetasFiltradas.length === 0 ? (
          <div className="text-center py-5 bg-dark-transparent rounded border-dashed">
            <i className="fas fa-folder-open fa-2x mb-2 text-info"></i>
            <p className="mb-0 small astro-light-text label-vacia">No se registran bitácoras culinarias en estas coordenadas.</p>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
            {recetasFiltradas.map((r) => (
              <div key={r.id} className="col">
                <div 
                  className={`card h-100 text-white astro-recipe-card ${r.favorita ? "border-warning bg-fav-gradient" : ""}`}
                  style={{ backgroundColor: "#151f32" }}
                >
                  <div className="card-body d-flex flex-column justify-content-between p-3">
                    <div>
                      <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                        <span className="badge bg-dark-opacity text-turquoise border border-turquoise-sm fw-bold">
                          {r.categoria}
                        </span>
                        <button onClick={() => alternarFavorito(r.id)} className={`btn p-0 border-0 fs-5 line-height-1 ${r.favorita ? "text-warning" : "text-secondary"}`}>
                          <i className={`${r.favorita ? "fas" : "far"} fa-star`}></i>
                        </button>
                      </div>

                      {/* Título de la receta */}
                      <h3 className="h5 text-white fw-bold mb-2 mt-1">{r.nombre}</h3>

                      <div className="d-flex gap-3 text-info small mb-3 fw-medium">
                        <span><i className="far fa-clock me-1"></i>{r.tiempo} min</span>
                        <span><i className="fas fa-layer-group me-1"></i>{r.dificultad}</span>
                      </div>

                      <p className="card-text small text-secondary-light astro-desc-text fw-normal">{r.descripcion}</p>
                    </div>

                    <div className="d-flex gap-2 mt-4 pt-2 border-top-dark">
                      <button className="btn btn-sm btn-outline-light w-100 text-uppercase tracking-wider small-font fw-bold" onClick={() => prepararEdicion(r)}>
                        <i className="fas fa-pencil-alt me-1"></i>Editar
                      </button>
                      <button className="btn btn-sm btn-outline-danger w-100 text-uppercase tracking-wider small-font fw-bold" onClick={() => eliminarReceta(r.id)}>
                        <i className="fas fa-trash-alt me-1"></i>Eliminar
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="text-center py-4 mt-5 border-top-dark text-secondary small fw-medium">
        <p className="mb-0">AstroChef Pro © 2026 | Desarrollado bajo los estándares de Bootstrap 5 e IA Avanzada</p>
      </footer>
    </div>
  );
}

export default App;
