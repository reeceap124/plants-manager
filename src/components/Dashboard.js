import React, { useState, useEffect } from 'react'
import { useUser } from '../context/UserContext'
import Card from 'react-bootstrap/Card'
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
    <div style={{ padding: '2rem' }}>
      <h2>{user.username} Plant Manager</h2>
      <button onClick={handleModal}>Show Modal</button>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '1rem'
        }}
      >
        {plants.map((plant, index) => {
          return (
            <Card
              key={index}
              onClick={() =>
                console.log('Clicked card: ', plant.common_name, plant.id)
              }
            >
              <Card.Body>
                <Card.Title>
                  {plant?.common_name || plant?.scientific_name}
                  <span> {plant.id}</span>
                </Card.Title>

                <Card.Text>
                  Notes: {plant?.notes || 'No notes given for this plant'}
                </Card.Text>
              </Card.Body>
            </Card>
          )
        })}
      </div>
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
