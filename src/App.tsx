import { useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

interface Task {
  id: number
  title: string
  description: string
  completed: boolean
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const addTask = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    setTasks((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: trimmed,
        description: description.trim(),
        completed: false,
      },
    ])
    setTitle('')
    setDescription('')
  }

  const toggleTask = (id: number) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    )

  const deleteTask = (id: number) =>
    setTasks((prev) => prev.filter((t) => t.id !== id))

  return (
    <main className="tasks-app">
      <h1>Tareas</h1>

      <form className="task-form" onSubmit={addTask}>
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
        <button type="submit">Agregar tarea</button>
      </form>

      {tasks.length === 0 ? (
        <p className="empty">No hay tareas todavía.</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className={task.completed ? 'completed' : ''}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                aria-label={`Marcar "${task.title}" como completada`}
              />
              <div className="task-body">
                <h3>{task.title}</h3>
                {task.description && <p>{task.description}</p>}
              </div>
              <button
                type="button"
                className="delete"
                onClick={() => deleteTask(task.id)}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

export default App
