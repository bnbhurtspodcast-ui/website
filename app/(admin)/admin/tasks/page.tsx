import { createClient } from '@/lib/supabase/server'
import { TaskBoardClient } from './TaskBoardClient'
import type { KanbanColumn, Task } from '@/types'

export default async function TasksPage() {
  const supabase = await createClient()

  const [{ data: columns }, { data: tasks }] = await Promise.all([
    supabase.from('kanban_columns').select('*').order('sort_order', { ascending: true }),
    supabase.from('tasks').select('*').order('sort_order', { ascending: true }),
  ])

  return (
    <TaskBoardClient
      tasks={(tasks ?? []) as Task[]}
      columns={(columns ?? []) as KanbanColumn[]}
    />
  )
}
