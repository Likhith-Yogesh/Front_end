import { useState } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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
                  className="border-b border-slate-700/50 hover:bg-slate-700/30 transition"
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
        <h4 className="text-lg font-semibold text-white mb-4">Excelsius Hardware Monitoring</h4>
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
    </div>
  );
}
