import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import axios from 'axios'

export default function NewPlant(props) {
  const [plant, setPlant] = useState({
    common_name: props.plant.common_name,
    scientific_name: props.plant.scientific_name
  })
  const handleChange = (e) => {
    setPlant({ ...plant, [e.target.name]: e.target.value })
  }

  const submitPlant = async (e) => {
    e.preventDefault()
    const newPlant = await axios.post(`http://localhost:3300/api/plants`, plant)
    if (props.handleAdded) {
      props.handleAdded(newPlant.data)
    }
    props?.handleClose()
  }

  return (
    <Form onSubmit={submitPlant}>
      <Form.Group className="mb-3" controlId="common_name">
        <Form.Label>Common Name: </Form.Label>
        <Form.Control
          type="text"
          placeholder="What do normal people call it?"
          name="common_name"
          value={plant.common_name}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="scientific_name">
        <Form.Label>Scientific Name: </Form.Label>
        <Form.Control
          type="text"
          placeholder="The nerd name"
          name="scientific_name"
          value={plant.scientific_name}
          onChange={handleChange}
        />
      </Form.Group>

      <Button type="submit">Add plant</Button>
    </Form>
  )
}
