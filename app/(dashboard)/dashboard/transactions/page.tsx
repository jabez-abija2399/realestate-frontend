import type { Metadata } from 'next';
import { TransactionsClient } from './_components/TransactionsClient';

export const metadata: Metadata = { title: 'Transactions' };

export default function TransactionsPage() {
  return <TransactionsClient />;
}
