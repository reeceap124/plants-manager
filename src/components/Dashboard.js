import React, { useState, useEffect } from 'react'
import { useUser } from '../context/UserContext'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import OffCanvas from 'react-bootstrap/Offcanvas'
// import Badge from 'react-bootstrap/Badge'
import axios from 'axios'
import Modal from '../ui/Modal'
import NewPlant from './forms/NewInventory'
import NewPropagation from './forms/NewPropagation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import Filters from './forms/Filters'

export default function Dashboard() {
  const [user] = useUser()
  const [plants, setPlants] = useState([])
  const [appliedFilters, setAppliedFilters] = useState({
    plants_key: [],
    status_key: [],
    medium_key: []
  })
  const [filteredPlants, setFilteredPlants] = useState([])
  const [showModal, setShowModal] = useState(undefined)
  const [propState, setPropState] = useState(undefined)
  useEffect(() => {
    axios
      .get(`http://localhost:3300/api/inventory/all/${user.id}`)
      .then((res) => {
        setPlants(res.data)
      })
      .catch((error) => console.error('Failed to get users plants', error))
  }, [user])

  useEffect(() => {
    let filteredPlants = plants
    for (const key in appliedFilters) {
      filteredPlants = filteredPlants.filter(
        (plant) => !appliedFilters[key].includes(plant[key])
      )
    }
    setFilteredPlants(filteredPlants)
  }, [plants, appliedFilters])

  const handleModal = (e) => {
    e?.preventDefault()
    if (!e?.target?.attributes?.modalval?.value) {
      setPropState(undefined)
    }
    setShowModal(e?.target?.attributes?.modalval?.value)
  }

  // filterVals.map((val) => {
  //   const opts = [...new Set(plants.map((p) => p[val]))]
  //   return <Select options={opts} />
  // })

  /*
  Needs to:
  - Crud on individual plants
  - Get cost/profit on original mothers

  Filter Options:
  - Name
  - Plant
  - Status
  - Ancestry???
  */
  return (
    <div style={{ padding: '2rem' }}>
      <h2>{user.username} Plant Manager</h2>
      <Button
        name="new inventory"
        modalval="new inventory"
        onClick={handleModal}
        className="newInventoryButton"
      >
        <FontAwesomeIcon icon={faPlus} />
      </Button>
      <Button name="filters" modalval="filters" onClick={handleModal}>
        Filter
      </Button>

      <div className="plantsCardWrapper">
        {filteredPlants.map((plant, index) => {
          return (
            <Card key={index}>
              <Card.Body>
                <Card.Title>
                  {plant?.common_name || plant?.scientific_name}
                  <span> {plant.id}</span>
                </Card.Title>

                <Card.Text>
                  Notes: {plant?.notes || 'No notes given for this plant'}
                </Card.Text>
              </Card.Body>
              <Card.Footer>
                <Button
                  modalval="new propagation"
                  onClick={(e) => {
                    console.log('clicked em')
                    setPropState(plant)
                    handleModal(e)
                  }}
                >
                  Add Propagations
                </Button>
              </Card.Footer>
            </Card>
          )
        })}
      </div>
      <Modal
        show={showModal === 'new inventory'}
        handleModal={handleModal}
        heading="New Inventory"
      >
        <NewPlant
          userPlants={plants}
          setUserPlants={(newPlant) => setPlants([...plants, newPlant])}
          handleClose={handleModal}
        />
      </Modal>
      <Modal
        show={showModal === 'new propagation'}
        handleModal={handleModal}
        heading="New Propagation"
      >
        <NewPropagation
          handleClose={handleModal}
          propState={[propState, setPropState]}
          setUserPlants={(newPlants) => setPlants([...plants, ...newPlants])}
        />
      </Modal>

      <Modal
        className="adjHeight"
        show={showModal === 'filters'}
        handleModal={handleModal}
        heading="Filters"
      >
        <Filters applied={[appliedFilters, setAppliedFilters]} />
      </Modal>
    </div>
  )
}
