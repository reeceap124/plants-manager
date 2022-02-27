import React from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

export default function PlantsList({
  filteredPlants,
  handleModal,
  setPropState
}) {
  return (
    <div className="plantsListWrapper">
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
            <Card.Footer
              style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}
            >
              <Button
                modalval="new propagation"
                onClick={(e) => {
                  setPropState(plant)
                  handleModal(e)
                }}
              >
                Propagate
              </Button>
              <Button
                modalval="update inventory"
                onClick={(e) => {
                  setPropState(plant)
                  handleModal(e)
                }}
              >
                Update
              </Button>
              <Button>Sell</Button>
            </Card.Footer>
          </Card>
        )
      })}
    </div>
  )
}
