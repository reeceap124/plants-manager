import { useState, useRef } from 'react'
import { useUser } from '../../context/UserContext'
import { useStatus } from '../../context/StatusContext'
import { usePlants } from '../../context/PlantsContext'
import { useMediums } from '../../context/MediumContext'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import DatePicker from 'react-datepicker'
import Select from 'react-select'
import CreateableSelect from 'react-select/creatable'
import NewPlant from './NewPlant'
import Modal from '../ui/Modal'
import axios from 'axios'
import Tooltip from 'react-bootstrap/Tooltip'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'

export default function NewInventory({
  userPlants,
  setUserPlants,
  handleClose
}) {
  const [user] = useUser()
  const [statuses] = useStatus()
  const [plants, setPlants] = usePlants()
  const mediums = useMediums()
  const [plantLabel, setPlantLabel] = useState('common_name')
  const [inventoryItem, setInventoryItem] = useState({
    plants_key: undefined,
    status_key: undefined,
    cost: 0,
    acquired_from: undefined,
    acquired_date: new Date(),
    users_key: user.id,
    medium_key: undefined
  })
  const plantsRef = useRef(null)
  const [showPlantModal, setShowPlantModal] = useState(false)
  const [createPlant, setCreatePlant] = useState(undefined)
  const [potentialCreate, setPotentialCreate] = useState('')
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
      plant: inventoryItem
    })
    setUserPlants(data)
    handleClose()
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="plants_key">
        <Form.Label>Plant </Form.Label>
        <OverlayTrigger
          placement="top-end"
          delay={{ show: 250 }}
          overlay={(tprops) => (
            <Tooltip {...tprops}>{`Type in a ${plantLabel.replace(
              '_',
              ' '
            )} and select 'Create "${
              potentialCreate.trim().length ? potentialCreate : '<new>'
            }"'`}</Tooltip>
          )}
        >
          <CreateableSelect
            ref={plantsRef}
            blurInputOnSelect={true}
            onInputChange={(val) => setPotentialCreate(val)}
            placeholder={`Select existing or add new`}
            createOptionPosition="first"
            options={plants.map((plant) => ({
              label: plant[plantLabel],
              value: plant.id
            }))}
            onChange={({ value }) => {
              setInventoryItem({ ...inventoryItem, plants_key: value })
            }}
            onCreateOption={(value) => {
              setCreatePlant({ [plantLabel]: value, creator_key: user.id })
              handleModal()
              // set id on state, and name on select
            }}
          />
        </OverlayTrigger>
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
      <Form.Group className="mb-3" controlId="status_key">
        <Form.Label>Status </Form.Label>
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
        <Form.Label>Acquired from </Form.Label>
        <Form.Control
          type="text"
          placeholder="Where'd that come from?"
          name="acquired_from"
          onChange={handleChanges}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="acquired_date">
        <Form.Label>Acquired Date </Form.Label>
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

      <Form.Group className="mb-3" controlId="medium_key">
        <Form.Label>Growing Medium </Form.Label>
        <Select
          options={mediums.map(({ medium, id }) => ({
            label: medium,
            value: id
          }))}
          onChange={({ value }) =>
            setInventoryItem({ ...inventoryItem, medium_key: value })
          }
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  )
}
