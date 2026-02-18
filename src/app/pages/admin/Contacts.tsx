import { Mail, Search, Filter, Eye, Trash2, CheckCircle } from "lucide-react";
import { useState } from "react";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: "new" | "reviewed" | "responded";
}

const mockContacts: ContactSubmission[] = [
  {
    id: "c1",
    name: "Mike Chen",
    email: "mike.chen@email.com",
    subject: "Question about Episode 145",
    message: "I really enjoyed the episode about climate change. Could you share more resources on this topic?",
    date: "2026-02-12",
    status: "new",
  },
  {
    id: "c2",
    name: "Alex Turner",
    email: "alex.t@email.com",
    subject: "Feedback on recent episodes",
    message: "Love the new format! The longer episodes are much better for deep dives into topics.",
    date: "2026-02-11",
    status: "responded",
  },
  {
    id: "c3",
    name: "Lisa Martinez",
    email: "lisa.m@email.com",
    subject: "Transcript Request",
    message: "Could you provide a transcript for episode #142? I'd like to quote it in my research.",
    date: "2026-02-10",
    status: "reviewed",
  },
  {
    id: "c4",
    name: "David Kim",
    email: "david.kim@email.com",
    subject: "Technical Issue",
    message: "Having trouble downloading episode 150. The file seems to be corrupted.",
    date: "2026-02-09",
    status: "new",
  },
  {
    id: "c5",
    name: "Emma Wilson",
    email: "emma.w@email.com",
    subject: "Partnership Opportunity",
    message: "I run a mental health blog and would love to collaborate on content.",
    date: "2026-02-08",
    status: "reviewed",
  },
];

export function Contacts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);

  const filteredContacts = mockContacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || contact.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-[#FAA21B] text-[#112B4F]";
      case "reviewed":
        return "bg-blue-500 text-white";
      case "responded":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const newCount = mockContacts.filter((c) => c.status === "new").length;
  const reviewedCount = mockContacts.filter((c) => c.status === "reviewed").length;
  const respondedCount = mockContacts.filter((c) => c.status === "responded").length;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Contact Submissions</h1>
        <p className="text-[#FAA21B]">Manage and respond to contact form submissions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow">
          <div className="text-2xl font-bold text-[#112B4F]">{mockContacts.length}</div>
          <div className="text-sm text-gray-600">Total Contacts</div>
        </div>
        <div className="bg-[#FAA21B]/10 rounded-xl p-4 shadow">
          <div className="text-2xl font-bold text-[#FAA21B]">{newCount}</div>
          <div className="text-sm text-[#112B4F]">New</div>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 shadow">
          <div className="text-2xl font-bold text-blue-600">{reviewedCount}</div>
          <div className="text-sm text-gray-600">Reviewed</div>
        </div>
        <div className="bg-green-50 rounded-xl p-4 shadow">
          <div className="text-2xl font-bold text-green-600">{respondedCount}</div>
          <div className="text-sm text-gray-600">Responded</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-4 shadow-lg mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or subject..."
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
              <option value="new">New</option>
              <option value="reviewed">Reviewed</option>
              <option value="responded">Responded</option>
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
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#112B4F] uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#112B4F] uppercase tracking-wider">
                  Date
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
              {filteredContacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{contact.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">{contact.subject}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{contact.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(contact.status)}`}>
                      {contact.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedContact(contact)}
                        className="p-2 text-[#FAA21B] hover:bg-[#FAA21B]/10 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Mark as Responded"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      <button
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
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
      {selectedContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedContact(null)}>
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[#112B4F] mb-2">{selectedContact.subject}</h2>
                <p className="text-gray-600">From: {selectedContact.name}</p>
              </div>
              <button
                onClick={() => setSelectedContact(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-gray-900">{selectedContact.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Date</label>
                <p className="text-gray-900">{selectedContact.date}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(selectedContact.status)} ml-2`}>
                  {selectedContact.status}
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-2">Message</label>
                <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">{selectedContact.message}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 px-6 py-3 bg-[#FAA21B] text-[#112B4F] rounded-lg font-bold hover:bg-[#FAA21B]/90 transition-colors">
                <Mail className="inline h-4 w-4 mr-2" />
                Reply
              </button>
              <button className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition-colors">
                <CheckCircle className="inline h-4 w-4 mr-2" />
                Mark Responded
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
