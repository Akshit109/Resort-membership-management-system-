export function downloadMembersTemplate() {
  const rows = [
    [
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
    ],
    [
      'John Doe',
      'Platinum',
      'john@example.com',
      '9876543210',
      '123 Resort Road',
      '2026-01-01',
      '2026-12-31',
      '2026-12-31',
      'Paid',
      '50000',
      '50000',
      '2026-12-01',
      'Example member row',
    ],
  ]

  const csv = rows
    .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(','))
    .join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = 'members-template.csv'
  a.click()

  URL.revokeObjectURL(url)
}