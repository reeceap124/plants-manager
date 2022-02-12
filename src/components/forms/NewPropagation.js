import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Select from 'react-select'
import DatePicker from 'react-datepicker'
import { useStatus, useMediums } from '../../context'
import axios from 'axios'

export default function NewPropagation(props) {
  const [toProp, setToProp] = props.propState
  const [statuses] = useStatus()
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
  const [count, setCount] = useState(0)

  if (!toProp) return null

  async function handleSubmit(e) {
    e.preventDefault()
    const { parent, plants_key, status_key, users_key, medium_key } = plantVals
    if (!(parent && plants_key && status_key && users_key && medium_key)) {
      return console.error('Need valid info to submit')
    }
    const subArr = new Array(parseInt(count)).fill(0)
    console.log({ subArr })
    const submittedResults = await Promise.all(
      subArr.map(async (val) => {
        const { data } = await axios.post(
          'http://localhost:3300/api/inventory',
          {
            plant: plantVals
          }
        )
        return data
      })
    )
    console.log('submitted results here', submittedResults)
    props.setUserPlants(submittedResults)
    setToProp(undefined)
    props.handleClose(undefined)
  }

  return (
    <Form onSubmit={handleSubmit}>
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
        <Form.Label>Propagation Date: </Form.Label>
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

      <Form.Group className="mb-3" controlId="count">
        <Form.Label>Count: </Form.Label>
        <Form.Control
          type="number"
          placeholder="Number propagated?"
          name="count"
          onChange={(e) => {
            setCount(e.target.value)
          }}
          min={0}
          max={20}
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  )
}
