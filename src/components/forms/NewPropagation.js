import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Select from 'react-select'
import DatePicker from 'react-datepicker'
import { useStatus, useMediums } from '../../context'

export default function NewPropagation(props) {
  const [toProp, setToProp] = props.propState
  const [statuses] = useStatus()
  console.log({ statuses })
  const mediums = useMediums()
  const [plantVals, setPlantVals] = useState({
    parent: toProp?.id,
    plants_key: toProp?.plants_key,
    status_key: undefined,
    cost: 0,
    acquired_from: 'propagation',
    acquired_date: new Date(),
    users_key: toProp?.users_key,
    medium_key: undefined
  })
  console.log('new props', toProp)
  if (!toProp) return null
  return (
    <Form>
      <p>
        Plant: {toProp.common_name} / {toProp.scientific_name}
      </p>
      <p>Mother Id: {toProp.id}</p>
      <Form.Group className="mb-3" controlId="plants_key"></Form.Group>

      <Form.Group className="mb-3" controlId="status_key">
        <Form.Label>Status: </Form.Label>
        <Select
          options={statuses.map((status) => ({
            label: status.status,
            value: status.id
          }))}
          onChange={({ value }) =>
            setPlantVals({ ...plantVals, status_key: value })
          }
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="acquired_date">
        <Form.Label>Acquired Date: </Form.Label>
        <DatePicker
          className="form-control"
          selected={plantVals.acquired_date}
          onChange={(value) =>
            setPlantVals({ ...plantVals, acquired_date: value })
          }
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="medium_key">
        <Form.Label>Growing Medium: </Form.Label>
        <Select
          options={mediums.map(({ medium, id }) => ({
            label: medium,
            value: id
          }))}
          onChange={({ value }) =>
            setPlantVals({ ...plantVals, medium_key: value })
          }
        />
      </Form.Group>
    </Form>
  )
}
