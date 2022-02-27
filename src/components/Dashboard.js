import React, { useState, useEffect } from 'react'
import { useUser } from '../context/UserContext'
import Button from 'react-bootstrap/Button'
import axios from 'axios'
import Modal from '../ui/Modal'
import NewPlant from './forms/NewInventory'
import NewPropagation from './forms/NewPropagation'
import UpdateInventory from './forms/UpdateInventory'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faFilter } from '@fortawesome/free-solid-svg-icons'
import Filters from './forms/Filters'
import PlantsList from './PlantsList'

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
  const [targetValue, setTargetValue] = useState(undefined)
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
      setTargetValue(undefined)
    }
    setShowModal(e?.target?.attributes?.modalval?.value)
  }

  // filterVals.map((val) => {
  //   const opts = [...new Set(plants.map((p) => p[val]))]
  //   return <Select options={opts} />
  // })

  /*
  Needs to:
  - Logout

  - Images

  - Crud on individual plants
  - Get cost/profit on original mothers
  - Record sales 

  Filter Options:
  - Name
  - Plant
  - Status
  - Ancestry???
  */
  return (
    <div style={{ padding: '2rem' }}>
      <h2>{user.username} Plant Manager</h2>
      <div className="menuWrapper">
        <Button
          name="new inventory"
          modalval="new inventory"
          onClick={handleModal}
        >
          <FontAwesomeIcon icon={faPlus} />
        </Button>

        <Button name="filters" modalval="filters" onClick={handleModal}>
          <FontAwesomeIcon icon={faFilter} />
        </Button>
      </div>

      <PlantsList
        filteredPlants={filteredPlants}
        handleModal={handleModal}
        setPropState={setTargetValue}
      />

      <Modal
        show={showModal === 'update inventory'}
        handleModal={handleModal}
        heading="Update Inventory"
      >
        <UpdateInventory
          handleClose={handleModal}
          update={targetValue}
          setUserPlants={(updated) =>
            setPlants(
              plants.map((p) => {
                if (p.id === updated.id) return updated
                return p
              })
            )
          }
        />
      </Modal>

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
          propState={[targetValue, setTargetValue]}
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
