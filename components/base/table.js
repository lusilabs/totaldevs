import { useState, useEffect } from 'react'
import { useMediaQuery } from '@/utils/hooks'

const DesktopLayout = ({ getOrderedData, onSelect, setSelectedRow, columns, selectedRow, renderField }) => {
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

const MobileLayout = ({ getOrderedData, onSelect, setSelectedRow, columns, selectedRow, renderField }) => {
  return (
    <div className='max-w-2xl mx-auto py-4 px-4 sm:py-8 sm:px-6 lg:max-w-7xl lg:px-8'>
      <div className='mt-8 grid grid-cols-2 gap-y-2 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8'>
        {getOrderedData().map(row => (
          <div
            key={row.id} onClick={() => {
              if (onSelect) {
                onSelect(row)
                setSelectedRow(row)
              }
            }}
            className={`p-4 bg-white rounded-xl shadow-lg ${onSelect ? 'cursor-pointer' : ''} ${row.id === selectedRow?.id ? 'bg-gray-300' : ''}`}
          >
            {
              columns.map((name) => (
                <div key={name} className='flex '>
                  <span className='mr-1 text-gray-500'>{name}</span>{renderField(row, name)}
                </div>
              )
              )
            }
          </div>
        ))}
      </div>
    </div>
  )
}

export const Table = ({ columns, data, renderMapping = {}, getterMapping = {}, onSelect, orderBy, type, checkScreen, CustomMovileView }) => {
  const [selectedRow, setSelectedRow] = useState()
  const mediaQuery = useMediaQuery()

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

  const layoutProps = { getOrderedData, onSelect, setSelectedRow, columns, selectedRow, renderField }
  if (checkScreen && mediaQuery) {
    return CustomMovileView ? <CustomMovileView {...layoutProps} /> : <MobileLayout {...layoutProps} />
  } else {
    return <DesktopLayout {...layoutProps} />
  }
}
