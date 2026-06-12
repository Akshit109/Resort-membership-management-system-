import { useState } from 'react'
import { toast } from 'sonner'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { parseMemberCsv } from '../utils/csv'
import { downloadMembersTemplate } from '../utils/downloadMembersTemplate'
import { importMembersFromCsvRows } from '../services/memberService'

export default function ImportsPage() {
  const [allRows, setAllRows] = useState([])
  const [preview, setPreview] = useState([])
  const [fileName, setFileName] = useState('')
  const [importing, setImporting] = useState(false)

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const rows = await parseMemberCsv(file)
      if (!rows.length) {
        toast.error('CSV file is empty or invalid.')
        return
      }

      setAllRows(rows)
      setPreview(rows.slice(0, 10))
      setFileName(file.name)
      toast.success(`Loaded ${rows.length} rows from ${file.name}`)
    } catch {
      toast.error('Failed to parse CSV file.')
    }
  }

  const handleImport = async () => {
    if (!allRows.length) return

    setImporting(true)
    try {
      await importMembersFromCsvRows(allRows)
      toast.success(`${allRows.length} members imported successfully!`)
      setAllRows([])
      setPreview([])
      setFileName('')
    } catch (err) {
      toast.error(err.message || 'Failed to import members.')
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between gap-3'>
        <div>
          <p className='text-xs uppercase tracking-[0.24em] text-accent/80'>Data management</p>
          <h2 className='font-display text-2xl font-bold'>CSV import system</h2>
        </div>
        <Button type='button' variant='secondary' onClick={downloadMembersTemplate}>
          Download CSV Template
        </Button>
      </div>

      <Card>
        <p className='text-sm text-muted'>Bulk import members</p>
        <h3 className='mb-4 text-lg font-semibold'>Upload CSV file</h3>

        <label className='flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-accent/30 bg-white/[0.02] p-10 transition hover:border-accent/60 hover:bg-accent/5'>
          <div className='flex h-14 w-14 items-center justify-center rounded-2xl border border-accent/20 bg-accent/10'>
            <span className='text-2xl'>📂</span>
          </div>
          <div className='text-center'>
            <p className='font-medium'>{fileName || 'Click to select a CSV file'}</p>
            <p className='mt-1 text-sm text-muted'>Supports .csv files with member data</p>
          </div>
          <Input type='file' accept='.csv' className='hidden' onChange={handleFile} />
        </label>

        <div className='mt-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4'>
          <p className='mb-2 text-sm font-medium text-accent'>Expected CSV columns:</p>
          <div className='flex flex-wrap gap-2'>
            {[
              'full_name',
              'membership_type',
              'email',
              'phone_number',
              'address',
              'membership_start_date',
              'membership_end_date',
              'valid_till',
              'payment_status',
              'amount_paid',
              'total_amount',
              'renewal_date',
              'notes',
            ].map((col) => (
              <span key={col} className='rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-muted'>
                {col}
              </span>
            ))}
          </div>
        </div>
      </Card>

      {preview.length > 0 && (
        <Card>
          <div className='mb-4 flex items-center justify-between'>
            <div>
              <p className='text-sm text-muted'>Import preview</p>
              <h3 className='text-lg font-semibold'>{allRows.length} rows ready to import</h3>
            </div>
            <div className='flex gap-3'>
              <Button
                variant='secondary'
                onClick={() => {
                  setAllRows([])
                  setPreview([])
                  setFileName('')
                }}
              >
                Clear
              </Button>
              <Button onClick={handleImport} disabled={importing}>
                {importing ? 'Importing...' : 'Confirm Import'}
              </Button>
            </div>
          </div>

          <div className='data-scroll overflow-x-auto'>
            <table className='min-w-full text-left text-sm'>
              <thead>
                <tr className='border-b border-white/10'>
                  {Object.keys(preview[0]).map((key) => (
                    <th key={key} className='px-3 py-2 text-xs font-medium uppercase tracking-wider text-muted'>
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.map((row, i) => (
                  <tr key={i} className='border-b border-white/5 hover:bg-white/[0.03]'>
                    {Object.values(row).map((val, j) => (
                      <td key={j} className='px-3 py-3 text-muted'>
                        {String(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}