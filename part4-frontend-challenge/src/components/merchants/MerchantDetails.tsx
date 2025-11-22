import { Card } from '../common/Card';
import { Table } from '../common/Table';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { useMerchantDetails } from '../../hooks/useMerchants';

import { Merchant } from '../../types/merchant';

interface Props {
  merchantId: string;
  onBack: () => void;
  onEdit: (merchant: Merchant) => void;
}

export const MerchantDetails = ({ merchantId, onBack, onEdit }: Props) => {
  const { merchant, stats, transactions, activity, loading, error } = useMerchantDetails(merchantId);

  if (loading) return <LoadingSpinner />;
  if (error) return <div style={{ padding: '1rem', background: '#fee2e2', borderRadius: 8, color: '#991b1b' }}>{error}</div>;
  if (!merchant) return null;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>{merchant.name}</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-outline" onClick={onBack}>Back</button>
          <button className="btn btn-secondary" onClick={() => onEdit(merchant)}>Edit</button>
          <button
            className="btn btn-primary"
            onClick={() => {
              const rows = transactions.map((t) => [t.txnId, t.timestamp, t.amount, t.currency, t.status, `${t.cardType} **** ${t.cardLast4}`]);
              const header = ['ID', 'Timestamp', 'Amount', 'Currency', 'Status', 'Card'];
              const csv = [header, ...rows]
                .map((r) => r.map((v) => String(v).replace(/"/g, '""')).map((v) => `"${v}"`).join(','))
                .join('\n');
              const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `merchant-${merchant.id}-transactions.csv`;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            Export CSV
          </button>
        </div>
      </div>

      <Card title="Profile">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          <div>
            <div><strong>ID:</strong> {merchant.id}</div>
            <div><strong>Email:</strong> {merchant.email}</div>
            <div><strong>Phone:</strong> {merchant.phone}</div>
            <div><strong>Status:</strong> {merchant.status}</div>
          </div>
          <div>
            <div><strong>Business:</strong> {merchant.businessName}</div>
            <div><strong>Reg #:</strong> {merchant.businessRegistrationNumber}</div>
            <div><strong>Address:</strong> {merchant.address.street}, {merchant.address.city}, {merchant.address.state}, {merchant.address.country} {merchant.address.postalCode}</div>
          </div>
        </div>
      </Card>

      {stats && (
        <Card title="Statistics">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div><strong>Total Transactions:</strong> {stats.totalTransactions}</div>
            <div><strong>Total Revenue:</strong> {new Intl.NumberFormat('en-US', { style: 'currency', currency: stats.currency }).format(stats.totalRevenue)}</div>
            <div><strong>Success Rate:</strong> {stats.successRate.toFixed(1)}%</div>
            <div><strong>Avg Amount:</strong> {new Intl.NumberFormat('en-US', { style: 'currency', currency: stats.currency }).format(stats.avgTransactionAmount)}</div>
          </div>
        </Card>
      )}

      <Card title="Recent Transactions">
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Card</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.txnId}>
                <td>{t.txnId}</td>
                <td>{new Date(t.timestamp).toLocaleString()}</td>
                <td>{new Intl.NumberFormat('en-US', { style: 'currency', currency: t.currency }).format(t.amount)}</td>
                <td>{t.status}</td>
                <td>{t.cardType} •••• {t.cardLast4}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      <Card title="Activity Timeline">
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {activity.map((a) => (
            <li key={a.id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 600 }}>{a.type}</div>
              <div>{a.description}</div>
              <div style={{ color: '#64748b' }}>{new Date(a.timestamp).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};