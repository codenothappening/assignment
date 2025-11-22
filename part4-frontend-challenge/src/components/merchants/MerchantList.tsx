import { Table } from '../common/Table';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { useMerchants } from '../../hooks/useMerchants';
import { MerchantFilters } from '../../types/merchant';
import { MerchantFiltersControls as Filters } from './MerchantFilters';

interface Props {
  onSelect: (merchantId: string) => void;
  onAddNew: () => void;
}

export const MerchantList = ({ onSelect, onAddNew }: Props) => {
  const { merchants, pagination, loading, error, filters, setFilters } = useMerchants();

  const changePage = (nextPage: number) => {
    if (!pagination) return;
    if (nextPage < 0 || nextPage >= pagination.totalPages) return;
    setFilters({ page: nextPage });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Merchants</h2>
        <Button onClick={onAddNew}>Add Merchant</Button>
      </div>

      <Filters filters={filters as MerchantFilters} onChange={setFilters} />

      {loading && <LoadingSpinner />}
      {error && (
        <div style={{ padding: '1rem', background: '#fee2e2', borderRadius: 8, color: '#991b1b' }}>{error}</div>
      )}

      {!loading && !error && (
        <Card>
          <Table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {merchants.map((m) => (
                <tr key={m.id}>
                  <td>{m.id}</td>
                  <td>{m.name}</td>
                  <td>{m.email}</td>
                  <td>{m.phone}</td>
                  <td>
                    <span
                      style={{
                        padding: '4px 8px',
                        borderRadius: 999,
                        background: m.status === 'active' ? '#dcfce7' : '#fee2e2',
                        color: m.status === 'active' ? '#166534' : '#991b1b',
                        fontSize: 12,
                      }}
                    >
                      {m.status}
                    </span>
                  </td>
                  <td>{new Date(m.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Button size="small" variant="secondary" onClick={() => onSelect(m.id)}>View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {pagination && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
              <div>
                Page {pagination.page + 1} of {pagination.totalPages} • {pagination.totalElements} total
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button variant="outline" onClick={() => changePage(pagination.page - 1)}>Prev</Button>
                <Button variant="outline" onClick={() => changePage(pagination.page + 1)}>Next</Button>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};