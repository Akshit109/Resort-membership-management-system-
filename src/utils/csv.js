import Papa from 'papaparse'

export function exportCsv(filename, rows) {
  const csv = Papa.unparse(rows, {
    header: true,
    quotes: true,
    newline: '\r\n',
    escapeFormulae: true,
  })

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(link.href)
}

const normalizeHeader = (header = '') =>
  header
    .trim()
    .replace(/\ufeff/g, '')
    .toLowerCase()

export async function parseMemberCsv(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: 'greedy',
      transformHeader: normalizeHeader,
      complete: (results) => {
        if (results.errors?.length) {
          reject(new Error(results.errors[0].message))
          return
        }

        const rows = results.data
          .map((row) => ({
            full_name: String(row.full_name ?? row.fullname ?? row.name ?? '').trim(),
            membership_type: String(row.membership_type ?? row.membershiptype ?? '').trim(),
            email: String(row.email ?? '').trim(),
            phone_number: String(row.phone_number ?? row.phonenumber ?? row.phone ?? '').trim(),
            address: String(row.address ?? '').trim(),
            membership_start_date: String(row.membership_start_date ?? '').trim(),
            membership_end_date: String(row.membership_end_date ?? '').trim(),
            valid_till: String(row.valid_till ?? '').trim(),
            payment_status: String(row.payment_status ?? '').trim(),
            amount_paid: String(row.amount_paid ?? '').trim(),
            total_amount: String(row.total_amount ?? '').trim(),
            renewal_date: String(row.renewal_date ?? '').trim(),
            notes: String(row.notes ?? '').trim(),
          }))
          .filter((row) =>
            Object.values(row).some((value) => value !== '')
          )

        resolve(rows)
      },
      error: (error) => reject(error),
    })
  })
}