import SystemMonitor from './SystemMonitor';
import ExamViewTable from './ExamViewTable';

export default function PACS() {
  return (
    <div className="space-y-8">
      {/* Exam Viewer Section - FIRST */}
      <ExamViewTable />
      
      {/* Visual Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t-2 border-slate-700"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="px-4 py-1 bg-slate-800 text-slate-400 text-sm font-medium rounded-full border border-slate-700">
            System Monitor
          </span>
        </div>
      </div>
      
      {/* System Monitor Section - SECOND */}
      <SystemMonitor />
    </div>
  );
}
