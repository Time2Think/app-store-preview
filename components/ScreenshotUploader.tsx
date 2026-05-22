'use client'
import { useCallback } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface ScreenshotUploaderProps {
  screenshots: string[]
  onChange: (screenshots: string[]) => void
}

export function ScreenshotUploader({ screenshots, onChange }: ScreenshotUploaderProps) {
  const sensors = useSensors(useSensor(PointerSensor))

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return
    const remaining = 8 - screenshots.length
    const toAdd = Array.from(files).slice(0, remaining)
    toAdd.forEach(file => {
      const reader = new FileReader()
      reader.onload = e => {
        const result = e.target?.result as string
        onChange([...screenshots, result])
      }
      reader.readAsDataURL(file)
    })
  }, [screenshots, onChange])

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = screenshots.indexOf(active.id as string)
    const newIndex = screenshots.indexOf(over.id as string)
    onChange(arrayMove(screenshots, oldIndex, newIndex))
  }

  function removeScreenshot(index: number) {
    onChange(screenshots.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-2">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={screenshots} strategy={horizontalListSortingStrategy}>
          <div className="flex flex-wrap gap-2">
            {screenshots.map((src, i) => (
              <SortableScreenshot
                key={src}
                id={src}
                src={src}
                index={i}
                onRemove={removeScreenshot}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {screenshots.length < 8 && (
        <label className="flex items-center justify-center w-full h-16 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-400 transition-colors">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            + Add screenshots ({screenshots.length}/8)
          </span>
          <input
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={e => handleFiles(e.target.files)}
          />
        </label>
      )}
    </div>
  )
}

function SortableScreenshot({
  id, src, index, onRemove,
}: {
  id: string
  src: string
  index: number
  onRemove: (i: number) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}
      className="relative group w-10 h-16 rounded overflow-hidden cursor-grab active:cursor-grabbing">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={`Screenshot ${index + 1}`} className="w-full h-full object-cover" />
      <button
        onClick={() => onRemove(index)}
        className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-bl"
        onPointerDown={e => e.stopPropagation()}
      >
        ×
      </button>
    </div>
  )
}
