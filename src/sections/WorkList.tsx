import { useState } from 'react';
import { Search, RefreshCw, AlertCircle, Server, Loader2 } from 'lucide-react';

const WORKLIST_API_URL =
  import.meta.env.VITE_WORKLIST_API ?? 'http://localhost:8081/worklist';
// ↑ TODO: point this at your actual worklist server endpoint

interface WorklistQuery{
  patientId: string;
  patientName: string;
  accessionNumber: string;
  modality: string;
  fromDate: string;
  toDate: string;
}

interface Worklist{
  id: string;
  patientId: string;
  patientName: string;
  accessionNumber: string;
  modality: string;
  scheduledDate: string;
  scheduledTime?: string;
  stationAET?: string;
  status?: string;
}

function buildQueryString(query: WorklistQuery) {
  const params = new URLSearchParams();

  if (query.patientId) params.set('patientId', query.patientId);
  if (query.patientName) params.set('patientName', query.patientName);
  if (query.accessionNumber) params.set('accessionNumber', query.accessionNumber);
  if (query.modality) params.set('modality', query.modality);
  if (query.fromDate) params.set('fromDate', query.fromDate);
  if (query.toDate) params.set('toDate', query.toDate);

  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

// Map raw API item → UI item.
// TODO: adjust this to match your real JSON structure.
function mapApiItemToWorklistItem(raw: any): Worklist {
  return {
    id: raw.id ?? raw.StudyInstanceUID ?? crypto.randomUUID(),
    patientId: raw.patientId ?? raw.PatientID ?? '',
    patientName: raw.patientName ?? raw.PatientName ?? '',
    accessionNumber: raw.accessionNumber ?? raw.AccessionNumber ?? '',
    modality: raw.modality ?? raw.Modality ?? '',
    scheduledDate: raw.scheduledDate ?? raw.ScheduledProcedureStepStartDate ?? '',
    scheduledTime: raw.scheduledTime ?? raw.ScheduledProcedureStepStartTime ?? '',
    stationAET: raw.stationAET ?? raw.ScheduledStationAETitle ?? '',
    status: raw.status ?? raw.StudyStatus ?? raw.ProcedureStatus ?? '',
  };
}

export default function Worklist() {
  const [query, setQuery] = useState<WorklistQuery>({
    patientId: '',
    patientName: '',
    accessionNumber: '',
    modality: '',
    fromDate: '',
    toDate: '',
  });

  const [items, setItems] = useState<Worklist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const handleChange =
    (field: keyof WorklistQuery) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setQuery((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const resetFilters = () => {
    setQuery({
      patientId: '',
      patientName: '',
      accessionNumber: '',
      modality: '',
      fromDate: '',
      toDate: '',
    });
  };

  const fetchWorklist = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const url = WORKLIST_API_URL + buildQueryString(query);
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Worklist request failed: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();

      // Assume API returns an array; tweak if your API is wrapped.
      const list = Array.isArray(data) ? data : data.items ?? [];
      const mapped: Worklist[] = list.map(mapApiItemToWorklistItem);

      setItems(mapped);
      setLastUpdated(new Date());
    } catch (err: any) {
      console.error('Worklist fetch error', err);
      setError(err.message ?? 'Unknown error while fetching worklist');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchWorklist();
  };

  const handleRefresh = () => {
    void fetchWorklist();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white">Worklist</h3>
          <p className="text-slate-400 text-sm">
            Query and view studies from the worklist server.
          </p>
        </div>
        <div className="flex items-center gap-2 text-slate-300 text-sm">
          <Server className="w-4 h-4" />
          <span className="hidden sm:inline">
            Endpoint:&nbsp;
            <span className="font-mono text-xs text-slate-400">
              {WORKLIST_API_URL}
            </span>
          </span>
        </div>
      </div>

      {/* Query Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 border border-slate-700 rounded-xl p-4 md:p-6 space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Patient ID
            </label>
            <input
              type="text"
              value={query.patientId}
              onChange={handleChange('patientId')}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              placeholder="e.g. 123456"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Patient Name
            </label>
            <input
              type="text"
              value={query.patientName}
              onChange={handleChange('patientName')}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              placeholder="e.g. DOE^JOHN"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Accession Number
            </label>
            <input
              type="text"
              value={query.accessionNumber}
              onChange={handleChange('accessionNumber')}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              placeholder="e.g. ACC-2024-0001"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Modality
            </label>
            <select
              value={query.modality}
              onChange={handleChange('modality')}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">Any</option>
              <option value="CT">CT</option>
              <option value="RF">RF</option>
              <option value="DF">DF</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              From Date
            </label>
            <input
              type="date"
              value={query.fromDate}
              onChange={handleChange('fromDate')}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              To Date
            </label>
            <input
              type="date"
              value={query.toDate}
              onChange={handleChange('toDate')}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Querying…
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Query Worklist
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 text-sm font-medium transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>

          <button
            type="button"
            onClick={resetFilters}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-600 text-slate-200 text-xs font-medium hover:bg-slate-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Clear Filters
          </button>

          {lastUpdated && (
            <span className="ml-auto text-xs text-slate-400 self-center">
              Last updated:{' '}
              {lastUpdated.toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          )}
        </div>
      </form>

      {/* Error State */}
      {error && (
        <div className="flex items-start gap-3 bg-red-900/30 border border-red-700 rounded-lg px-4 py-3 text-sm text-red-200">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Worklist request failed</p>
            <p className="text-red-200/80 break-all">{error}</p>
          </div>
        </div>
      )}

      {/* Results Table */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
          <p className="text-sm text-slate-300">
            Results{' '}
            <span className="text-slate-400">
              ({items.length} {items.length === 1 ? 'entry' : 'entries'})
            </span>
          </p>
        </div>

        {items.length === 0 ? (
          <div className="px-4 py-10 text-center text-slate-400 text-sm">
            {isLoading
              ? 'Querying worklist…'
              : 'No worklist entries. Adjust your filters and query again.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-900/60">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-slate-300 whitespace-nowrap">
                    Patient ID
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-slate-300 whitespace-nowrap">
                    Patient Name
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-slate-300 whitespace-nowrap">
                    Accession
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-slate-300 whitespace-nowrap">
                    Modality
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-slate-300 whitespace-nowrap">
                    Scheduled Date/Time
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-slate-300 whitespace-nowrap">
                    Station
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-slate-300 whitespace-nowrap">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-slate-700 hover:bg-slate-900/40 transition"
                  >
                    <td className="px-4 py-2 text-slate-100 font-mono text-xs whitespace-nowrap">
                      {item.patientId || '—'}
                    </td>
                    <td className="px-4 py-2 text-slate-100 whitespace-nowrap">
                      {item.patientName || '—'}
                    </td>
                    <td className="px-4 py-2 text-slate-200 font-mono text-xs whitespace-nowrap">
                      {item.accessionNumber || '—'}
                    </td>
                    <td className="px-4 py-2 text-slate-100 whitespace-nowrap">
                      {item.modality || '—'}
                    </td>
                    <td className="px-4 py-2 text-slate-200 whitespace-nowrap">
                      {item.scheduledDate || '—'}
                      {item.scheduledTime && (
                        <span className="text-slate-400"> {item.scheduledTime}</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-slate-200 whitespace-nowrap">
                      {item.stationAET || '—'}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {item.status ? (
                        <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-500/15 text-blue-200">
                          {item.status}
                        </span>
                      ) : (
                        <span className="text-slate-500 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}
