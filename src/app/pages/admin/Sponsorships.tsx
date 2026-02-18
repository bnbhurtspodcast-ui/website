import { Briefcase, Search, Filter, Eye, DollarSign, CheckCircle, X } from "lucide-react";
import { useState } from "react";

interface SponsorshipInquiry {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  budget: string;
  goals: string;
  message: string;
  date: string;
  status: "new" | "reviewing" | "negotiating" | "accepted" | "declined";
  packageInterest: string;
}

const mockSponsorships: SponsorshipInquiry[] = [
  {
    id: "s1",
    companyName: "Tech Innovations Inc.",
    contactName: "Jennifer Smith",
    email: "marketing@techinnovations.com",
    budget: "5k-10k",
    goals: "Brand awareness for new product launch targeting tech professionals",
    message: "We're launching a new SaaS product and think your audience would be perfect. Interested in Silver package.",
    date: "2026-02-12",
    status: "new",
    packageInterest: "Silver",
  },
  {
    id: "s2",
    companyName: "Wellness Co.",
    contactName: "Michael Brown",
    email: "partnerships@wellnessco.com",
    budget: "over-10k",
    goals: "Product awareness and lead generation for wellness app",
    message: "Looking for Gold package with host-read ads. Can we discuss custom integration?",
    date: "2026-02-11",
    status: "negotiating",
    packageInterest: "Gold",
  },
  {
    id: "s3",
    companyName: "GreenTech Solutions",
    contactName: "Sarah Lee",
    email: "sarah@greentech.io",
    budget: "1k-5k",
    goals: "Increase awareness of sustainable tech products",
    message: "We're a startup in the green technology space. Bronze package would work for us to start.",
    date: "2026-02-09",
    status: "accepted",
    packageInterest: "Bronze",
  },
  {
    id: "s4",
    companyName: "Finance App Pro",
    contactName: "David Martinez",
    email: "david@financeapp.com",
    budget: "5k-10k",
    goals: "User acquisition for financial planning app",
    message: "Interested in multi-episode sponsorship. What discounts are available?",
    date: "2026-02-08",
    status: "reviewing",
    packageInterest: "Silver",
  },
  {
    id: "s5",
    companyName: "FitLife Equipment",
    contactName: "Amanda Wilson",
    email: "amanda@fitlife.com",
    budget: "under-1k",
    goals: "Brand awareness",
    message: "Small budget but very interested. Any options?",
    date: "2026-02-06",
    status: "declined",
    packageInterest: "Bronze",
  },
];

export function Sponsorships() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedSponsorship, setSelectedSponsorship] = useState<SponsorshipInquiry | null>(null);

  const filteredSponsorships = mockSponsorships.filter((sponsorship) => {
    const matchesSearch =
      sponsorship.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sponsorship.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sponsorship.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || sponsorship.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-[#FAA21B] text-[#112B4F]";
      case "reviewing":
        return "bg-blue-500 text-white";
      case "negotiating":
        return "bg-purple-500 text-white";
      case "accepted":
        return "bg-green-500 text-white";
      case "declined":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getBudgetLabel = (budget: string) => {
    const labels: Record<string, string> = {
      "under-1k": "< $1K",
      "1k-5k": "$1K-$5K",
      "5k-10k": "$5K-$10K",
      "over-10k": "> $10K",
    };
    return labels[budget] || budget;
  };

  const newCount = mockSponsorships.filter((s) => s.status === "new").length;
  const negotiatingCount = mockSponsorships.filter((s) => s.status === "negotiating").length;
  const acceptedCount = mockSponsorships.filter((s) => s.status === "accepted").length;

  const totalValue = mockSponsorships
    .filter((s) => s.status === "accepted")
    .reduce((acc, s) => {
      const values: Record<string, number> = {
        "under-1k": 500,
        "1k-5k": 3000,
        "5k-10k": 7500,
        "over-10k": 15000,
      };
      return acc + (values[s.budget] || 0);
    }, 0);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Sponsorship Inquiries</h1>
        <p className="text-[#FAA21B]">Manage and track sponsorship opportunities</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow">
          <div className="text-2xl font-bold text-[#112B4F]">{mockSponsorships.length}</div>
          <div className="text-sm text-gray-600">Total Inquiries</div>
        </div>
        <div className="bg-[#FAA21B]/10 rounded-xl p-4 shadow">
          <div className="text-2xl font-bold text-[#FAA21B]">{newCount}</div>
          <div className="text-sm text-[#112B4F]">New Inquiries</div>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 shadow">
          <div className="text-2xl font-bold text-purple-600">{negotiatingCount}</div>
          <div className="text-sm text-gray-600">In Negotiation</div>
        </div>
        <div className="bg-green-50 rounded-xl p-4 shadow">
          <div className="text-2xl font-bold text-green-600">${(totalValue / 1000).toFixed(1)}K</div>
          <div className="text-sm text-gray-600">Accepted Value</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-4 shadow-lg mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by company name, contact, or email..."
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
              <option value="reviewing">Reviewing</option>
              <option value="negotiating">Negotiating</option>
              <option value="accepted">Accepted</option>
              <option value="declined">Declined</option>
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
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#112B4F] uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#112B4F] uppercase tracking-wider">
                  Package
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#112B4F] uppercase tracking-wider">
                  Budget
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
              {filteredSponsorships.map((sponsorship) => (
                <tr key={sponsorship.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Briefcase className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="text-sm font-medium text-gray-900">{sponsorship.companyName}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{sponsorship.contactName}</div>
                    <div className="text-xs text-gray-500">{sponsorship.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      {sponsorship.packageInterest}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      {getBudgetLabel(sponsorship.budget)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{sponsorship.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(sponsorship.status)}`}>
                      {sponsorship.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedSponsorship(sponsorship)}
                        className="p-2 text-[#FAA21B] hover:bg-[#FAA21B]/10 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Accept"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      <button
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Decline"
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
      {selectedSponsorship && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedSponsorship(null)}>
          <div className="bg-white rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Briefcase className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#112B4F]">{selectedSponsorship.companyName}</h2>
                  <p className="text-gray-600">{selectedSponsorship.contactName}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSponsorship(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">Contact Email</label>
                <p className="text-gray-900">{selectedSponsorship.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">Inquiry Date</label>
                <p className="text-gray-900">{selectedSponsorship.date}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">Package Interest</label>
                <span className="inline-flex px-3 py-1 bg-blue-100 text-blue-700 rounded font-medium text-sm">
                  {selectedSponsorship.packageInterest}
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">Budget Range</label>
                <p className="text-gray-900 font-medium flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  {getBudgetLabel(selectedSponsorship.budget)}
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-2">Campaign Goals</label>
                <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">{selectedSponsorship.goals}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-2">Additional Message</label>
                <p className="text-gray-900 bg-gray-50 p-4 rounded-lg leading-relaxed">{selectedSponsorship.message}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-2">Current Status</label>
                <span className={`inline-flex px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(selectedSponsorship.status)}`}>
                  {selectedSponsorship.status}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition-colors">
                <CheckCircle className="inline h-4 w-4 mr-2" />
                Accept & Create Deal
              </button>
              <button className="flex-1 px-6 py-3 bg-purple-500 text-white rounded-lg font-bold hover:bg-purple-600 transition-colors">
                <Briefcase className="inline h-4 w-4 mr-2" />
                Send Proposal
              </button>
              <button className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-colors">
                <X className="inline h-4 w-4 mr-2" />
                Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
