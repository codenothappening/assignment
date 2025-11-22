import { useEffect, useState } from 'react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Merchant, MerchantFormData, ValidationErrors } from '../../types/merchant';
import { useMerchantForm } from '../../hooks/useMerchants';

interface Props {
  initial?: Merchant | null;
  onCancel: () => void;
  onSaved: (merchant: Merchant) => void;
}

export const MerchantForm = ({ initial, onCancel, onSaved }: Props) => {
  const [form, setForm] = useState<MerchantFormData>({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    businessRegistrationNumber: '',
    street: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    status: 'active',
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const { submitting, error, success, createNewMerchant, updateExistingMerchant, resetState } = useMerchantForm();

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name,
        email: initial.email,
        phone: initial.phone,
        businessName: initial.businessName,
        businessRegistrationNumber: initial.businessRegistrationNumber,
        street: initial.address.street,
        city: initial.address.city,
        state: initial.address.state,
        country: initial.address.country,
        postalCode: initial.address.postalCode,
        status: initial.status === 'inactive' ? 'inactive' : 'active',
      });
    }
  }, [initial]);

  const validate = (): boolean => {
    const next: ValidationErrors = {};
    if (!form.name) next.name = 'Name is required';
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Valid email required';
    if (!form.phone) next.phone = 'Phone is required';
    if (!form.businessName) next.businessName = 'Business name is required';
    if (!form.businessRegistrationNumber) next.businessRegistrationNumber = 'Registration number required';
    if (!form.street) next.street = 'Street is required';
    if (!form.city) next.city = 'City is required';
    if (!form.state) next.state = 'State is required';
    if (!form.country) next.country = 'Country is required';
    if (!form.postalCode) next.postalCode = 'Postal code is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) return;
    const ok = window.confirm(initial ? 'Save changes to merchant?' : 'Create new merchant?');
    if (!ok) return;
    const saved = initial
      ? await updateExistingMerchant(initial.id, form)
      : await createNewMerchant(form);
    if (saved) {
      onSaved(saved);
      resetState();
      if (!initial) {
        setForm({
          name: '',
          email: '',
          phone: '',
          businessName: '',
          businessRegistrationNumber: '',
          street: '',
          city: '',
          state: '',
          country: '',
          postalCode: '',
          status: 'active',
        });
      }
    }
  };

  return (
    <Card title={initial ? 'Edit Merchant' : 'Add Merchant'}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        <Input label="Name" value={form.name} error={errors.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input label="Email" value={form.email} error={errors.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Input label="Phone" value={form.phone} error={errors.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <Input label="Business Name" value={form.businessName} error={errors.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} />
        <Input label="Registration Number" value={form.businessRegistrationNumber} error={errors.businessRegistrationNumber} onChange={(e) => setForm({ ...form, businessRegistrationNumber: e.target.value })} />
        <Input label="Street" value={form.street} error={errors.street} onChange={(e) => setForm({ ...form, street: e.target.value })} />
        <Input label="City" value={form.city} error={errors.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        <Input label="State" value={form.state} error={errors.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
        <Input label="Country" value={form.country} error={errors.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
        <Input label="Postal Code" value={form.postalCode} error={errors.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} />
        <div>
          <label className="input-label">Status</label>
          <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as any })}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {error && (
        <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#fee2e2', borderRadius: 8, color: '#991b1b' }}>{error}</div>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        <Button onClick={onSubmit} disabled={submitting}>{initial ? 'Save Changes' : 'Create Merchant'}</Button>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
      {success && <div style={{ marginTop: '0.75rem', color: '#166534' }}>Success</div>}
    </Card>
  );
};