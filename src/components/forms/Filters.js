import { useState } from 'react'
import { usePlants, useStatus, useMediums } from '../../context'
import Form from 'react-bootstrap/Form'

export default function Filters(props) {
  const [appliedFilters, setAppliedFilters] = props.applied
  const [plants] = usePlants()
  const [statuses] = useStatus()
  const mediums = useMediums()
  const [search, setSearch] = useState('')
  const hasFilterValue = (filter, value) =>
    appliedFilters[filter].includes(value)
  const setFilterValue = (filter, value) => {
    let toSet
    if (hasFilterValue(filter, value)) {
      toSet = appliedFilters[filter].filter((val) => val !== value)
      return setAppliedFilters({ ...appliedFilters, [filter]: toSet })
    }
    return setAppliedFilters({
      ...appliedFilters,
      [filter]: [...appliedFilters[filter], value]
    })
  }
  let timer
  return (
    <div style={{ padding: '1rem' }}>
      <div className="">
        <h2>Plants:</h2>
        <Form.Control
          type="text"
          placeholder="Search..."
          onChange={(e) => {
            clearTimeout(timer)
            timer = setTimeout(
              () => setSearch(e.target.value.toLowerCase()),
              500
            )
          }}
        />
        <div className="filterCategory filterCategory__limitHeight">
          {plants
            .filter(
              (p) =>
                p.common_name?.toLowerCase()?.includes(search) ||
                p.scientific_name?.toLowerCase()?.includes(search)
            )
            .map((p) => {
              return (
                <div className="filterItem">
                  <Form.Check
                    type="switch"
                    checked={hasFilterValue('plants_key', p.id)}
                    onChange={() => setFilterValue('plants_key', p.id)}
                  />
                  <p>
                    {p.common_name}
                    <br />
                    {p.scientific_name}
                  </p>
                </div>
              )
            })}
        </div>
      </div>

      <div>
        <h2>Mediums:</h2>
        <div className="filterCategory">
          {mediums.map((m) => {
            return (
              <div className="filterItem">
                <Form.Check
                  type="switch"
                  checked={hasFilterValue('medium_key', m.id)}
                  onChange={() => setFilterValue('medium_key', m.id)}
                />
                <p>{m.medium}</p>
              </div>
            )
          })}
        </div>
      </div>

      <div>
        <h2>Statuses:</h2>
        <div className="filterCategory">
          {statuses.map((s) => {
            return (
              <div className="filterItem">
                <Form.Check
                  type="switch"
                  checked={hasFilterValue('status_key', s.id)}
                  onChange={() => setFilterValue('status_key', s.id)}
                />
                <p>{s.status}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
