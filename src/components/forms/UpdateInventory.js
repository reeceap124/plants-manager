import { useState } from 'react'
import { useMediums, useStatus } from '../../context'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Select from 'react-select'
import DatePicker from 'react-datepicker'
import axios from 'axios'

export default function UpdateInventory(props) {
  const target = props?.update

  const [toUpdate, setToUpdate] = useState({
    status_key: target?.status_key,
    medium_key: target?.medium_key,
    cost: target?.cost,
    notes: target?.notes,
    acquired_date: target?.acquired_date,
    acquired_from: target?.acquired_from
  })
  const [statuses] = useStatus()
  const mediums = useMediums()

  if (!toUpdate) return null
  console.log({ toUpdate })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!target?.id) return
    console.log('submitted update')
    const { data } = await axios.patch(
      'http://localhost:3300/api/inventory/' + target.id,
      toUpdate
    )
    props.setUserPlants(data[0])
    props.handleClose()
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="status_key">
        <Form.Label>Status </Form.Label>
        <Select
          options={statuses.map((status) => ({
            label: status.status,
            value: status.id
          }))}
          onChange={({ value }) =>
            setToUpdate({ ...toUpdate, status_key: value })
          }
          value={
            statuses
              .filter((s) => s.id === toUpdate?.status_key)
              .map((s) => ({ label: s.status, value: s.id }))[0]
          }
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="medium_key">
        <Form.Label>Growing Medium </Form.Label>
        <Select
          options={mediums.map(({ medium, id }) => ({
            label: medium,
            value: id
          }))}
          onChange={({ value }) =>
            setToUpdate({ ...toUpdate, medium_key: value })
          }
          value={
            mediums
              .filter((m) => m.id === toUpdate?.medium_key)
              .map((m) => ({ label: m.medium, value: m.id }))[0]
          }
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="acquired_date">
        <Form.Label>Date </Form.Label>
        <DatePicker
          className="form-control"
          selected={new Date(toUpdate?.acquired_date)}
          onChange={(value) =>
            setToUpdate({ ...toUpdate, acquired_date: value })
          }
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="cost">
        <Form.Label>Cost </Form.Label>
        <Form.Control
          type="number"
          placeholder="What's the damage?"
          name="cost"
          onChange={(e) => {
            setToUpdate({ ...toUpdate, cost: parseInt(e.target.value) })
          }}
          min={0}
          value={toUpdate?.cost}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="acquired_from">
        <Form.Label>From </Form.Label>
        <Form.Control
          placeholder="Any notes?"
          name="acquired_from"
          rows={3}
          onChange={(e) =>
            setToUpdate({ ...toUpdate, acquired_from: e.target.value })
          }
          value={toUpdate?.acquired_from || ''}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="notes">
        <Form.Label>Notes </Form.Label>
        <Form.Control
          as="textarea"
          placeholder="Any notes?"
          name="notes"
          rows={3}
          onChange={(e) => setToUpdate({ ...toUpdate, notes: e.target.value })}
          value={toUpdate?.notes || ''}
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  )
}
