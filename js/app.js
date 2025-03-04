document.addEventListener('DOMContentLoaded', () => {
    // Sample student data
    const students = [
        {
            name: 'Carlos Rene Angarita Sanguino',
            id: '05372',
            email: 'carlosreneas@ufps.edu.co',
            github: 'GitHub',
            image: 'https://media.istockphoto.com/id/1090878494/es/foto/retrato-de-joven-sonriente-a-hombre-guapo-en-camiseta-polo-azul-aislado-sobre-fondo-gris-de.jpg?s=612x612&w=0&k=20&c=dHFsDEJSZ1kuSO4wTDAEaGOJEF-HuToZ6Gt-E2odc6U='
        },
        {
            name: 'Yan Carlo Angarita Sanguino',
            id: '00001',
            email: 'yancarlo120b@gmail.com',
            github: 'GitHub',
            image: 'https://media.istockphoto.com/id/1090878494/es/foto/retrato-de-joven-sonriente-a-hombre-guapo-en-camiseta-polo-azul-aislado-sobre-fondo-gris-de.jpg?s=612x612&w=0&k=20&c=dHFsDEJSZ1kuSO4wTDAEaGOJEF-HuToZ6Gt-E2odc6U='
        },
        {
            name: 'Claudia Yamile Gomez Llanez',
            id: '05096',
            email: 'claudiaygomez@ufps.edu.co',
            github: 'GitHub',
            image: 'https://media.istockphoto.com/id/1090878494/es/foto/retrato-de-joven-sonriente-a-hombre-guapo-en-camiseta-polo-azul-aislado-sobre-fondo-gris-de.jpg?s=612x612&w=0&k=20&c=dHFsDEJSZ1kuSO4wTDAEaGOJEF-HuToZ6Gt-E2odc6U='
        },
        {
            name: 'Julian Andres Ascanio Castilla',
            id: '1151865',
            email: 'julianandresac@ufps.edu.co',
            github: 'GitHub',
            image: 'https://media.istockphoto.com/id/1090878494/es/foto/retrato-de-joven-sonriente-a-hombre-guapo-en-camiseta-polo-azul-aislado-sobre-fondo-gris-de.jpg?s=612x612&w=0&k=20&c=dHFsDEJSZ1kuSO4wTDAEaGOJEF-HuToZ6Gt-E2odc6U='
        }
    ];

    const studentsList = document.getElementById('studentsList');
    const template = document.getElementById('studentCardTemplate');

    // Render students
    function renderStudents() {
        studentsList.innerHTML = '';
        students.forEach(student => {
            const clone = template.content.cloneNode(true);

            console.log(student.name)

            clone.querySelector('.student-name').textContent = student.name;
            clone.querySelector('.student-id').textContent = `ID: ${student.id}`;
            clone.querySelector('.student-email').textContent = student.email;
            clone.querySelector('.student-image').src = student.image;
            clone.querySelector('.github-link').href = `https://github.com/${student.github}`;

            studentsList.appendChild(clone);
        });
    }

    // Initial render
    renderStudents();

});