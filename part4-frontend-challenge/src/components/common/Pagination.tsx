import { Button } from './Button';

interface Props {
  page: number;
  size: number;
  totalElements: number;
  onPageChange: (next: number) => void;
}

export const Pagination = ({ page, size, totalElements, onPageChange }: Props) => {
  const totalPages = Math.max(1, Math.ceil(totalElements / size));
  const canPrev = page > 0;
  const canNext = page + 1 < totalPages;
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        Page {page + 1} of {totalPages} • {totalElements} total
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Button variant="outline" disabled={!canPrev} onClick={() => onPageChange(page - 1)}>Prev</Button>
        <Button variant="outline" disabled={!canNext} onClick={() => onPageChange(page + 1)}>Next</Button>
      </div>
    </div>
  );
};