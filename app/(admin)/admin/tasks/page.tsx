import { createClient } from '@/lib/supabase/server'
import { TaskBoardClient } from './TaskBoardClient'

export default async function TasksPage() {
  const supabase = await createClient()
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .order('sort_order', { ascending: true })

  return <TaskBoardClient tasks={tasks ?? []} />
}
