import { User, Search, Filter, Eye, CheckCircle, X, Star } from "lucide-react";
import { useState } from "react";

interface GuestApplication {
  id: string;
  name: string;
  email: string;
  expertise: string;
  topicIdea: string;
  bio: string;
  socialMedia: string;
  availability: string;
  date: string;
  status: "pending" | "approved" | "rejected" | "scheduled";
}

const mockGuests: GuestApplication[] = [
  {
    id: "g1",
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    expertise: "AI and Machine Learning",
    topicIdea: "Ethical implications of AI in healthcare",
    bio: "PhD in Computer Science, 10 years experience in AI research. Published author and speaker at TEDx.",
    socialMedia: "@sarahj_ai",
    availability: "weekday-afternoon",
    date: "2026-02-12",
    status: "pending",
  },
  {
    id: "g2",
    name: "Dr. Emily Rodriguez",
    email: "emily.r@university.edu",
    expertise: "Mental Health & Psychology",
    topicIdea: "Burnout in the modern workplace",
    bio: "Clinical psychologist specializing in workplace mental health. Author of 'The Burnout Solution'.",
    socialMedia: "@dremily_psych",
    availability: "flexible",
    date: "2026-02-10",
    status: "approved",
  },
  {
    id: "g3",
    name: "James Peterson",
    email: "james.p@startup.io",
    expertise: "Entrepreneurship & Startups",
    topicIdea: "Scaling challenges from 10 to 100 employees",
    bio: "Founder of 3 successful startups. Former VP at tech unicorn. Angel investor and startup advisor.",
    socialMedia: "@jamesp_founder",
    availability: "weekday-evening",
    date: "2026-02-08",
    status: "scheduled",
  },
  {
    id: "g4",
    name: "Maria Garcia",
    email: "maria.g@climate.org",
    expertise: "Climate Science",
    topicIdea: "Climate change and urban planning",
    bio: "Environmental scientist with 15 years in climate research. Advisor to city governments on sustainability.",
    socialMedia: "@mariag_climate",
    availability: "weekend",
    date: "2026-02-07",
    status: "pending",
  },
  {
    id: "g5",
    name: "Robert Chen",
    email: "robert.c@finance.com",
    expertise: "Finance & Investment",
    topicIdea: "Cryptocurrency and the future of money",
    bio: "Former hedge fund manager, now crypto investor. Founder of blockchain education platform.",
    socialMedia: "@robertc_crypto",
    availability: "weekday-morning",
    date: "2026-02-05",
    status: "rejected",
  },
];

export function Guests() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedGuest, setSelectedGuest] = useState<GuestApplication | null>(null);

  const filteredGuests = mockGuests.filter((guest) => {
    const matchesSearch =
      guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.expertise.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || guest.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-[#FAA21B] text-[#112B4F]";
      case "approved":
        return "bg-green-500 text-white";
      case "rejected":
        return "bg-red-500 text-white";
      case "scheduled":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const pendingCount = mockGuests.filter((g) => g.status === "pending").length;
  const approvedCount = mockGuests.filter((g) => g.status === "approved").length;
  const scheduledCount = mockGuests.filter((g) => g.status === "scheduled").length;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Guest Applications</h1>
        <p className="text-[#FAA21B]">Review and manage potential podcast guests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow">
          <div className="text-2xl font-bold text-[#112B4F]">{mockGuests.length}</div>
          <div className="text-sm text-gray-600">Total Applications</div>
        </div>
        <div className="bg-[#FAA21B]/10 rounded-xl p-4 shadow">
          <div className="text-2xl font-bold text-[#FAA21B]">{pendingCount}</div>
          <div className="text-sm text-[#112B4F]">Pending Review</div>
        </div>
        <div className="bg-green-50 rounded-xl p-4 shadow">
          <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
          <div className="text-sm text-gray-600">Approved</div>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 shadow">
          <div className="text-2xl font-bold text-blue-600">{scheduledCount}</div>
          <div className="text-sm text-gray-600">Scheduled</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-4 shadow-lg mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or expertise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-gray-200 focus:border-[#FAA21B] focus:ring-2 focus:ring-[#FAA21B]/20 outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-[#FAA21B] focus:ring-2 focus:ring-[#FAA21B]/20 outline-none transition-all"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="scheduled">Scheduled</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#112B4F] uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#112B4F] uppercase tracking-wider">
                  Expertise
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#112B4F] uppercase tracking-wider">
                  Topic Idea
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#112B4F] uppercase tracking-wider">
                  Date Applied
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#112B4F] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#112B4F] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredGuests.map((guest) => (
                <tr key={guest.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#FAA21B]/10 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-[#FAA21B]" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{guest.name}</div>
                        <div className="text-xs text-gray-500">{guest.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{guest.expertise}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">{guest.topicIdea}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{guest.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(guest.status)}`}>
                      {guest.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedGuest(guest)}
                        className="p-2 text-[#FAA21B] hover:bg-[#FAA21B]/10 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Approve"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      <button
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Reject"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedGuest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedGuest(null)}>
          <div className="bg-white rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#FAA21B]/10 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-[#FAA21B]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#112B4F]">{selectedGuest.name}</h2>
                  <p className="text-gray-600">{selectedGuest.expertise}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedGuest(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">Email</label>
                <p className="text-gray-900">{selectedGuest.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">Social Media</label>
                <p className="text-gray-900">{selectedGuest.socialMedia}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">Applied Date</label>
                <p className="text-gray-900">{selectedGuest.date}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">Availability</label>
                <p className="text-gray-900 capitalize">{selectedGuest.availability.replace("-", " ")}</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-2">Proposed Topic</label>
                <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">{selectedGuest.topicIdea}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-2">Bio</label>
                <p className="text-gray-900 bg-gray-50 p-4 rounded-lg leading-relaxed">{selectedGuest.bio}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-2">Current Status</label>
                <span className={`inline-flex px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(selectedGuest.status)}`}>
                  {selectedGuest.status}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition-colors">
                <CheckCircle className="inline h-4 w-4 mr-2" />
                Approve
              </button>
              <button className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition-colors">
                <Star className="inline h-4 w-4 mr-2" />
                Schedule Interview
              </button>
              <button className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-colors">
                <X className="inline h-4 w-4 mr-2" />
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
