export interface Lead {
  id: string;
  listingId: string;
  listingTitle: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  status: 'active' | 'pending' | 'closed' | 'expired';
  createdAt: string;
}
