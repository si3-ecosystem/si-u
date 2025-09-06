"use client";

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Copy, Check, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EditUserRolesDialog } from '@/components/organisms/admin/EditUserRolesDialog';
import { DeleteUserDialog } from '@/components/organisms/admin/DeleteUserDialog';
export interface GetColumnsParams {
  copiedWallet: string | null;
  copyToClipboard: (text: string) => void;
  refetch: () => void;
  refetchStats: () => void;
  currentUserRoles?: string[];
}

const truncateWallet = (address: string) => {
  if (!address) return '';
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export function getAdminUserColumns({ copiedWallet, copyToClipboard, refetch, refetchStats, currentUserRoles = [] }: GetColumnsParams): ColumnDef<any>[] {
  return [
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => {
        const email = row.original.email;
        let displayEmail = email;
        const isTemp = email?.includes('@wallet.temp');
        if (isTemp) {
          const emailPrefix = email.split('@')[0];
          displayEmail = emailPrefix.length > 10 ? `${emailPrefix.slice(0, 10)}...` : emailPrefix;
        }
        return (
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-medium" title={email}>{displayEmail}</span>
              {isTemp && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                  TEMP
                </span>
              )}
            </div>
            {row.original.username && (
              <span className="text-sm text-gray-500">@{row.original.username}</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => {
        const name = row.original.name || `${row.original.firstName || ''} ${row.original.lastName || ''}`.trim() || row.original.username || 'No name';
        return <span>{name}</span>;
      },
    },
    {
      accessorKey: 'roles',
      header: 'Roles',
      cell: ({ row }) => {
        const roles: string[] = row.original.roles || ['scholar'];
        const badgeColors: Record<string, string> = {
          admin: 'bg-red-100 text-red-800',
          guide: 'bg-blue-100 text-blue-800',
          scholar: 'bg-green-100 text-green-800',
          partner: 'bg-purple-100 text-purple-800',
          team: 'bg-yellow-100 text-yellow-800',
        };
        return (
          <div className="flex flex-wrap gap-1">
            {roles.map((role: string, index: number) => (
              <span key={`${role}-${index}`} className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${badgeColors[role] || 'bg-gray-100 text-gray-800'}`}>
                {role}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: 'wallet_address',
      header: 'Wallet Address',
      cell: ({ row }) => {
        const walletAddress = row.original.wallet_address || row.original.walletInfo?.address || (row.original.email?.includes('@wallet.temp') ? row.original.email.split('@')[0] : null);
        if (!walletAddress) {
          return <span className="text-gray-400 text-sm">No wallet</span>;
        }
        const truncated = truncateWallet(walletAddress);
        const isRecentlyCopied = copiedWallet === walletAddress;
        return (
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm">{truncated}</span>
            <button onClick={() => copyToClipboard(walletAddress)} className="p-1 hover:bg-gray-100 rounded transition-colors" title={`Copy full address: ${walletAddress}`}>
              {isRecentlyCopied ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3 text-gray-400 hover:text-gray-600" />}
            </button>
          </div>
        );
      },
    },
    {
      accessorKey: 'isVerified',
      header: 'Verified',
      cell: ({ row }) => (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${row.original.isVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {row.original.isVerified ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      accessorKey: 'scholarsNewsletter',
      header: 'Scholars NL',
      cell: ({ row }) => (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${row.original.scholarsNewsletter ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {row.original.scholarsNewsletter ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      accessorKey: 'partnerNewsletter',
      header: 'Partners NL',
      cell: ({ row }) => (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${row.original.partnerNewsletter ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {row.original.partnerNewsletter ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      accessorKey: 'lastLogin',
      header: 'Last Login',
      cell: ({ row }) => (row.original.lastLogin ? new Date(row.original.lastLogin).toLocaleDateString() : 'Never'),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => {
        const date = row.original.createdAt || row.original.dateJoined;
        return date ? new Date(date).toLocaleDateString() : 'Unknown';
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const id = row.original._id || row.original.id;
        const roles = row.original.roles || ['scholar'];
        const email = row.original.email;
        const name = row.original.name || `${row.original.firstName || ''} ${row.original.lastName || ''}`.trim() || row.original.username || 'Unknown User';

        // Get current user's roles for access control
        const isCurrentUserAdmin = currentUserRoles.includes('admin');
        const isCurrentUserTeam = currentUserRoles.includes('team');

        // Only admin users can edit/delete, team users can only view
        const canEdit = isCurrentUserAdmin;
        const canDelete = isCurrentUserAdmin;

        if (!canEdit && !canDelete) {
          return (
            <span className="text-sm text-gray-500">View Only</span>
          );
        }

        return (
          <div className="flex items-center gap-2">
            {canEdit && (
              <EditUserRolesDialog
                userId={id}
                currentRoles={roles}
                onUpdated={() => { refetch(); refetchStats(); }}
                trigger={
                  <Button variant="outline" size="sm" className="h-8 px-2">
                    <Pencil className="h-3.5 w-3.5 mr-1" /> Roles
                  </Button>
                }
              />
            )}
            {canDelete && (
              <DeleteUserDialog
                userId={id}
                userEmail={email}
                userName={name}
                onDeleted={() => { refetch(); refetchStats(); }}
                trigger={
                  <Button variant="outline" size="sm" className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                  </Button>
                }
              />
            )}
          </div>
        );
      },
    },
  ];
}

