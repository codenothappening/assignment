import { Button } from '../common/Button';
import { FilterState } from '../../types/transaction';

interface Props {
  filters: FilterState;
  onChange: (next: Partial<FilterState>) => void;
}

export const TransactionFilters = ({ filters, onChange }: Props) => {
  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', margin: '1rem 0' }}>
      <div>
        <label className="input-label">Start Date</label>
        <input
          type="date"
          className="input"
          value={filters.startDate}
          onChange={(e) => onChange({ startDate: e.target.value, page: 0 })}
        />
      </div>
      <div>
        <label className="input-label">End Date</label>
        <input
          type="date"
          className="input"
          value={filters.endDate}
          onChange={(e) => onChange({ endDate: e.target.value, page: 0 })}
        />
      </div>
      <div>
        <label className="input-label">Status</label>
        <select
          className="input"
          value={filters.status || ''}
          onChange={(e) => onChange({ status: e.target.value || undefined, page: 0 })}
        >
          <option value="">All</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>
      <div>
        <label className="input-label">Page Size</label>
        <select
          className="input"
          value={filters.size}
          onChange={(e) => onChange({ size: Number(e.target.value), page: 0 })}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
      <Button variant="outline" onClick={() => onChange({ status: undefined, page: 0 })}>Clear</Button>
    </div>
  );
};