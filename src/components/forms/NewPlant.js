import { useState } from 'react'
import { useUser } from '../../context/UserContext'
import { useStatus } from '../../context/StatusContext'
import { usePlants } from '../../context/PlantsContext'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Select from 'react-select'

export default function NewInventory({ userPlants }) {
  console.log('user plants', userPlants)
  const [user] = useUser()
  const [statuses] = useStatus()
  const [plants] = usePlants()
  const [plantLabel, setPlantLabel] = useState('common_name')
  const [inventoryItem, setInventoryItem] = useState({
    plants_key: undefined,
    status_key: undefined,
    cost: undefined,
    acquired_from: undefined,
    acquired_date: new Date(),
    user_key: user.id
  })
  const [ancestry, setAncestry] = useState(undefined)
  const [propagation, setPropagation] = useState(true)
  const handleChanges = (e) => {
    //need to add some date handling stuff here.
    setInventoryItem({ ...inventoryItem, [e.target.name]: e.target.value })
  }
  const handleLabel = () => {
    plantLabel === 'common_name'
      ? setPlantLabel('scientific_name')
      : setPlantLabel('common_name')
  }
  return (
    // TODO: handle changing selects based between plant and user/propagation issue (doesn't update plant when selecting mother)
    // TODO: handle date differences
    // TODO: handle non-propagations (just disable mother select)
    // TODO: Collapse mother select when not using.

    <Form>
      <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Select
          options={plants.map((plant) => ({
            label: plant[plantLabel],
            value: plant.id
          }))}
          onChange={({ value }) => {
            setInventoryItem({ ...inventoryItem, plants_key: value })
          }}
        />
        <Form.Check
          inline
          name="plant-type"
          id={`plant-type-common`}
          type="radio"
          label="Common Name"
          checked={plantLabel === 'common_name'}
          onChange={handleLabel}
        />
        <Form.Check
          inline
          name="plant-type"
          id={`plant-type-scientific`}
          type="radio"
          label="Scientific Name"
          checked={plantLabel === 'scientific_name'}
          onChange={handleLabel}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check
          type="checkbox"
          label="Is propagation"
          checked={propagation}
          onChange={() => setPropagation(!propagation)}
        />
        {/* if is propagation */}
        {/* filter by plant if given  */}
        <Select
          options={userPlants
            .filter((plant) => plant.status === 'mother')
            .filter((plant) => {
              if (!inventoryItem.plants_key) {
                return plant
              }
              if (inventoryItem.plants_key === plant.plants_key) {
                return plant
              }
            })
            .map((plant) => ({
              label: `${plant.common_name} (${plant.id})`,
              value: plant
            }))}
          onChange={({ value }) => {
            if (propagation) {
              setAncestry(value.ancestry)
              !inventoryItem.plants_key &&
                setInventoryItem({
                  ...inventoryItem,
                  plants_key: value.plants_key
                })
            }
          }}
        />
      </Form.Group>

      <Select
        options={statuses.map((status) => ({
          label: status.status,
          value: status.id
        }))}
        onChange={({ value }) =>
          setInventoryItem({ ...inventoryItem, status_key: value })
        }
      />
      <Form.Group className="mb-3" controlId="acquired_from">
        <Form.Label>Acquired from: </Form.Label>
        <Form.Control
          type="text"
          placeholder="Where'd that come from?"
          name="acquired_from"
          onChange={handleChanges}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="acquired_date">
        <Form.Label>Acquired Date: </Form.Label>
        <Form.Control
          type="date"
          placeholder="When did this beauty join the collection?"
          name="acquired_date"
          onChange={handleChanges}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="cost">
        <Form.Label>Cost: </Form.Label>
        <Form.Control
          type="number"
          placeholder="What's the damage?"
          name="cost"
          onChange={handleChanges}
          min={0}
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
