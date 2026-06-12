import { useMemo, useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { currency, formatDate } from '../lib/utils'

export function MembersTable({
  members,
  title = 'Members directory',
  exportAction,
  allowDelete = false,
  onEdit,
  onDelete,
  showPagination = true,
}) {
  const [globalFilter, setGlobalFilter] = useState('')

  const columns = useMemo(() => {
    const baseColumns = [
      {
        accessorKey: 'full_name',
        header: 'Name',
        cell: (info) => (
          <div>
            <p className='font-medium'>{info.getValue()}</p>
            <p className='text-xs text-muted'>{info.row.original.email}</p>
          </div>
        ),
      },
      {
        accessorKey: 'membership_type',
        header: 'Membership',
        cell: (info) => (
          <span className='rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs'>
            {info.getValue()}
          </span>
        ),
      },
      {
        accessorKey: 'phone_number',
        header: 'Phone',
        cell: (info) => <span className='text-muted'>{info.getValue()}</span>,
      },
      {
        accessorKey: 'payment_status',
        header: 'Payment',
        cell: ({ row }) => <Badge tone={row.original.payment_status}>{row.original.payment_status}</Badge>,
      },
      {
        accessorKey: 'due_amount',
        header: 'Due Amount',
        cell: ({ row }) => (
          <span className={row.original.due_amount > 0 ? 'font-semibold text-danger' : 'text-success'}>
            {currency(row.original.due_amount)}
          </span>
        ),
      },
      {
        accessorKey: 'valid_till',
        header: 'Valid Till',
        cell: ({ row }) => <span className='text-muted'>{formatDate(row.original.valid_till)}</span>,
      },
      {
        accessorKey: 'renewal_date',
        header: 'Renewal',
        cell: ({ row }) => <span className='text-muted'>{formatDate(row.original.renewal_date)}</span>,
      },
    ]

    if (onEdit || allowDelete) {
      baseColumns.push({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex gap-2'>
            {onEdit && (
              <Button
                type='button'
                variant='secondary'
                className='h-9 px-3 text-xs'
                onClick={() => onEdit(row.original)}
              >
                Edit
              </Button>
            )}
            {allowDelete && (
              <Button
                type='button'
                variant='danger'
                className='h-9 px-3 text-xs'
                onClick={() => onDelete?.(row.original)}
              >
                Delete
              </Button>
            )}
          </div>
        ),
      })
    }

    return baseColumns
  }, [allowDelete, onEdit, onDelete])

  const table = useReactTable({
    data: members,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    ...(showPagination ? { getPaginationRowModel: getPaginationRowModel() } : {}),
    globalFilterFn: (row, _columnId, filterValue) => {
      const val = String(filterValue || '').toLowerCase()
      return ['full_name', 'email', 'phone_number', 'membership_type'].some((key) =>
        String(row.original[key] || '').toLowerCase().includes(val)
      )
    },
  })

  return (
    <Card>
      <div className='mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
        <div>
          <p className='text-sm text-muted'>Members table</p>
          <h3 className='text-xl font-semibold'>{title}</h3>
        </div>

        <div className='flex flex-col gap-3 md:flex-row'>
          <Input
            placeholder='Search name, phone, email...'
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className='md:w-72'
          />
          {exportAction && (
            <Button type='button' onClick={exportAction}>
              Export CSV
            </Button>
          )}
        </div>
      </div>

      <div className='data-scroll overflow-x-auto'>
        <table className='min-w-full text-left text-sm'>
          <thead>
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id} className='border-b border-white/10'>
                {group.headers.map((header) => (
                  <th key={header.id} className='px-3 py-3 text-xs font-medium uppercase tracking-wider text-muted'>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className='px-3 py-8 text-center text-muted'>
                  No members found.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className='border-b border-white/5 transition hover:bg-white/[0.03]'>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className='px-3 py-4'>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showPagination && (
        <div className='mt-4 flex items-center justify-between text-sm text-muted'>
          <span>
            Showing {table.getState().pagination.pageIndex * 10 + 1}–
            {Math.min((table.getState().pagination.pageIndex + 1) * 10, members.length)} of {members.length}
          </span>

          <div className='flex gap-2'>
            <Button
              type='button'
              variant='secondary'
              className='h-9 px-3'
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              type='button'
              variant='secondary'
              className='h-9 px-3'
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}