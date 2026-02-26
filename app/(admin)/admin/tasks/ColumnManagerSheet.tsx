'use client'

import { useState, useTransition, useRef } from 'react'
import { Trash2, Plus, GripVertical } from 'lucide-react'
import type { KanbanColumn } from '@/types'
import { COLUMN_TOP_COLOR_MAP } from '@/app/(admin)/admin/tasks/constants'
import { createColumn, updateColumn, deleteColumn } from '@/app/(admin)/admin/actions'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

type ColumnManagerSheetProps = {
  open: boolean
  columns: KanbanColumn[]
  onClose: () => void
  onColumnsChange: (updated: KanbanColumn[]) => void
}

const COLOR_OPTIONS = Object.keys(COLUMN_TOP_COLOR_MAP)

type EditState = { name: string; color: string }

export function ColumnManagerSheet({ open, columns, onClose, onColumnsChange }: ColumnManagerSheetProps) {
  const [isPending, startTransition] = useTransition()
  const [editStates, setEditStates] = useState<Record<string, EditState>>({})
  const [columnErrors, setColumnErrors] = useState<Record<string, string>>({})
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState(COLOR_OPTIONS[0])
  const [addError, setAddError] = useState('')

  // Drag-to-reorder state
  const dragColId = useRef<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)

  const getEdit = (col: KanbanColumn): EditState =>
    editStates[col.id] ?? { name: col.name, color: col.color }

  const patchEdit = (id: string, patch: Partial<EditState>) =>
    setEditStates((prev) => ({
      ...prev,
      [id]: { ...(prev[id] ?? { name: columns.find((c) => c.id === id)!.name, color: columns.find((c) => c.id === id)!.color }), ...patch },
    }))

  // Auto-save on blur (name or color change)
  const handleBlurSave = (col: KanbanColumn) => {
    const edit = getEdit(col)
    if (!edit.name.trim()) return
    if (edit.name.trim() === col.name && edit.color === col.color) return
    onColumnsChange(columns.map((c) => c.id === col.id ? { ...c, name: edit.name.trim(), color: edit.color } : c))
    startTransition(async () => {
      const result = await updateColumn(col.id, { name: edit.name.trim(), color: edit.color })
      if (result.error) {
        setColumnErrors((prev) => ({ ...prev, [col.id]: result.error! }))
        onColumnsChange(columns) // revert
      } else {
        setColumnErrors((prev) => { const n = { ...prev }; delete n[col.id]; return n })
      }
    })
  }

  const handleDelete = (col: KanbanColumn) => {
    startTransition(async () => {
      const result = await deleteColumn(col.id)
      if (result.error) {
        setColumnErrors((prev) => ({ ...prev, [col.id]: result.error! }))
      } else {
        onColumnsChange(columns.filter((c) => c.id !== col.id))
        setColumnErrors((prev) => { const n = { ...prev }; delete n[col.id]; return n })
      }
    })
  }

  const handleAdd = () => {
    if (!newName.trim()) { setAddError('Name is required'); return }
    setAddError('')
    const nextOrder = columns.length > 0 ? Math.max(...columns.map((c) => c.sort_order)) + 1 : 0
    startTransition(async () => {
      const result = await createColumn({ name: newName.trim(), color: newColor, sort_order: nextOrder })
      if (result.error) {
        setAddError(result.error)
      } else if (result.id) {
        const newCol: KanbanColumn = {
          id: result.id,
          name: newName.trim(),
          color: newColor,
          sort_order: nextOrder,
        }
        onColumnsChange([...columns, newCol])
        setNewName('')
        setNewColor(COLOR_OPTIONS[0])
      }
    })
  }

  // Drag-to-reorder handlers
  const handleDragStart = (colId: string) => {
    dragColId.current = colId
  }

  const handleDragOver = (e: React.DragEvent, colId: string) => {
    e.preventDefault()
    if (dragColId.current !== colId) setDragOverId(colId)
  }

  const handleDrop = (targetId: string) => {
    const sourceId = dragColId.current
    if (!sourceId || sourceId === targetId) {
      setDragOverId(null)
      return
    }
    const sourceIdx = columns.findIndex((c) => c.id === sourceId)
    const targetIdx = columns.findIndex((c) => c.id === targetId)
    if (sourceIdx === -1 || targetIdx === -1) { setDragOverId(null); return }

    // Reorder array
    const reordered = [...columns]
    const [moved] = reordered.splice(sourceIdx, 1)
    reordered.splice(targetIdx, 0, moved)

    // Assign new sort_orders as sequential integers
    const updated = reordered.map((c, i) => ({ ...c, sort_order: i }))
    onColumnsChange(updated)
    setDragOverId(null)
    dragColId.current = null

    // Persist new sort_orders
    startTransition(async () => {
      await Promise.all(
        updated.map((c) => updateColumn(c.id, { sort_order: c.sort_order }))
      )
    })
  }

  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <SheetContent
        side="right"
        className="bg-[#08111e] border-l border-white/10 text-white w-[360px] flex flex-col gap-0 p-0"
      >
        <SheetHeader className="px-5 py-4 border-b border-white/10">
          <SheetTitle className="text-white text-base font-semibold">Manage Columns</SheetTitle>
          <p className="text-xs text-white/40">Drag to reorder. Changes to name and color save automatically.</p>
        </SheetHeader>

        {/* Existing columns */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
          {columns.map((col) => {
            const edit = getEdit(col)
            const err = columnErrors[col.id]
            const isOver = dragOverId === col.id
            return (
              <div
                key={col.id}
                draggable
                onDragStart={() => handleDragStart(col.id)}
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDrop={() => handleDrop(col.id)}
                onDragEnd={() => { setDragOverId(null); dragColId.current = null }}
                className={[
                  'space-y-1 rounded-lg transition-all',
                  isOver ? 'ring-1 ring-[#FAA21B]/50 bg-[#FAA21B]/5' : '',
                ].join(' ')}
              >
                <div className="flex items-center gap-2">
                  {/* Drag handle */}
                  <span className="text-white/20 hover:text-white/50 cursor-grab active:cursor-grabbing flex-shrink-0">
                    <GripVertical className="h-4 w-4" />
                  </span>

                  {/* Color dot preview */}
                  <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${COLUMN_TOP_COLOR_MAP[edit.color] ?? 'bg-gray-400'}`} />

                  {/* Name input — auto-saves on blur */}
                  <input
                    type="text"
                    value={edit.name}
                    onChange={(e) => patchEdit(col.id, { name: e.target.value })}
                    onBlur={() => handleBlurSave(col)}
                    onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur() }}
                    className="flex-1 bg-white/5 border border-white/10 rounded-md px-2 py-1.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#FAA21B]/50 min-w-0"
                  />

                  {/* Color select — auto-saves on change */}
                  <select
                    value={edit.color}
                    onChange={(e) => {
                      patchEdit(col.id, { color: e.target.value })
                      // Trigger save after state update
                      const updatedEdit = { ...getEdit(col), color: e.target.value }
                      onColumnsChange(columns.map((c) => c.id === col.id ? { ...c, color: updatedEdit.color } : c))
                      startTransition(async () => {
                        await updateColumn(col.id, { color: updatedEdit.color })
                      })
                    }}
                    className="bg-white/5 border border-white/10 rounded-md px-1.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#FAA21B]/50"
                  >
                    {COLOR_OPTIONS.map((c) => (
                      <option key={c} value={c} className="bg-[#08111e]">{c}</option>
                    ))}
                  </select>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(col)}
                    disabled={isPending}
                    className="p-1.5 rounded-md text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                    title="Delete column"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                {err && <p className="text-red-400 text-[11px] pl-7">{err}</p>}
              </div>
            )
          })}
        </div>

        {/* Add new column */}
        <div className="border-t border-white/10 px-4 py-4 space-y-3">
          <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">Add Column</p>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${COLUMN_TOP_COLOR_MAP[newColor] ?? 'bg-gray-400'}`} />
            <input
              type="text"
              placeholder="Column name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAdd() }}
              className="flex-1 bg-white/5 border border-white/10 rounded-md px-2 py-1.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#FAA21B]/50 min-w-0"
            />
            <select
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-md px-1.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#FAA21B]/50"
            >
              {COLOR_OPTIONS.map((c) => (
                <option key={c} value={c} className="bg-[#08111e]">{c}</option>
              ))}
            </select>
            <button
              onClick={handleAdd}
              disabled={isPending || !newName.trim()}
              className="p-1.5 rounded-md text-white/40 hover:text-[#FAA21B] hover:bg-[#FAA21B]/10 transition-colors disabled:opacity-30"
              title="Add column"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          {addError && <p className="text-red-400 text-[11px]">{addError}</p>}
        </div>
      </SheetContent>
    </Sheet>
  )
}
