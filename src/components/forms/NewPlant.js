import { useState } from 'react'
import { useUser } from '../../context/UserContext'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

export default function NewInventory() {
  const [user] = useUser()
  const [inventoryItem, setInventoryItem] = useState({
    plants_key: undefined,
    status_key: undefined,
    cost: undefined,
    acquired_from: undefined,
    acquired_date: new Date(),
    user_key: user.id
  })
  const handleChanges = (e) => {
    console.log(e, inventoryItem)
    //need to add some date handling stuff here.
    setInventoryItem({ ...inventoryItem, [e.target.name]: e.target.value })
  }
  return (
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Acquired from: </Form.Label>
        <Form.Control
          type="text"
          placeholder="Where'd that come from?"
          name="acquired_from"
          onChange={handleChanges}
          value={inventoryItem.acquired_from}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Acquired Date: </Form.Label>
        <Form.Control
          type="date"
          placeholder="When did this beauty join the collection?"
          name="acquired_date"
          onChange={handleChanges}
          value={inventoryItem.acquired_date}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Cost: </Form.Label>
        <Form.Control
          type="number"
          placeholder="What's the damage?"
          name="cost"
          onChange={handleChanges}
          value={inventoryItem.cost}
        />
      </Form.Group>

      {/* <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check type="checkbox" label="Check me out" />
      </Form.Group> */}
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  )
}
