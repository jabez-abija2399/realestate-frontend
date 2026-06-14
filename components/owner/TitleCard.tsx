'use client';

import * as React from 'react';
import { FileCheck2, ExternalLink, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { HashDisplay } from '@/components/ui/HashDisplay';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { appConfig } from '@/config/app.config';
import { cn } from '@/lib/utils';

/**
 * TitleCard — displays a digital property title / NFT.
 * The "Mint Title" action is delegated to onMint so the contract
 * call lives in features/titles/services, not in this component.
 */

export interface TitleData {
  id: string;
  propertyId: string;
  propertyTitle: string;
  tokenId?: string;
  contractAddress?: string;
  status: 'pending' | 'minted' | 'failed';
  documentUrl?: string;
  createdAt: string;
}

interface TitleCardProps {
  title: TitleData;
  onMint?: (titleId: string) => void;
  isMinting?: boolean;
  className?: string;
}

export function TitleCard({ title, onMint, isMinting, className }: TitleCardProps) {
  const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? 11155111);
  const isMinted = title.status === 'minted' && !!title.tokenId;

  return (
    <Card className={cn('card-hover', className)}>
      <CardContent className="pt-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                'rounded-lg p-2',
                isMinted ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'
              )}
            >
              <FileCheck2 size={18} aria-hidden="true" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 leading-snug line-clamp-1">
                {title.propertyTitle}
              </p>
              <time
                dateTime={title.createdAt}
                className="text-xs text-gray-400"
              >
                {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(
                  new Date(title.createdAt)
                )}
              </time>
            </div>
          </div>
          <Badge
            status={
              title.status === 'minted' ? 'verified'
              : title.status === 'failed' ? 'flagged'
              : 'pending'
            }
            label={
              title.status === 'minted' ? 'Minted'
              : title.status === 'failed' ? 'Failed'
              : 'Pending'
            }
          />
        </div>

        {/* On-chain data */}
        {isMinted && (
          <div className="mt-4 rounded-lg bg-slate-950 p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-slate-400">Token ID</span>
              <span className="font-mono text-xs text-slate-200">#{title.tokenId}</span>
            </div>
            {title.contractAddress && (
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-slate-400">Contract</span>
                <HashDisplay
                  hash={title.contractAddress}
                  explorerUrl={appConfig.blockchain.addressPath(chainId, title.contractAddress)}
                />
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 flex items-center gap-2">
          {!isMinted && title.status !== 'failed' && onMint && (
            <Button
              size="sm"
              onClick={() => onMint(title.id)}
              loading={isMinting}
              disabled={isMinting}
              className="flex-1"
            >
              {isMinting ? 'Minting…' : 'Mint Digital Title'}
            </Button>
          )}

          {title.documentUrl && (
            <Button variant="outline" size="sm" asChild>
              <a
                href={title.documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View title document"
              >
                <ExternalLink size={14} />
                View Doc
              </a>
            </Button>
          )}

          {isMinting && (
            <Loader2 size={16} className="animate-spin text-emerald-500" aria-hidden="true" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
