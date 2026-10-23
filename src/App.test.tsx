import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

async function addTask(
  user: ReturnType<typeof userEvent.setup>,
  title: string,
  description = '',
) {
  await user.type(screen.getByPlaceholderText('Título'), title)
  if (description) {
    await user.type(screen.getByPlaceholderText('Descripción'), description)
  }
  await user.click(screen.getByRole('button', { name: 'Agregar tarea' }))
}

describe('App de tareas', () => {
  it('muestra un mensaje cuando no hay tareas', () => {
    render(<App />)
    expect(screen.getByText('No hay tareas todavía.')).toBeInTheDocument()
  })

  it('crea una tarea con título y descripción y la muestra en la lista', async () => {
    const user = userEvent.setup()
    render(<App />)

    await addTask(user, 'Comprar pan', 'Integral')

    expect(screen.getByText('Comprar pan')).toBeInTheDocument()
    expect(screen.getByText('Integral')).toBeInTheDocument()
    expect(screen.queryByText('No hay tareas todavía.')).not.toBeInTheDocument()
  })

  it('limpia el formulario después de crear una tarea', async () => {
    const user = userEvent.setup()
    render(<App />)

    await addTask(user, 'Tarea', 'Detalle')

    expect(screen.getByPlaceholderText('Título')).toHaveValue('')
    expect(screen.getByPlaceholderText('Descripción')).toHaveValue('')
  })

  it('no crea tareas con título vacío o solo espacios', async () => {
    const user = userEvent.setup()
    render(<App />)

    await addTask(user, '   ')

    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })

  it('muestra varias tareas', async () => {
    const user = userEvent.setup()
    render(<App />)

    await addTask(user, 'Uno')
    await addTask(user, 'Dos')

    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  it('marca una tarea como completada y permite desmarcarla', async () => {
    const user = userEvent.setup()
    render(<App />)
    await addTask(user, 'Estudiar')

    const item = screen.getByRole('listitem')
    const checkbox = within(item).getByRole('checkbox')
    expect(checkbox).not.toBeChecked()
    expect(item).not.toHaveClass('completed')

    await user.click(checkbox)
    expect(checkbox).toBeChecked()
    expect(item).toHaveClass('completed')

    await user.click(checkbox)
    expect(checkbox).not.toBeChecked()
    expect(item).not.toHaveClass('completed')
  })

  it('completar una tarea no afecta a las demás', async () => {
    const user = userEvent.setup()
    render(<App />)
    await addTask(user, 'Uno')
    await addTask(user, 'Dos')

    const [first, second] = screen.getAllByRole('listitem')
    await user.click(within(first).getByRole('checkbox'))

    expect(first).toHaveClass('completed')
    expect(second).not.toHaveClass('completed')
  })

  it('elimina una tarea', async () => {
    const user = userEvent.setup()
    render(<App />)
    await addTask(user, 'Uno')
    await addTask(user, 'Dos')

    const first = screen.getAllByRole('listitem')[0]
    await user.click(within(first).getByRole('button', { name: 'Eliminar' }))

    expect(screen.queryByText('Uno')).not.toBeInTheDocument()
    expect(screen.getByText('Dos')).toBeInTheDocument()
  })

  it('vuelve a mostrar el mensaje vacío al eliminar la última tarea', async () => {
    const user = userEvent.setup()
    render(<App />)
    await addTask(user, 'Única')

    await user.click(screen.getByRole('button', { name: 'Eliminar' }))

    expect(screen.getByText('No hay tareas todavía.')).toBeInTheDocument()
  })
})
