
import React from "react";
import { Card, Col, Row, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useFetchBooksListQuery } from "../redux/services/api";
import { RiEditLine } from "react-icons/ri/";
import addNewImg from "../assets/add_new_vector.png";
import DeleteBookModal from "./DeleteBookModal";
import Loader from "./Loader";

export default function BookList () {
  const { data, isLoading } = useFetchBooksListQuery();
  const navigate = useNavigate();

  const handleAddNewBook = () => {
    navigate(`/books/new`);
  };
  return (
    <>
      {isLoading && <Loader/>}
      {!isLoading && data &&
      <>
      <Col lg="12" md="12" xs="12" xxs="12" className="my-3">
        <Col lg="4" md="12" xs="12" xxs="12" className="text-start"><h3 className="ps-3">Book Catalogue</h3></Col>
      </Col>
      <Row className="gx-lg-0 gx-md-5 gx-sm-0">
      { data?.map((book) => (
        <Col lg="4" xl="4" xxl="3" md="6" xs="12" xxs="12" key={book.id}>
        <Card border="primary" className="book-card mb-5 mx-auto" style={{ maxWidth: "18rem", height: "390px" }} >
          <Row className="g-0 separator">
            <Col className="d-flex justify-content-center bg-gray-800" xxs="12" xs="12" lg="12" md="12">
              <img src={book.imageUrl} className="img-fluid max-height-150" alt="..." />
            </Col>
          </Row>
          <Row className="g-0">
            <Col>
              <Card.Body className="px-2">
                <Card.Title className="font-1rem">{book.name}</Card.Title>
                <Card.Text className="font-12 text-warning">
                  <span className="text-warning fw-bold fst-italic">Authors:</span> {book.authors.join(", ")}
                </Card.Text>
                <Card.Text className="font-12 mb-2">
                  <span className="text-warning fw-bold">Description:</span>
                </Card.Text>
                <Card.Text className="font-12 h-36">
                  {book.description}
                </Card.Text>
                <Card.Text className="font-12 text-muted">
                  {book.dateCreated}
                </Card.Text>
                <Button className="view-details-btn" variant="link">View book details</Button>
                <Button className="update-btn" variant="primary" ><RiEditLine /></Button>
                <DeleteBookModal bookId={book.id} bookName={book.name} />
              </Card.Body>
            </Col>
          </Row>
        </Card>
        </Col>
      ))}
        <Col lg="4" xl="4" xxl="3" md="6" xs="12" xxs="12">
          <Card border="primary" className="add-book book-card mb-5 mx-auto bg-gray-300" style={{ maxWidth: "18rem", height: "390px" }} onClick={handleAddNewBook}>
            <Row>
              <Col xxs="12" xs="12" lg="12" md="12" className="d-flex justify-content-center">
              <img src={addNewImg} className="img-fluid" alt="..." />
              </Col>
              <Card.Title className="font-1rem text-primary text-center">Add New Book</Card.Title>
            </Row>
          </Card>
        </Col>
      </Row> </>}
    </>
  );
}
