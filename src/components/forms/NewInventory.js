import { useState, useRef } from 'react'
import { useUser } from '../../context/UserContext'
import { useStatus } from '../../context/StatusContext'
import { usePlants } from '../../context/PlantsContext'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Collapse from 'react-bootstrap/Collapse'
import DatePicker from 'react-datepicker'
import Select from 'react-select'
import CreateableSelect from 'react-select/creatable'
import NewPlant from './NewPlant'
import Modal from '../ui/Modal'
import axios from 'axios'

export default function NewInventory({
  userPlants,
  setUserPlants,
  handleClose
}) {
  console.log('user plants', userPlants)
  const [user] = useUser()
  const [statuses] = useStatus()
  const [plants, setPlants] = usePlants()
  const [plantLabel, setPlantLabel] = useState('common_name')
  const [inventoryItem, setInventoryItem] = useState({
    plants_key: undefined,
    status_key: undefined,
    cost: 0,
    acquired_from: undefined,
    acquired_date: new Date(),
    users_key: user.id
  })
  const [ancestry, setAncestry] = useState(undefined)
  const [propagation, setPropagation] = useState(true)
  const plantsRef = useRef(null)
  const mothersRef = useRef(null)
  const [showPlantModal, setShowPlantModal] = useState(false)
  const [createPlant, setCreatePlant] = useState(undefined)

  const handleChanges = (e) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { data } = await axios.post('http://localhost:3300/api/inventory', {
      plant: inventoryItem,
      parent: ancestry
    })
    setUserPlants(data)
    handleClose()
  }

  return (
    <Form onSubmit={handleSubmit}>
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
            setCreatePlant({ [plantLabel]: value, creator_key: user.id })
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
      <Collapse in={propagation}>
        <Form.Group className="mb-3" controlId="ancestry">
          <Form.Label>Mother Plant: </Form.Label>

          {propagation && (
            <Select
              ref={mothersRef}
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
                if (propagation) {
                  plantsRef.current.selectOption({
                    label: value[plantLabel],
                    value: value.plants_key
                  })
                  setAncestry(value.ancestry)
                }
              }}
            />
          )}
        </Form.Group>
      </Collapse>
      <Form.Check
        type="checkbox"
        label="Is propagation"
        checked={propagation}
        onChange={() => {
          if (ancestry) {
            console.log('propagation unchecked', mothersRef.current)
            setAncestry(undefined)
          }
          setPropagation(!propagation)
        }}
      />
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
        <DatePicker
          className="form-control"
          selected={inventoryItem.acquired_date}
          onChange={(value) =>
            setInventoryItem({ ...inventoryItem, acquired_date: value })
          }
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
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  )
}
