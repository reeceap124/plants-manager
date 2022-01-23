import React, { useState, useEffect } from 'react'
import { useUser } from '../context/UserContext'
import Select from 'react-select'
import Pagination from 'react-bootstrap/Pagination'
import ListGroup from 'react-bootstrap/ListGroup'
import axios from 'axios'
import Modal from './ui/Modal'
import NewPlant from './forms/NewPlant'

export default function Dashboard() {
  const [user, setUser] = useUser()
  const [filters, setFilters] = useState()
  const [page, setPage] = useState(1)
  const [plants, setPlants] = useState([])
  const [showModal, setShowModal] = useState(false)

  const filterVals = ['common_name', 'scientific_name', 'status']

  useEffect(() => {
    axios
      .get(`http://localhost:3300/api/inventory/all/${user.id}`)
      .then((res) => {
        console.log('plants', res.data)
        setPlants(res.data)
      })
      .catch((error) => console.error('Failed to get users plants', error))
  }, [user])
  const handleModal = (e) => {
    e?.preventDefault()
    setShowModal(!showModal)
  }
  const handleSave = () => {}

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
        {plants.map((plant, index) => {
          return (
            <ListGroup.Item key={index}>
              {plant?.common_name ||
                plant?.scientific_name ||
                'No plant name defined'}
            </ListGroup.Item>
          )
        })}
      </ListGroup>
      <Modal show={showModal} handleModal={handleModal} heading="Modal Heading">
        <NewPlant />
      </Modal>
    </div>
  )
}
