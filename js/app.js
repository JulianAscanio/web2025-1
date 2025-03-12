document.addEventListener('DOMContentLoaded', () => {
    // Intenta renderizar estudiantes solo si estamos en la página principal
    try {
        const studentsList = document.getElementById('studentsList');
        const template = document.getElementById('studentCardTemplate');
        
        if (studentsList && template) {
            // Render students
            async function renderStudents() {
                try {
                    const students = await api.getStudents();
                    console.log(students);
                    studentsList.innerHTML = '';
                    students.forEach(student => {
                        const clone = template.content.cloneNode(true);
                        
                        console.log(student.name);
                        
                        clone.querySelector('.student-name').textContent = student.name;
                        clone.querySelector('.student-id').textContent = `ID: ${student.code}`;
                        clone.querySelector('.student-email').textContent = student.email;
                        clone.querySelector('.student-image').src = student.photo;
                        clone.querySelector('.github-link').href = `https://github.com/${student.github}`;
                        
                        studentsList.appendChild(clone);
                    });
                } catch (error) {
                    console.error('Error al cargar estudiantes:', error);
                }
            }
            
            // Initial render
            renderStudents();
        }
    } catch (error) {
        console.log('No estamos en la página de listado de estudiantes');
    }
    
    // Manejo del botón Nuevo solo si existe
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
    
    // Formulario de estudiante
    try {
        const studentForm = document.getElementById('studentForm');
        if (studentForm) {
            studentForm.addEventListener('submit', async (event) => {
                event.preventDefault();
                
                const newStudent = {
                    code: document.getElementById('codigo').value.trim(),
                    name: document.getElementById('nombre').value.trim(),
                    email: document.getElementById('email').value.trim(),
                    photo: document.getElementById('imagen').value.trim() || 'https://via.placeholder.com/150',
                    github_link: document.getElementById('url').value.trim(),
                    description: document.getElementById('description').value.trim()
                };
                console.log(newStudent);
                
                try {
                    const response = await api.createStudent(newStudent);
                    alert('Estudiante creado con éxito!');
                    window.location.href = 'index.html';
                } catch (error) {
                    console.error('Error agregando al estudiante:', error);
                    alert('Fallo al agregar el estudiante. Por favor, intenta de nuevo.');
                }
            });
            
            // Opcional: Manejar el botón de cancelar
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
});