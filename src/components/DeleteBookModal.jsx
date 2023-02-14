import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { RiDeleteBinLine } from "react-icons/ri/";
import { useDeleteBookMutation } from "../redux/services/api";
import { toast } from "react-toastify";

export default function DeleteBookModal ({ bookId, bookName }) {
  const [show, setShow] = useState(false);
  const [deleteBook] = useDeleteBookMutation();
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const handleDeleteBook = () => {
    setShow(false);
    deleteBook(bookId).then(() => {
      // toastify here
      toast.success("Deleting book successful!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light"
      });
    });
  };
  return (
    <>
    <Button className="delete-btn" variant="danger" onClick={handleShow} ><RiDeleteBinLine /></Button>
    <Modal
              show={show}
              onHide={handleClose}
              backdrop="static"
              keyboard={false}
            >
              <Modal.Header closeButton>
                <Modal.Title>Delete {bookName}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Proceeding will delete this book permanently.Are you sure you want to continue?
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleDeleteBook}>Continue</Button>
              </Modal.Footer>
      </Modal>
      </>
  );
}
