import { Plus, MoreVertical, Calendar, User as UserIcon, Tag } from "lucide-react";
import { useState } from "react";

interface Task {
  id: string;
  title: string;
  description: string;
  assignee?: string;
  dueDate?: string;
  tags: string[];
  priority: "low" | "medium" | "high";
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

const initialColumns: Column[] = [
  {
    id: "todo",
    title: "To Do",
    tasks: [
      {
        id: "t1",
        title: "Review new guest applications",
        description: "3 pending applications need review",
        assignee: "Admin",
        dueDate: "2026-02-14",
        tags: ["guests", "urgent"],
        priority: "high",
      },
      {
        id: "t2",
        title: "Update episode 158 show notes",
        description: "Add timestamps and links to resources",
        assignee: "Content Team",
        dueDate: "2026-02-15",
        tags: ["content"],
        priority: "medium",
      },
      {
        id: "t3",
        title: "Follow up with Tech Innovations Inc.",
        description: "Send sponsorship proposal",
        assignee: "Sales",
        dueDate: "2026-02-13",
        tags: ["sponsorship"],
        priority: "high",
      },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    tasks: [
      {
        id: "t4",
        title: "Schedule interviews for approved guests",
        description: "2 guests approved and ready to schedule",
        assignee: "Producer",
        dueDate: "2026-02-16",
        tags: ["guests", "scheduling"],
        priority: "medium",
      },
      {
        id: "t5",
        title: "Edit episode 159",
        description: "Audio editing and cleanup",
        assignee: "Audio Engineer",
        tags: ["production"],
        priority: "medium",
      },
      {
        id: "t6",
        title: "Create social media promo for ep 158",
        description: "Instagram, Twitter, and LinkedIn posts",
        assignee: "Marketing",
        dueDate: "2026-02-14",
        tags: ["marketing", "social"],
        priority: "low",
      },
    ],
  },
  {
    id: "review",
    title: "Review",
    tasks: [
      {
        id: "t7",
        title: "Review press kit updates",
        description: "New assets and updated bio",
        assignee: "Admin",
        tags: ["press", "branding"],
        priority: "low",
      },
      {
        id: "t8",
        title: "Sponsorship proposal for Wellness Co.",
        description: "Custom Gold package proposal ready",
        assignee: "Sales",
        dueDate: "2026-02-15",
        tags: ["sponsorship"],
        priority: "high",
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    tasks: [
      {
        id: "t9",
        title: "Published episode 157",
        description: "Episode live on all platforms",
        assignee: "Admin",
        tags: ["content", "published"],
        priority: "medium",
      },
      {
        id: "t10",
        title: "Responded to 5 contact submissions",
        description: "All new inquiries handled",
        assignee: "Support",
        tags: ["contacts"],
        priority: "low",
      },
    ],
  },
];

export function TaskBoard() {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [showAddTask, setShowAddTask] = useState<string | null>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "low":
        return "bg-green-100 text-green-700 border-green-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getColumnColor = (columnId: string) => {
    switch (columnId) {
      case "todo":
        return "border-blue-400";
      case "in-progress":
        return "border-yellow-400";
      case "review":
        return "border-purple-400";
      case "done":
        return "border-green-400";
      default:
        return "border-gray-400";
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Task Board</h1>
        <p className="text-[#FAA21B]">Organize and track your team's work</p>
      </div>

      {/* Board */}
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="inline-flex gap-4 h-full min-w-full">
          {columns.map((column) => (
            <div
              key={column.id}
              className="flex flex-col w-80 flex-shrink-0 bg-white/5 backdrop-blur-sm rounded-xl border-2 border-white/10"
            >
              {/* Column Header */}
              <div className={`flex items-center justify-between p-4 border-b-4 ${getColumnColor(column.id)}`}>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white">{column.title}</h2>
                  <span className="text-xs font-bold text-white/60 bg-white/10 px-2 py-1 rounded-full">
                    {column.tasks.length}
                  </span>
                </div>
                <button className="text-white/60 hover:text-white transition-colors">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>

              {/* Tasks */}
              <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                {column.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all cursor-pointer group"
                  >
                    {/* Priority Badge */}
                    <div className="flex items-start justify-between mb-2">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Task Title */}
                    <h3 className="font-bold text-[#112B4F] mb-2">{task.title}</h3>

                    {/* Task Description */}
                    <p className="text-sm text-gray-600 mb-3">{task.description}</p>

                    {/* Tags */}
                    {task.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {task.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 text-xs bg-[#FAA21B]/10 text-[#FAA21B] px-2 py-1 rounded"
                          >
                            <Tag className="h-3 w-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      {task.assignee && (
                        <div className="flex items-center gap-1">
                          <UserIcon className="h-3 w-3" />
                          <span>{task.assignee}</span>
                        </div>
                      )}
                      {task.dueDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{task.dueDate}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Add Task Button */}
                {showAddTask === column.id ? (
                  <div className="bg-white rounded-lg p-4 shadow-md">
                    <input
                      type="text"
                      placeholder="Enter task title..."
                      className="w-full px-3 py-2 rounded border-2 border-gray-200 focus:border-[#FAA21B] outline-none mb-2"
                      autoFocus
                    />
                    <textarea
                      placeholder="Add description..."
                      className="w-full px-3 py-2 rounded border-2 border-gray-200 focus:border-[#FAA21B] outline-none mb-2 resize-none"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <button className="flex-1 px-4 py-2 bg-[#FAA21B] text-[#112B4F] rounded font-bold hover:bg-[#FAA21B]/90 transition-colors">
                        Add Task
                      </button>
                      <button
                        onClick={() => setShowAddTask(null)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded font-bold hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAddTask(column.id)}
                    className="w-full py-3 bg-white/10 backdrop-blur-sm border-2 border-dashed border-white/20 rounded-lg text-white/60 hover:text-white hover:border-white/40 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Task
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Add Column Button */}
          <div className="flex-shrink-0 w-80">
            <button className="w-full h-full min-h-[200px] bg-white/5 backdrop-blur-sm border-2 border-dashed border-white/20 rounded-xl text-white/60 hover:text-white hover:border-white/40 transition-all flex flex-col items-center justify-center gap-2">
              <Plus className="h-8 w-8" />
              <span className="font-bold">Add Column</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
