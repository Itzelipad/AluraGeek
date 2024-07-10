document.addEventListener('DOMContentLoaded', cargarPlantas);
 // Función para limpiar el formulario
 function limpiarFormulario() {
    document.getElementById('plant-form').reset();
}

async function cargarPlantas() {
    try {
        const response = await fetch('http://localhost:3000/plants');
        const plants = await response.json();

        const plantsContainer = document.getElementById('plants-container');
        plantsContainer.innerHTML = ''; // Limpiar el contenedor antes de agregar las tarjetas

        plants.forEach(plant => {
            const card = crearTarjetaPlanta(plant);
            plantsContainer.appendChild(card);
        });

    } catch (error) {
        console.error('Error al cargar las plantas:', error);
    }
}

function crearTarjetaPlanta(plant) {
    const card = document.createElement('div');
    card.classList.add('plant-card');
    card.innerHTML = `
        <img src="${plant.imagenUrl}" alt="Imagen de la planta">
        <div class="plant-info">
            <h3>${plant.nombre}</h3>
            <p>Tipo: ${plant.tipo}</p>
            <p>Precio: $${plant.precio}</p>
            <button class="delete-btn">Eliminar</button>
        </div>
    `;

    const deleteBtn = card.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', async function () {
        try {
            const deleteResponse = await fetch(`http://localhost:3000/plants/${plant.id}`, {
                method: 'DELETE',
            });

            if (!deleteResponse.ok) {
                throw new Error('Error al eliminar la planta');
            }

            card.remove();
        } catch (error) {
            console.error('Error al eliminar la planta:', error);
        }
    });

    return card;
}

// Función para agregar una nueva planta
async function agregarPlanta(event) {
    event.preventDefault(); 

    const nombre = document.getElementById('plant-name').value;
    const tipo = document.getElementById('plant-type').value;
    const precio = document.getElementById('plant-price').value;
    const imagenUrl = document.getElementById('plant-image').value;

    // Validación de precio
    if (precio <= 1) {
        alert('El precio debe ser mayor que 1.');
        return;
    }

    // Validación de campos vacíos
    if (nombre === '' || tipo === '' || precio === '' || imagenUrl === '') {
        alert('Por favor completa todos los campos del formulario.');
        return;
    }

    try {
        // Obtener la lista de plantas existentes
        const response = await fetch('http://localhost:3000/plants');
        const plants = await response.json();

        // Verificar si el nombre de la planta ya existe
        const plantaExistente = plants.find(plant => plant.nombre.toLowerCase() === nombre.toLowerCase());

        if (plantaExistente) {
            alert('El nombre de la planta ya existe. Por favor, elige otro nombre.');
            return;
        }

        // Agregar la nueva planta si no existe una planta con el mismo nombre
        const addResponse = await fetch('http://localhost:3000/plants', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombre,
                tipo,
                precio,
                imagenUrl
            }),
        });

        if (!addResponse.ok) {
            throw new Error('Error al agregar la planta');
        }

        const newPlant = await addResponse.json();
        const card = crearTarjetaPlanta(newPlant);

        const plantsContainer = document.getElementById('plants-container');
        plantsContainer.appendChild(card);

        event.target.reset(); // Limpiar el formulario después de agregar la planta

    } catch (error) {
        console.error('Error al agregar la planta:', error);
    }
}

const plantForm = document.getElementById('plant-form');
plantForm.addEventListener('submit', agregarPlanta);
