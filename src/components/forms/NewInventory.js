import { useState, useRef } from 'react'
import { useUser } from '../../context/UserContext'
import { useStatus } from '../../context/StatusContext'
import { usePlants } from '../../context/PlantsContext'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Select from 'react-select'
import CreateableSelect from 'react-select/creatable'
import NewPlant from './NewPlant'
import Modal from '../ui/Modal'

export default function NewInventory({ userPlants }) {
  console.log('user plants', userPlants)
  const [user] = useUser()
  const [statuses] = useStatus()
  const [plants, setPlants] = usePlants()
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
  const plantsRef = useRef(null)
  const [showPlantModal, setShowPlantModal] = useState(false)
  const [createPlant, setCreatePlant] = useState(undefined)

  const handleChanges = (e) => {
    //need to add some date handling stuff here.
    setInventoryItem({ ...inventoryItem, [e.target.name]: e.target.value })
  }
  const handleModal = (e) => {
    e?.preventDefault()
    setShowPlantModal(!showPlantModal)
  }

  const handleLabel = () => {
    plantLabel === 'common_name'
      ? setPlantLabel('scientific_name')
      : setPlantLabel('common_name')
    if (inventoryItem.plants_key) {
      plantsRef.current.selectOption(
        plants
          .filter((plant) => plant.id === inventoryItem.plants_key)
          .map((plant) => ({
            label:
              plant[
                plantLabel === 'common_name' ? 'scientific_name' : 'common_name'
              ],
            value: plant.id
          }))[0]
      )
    }
  }

  const handleNewPlant = (newPlant) => {
    setCreatePlant(newPlant)
    setPlants([...plants, newPlant])
    setInventoryItem({ ...inventoryItem, plants_key: newPlant.id })
    plantsRef.current.selectOption({
      label: newPlant[plantLabel],
      value: newPlant.id
    })
  }

  return (
    // DONE: handle changing selects based between plant and user/propagation issue (doesn't update plant when selecting mother)
    // TODO: clear mother if plant type changes
    // DONE: reset plant type name when switching
    // DONE: make plant select creatable
    // TODO: handle date differences
    // DONE: handle non-propagations (just disable mother select)
    // STRETCH: Collapse mother select when not using.

    <Form>
      <Form.Group className="mb-3" controlId="plants_key">
        <Form.Label>Plant: </Form.Label>
        <CreateableSelect
          ref={plantsRef}
          options={plants.map((plant) => ({
            label: plant[plantLabel],
            value: plant.id
          }))}
          onChange={({ value }) => {
            console.log('value to change', value)
            setInventoryItem({ ...inventoryItem, plants_key: value })
          }}
          onCreateOption={(value) => {
            setCreatePlant({ [plantLabel]: value })
            handleModal()
            // set id on state, and name on select
          }}
        />
        <Modal
          show={showPlantModal}
          heading="Create New Plant"
          handleModal={handleModal}
        >
          <NewPlant
            plant={createPlant}
            handleClose={handleModal}
            handleAdded={handleNewPlant}
          />
        </Modal>
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

      <Form.Group className="mb-3" controlId="ancestry">
        <Form.Label>Mother Plant: </Form.Label>
        {/* if is propagation */}
        {/* filter by plant if given  */}
        <Select
          placeholder={
            propagation
              ? 'Which mother is this being propagated from?'
              : 'Only used for propagations'
          }
          isDisabled={!propagation}
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
            console.log('ref from mothers click', plantsRef.current)
            if (propagation) {
              plantsRef.current.selectOption({
                label: value[plantLabel],
                value: value.plants_key
              })
              setAncestry(value.ancestry)
            }
          }}
        />
        <Form.Check
          type="checkbox"
          label="Is propagation"
          checked={propagation}
          onChange={() => {
            if (ancestry) {
              setAncestry(undefined)
            }
            setPropagation(!propagation)
          }}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="status_key">
        <Form.Label>Status: </Form.Label>
        <Select
          options={statuses.map((status) => ({
            label: status.status,
            value: status.id
          }))}
          onChange={({ value }) =>
            setInventoryItem({ ...inventoryItem, status_key: value })
          }
        />
      </Form.Group>

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
