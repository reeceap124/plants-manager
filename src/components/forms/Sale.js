import React, { useState, useEffect } from 'react'
import { useUser } from '../../context'
import Form from 'react-bootstrap/Form'
// import Button from 'react-bootstrap/Button'
import DatePicker from 'react-datepicker'
import CreateableSelect from 'react-select/creatable'
import axios from 'axios'

export default function Sales(props) {
  const [user] = useUser()
  const [saleData, setSaleData] = useState({
    venue_key: undefined,
    sale_amount: undefined,
    tax_amount: undefined,
    inventory_key: props?.inventory_key,
    sale_date: new Date(),
    shipping_amount: 0,
    shipped: false
  })
  const sale = props.sale || saleData
  const setSale = props.setSale || setSaleData
  const [venues, setVenues] = useState([])
  useEffect(() => {
    axios
      .get('http://localhost:3300/api/venues/' + user.id)
      .then(({ data }) => setVenues(data))
      .catch((error) => console.error('failed to get venues', error))
  }, [user.id])

  useEffect(() => {
    console.log('updating sale info')
    setSale(sale)
  }, [sale, setSale])

  function handleChanges(e) {
    setSale({
      ...sale,
      [e.target.name]: e.target.value
    })
  }

  return (
    <>
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
            setVenues([...venues, data])
            return { label: data.name, value: data.id }
          }}
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
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="sale_date">
        <Form.Label>Sale Date </Form.Label>
        <DatePicker
          className="form-control"
          selected={sale.sale_date}
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
          checked={sale.shipped}
        />
      </Form.Group>
    </>
  )
}
