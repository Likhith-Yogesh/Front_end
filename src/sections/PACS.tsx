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
      </div>
      
      {/* System Monitor Section - SECOND */}
      <SystemMonitor />
    </div>
  );
}
