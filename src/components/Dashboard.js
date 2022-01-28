import React, { useState, useEffect } from 'react'
import { useUser } from '../context/UserContext'
import ListGroup from 'react-bootstrap/ListGroup'
import axios from 'axios'
import Modal from './ui/Modal'
import NewPlant from './forms/NewInventory'

export default function Dashboard() {
  const [user] = useUser()
  const [plants, setPlants] = useState([])
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    axios
      .get(`http://localhost:3300/api/inventory/all/${user.id}`)
      .then((res) => {
        console.log('inventory data', res.data)
        setPlants(res.data)
      })
      .catch((error) => console.error('Failed to get users plants', error))
  }, [user])
  const handleModal = (e) => {
    e?.preventDefault()
    setShowModal(!showModal)
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
    <div>
      <h2>{user.username} Plant Manager</h2>
      <button onClick={handleModal}>Show Modal</button>
      <ListGroup>
        {plants?.map((plant, index) => {
          return (
            <ListGroup.Item key={index}>
              {plant?.common_name ||
                plant?.scientific_name ||
                'No plant name defined'}

              {plant.id ? ` (id: ${plant.id})` : null}
            </ListGroup.Item>
          )
        })}
      </ListGroup>
      <Modal show={showModal} handleModal={handleModal} heading="New Inventory">
        <NewPlant
          userPlants={plants}
          setUserPlants={(newPlant) => setPlants([...plants, newPlant])}
          handleClose={handleModal}
        />
      </Modal>
    </div>
  )
}
