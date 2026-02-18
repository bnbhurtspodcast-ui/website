import { FileText, Plus } from "lucide-react";

export function Content() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Content Management</h1>
        <p className="text-[#FAA21B]">Manage episodes, show notes, and podcast content</p>
      </div>

      {/* Coming Soon Card */}
      <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
        <div className="w-20 h-20 bg-[#FAA21B]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileText className="h-10 w-10 text-[#FAA21B]" />
        </div>
        <h2 className="text-2xl font-bold text-[#112B4F] mb-4">Content Management Coming Soon</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          This section will allow you to create, edit, and manage podcast episodes, show notes, 
          transcripts, and other content. Features will include:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto mb-8">
          <div className="bg-gray-50 p-4 rounded-lg text-left">
            <h3 className="font-bold text-[#112B4F] mb-2">Episode Management</h3>
            <p className="text-sm text-gray-600">Create and edit episodes with audio uploads</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-left">
            <h3 className="font-bold text-[#112B4F] mb-2">Show Notes Editor</h3>
            <p className="text-sm text-gray-600">Rich text editor for detailed show notes</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-left">
            <h3 className="font-bold text-[#112B4F] mb-2">Transcript Management</h3>
            <p className="text-sm text-gray-600">Upload and edit episode transcripts</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-left">
            <h3 className="font-bold text-[#112B4F] mb-2">Publishing Schedule</h3>
            <p className="text-sm text-gray-600">Schedule episodes for future release</p>
          </div>
        </div>
        <button className="px-8 py-4 bg-[#FAA21B] text-[#112B4F] rounded-full font-bold hover:bg-[#FAA21B]/90 transition-colors shadow-lg inline-flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Create New Episode (Demo)
        </button>
      </div>
    </div>
  );
}
