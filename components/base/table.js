import { useState, useEffect } from 'react'

export const Table = ({ columns, data, renderMapping = {}, getterMapping = {}, onSelect, orderBy, type }) => {
  const [selectedRow, setSelectedRow] = useState()

  const renderField = (row, name) => {
    const value = getFieldValue(row, name)
    return renderMapping[name] ? renderMapping[name](value) : value
  }

  const getFieldValue = (row, name) => {
    return getterMapping[name] ? getterMapping[name](row) : row[name]
  }

  const getOrderedData = () => {
    if (orderBy) {
      const direction = orderBy.indexOf('-') === 0 ? -1 : 1
      return [...data].sort(
        (a, b) => direction * getFieldValue(a, orderBy.replace('-', '')) - direction * getFieldValue(b, orderBy.replace('-', ''))
      )
    }
    return data
  }

  useEffect(() => {
    setSelectedRow(null)
  }, [type])

  return (
    <table className='min-w-full divide-y divide-gray-200'>
      <thead className='bg-gray-50'>
        <tr>
          {
            columns.map((name) => (
              <th
                key={name}
                scope='col'
                className='px-6 py-3 max-w-md text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
              >
                {name}
              </th>
            ))
           }
        </tr>
      </thead>
      <tbody className='bg-white divide-y divide-gray-200'>
        {getOrderedData().map(row => (
          <tr
            key={row.id} onClick={() => {
              if (onSelect) {
                onSelect(row)
                setSelectedRow(row)
              }
            }}
            className={`${onSelect ? 'cursor-pointer' : ''} ${row.id === selectedRow?.id ? 'bg-gray-300' : ''}`}
          >
            {
            columns.map((name) => (
              <td className='px-6 py-4' key={name}>
                <div className='ml-4'>
                  <div className='text-sm font-medium text-gray-900'>
                    {
                    renderField(row, name)
                  }
                  </div>
                </div>
              </td>)
            )
            }
          </tr>
        ))}
      </tbody>
    </table>
  )
}
