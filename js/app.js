document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const studentCode = params.get('id');

    if (document.getElementById('studentsList')) {
        await renderStudents();
    }

    if (document.getElementById('studentForm')) {
        setupStudentForm();
    }

    if (document.getElementById('edit-student-form')) {
        await setupEditForm(studentCode);
    }

    if (document.getElementById('student-detail')) {
        await setupStudentDetail(studentCode);
    }

    if (document.getElementById('profile-student')) {
        await setupStudent(studentCode);
    }

    await loadTechnologies();
    const studentCodeElement = document.getElementById("student-code").textContent.trim();

    if (studentCode) {
        await loadStudentTechnologies(studentCode);
    }
});

async function renderStudents() {
    try {
        const students = await api.getStudents();
        const studentsList = document.getElementById('studentsList');
        const template = document.getElementById('studentCardTemplate');
        studentsList.innerHTML = '';

        students.forEach(student => {
            const clone = template.content.cloneNode(true);
            clone.querySelector('.student-name').textContent = student.name;
            clone.querySelector('.student-id').textContent = `ID: ${student.code}`;
            clone.querySelector('.student-email').textContent = student.email;
            clone.querySelector('.student-image').src = student.photo;
            clone.querySelector('.github-link').href = `https://github.com/${student.github}`;

            clone.querySelector('.btn-edit').addEventListener('click', () => {
                window.location.href = `edit.html?id=${student.code}`;
            });

            clone.querySelector('.btn-profile').addEventListener('click', () => {
                window.location.href = `detail.html?id=${student.code}`;
            });

            clone.querySelector('.btn-resume').addEventListener('click', () => {
                window.location.href = `resume.html?id=${student.code}`;
            });

            studentsList.appendChild(clone);
        });
    } catch (error) {
        console.error('Error al cargar estudiantes:', error);
    }
}

const btnNew = document.getElementById('btnNew');
if (btnNew) {
    btnNew.addEventListener('click', () => {
        window.location.href = 'form.html';
    });
}

async function setupStudentForm() {
    document.getElementById('studentForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const newStudent = {
            code: document.getElementById('codigo').value.trim(),
            name: document.getElementById('nombre').value.trim(),
            email: document.getElementById('email').value.trim(),
            photo: document.getElementById('imagen').value.trim(),
            github_link: document.getElementById('url').value.trim(),
            description: document.getElementById('description').value.trim()
        };
        try {
            await api.createStudent(newStudent);
            alert('Estudiante creado con éxito!');
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Error agregando al estudiante:', error);
            alert('Fallo al agregar el estudiante.');
        }
    });
    const btnCancel = document.querySelector('.btn-cancel');
    if (btnCancel) {
        btnCancel.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
}

async function setupEditForm(studentCode) {
    try {
        const studentData = await api.getStudentByCode(studentCode);
        if (studentData) {
            document.getElementById('student-code').value = studentData.code;
            document.getElementById('full-name').value = studentData.name;
            document.getElementById('email').value = studentData.email;
            document.getElementById('photo').value = studentData.photo || '';
            document.getElementById('github-link').value = studentData.github_link || '';
            document.getElementById('description').value = studentData.description || '';
        }
    } catch (error) {
        console.error('Error obteniendo datos del estudiante:', error);
    }

    document.getElementById('edit-student-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const updatedStudent = {
            code: studentCode,
            name: document.getElementById('full-name').value.trim(),
            email: document.getElementById('email').value.trim(),
            photo: document.getElementById('photo').value.trim(),
            github_link: document.getElementById('github-link').value.trim(),
            description: document.getElementById('description').value.trim()
        };
        try {
            await api.updateStudent(studentCode, updatedStudent);
            alert('Estudiante actualizado con éxito!');
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Error actualizando al estudiante:', error);
            alert('Fallo al actualizar el estudiante.');
        }
    });

    const btnCancel = document.querySelector('.btn-cancel');
    if (btnCancel) {
        btnCancel.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
}

async function setupStudentDetail(studentCode) {
    try {
        const studentData = await api.getStudentByCode(studentCode);
        if (studentData) {
            document.getElementById('student-name').textContent = studentData.name;
            document.getElementById('student-code').textContent = `${studentData.code}`;
            document.getElementById('student-email').textContent = studentData.email;
            document.getElementById('student-image').src = studentData.photo;
            document.getElementById('description').textContent = studentData.description;
            document.getElementById('github-link').href = studentData.github_link ? `GitHub: ${studentData.github_link}` : '';
        }
    } catch (error) {
        console.error('Error obteniendo datos del estudiante para detalles:', error);
    }

    await loadTechnologies(studentCode);
}

