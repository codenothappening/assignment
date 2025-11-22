import { useState } from 'react';
import './Merchants.css';
import { Merchant } from '../types/merchant';
import { MerchantList } from '../components/merchants/MerchantList';
import { MerchantDetails } from '../components/merchants/MerchantDetails';
import { MerchantForm } from '../components/merchants/MerchantForm';

export const Merchants = () => {
  const [view, setView] = useState<'list' | 'details' | 'add' | 'edit'>('list');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);

  const openDetails = (id: string) => {
    setSelectedId(id);
    setView('details');
  };

  const openAdd = () => setView('add');
  const openEdit = () => setView('edit');
  const backToList = () => {
    setView('list');
    setSelectedId(null);
    setSelectedMerchant(null);
  };

  return (
    <main className="container">
      {view === 'list' && <MerchantList onSelect={openDetails} onAddNew={openAdd} />}
      {view === 'details' && selectedId && (
        <MerchantDetails
          merchantId={selectedId}
          onBack={backToList}
          onEdit={(m) => {
            setSelectedMerchant(m);
            openEdit();
          }}
        />
      )}
      {(view === 'add' || view === 'edit') && (
        <MerchantForm initial={view === 'edit' ? selectedMerchant : null} onCancel={backToList} onSaved={() => backToList()} />
      )}
    </main>
  );
};
