import ExamViewTableBlock from '../components/ExamViewTableBlock';


export default function ExamViewTable() {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-white">PACS Module</h3>
      <ExamViewTableBlock></ExamViewTableBlock>

      {/* TODO: Modal Popup */}
    </div>
  );
}
