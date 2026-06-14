import { Badge } from '@/components/ui/Badge';
import type { EscrowStatus } from '@/types';

/**
 * EscrowStatusBadge — maps EscrowStatus values to the Badge component.
 * Thin wrapper so callers don't need to remember which status maps to which colour.
 */

const ESCROW_LABELS: Record<EscrowStatus, string> = {
  awaiting_funds: 'Awaiting Funds',
  funds_held:     'Funds Held',
  released:       'Released',
  refunded:       'Refunded',
  disputed:       'Disputed',
};

interface EscrowStatusBadgeProps {
  status: EscrowStatus;
  className?: string;
}

export function EscrowStatusBadge({ status, className }: EscrowStatusBadgeProps) {
  return (
    <Badge
      status={status}
      label={ESCROW_LABELS[status]}
      className={className}
    />
  );
}
