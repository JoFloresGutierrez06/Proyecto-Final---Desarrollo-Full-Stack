// Attor - Avance de Proyecto Final - Jocelyn Flores Gutiérrez - Cuarto semestre

/* Configuraciones iniciales en consola:
    - npm init
    - npm install express
    ---------------------------------
    - npm install --save-dev nodemon
        *Cambiamos la variable de scripts en package por: "dev": "nodemon index.js"
    - npm run dev 
*/

//-------- CONFIGURACIONES ----------

const express = require('express');
const app = express();
const PORT = 5000;

app.use(express.json()); // Middleware para leer los json que pase el body

let obras = [ // Almacena los productos localmente sin una base de datos
    // Titulo       (String)
    // Autor        (String)
    // Descripcion  (String)
    // Portada      (String)    - Link a la imagen de la portada
    // Publicado    (Boolean)   - ¿es visible para los lectores?
]; 

// #--------- GET --------------#

// INICIO
app.get('/', (req, res) => {
    res.json({"mensaje": "Página de inicio de la editorial. Bienvenido."})
})

// OBRAS
app.get('/obras', (req, res) => {

    // No hay obras disponibles
    if(obras.length === 0) { return res.status(204).send("Sin obras disponibles.") }

    // Devuelve las obras no-ocultas
    res.json(obras.filter(obra => obra.publicado === true)) 
});

// #--------- POST --------------#

// Atributos necesarios: Titulo, Autor, Descripción. 
// Se pueden establecer por default: Portada, Publicado

app.post('/obras', (req, res) => {
    const obra = req.body;

    // Contenido vacío
    if (!obra) { return res.status(204).send("Contenido vacío.")}

    // Verificar si el valor en publicado es booleano
    if (obra.publicado) {
        if (obra.publicado === true || obra.publicado === false) {
        } else {res.status(403).send("Valor incorrecto. Se requiere: booleano.")  }
    }

    // Verificar los atributos obligatorios
    if (!obra.titulo || obra.titulo.trim() === "" || !obra.autor || obra.autor.trim() === "" || !obra.descripcion || obra.descripcion.trim() === "") {
        return res.status(400).send("Elementos obligatorios: Titulo, Autor, Descripción.");
    }

    // Confirmar si tiene portada
    if (!obra.portada || obra.portada.trim() === "") { obra.portada = "http://portadadefault" }

    // Confirmar si está publicada
    if (!obra.publicado) { obra.publicado = false }

    obras.push(obra); // Se agrega
    res.status(201).json(obra); // Mostrar la obra creada
});

// #--------- PUT --------------#

app.put('/obras/:id', (req, res) => { // Se le puede agregar mas parametros, como :user

    const id = req.params.id;   // Obtener el id de la petición
    const obra = req.body;      // Obtener la actualización

    // Comprobar que el body no esté vacío
    if(!obra) { return res.status(400).send("Contenido vacío."); }
     
    // Comprobar que el id existe
    if(!obras[id]) { return res.status(404).send("No existe el id."); } 

    // AACTUALIZAR TITULO
    if (obra.titulo) {
        if (!obra.titulo || obra.titulo.trim() === "") {
            return res.status(404).send("No hay título disponible.")
        }
        obras[id].titulo = obra.titulo
    }

    // ACTUALIZAR AUTOR
    if (obra.autor) {
        if (!obra.autor || obra.autor.trim() === "") {
            return res.status(404).send("No hay autor disponible.")
        }
        obras[id].autor = obra.autor
    }

    // ACTUALIZAR DESCRIPCIÓN
    if (obra.descripcion) {
        if (!obra.descripcion || obra.descripcion.trim() === "") {
            return res.status(404).send("No hay descripción disponible.")
        }
        obras[id].descripcion = obra.descripcion
    }

    // ACTUALIZAR PORTADA
    if (obra.portada) {
        if (!obra.portada || obra.portada.trim() === "") {
            return res.status(404).send("No hay portada disponible.")
        }
        obras[id].portada = obra.portada
    }

    // ACTUALIZAR PUBLICADO
    if (obra.hasOwnProperty("publicado") || obra.publicado !== undefined) {
        if (typeof obra.publicado !== "boolean") {
            return res.status(400).send("Valor incorrecto. Se requiere booleano.");
        }
        obras[id].publicado = obra.publicado;
    }

    // Todo salió bien, muestra la obra actualizada
    res.status(200).json({ obra: obras[id] })
})

// #--------- DELETE --------------#

app.delete('/obras/:id', (req, res) => {
    const id = req.params.id;

    // Comprobar que el id existe
    if(!obras[id]) { res.status(404).send('No existe el id.');

    } else {
        obras.splice(id, 1); // remover elemento del arreglo
        res.status(204).send("Elemento eliminado.");
    }  
});

// #--------- LISTENER --------------#

app.listen(PORT, () => {
    console.log(`Servidor activo en http://localhost:${PORT}`);
})