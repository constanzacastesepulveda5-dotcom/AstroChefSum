# AstroChefSum
Sumativa 3, Front End, Casté y Bacuñán

Introducción
Durante el desarrollo de la Sumativa 3, se utilizó inteligencia artificial (Gemini) como asistente de programación para garantizar el cumplimiento de los criterios de desarrollo seguro, consumo de APIs y persistencia de datos.

1. Fase de Estructura y CRUD
Prompt: "Actúa como experto en React. Necesito crear una aplicación tipo SPA para gestión de recetas (AstroChef). Debo implementar un CRUD completo (Crear, Leer, Actualizar, Eliminar) utilizando useState para el estado y localStorage para persistir los datos. Incluye validación de campos obligatorios y manejo de errores. Usa un diseño responsive con Bootstrap 5."

Aplicación: Se generó la lógica inicial del estado recetas y las funciones guardarReceta, eliminarReceta y prepararEdicion.

2. Fase de Diseño UI/UX
Prompt: "La aplicación debe tener una estética futurista y espacial. Crea una estructura con Bootstrap 5 que incluya una cabecera, un formulario de registro y un catálogo de tarjetas dinámicas. Asegúrate de que el diseño sea 'mobile-first' y utilice colores oscuros, magenta y turquesa."

Aplicación: Se definieron las clases CSS personalizadas (astro-container, astro-card) para lograr la identidad visual solicitada en la rúbrica.

3. Fase de Seguridad y Desarrollo Seguro (Criterio 3.1.2)
Prompt: "Estoy usando formularios en React. ¿Cómo puedo prevenir ataques XSS (Cross-Site Scripting) al renderizar las recetas registradas por el usuario? Crea una función para sanitizar los inputs de texto reemplazando caracteres especiales como <, >, &, ", ' antes de guardarlos."

Aplicación: Se implementó la función sanitizarEntrada que se ejecuta antes de cualquier operación de creación o actualización, protegiendo el DOM.

4. Fase de Integración API Externa (Criterio 3.1.4)
Prompt: "Necesito integrar el consumo de la API pública 'TheMealDB' (https://www.themealdb.com/api/json/v1/1/random.php) para obtener recetas aleatorias. Crea una función asíncrona usando async/await y fetch que maneje posibles errores con try/catch. Si la llamada falla, debe mostrar una alerta visual al usuario."

Aplicación: Se desarrolló invocarRecetaApi y se configuró un sistema de alertas (mensaje.texto) para dar feedback al usuario, cumpliendo con los estándares de UX.

5. Fase de Persistencia y React Hooks (Criterio 3.1.3)
Prompt: "Tengo una función que actualiza el estado de las recetas. ¿Cómo puedo usar useEffect para que cada vez que cambie el estado de recetas, se guarden automáticamente en el localStorage del navegador?"

Aplicación: Se implementó el hook useEffect como observador del estado, garantizando la integridad de los datos entre sesiones.

6. Fase de Accesibilidad y Refinamiento
Prompt: "Necesito añadir un modo de accesibilidad (alto contraste) para usuarios con daltonismo. ¿Cómo puedo implementar un interruptor que cambie las clases CSS de toda la aplicación dinámicamente?"

Aplicación: Se añadió el estado modoDaltonico y un selector en la interfaz que altera dinámicamente los estilos para cumplir con estándares de accesibilidad.

7. Fase de Auditoría Final (Criterio 3.1.1)
Prompt: "Revisa mi archivo App.js. ¿Cumple con el patrón de componentes de React? ¿El manejo de estado es óptimo? Asegúrate de que el componente principal no esté sobrecargado y que las funciones sean reutilizables."

Aplicación: Se optimizó la estructura del código, asegurando una separación clara entre lógica de negocio y presentación en el return.
