import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

export default function CustomModal({
  show,
  handleModal,
  heading,
  body,
  children
}) {
  return (
    <>
      <Modal show={show} onHide={handleModal}>
        <Modal.Header closeButton>
          <Modal.Title>{heading}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{body || children}</Modal.Body>
        {/* <Modal.Footer>
          <Button variant="secondary" onClick={handleModal}>
            Done
          </Button>
        </Modal.Footer> */}
      </Modal>
    </>
  )
}