async function loadTechnologies() {
    try {
        const technologies = await api.getTechnologies();
        const select = document.getElementById("technology");

        select.innerHTML = ""; // Limpiar opciones anteriores
        const defaultOption = document.createElement("option");
        defaultOption.textContent = "Select a technology";
        defaultOption.value = "";
        select.appendChild(defaultOption);

        technologies.forEach(tech => {
            const option = document.createElement("option");
            option.value = tech.code; // Asegurar que `code` existe en la BD
            option.textContent = tech.name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Error cargando tecnologías:", error);
    }
}

function editTechHandler(event) {
    const studentCode = new URLSearchParams(window.location.search).get('id');
    const techCode = event.target.dataset.tech;
    editTechnology(studentCode, techCode);
}

async function deleteTechHandler(event) {
    const studentCode = new URLSearchParams(window.location.search).get('id');
    const techCode = event.target.dataset.tech;
    await deleteTechnology(studentCode, techCode);
}

document.getElementById("openModal").addEventListener("click", function () {
    document.getElementById("modal").style.display = "flex";
});
document.getElementById("closeModal").addEventListener("click", function () {
    document.getElementById("modal").style.display = "none";
});

// Función para agregar una tecnología al estudiante
document.getElementById("addTech").addEventListener("click", async function () {
    let studentCodeElement = document.getElementById("student-code").textContent.trim();
    let studentCode = studentCodeElement.replace(/^Id:\s*/, "").trim(); // Eliminar "Id: "

    const technologySelect = document.getElementById("technology");
    const selectedTechnology = parseInt(technologySelect.value, 10);
    
    const selectedLevelElement = document.querySelector(".star.selected");
    const level = selectedLevelElement ? parseInt(selectedLevelElement.dataset.value, 10) : 1;

    if (!studentCode || isNaN(selectedTechnology)) {
        alert("Selecciona una tecnología y un nivel válido.");
        return;
    }

    let existingTechnologies = await api.getStudentTechnologies(studentCode);
    let exists = existingTechnologies.some(tech => tech.technology_code === selectedTechnology);
    if (exists) {
        alert("Este estudiante ya tiene esta tecnología agregada.");
        return;
    }

    const requestData = {
        student_code: studentCode,
        technology_code: selectedTechnology,
        level: level
    };

    console.log("Datos a enviar:", requestData);

    try {
        await api.addStudentTechnology(requestData);
        alert("Tecnología agregada correctamente.");
        document.getElementById("closeModal").click();
        await loadStudentTechnologies(studentCode); // Recargar la lista
    } catch (error) {
        console.error("Error agregando tecnología:", error);
    }
});




// Función para cargar las tecnologías del estudiante en la tabla
async function loadStudentTechnologies(studentCode) {
    try {
        const studentTechnologies = await api.getStudentTechnologies(studentCode);
        const techList = document.getElementById("tech-list");

        techList.innerHTML = "";

        studentTechnologies.forEach(item => {
            // Verificar si item.technology es null o no tiene imagen
            if (!item.technology) {
                console.warn(`Tecnología no encontrada para el código: ${item.technology_code}`);
                return; // Omitir este registro si está incompleto
            }

            const row = document.createElement("tr");
            row.innerHTML = `
                <td><img src="${item.technology.image || 'default-image.png'}" alt="${item.technology.name}" width="50"></td>
                <td>${item.technology.name}</td>
                <td>${"⭐".repeat(item.level)}</td>
                <td>
                    <button class="edit-tech" onclick="editTechnology('${studentCode}', '${item.technology.code}', ${item.level})">
                        <i class="fas fa-edit"> Edit</i>
                    </button>
                    <button class="delete-tech" onclick="deleteTechnology('${studentCode}', '${item.technology.code}')">
                        <i class="fas fa-trash"> Delete</i>
                    </button>
                </td>
            `;
            techList.appendChild(row);
        });
    } catch (error) {
        console.error("Error cargando tecnologías del estudiante:", error);
    }
}

// Evento para seleccionar nivel con estrellas
document.querySelectorAll(".star").forEach(star => {
    star.addEventListener("click", function () {
        document.querySelectorAll(".star").forEach(s => s.classList.remove("selected"));
        this.classList.add("selected");
    });
});

// Función para eliminar una tecnología del estudiante
async function deleteTechnology(studentCode, technologyCode) {
    if (confirm("¿Estás seguro de que deseas eliminar esta tecnología?")) {
        try {
            await api.deleteStudentTechnology(studentCode, technologyCode);
            alert("Tecnología eliminada correctamente.");
            loadStudentTechnologies(studentCode);
        } catch (error) {
            console.error("Error eliminando tecnología:", error);
        }
    }
}

async function editTechnology(studentCode, technologyCode) {
    const newLevel = prompt("Ingrese nuevo nivel (1-5):");
    if (newLevel >= 1 && newLevel <= 5) {
        try {
            await api.updateStudentTechnology(studentCode, technologyCode, parseInt(newLevel));
            alert('Nivel actualizado');
            await loadTechnologies(studentCode);
        } catch (error) {
            console.error('Error actualizando nivel:', error);
        }
    } else {
        alert('Nivel inválido');
    }
}

async function setupStudent(studentCode) {
    try {
        if (!studentCode) {
            console.error("ID de estudiante no válido en setupStudent");
            return;
        }

        const studentData = await api.getStudentByCode(studentCode);
        if (studentData) {
            document.getElementById('student-name').textContent = studentData.name;
            document.getElementById('student-code').textContent = `Id: ${studentData.code}`;
            document.getElementById('student-email').textContent = studentData.email;
            document.getElementById('student-image').src = studentData.photo;
            document.getElementById('description').textContent = studentData.description;
            document.getElementById('github-link').href = studentData.github_link ? `${studentData.github_link}` : '';

            console.log("Llamando a loadTechnologies con studentCode:", studentCode);
            await loadTechnologies(studentCode);
        }
    } catch (error) {
        console.error('Error obteniendo datos del estudiante para detalles:', error);
    }
}

