import { Input } from '../common/Input';
import { Button } from '../common/Button';
import type { MerchantFilters as MerchantFiltersType } from '../../types/merchant';

interface Props {
  filters: MerchantFiltersType;
  onChange: (next: Partial<MerchantFiltersType>) => void;
}

export const MerchantFiltersControls = ({ filters, onChange }: Props) => {
  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', margin: '1rem 0' }}>
      <Input
        label="Search"
        placeholder="Name, email, ID, business"
        value={filters.search || ''}
        onChange={(e) => onChange({ search: e.target.value, page: 0 })}
        style={{ minWidth: '260px' }}
      />
      <div>
        <label className="input-label">Status</label>
        <select
          className="input"
          value={filters.status || ''}
          onChange={(e) => onChange({ status: e.target.value || undefined, page: 0 })}
        >
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <div>
        <label className="input-label">Sort By</label>
        <select
          className="input"
          value={filters.sortBy || 'createdAt'}
          onChange={(e) => onChange({ sortBy: e.target.value as MerchantFiltersType['sortBy'], page: 0 })}
        >
          <option value="createdAt">Created</option>
          <option value="name">Name</option>
          <option value="email">Email</option>
        </select>
      </div>
      <div>
        <label className="input-label">Order</label>
        <select
          className="input"
          value={filters.sortOrder || 'desc'}
          onChange={(e) => onChange({ sortOrder: e.target.value as MerchantFiltersType['sortOrder'], page: 0 })}
        >
          <option value="asc">Asc</option>
          <option value="desc">Desc</option>
        </select>
      </div>
      <Button variant="outline" onClick={() => onChange({ search: '', status: undefined, page: 0 })}>Clear</Button>
    </div>
  );
};