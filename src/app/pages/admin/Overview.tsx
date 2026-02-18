import { Mail, User, Briefcase, FileText, TrendingUp, Calendar } from "lucide-react";
import { Link } from "react-router";

export function Overview() {
  const stats = [
    { label: "Total Contact Submissions", value: 45, icon: Mail, change: "+12%", path: "/admin/contacts" },
    { label: "Guest Applications", value: 28, icon: User, change: "+8%", path: "/admin/guests" },
    { label: "Sponsorship Inquiries", value: 15, icon: Briefcase, change: "+23%", path: "/admin/sponsorships" },
    { label: "Total Episodes", value: 156, icon: FileText, change: "+2", path: "/admin/content" },
  ];

  const recentActivity = [
    { type: "contact", name: "Sarah Johnson", action: "submitted a contact form", time: "2 hours ago" },
    { type: "guest", name: "Dr. Emily Rodriguez", action: "applied to be a guest", time: "5 hours ago" },
    { type: "sponsorship", name: "Tech Innovations Inc.", action: "requested sponsorship info", time: "1 day ago" },
    { type: "contact", name: "Mike Chen", action: "sent a message", time: "1 day ago" },
    { type: "guest", name: "James Peterson", action: "submitted guest application", time: "2 days ago" },
  ];

  const pendingTasks = [
    { task: "Review 3 new guest applications", priority: "high", category: "guests" },
    { task: "Respond to 2 sponsorship inquiries", priority: "high", category: "sponsorships" },
    { task: "Follow up with 5 contact submissions", priority: "medium", category: "contacts" },
    { task: "Update episode 157 show notes", priority: "low", category: "content" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-[#FAA21B]">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              to={stat.path}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-[#FAA21B]/10 rounded-lg">
                  <Icon className="h-6 w-6 text-[#FAA21B]" />
                </div>
                <span className="text-green-600 text-sm font-bold flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  {stat.change}
                </span>
              </div>
              <div className="text-3xl font-bold text-[#112B4F] mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-[#112B4F] mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#FAA21B]" />
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className={`p-2 rounded-full ${
                  activity.type === "contact" ? "bg-purple-100" :
                  activity.type === "guest" ? "bg-blue-100" :
                  "bg-green-100"
                }`}>
                  {activity.type === "contact" && <Mail className="h-4 w-4 text-purple-600" />}
                  {activity.type === "guest" && <User className="h-4 w-4 text-blue-600" />}
                  {activity.type === "sponsorship" && <Briefcase className="h-4 w-4 text-green-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.name}</span> {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-[#112B4F] mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#FAA21B]" />
            Pending Tasks
          </h2>
          <div className="space-y-3">
            {pendingTasks.map((task, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className={`w-2 h-2 rounded-full ${
                  task.priority === "high" ? "bg-red-500" :
                  task.priority === "medium" ? "bg-yellow-500" :
                  "bg-green-500"
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{task.task}</p>
                  <p className="text-xs text-gray-500 capitalize">{task.category}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  task.priority === "high" ? "bg-red-100 text-red-700" :
                  task.priority === "medium" ? "bg-yellow-100 text-yellow-700" :
                  "bg-green-100 text-green-700"
                }`}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
