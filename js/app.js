document.addEventListener('DOMContentLoaded', async () => {
    try {
        const studentsList = document.getElementById('studentsList');
        const template = document.getElementById('studentCardTemplate');

        if (studentsList && template) {
            async function renderStudents() {
                try {
                    const students = await api.getStudents();
                    studentsList.innerHTML = '';
                    console.log(students);

                    students.forEach(student => {
                        const clone = template.content.cloneNode(true);

                        clone.querySelector('.student-name').textContent = student.name;
                        clone.querySelector('.student-id').textContent = `ID: ${student.code}`;
                        clone.querySelector('.student-email').textContent = student.email;
                        clone.querySelector('.student-image').src = student.photo;
                        clone.querySelector('.github-link').href = student.github_link ? `https://github.com/${student.github_link}` : '#';

                        // Botón de editar
                        const editButton = clone.querySelector('.btn-edit');
                        if (editButton) {
                            editButton.addEventListener('click', () => {
                                window.location.href = `edit.html?id=${student.code}`;
                            });
                        }
                        studentsList.appendChild(clone);
                    });
                } catch (error) {
                    console.error('Error al cargar estudiantes:', error);
                }
            }
            renderStudents();
        }
    } catch (error) {
        console.log('No estamos en la página de listado de estudiantes');
    }

    try {
        const btnNew = document.getElementById('btnNew');
        if (btnNew) {
            btnNew.addEventListener('click', () => {
                window.location.href = 'form.html';
            });
        }
    } catch (error) {
        console.log('No se encontró el botón de nuevo estudiante');
    }

    try {
        const studentForm = document.getElementById('studentForm');
        if (studentForm) {
            studentForm.addEventListener('submit', async (event) => {
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
                    alert('Fallo al agregar el estudiante. Por favor, intenta de nuevo.');
                }
            });

            const btnCancel = document.querySelector('.btn-cancel');
            if (btnCancel) {
                btnCancel.addEventListener('click', () => {
                    window.location.href = 'index.html';
                });
            }
        }
    } catch (error) {
        console.log('No estamos en la página del formulario');
    }

    // **Editar estudiante**
    try {
        const editStudentForm = document.getElementById('edit-student-form');
        if (editStudentForm) {
            const params = new URLSearchParams(window.location.search);
            const studentCode = params.get('id');

            if (studentCode) {
                try {
                    const studentData = await api.getStudentByCode(studentCode);
                    if (studentData) {
                        document.getElementById('student-code').value = studentData.code;
                        document.getElementById("full-name").value = studentData.name;
                        document.getElementById("email").value = studentData.email;
                        document.getElementById("photo").value = studentData.photo || '';
                        document.getElementById("github-link").value = studentData.github_link || '';
                        document.getElementById("description").value = studentData.description || '';
                    }
                } catch (error) {
                    console.error('Error obteniendo datos del estudiante:', error);
                }
            }

            // **Guardar cambios**
            editStudentForm.addEventListener("submit", async (event) => {
                event.preventDefault();
                const updatedStudent = {
                    code: studentCode,
                    name: document.getElementById('full-name').value.trim(),
                    email: document.getElementById('email').value.trim(),
                    photo: document.getElementById('photo').value.trim(),
                    github_link: document.getElementById('github-link').value.trim(),
                    description: document.getElementById('description').value.trim(),
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
    } catch (error) {
        console.log('No estamos en la página de edición de estudiantes');
    }
});
