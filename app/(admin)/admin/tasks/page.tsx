import { createClient } from '@/lib/supabase/server'
import { TaskBoard } from './TaskBoard'
import type { KanbanColumn, Task } from '@/types'
import { archiveDoneTasks } from '../actions'

export default async function TasksPage() {
  const supabase = await createClient()

  const [{ data: columns }, { data: tasks }] = await Promise.all([
    supabase.from('kanban_columns').select('*').order('sort_order', { ascending: true }),
    supabase.from('tasks').select('*').is('archived_at', null).order('sort_order', { ascending: true }),
  ])

  // Fire archive sweep in the background — no need to await result
  archiveDoneTasks().catch(() => {})

  return (
    <TaskBoard
      tasks={(tasks ?? []) as Task[]}
      columns={(columns ?? []) as KanbanColumn[]}
    />
  )
}
