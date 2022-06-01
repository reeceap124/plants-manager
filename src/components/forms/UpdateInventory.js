import { useEffect, useState } from 'react'
import { useMediums, useStatus } from '../../context'
import { useUser } from '../../context'
import CreateableSelect from 'react-select/creatable'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Collapse from 'react-bootstrap/Collapse'
import Select from 'react-select'
import DatePicker from 'react-datepicker'
import axios from 'axios'

export default function UpdateInventory(props) {
  const target = props?.update
  const defaultSale = {
    venue_key: '',
    sale_amount: '',
    tax_amount: '',
    inventory_key: target?.id || '',
    sale_date: new Date(),
    shipping_amount: '',
    shipped: false
  }
  const [user] = useUser()
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
  const [venues, setVenues] = useState([])
  const [sale, setSale] = useState(defaultSale)
  useEffect(() => {
    axios
      .get('http://localhost:3300/api/venues/' + user.id)
      .then(({ data }) => setVenues(data))
      .catch((error) => console.error('failed to get venues', error))
  }, [user.id])
  // need to update sold data
  const getItemSale = (id) => {
    if (!id) {
      return
    }
    axios
      .get(`http://localhost:3300/api/sales/inventory_key/${id}`)
      .then(({ data }) => {
        if (!data?.length) {
          return
        }
        setSale({
          ...data[0],
          sale_date: new Date(data[0]?.sale_date || new Date())
        })
      })
      .catch((error) => console.error('failed to get sale', error))
  }

  useEffect(() => {
    getItemSale(target?.id)
  }, [target?.id])

  function handleChanges(e) {
    e.preventDefault()
    setSale({
      ...sale,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!target?.id) return
    const { data } = await axios.patch(
      'http://localhost:3300/api/inventory/' + target.id,
      toUpdate
    )
    if (sale.inventory_key && sale.sale_amount && sale.venue_key) {
      try {
        const { data: saleData } = await axios[sale?.id ? 'put' : 'post'](
          'http://localhost:3300/api/sales',
          sale
        )
        console.log('submitted sale data', saleData)
      } catch (error) {
        console.error('sale data failed', error)
      }
    }
    props.setUserPlants(data[0])
    props.handleClose()
  }
  if (!toUpdate) return null
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

      <Collapse
        in={
          toUpdate.status_key ===
          statuses.filter((s) => s.status === 'sold')[0]?.id
        }
        onExited={() =>
          !sale.id ? setSale({ ...defaultSale }) : getItemSale(target?.id)
        }
      >
        <div>
          <Form.Group className="mb-3" controlId="venue_key">
            <Form.Label>Sale Venue </Form.Label>
            <CreateableSelect
              placeholder={`Select existing or add new`}
              createOptionPosition="first"
              options={venues.map((venue) => ({
                label: venue.name,
                value: venue.id
              }))}
              onChange={({ value }) => {
                setSale({ ...sale, venue_key: value })
              }}
              onCreateOption={async (value) => {
                const { data } = await axios.post(
                  `http://localhost:3300/api/venues`,
                  { name: value, users_key: user.id }
                )
                setSale({ ...sale, venue_key: data.id })
                setVenues([...venues, data])
                return { label: data.name, value: data.id }
              }}
              value={
                venues
                  .filter((v) => v.id === sale.venue_key)
                  .map((v) => ({ label: v?.name, value: v?.id }))[0]
              }
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="sale_amount">
            <Form.Label>Sale Amount </Form.Label>
            <Form.Control
              type="number"
              placeholder="How much did this one bring in?"
              name="sale_amount"
              onChange={handleChanges}
              min={0}
              value={sale?.sale_amount}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="tax_amount">
            <Form.Label>Tax Amount </Form.Label>
            <Form.Control
              type="number"
              placeholder="Government has to have its cut too."
              name="tax_amount"
              onChange={handleChanges}
              min={0}
              value={sale?.tax_amount}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="shipping_amount">
            <Form.Label>Shipping Amount </Form.Label>
            <Form.Control
              type="number"
              placeholder="Shipping costs"
              name="shipping_amount"
              onChange={handleChanges}
              min={0}
              value={sale?.shipping_amount}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="sale_date">
            <Form.Label>Sale Date </Form.Label>
            <DatePicker
              className="form-control"
              selected={sale?.sale_date || new Date()}
              onChange={(value) => setSale({ ...sale, sale_date: value })}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="shipped">
            <Form.Label>Shipped? </Form.Label>
            <Form.Check
              type="checkbox"
              name="shipped"
              onChange={(e) => {
                setSale({ ...sale, shipped: e.target.checked })
              }}
              checked={sale?.shipped || false}
              value="on"
            />
          </Form.Group>
        </div>
      </Collapse>

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
