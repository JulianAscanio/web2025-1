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
            clone.querySelector('.github-link').href = student.github_link ? `https://github.com/${student.github_link}` : '#';

            clone.querySelector('.btn-edit').addEventListener('click', () => {
                window.location.href = `edit.html?id=${student.code}`;
            });

            clone.querySelector('.btn-profile').addEventListener('click', () => {
                window.location.href = `detail.html?id=${student.code}`;
            });

            studentsList.appendChild(clone);
        });
    } catch (error) {
        console.error('Error al cargar estudiantes:', error);
    }
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
}

async function setupStudentDetail(studentCode) {
    try {
        const studentData = await api.getStudentByCode(studentCode);
        if (studentData) {
            document.getElementById('student-name').textContent = studentData.name;
            document.getElementById('student-code').textContent = `ID: ${studentData.code}`;
            document.getElementById('student-email').textContent = studentData.email;
            document.getElementById('student-image').src = studentData.photo;
            document.getElementById('description').textContent = studentData.description;
            document.getElementById('github-link').href = studentData.github_link ? `https://github.com/${studentData.github_link}` : '#';
        }
    } catch (error) {
        console.error('Error obteniendo datos del estudiante para detalles:', error);
    }

    await loadTechnologies(studentCode);
    setupTechnologyModal(studentCode);
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const studentDetail = document.getElementById('student-detail');
        if (studentDetail) {
            const params = new URLSearchParams(window.location.search);
            const studentCode = params.get('id');

            if (studentCode) {
                try {
                    const studentData = await api.getStudentByCode(studentCode);
                    document.getElementById('student-name').textContent = studentData.name;
                    document.getElementById('student-code').textContent = `ID: ${studentData.code}`;
                    document.getElementById('student-email').textContent = studentData.email;
                    document.getElementById('student-image').src = studentData.photo || '';
                    document.getElementById('description').textContent = studentData.description || '';
                    document.getElementById('github-link').href = studentData.github_link ? `https://github.com/${studentData.github_link}` : '#';

                    // Cargar tecnologías
                    await loadTechnologies(studentCode);
                } catch (error) {
                    console.error('Error obteniendo datos del estudiante:', error);
                }
            }
        }
    } catch (error) {
        console.log('No estamos en la página de detalles del estudiante');
    }
});

// Función para cargar las tecnologías del estudiante
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const studentDetail = document.getElementById('student-detail');
        if (studentDetail) {
            const params = new URLSearchParams(window.location.search);
            const studentCode = params.get('id');
            console.log("Código del estudiante:", studentCode); // Debug

            if (studentCode) {
                try {
                    const studentData = await api.getStudentByCode(studentCode);
                    document.getElementById('student-name').textContent = studentData.name;
                    document.getElementById('student-code').textContent = `ID: ${studentData.code}`;
                    document.getElementById('student-email').textContent = studentData.email;
                    document.getElementById('student-image').src = studentData.photo || '';
                    document.getElementById('description').textContent = studentData.description || '';
                    document.getElementById('github-link').href = studentData.github_link ? `https://github.com/${studentData.github_link}` : '#';

                    // Cargar tecnologías
                    await loadTechnologies(studentCode);
                } catch (error) {
                    console.error('Error obteniendo datos del estudiante:', error);
                }
            }
        }
    } catch (error) {
        console.log('No estamos en la página de detalles del estudiante');
    }
});

async function loadTechnologies(studentCode) {
    try {
        const techList = document.getElementById('tech-list');
        techList.innerHTML = ''; // Limpiar la tabla antes de cargar

        const technologies = await api.getStudentTechnologies(studentCode);
        console.log("Tecnologías del estudiante:", technologies); // Debug

        if (!technologies || technologies.length === 0) {
            techList.innerHTML = '<tr><td colspan="4">No hay tecnologías registradas</td></tr>';
            return;
        }

        technologies.forEach(tech => {
            const { technology, level, technology_code } = tech;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td><img src="${technology.image}" alt="${technology.name}" width="40"></td>
                <td>${technology.name}</td>
                <td>${'⭐'.repeat(level)}</td>
                <td>
                    <button class="edit-tech" data-tech="${technology_code}">Edit</button>
                    <button class="delete-tech" data-tech="${technology_code}">Delete</button>
                </td>
            `;
            techList.appendChild(row);
        });

        document.querySelectorAll('.edit-tech').forEach(button => {
            button.addEventListener('click', (event) => {
                const techCode = event.target.dataset.tech;
                editTechnology(studentCode, techCode);
            });
        });

        document.querySelectorAll('.delete-tech').forEach(button => {
            button.addEventListener('click', async (event) => {
                const techCode = event.target.dataset.tech;
                await deleteTechnology(studentCode, techCode);
            });
        });

    } catch (error) {
        console.error('Error cargando tecnologías:', error);
    }
}

// Funciones para agregar, editar y eliminar tecnologías
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

async function deleteTechnology(studentCode, technologyCode) {
    if (confirm('¿Seguro que quieres eliminar esta tecnología?')) {
        try {
            await api.deleteStudentTechnology(studentCode, technologyCode);
            alert('Tecnología eliminada');
            await loadTechnologies(studentCode);
        } catch (error) {
            console.error('Error eliminando tecnología:', error);
        }
    }
}
