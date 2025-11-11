import { useState } from 'react';
import { ChevronLeft, ChevronRight, Search, X, Send, Trash2 } from 'lucide-react';
import examData from '../../test/dummy_exam_data.json';

interface ExamRecord {
  id: number;
  examName: string;
  patientID: string;
  patientBirthDate: string;
  patientSex: string;
  studyDate: string;
  accessionNumber: string;
  institutionName: string;
  referringPhysicianName: string;
  studyInstanceUID: string;
  studyID: string;
}

export default function ExamViewTable() {
  const [examRecords] = useState<ExamRecord[]>(examData);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExam, setSelectedExam] = useState<ExamRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudy, setSelectedStudy] = useState('');
  const [selectedSeries, setSelectedSeries] = useState('');
  const [sendDestination, setSendDestination] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Mock data for studies and series
  const studies = ['Study 1', 'Study 2', 'Study 3'];
  const series = ['Series A', 'Series B', 'Series C', 'Series D'];
  
  // Excelsius systems - all systems available for sending
  const excelsistusSystems = [
    { id: 'EHUB-P101', status: 'online' },
    { id: 'EGPS-P102', status: 'online' },
    { id: 'E3D-P103', status: 'offline' },
  ];

  // Filter exam records based on search query
  const filteredRecords = examRecords.filter((exam) => {
    const query = searchQuery.toLowerCase();
    return (
      exam.examName.toLowerCase().includes(query) ||
      exam.patientID.toLowerCase().includes(query) ||
      exam.studyID.toLowerCase().includes(query) ||
      exam.institutionName.toLowerCase().includes(query)
    );
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredRecords.slice(startIndex, endIndex);

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  // Reset to page 1 when search changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleExamClick = (exam: ExamRecord) => {
    setSelectedExam(exam);
    setIsModalOpen(true);
    setSelectedStudy('');
    setSelectedSeries('');
    setSendDestination('');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedExam(null);
    setSelectedStudy('');
    setSelectedSeries('');
    setSendDestination('');
  };

  const handleSend = () => {
    // Handle send logic here
    if (!sendDestination) {
      alert('Please select a destination');
      return;
    }
    alert(`Sending to ${sendDestination}: Study=${selectedStudy}, Series=${selectedSeries}`);
    handleCloseModal();
  };

  const handleDelete = () => {
    // Handle delete logic here
    if (window.confirm(`Are you sure you want to delete this exam?`)) {
      alert(`Deleting exam`);
      handleCloseModal();
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-white">PACS Module</h3>

      {/* PACS table */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-white">Exams Table</h4>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search exams..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left text-slate-400 text-xs font-medium py-3 px-4">Exam Name</th>
                <th className="text-left text-slate-400 text-xs font-medium py-3 px-4">Patient ID</th>
                <th className="text-left text-slate-400 text-xs font-medium py-3 px-4">Birth Date</th>
                <th className="text-left text-slate-400 text-xs font-medium py-3 px-4">Sex</th>
                <th className="text-left text-slate-400 text-xs font-medium py-3 px-4">Study Date</th>
                <th className="text-left text-slate-400 text-xs font-medium py-3 px-4">Institution</th>
                <th className="text-left text-slate-400 text-xs font-medium py-3 px-4">Study ID</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((exam) => (
                <tr
                  key={exam.id}
                  onClick={() => handleExamClick(exam)}
                  className="border-b border-slate-700/50 hover:bg-slate-700/30 transition cursor-pointer"
                >
                  <td className="py-3 px-4 text-white text-sm">{exam.examName}</td>
                  <td className="py-3 px-4 text-slate-300 text-sm">{exam.patientID}</td>
                  <td className="py-3 px-4 text-slate-300 text-sm">{exam.patientBirthDate}</td>
                  <td className="py-3 px-4 text-slate-300 text-sm">{exam.patientSex || '-'}</td>
                  <td className="py-3 px-4 text-slate-300 text-sm">{exam.studyDate}</td>
                  <td className="py-3 px-4 text-slate-300 text-sm">{exam.institutionName || '-'}</td>
                  <td className="py-3 px-4 text-slate-300 text-sm">{exam.studyID}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700">
          <div className="text-sm text-slate-400">
            Page {currentPage} of {totalPages} ({filteredRecords.length} {searchQuery ? 'filtered' : 'total'} exams)
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Excelsius Hardware Monitoring */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Excelsius System Status</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <p className="text-slate-400 text-sm">EHUB-P101</p>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-white text-sm font-medium">online</span>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-slate-400 text-sm">EGPS-P102</p>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-white text-sm font-medium">online</span>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-slate-400 text-sm">E3D-P103</p>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-white text-sm font-medium">offline</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Popup */}
      {isModalOpen && selectedExam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 w-full max-w-md mx-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Exam Details</h3>
              <button
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Exam Info */}
            <div className="mb-4 p-3 bg-slate-700/50 rounded-lg">
              <p className="text-sm text-slate-300 mb-1">
                <span className="font-semibold text-white">Patient:</span> {selectedExam.patientID}
              </p>
              <p className="text-sm text-slate-300">
                <span className="font-semibold text-white">Exam:</span> {selectedExam.examName}
              </p>
            </div>

            {/* Study Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Select Study
              </label>
              <select
                value={selectedStudy}
                onChange={(e) => setSelectedStudy(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Select Study --</option>
                {studies.map((study, index) => (
                  <option key={index} value={study}>
                    {study}
                  </option>
                ))}
              </select>
            </div>

            {/* Series Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Select Series
              </label>
              <select
                value={selectedSeries}
                onChange={(e) => setSelectedSeries(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Select Series --</option>
                {series.map((ser, index) => (
                  <option key={index} value={ser}>
                    {ser}
                  </option>
                ))}
              </select>
            </div>

            {/* Send Destination Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Send Destination
              </label>
              <select
                value={sendDestination}
                onChange={(e) => setSendDestination(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Select Destination --</option>
                {excelsistusSystems.map((system) => (
                  <option key={system.id} value={system.id}>
                    {system.status === 'online' ? '🟢' : '🔴'} {system.id} ({system.status})
                  </option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleSend}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
