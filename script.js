document.addEventListener('DOMContentLoaded', () => {
    // --- Particle Background ---
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray;

    const mouse = {
        x: null,
        y: null,
        radius: (canvas.height / 120) * (canvas.width / 120)
    };

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        mouse.radius = (canvas.height / 120) * (canvas.width / 120);
        initParticles();
    });
    
    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });


    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        update() {
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }

            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouse.radius + this.size) {
                if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                    this.x += 5;
                }
                if (mouse.x > this.x && this.x > this.size * 10) {
                    this.x -= 5;
                }
                if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                    this.y += 5;
                }
                if (mouse.y > this.y && this.y > this.size * 10) {
                    this.y -= 5;
                }
            }
            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    function initParticles() {
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 9000;
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1;
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * .4) - .2;
            let directionY = (Math.random() * .4) - .2;
            let color = 'rgba(162, 155, 254, 0.6)';
            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    function animateParticles() {
        requestAnimationFrame(animateParticles);
        ctx.clearRect(0, 0, innerWidth, innerHeight);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
    }
    
    initParticles();
    animateParticles();


    // --- To-Do List Logic ---
    const todoForm = document.getElementById('todo-form');
    const todoTitleInput = document.getElementById('todo-title');
    const todoDescInput = document.getElementById('todo-desc');
    const todoPriorityInput = document.getElementById('todo-priority');
    const listContainer = document.getElementById('todos-list-container');
    const searchInput = document.getElementById('search-input');
    const clearCompletedBtn = document.getElementById('clear-completed');
    const noTasksMessage = document.getElementById('no-tasks-message');
    
    // Modal elements
    const modal = document.getElementById('confirmation-modal');
    const modalText = document.getElementById('modal-text');
    const confirmBtn = document.getElementById('modal-confirm-btn');
    const cancelBtn = document.getElementById('modal-cancel-btn');
    let actionToConfirm = null;


    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    const saveTodos = () => {
        localStorage.setItem('todos', JSON.stringify(todos));
    };

    const renderTodos = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredTodos = todos.filter(todo => 
            todo.title.toLowerCase().includes(searchTerm) ||
            todo.description.toLowerCase().includes(searchTerm)
        );

        listContainer.innerHTML = '';

        if (todos.length === 0) {
            noTasksMessage.style.display = 'block';
        } else {
            noTasksMessage.style.display = 'none';
        }

        if (filteredTodos.length > 0) {
            filteredTodos.forEach(todo => {
                const todoItem = document.createElement('div');
                todoItem.classList.add('todo-item');
                if (todo.completed) {
                    todoItem.classList.add('completed');
                }
                todoItem.dataset.id = todo.id;
                todoItem.dataset.priority = todo.priority;

                todoItem.innerHTML = `
                    <div class="task-content">
                        <h3>${todo.title}</h3>
                        <p>${todo.description}</p>
                    </div>
                    <div class="task-actions">
                        <button class="btn btn-icon complete" aria-label="Complete Task">✓</button>
                        <button class="btn btn-icon edit" aria-label="Edit Task">✎</button>
                        <button class="btn btn-icon delete" aria-label="Delete Task">✖</button>
                    </div>
                `;
                listContainer.appendChild(todoItem);
            });
        }
    };
    
    const showModal = (text, onConfirm) => {
        modalText.textContent = text;
        actionToConfirm = onConfirm;
        modal.style.display = 'flex';
    };
    
    const hideModal = () => {
        modal.style.display = 'none';
        actionToConfirm = null;
    };

    confirmBtn.addEventListener('click', () => {
        if (actionToConfirm) {
            actionToConfirm();
        }
        hideModal();
    });

    cancelBtn.addEventListener('click', hideModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal();
        }
    });

    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = todoTitleInput.value.trim();
        const description = todoDescInput.value.trim();
        const priority = todoPriorityInput.value;

        if (title) {
            const newTodo = {
                id: Date.now().toString(),
                title,
                description,
                priority,
                completed: false,
            };
            todos.unshift(newTodo);
            saveTodos();
            renderTodos();
            todoForm.reset();
            todoPriorityInput.value = 'medium';
        }
    });
    
    listContainer.addEventListener('click', (e) => {
        const item = e.target.closest('.todo-item');
        if (!item) return;
        
        const todoId = item.dataset.id;
        const todo = todos.find(t => t.id === todoId);

        if (e.target.classList.contains('delete')) {
            showModal('Are you sure you want to delete this task?', () => {
                todos = todos.filter(t => t.id !== todoId);
                saveTodos();
                renderTodos();
            });
        } else if (e.target.classList.contains('complete')) {
            todo.completed = !todo.completed;
            saveTodos();
            renderTodos();
        } else if (e.target.classList.contains('edit')) {
            const taskContent = item.querySelector('.task-content');
            const currentTitle = taskContent.querySelector('h3').textContent;
            const currentDesc = taskContent.querySelector('p').textContent;

            taskContent.innerHTML = `
                <input type="text" class="input edit-title" value="${currentTitle}">
                <textarea class="input edit-desc">${currentDesc}</textarea>
                <button class="btn btn-save-edit">Save</button>
            `;
            
            const saveBtn = taskContent.querySelector('.btn-save-edit');
            saveBtn.addEventListener('click', () => {
                const newTitle = taskContent.querySelector('.edit-title').value.trim();
                const newDesc = taskContent.querySelector('.edit-desc').value.trim();
                if (newTitle) {
                    todo.title = newTitle;
                    todo.description = newDesc;
                    saveTodos();
                    renderTodos();
                }
            });
        }
    });

    clearCompletedBtn.addEventListener('click', () => {
        const completedTasks = todos.some(t => t.completed);
        if (completedTasks) {
            showModal('Are you sure you want to clear all completed tasks?', () => {
                todos = todos.filter(t => !t.completed);
                saveTodos();
                renderTodos();
            });
        } else {
            alert("No completed tasks to clear.");
        }
    });

    searchInput.addEventListener('input', renderTodos);

    renderTodos();
});
