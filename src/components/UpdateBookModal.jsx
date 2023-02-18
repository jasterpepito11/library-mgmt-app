import React, { useState } from "react";
import { useFormik, Field, FieldArray, FormikProvider } from "formik";
import * as Yup from "yup";
import { storage } from "../firebase/config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Row, Col, Form, Button, InputGroup, Card, Modal } from "react-bootstrap";
import { RiEditLine } from "react-icons/ri/";
import { toast } from "react-toastify";

import {
  ERROR_BOOK_NAME_REQUIRED,
  ERROR_BOOK_DESCRIPTION_REQUIRED,
  ERROR_BOOK_AUTHOR_PATTERN,
  ERROR_BOOK_AUTHOR_MIN,
  ERROR_BOOK_AUTHOR_REQUIRED
} from "../constants/responseMessages";
import { useUpdateBookMutation } from "../redux/services/api";

const updateBookSchema = Yup.object().shape({
  name: Yup.string().required(ERROR_BOOK_NAME_REQUIRED).max(100),
  description: Yup.string().required(ERROR_BOOK_DESCRIPTION_REQUIRED).max(100),
  author: Yup.string().matches(/^[a-zA-Z0-9-., ]*$/, ERROR_BOOK_AUTHOR_PATTERN),
  authors: Yup.array().min(1, ERROR_BOOK_AUTHOR_MIN).required(ERROR_BOOK_AUTHOR_REQUIRED),
  imgFile: Yup.mixed()
});
export default function UpdateBookModal ({ receivedBook }) {
  const [updateBook] = useUpdateBookMutation();
  const [formState, setFormState] = useState(true);
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleCloseModal = () => {
    setShow(false);
    formik.handleReset();
  };
  const handleUploadImg = (values, book) => {
    const storageRef = ref(storage, values.imgFile.name);
    const uploadTask = uploadBytesResumable(storageRef, values.imgFile);
    uploadTask.on("state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
            break;
        }
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("Successfully uploaded image. Inserting to db now...");
          book.imageUrl = downloadURL;
          updateBook(receivedBook.id, book).then(() => {
            formik.setFieldValue("imgFile", downloadURL);
            toast.success("Updating book successful!", {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light"
            });
            setShow(false);
          });
        });
      });
  };
  const formik = useFormik({
    initialValues: {
      name: receivedBook.name,
      description: receivedBook.description,
      author: "",
      authors: receivedBook.authors,
      initialImgURL: receivedBook.imageUrl,
      imgFile: null
    },
    validationSchema: updateBookSchema,
    onSubmit: (values) => {
      if (formik.dirty) {
        const book = { id: receivedBook.id };
        console.log(formState);
        // check each field and compare values
        // from initial to see if there are any changes
        if (formik.values.name !== formik.initialValues.name) {
          book.name = formik.values.name;
        }
        if (formik.values.description !== formik.initialValues.description) {
          book.description = formik.values.description;
        }
        if (JSON.stringify(formik.values.authors) !== JSON.stringify(formik.initialValues.authors)) {
          book.authors = formik.values.authors;
        }
        if (formik.values.imgFile) {
          handleUploadImg(values, book);
        } else {
          updateBook(book).then(() => {
            toast.success("Book update successful!", {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light"
            });
            setShow(false);
          });
        }
        setFormState(values);
      }
    }
  });
  return (
    <>
      <Button className="update-btn" variant="primary" onClick={handleShow} ><RiEditLine /></Button>
      <Modal
        show={show}
        onHide={handleCloseModal}
        backdrop="static"
        keyboard={false}
        size="xl"
      >
        <FormikProvider value={formik}>
          <Modal.Header closeButton>
            <Modal.Title>Update {receivedBook?.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className="justify-content-center px-2">

              <Card border="warning" className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 col-12 mb-5" >
                <Form id="updateBook" noValidate onSubmit={formik.handleSubmit} className="p-5 bg-gray-100">
                  <Row>
                    <Col lg="6" md="6" sm="12" xs="12" xxs="12">
                      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Book Title</Form.Label>
                        <Form.Control required name="name" value={formik.values.name} onChange={formik.handleChange}
                          onBlur={formik.handleBlur} isInvalid={formik.touched.name && formik.errors.name}
                          type="text" placeholder="title" />
                        {formik.touched.name && formik.errors.name &&
                          <Form.Control.Feedback type="invalid">{formik.errors.name}</Form.Control.Feedback>}
                      </Form.Group>
                      <InputGroup className="mb-3">
                        <Field
                          className={(formik.touched?.author && formik.errors?.author) ? "form-control is-invalid" : "form-control"}
                          value={formik.values?.author}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          required name="author"
                          placeholder="Author(s)"
                          aria-label="Author(s)"
                          aria-describedby="basic-addon2"
                        />
                        <Button variant="outline-secondary" id="button-addon2" onClick={() => {
                          if (formik.values.author) {
                            const newAuthors = [...formik.values.authors, formik.values.author];
                            formik.setFieldValue("authors", newAuthors);
                            formik.setFieldValue("author", "");
                          }
                        }}>
                          Add Author
                        </Button>
                        {formik.touched.author && formik.errors.author &&
                          <Form.Control.Feedback type="invalid">{formik.errors.author}</Form.Control.Feedback>}
                        {formik.submitCount > 0 && formik.errors?.authors &&
                          <Form.Control.Feedback type="invalid">{formik.errors?.authors}</Form.Control.Feedback>}
                      </InputGroup>
                      <FieldArray
                        name="authors"
                        render={(arrayHelpers) => (
                          <Row>
                            {formik.values?.authors.map((val, index) => (
                              <Col key={index}>
                                <InputGroup className="mb-3" >
                                  <Form.Control
                                    type="text"
                                    value={val}
                                    disabled
                                    readOnly
                                    aria-label="Recipient's username"
                                    aria-describedby="basic-addon2"
                                  />
                                  <Button variant="outline-secondary" id="button-addon2" onClick={() => {
                                    arrayHelpers.remove(index);
                                  }}>
                                    x
                                  </Button>
                                </InputGroup>
                              </Col>
                            ))}
                          </Row>
                        )}
                      />
                    </Col>
                    <Col lg="6" md="6" xs="12" xxs="12">
                      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Description</Form.Label>
                        <Form.Control required value={formik.values.description}
                          onBlur={formik.handleBlur} isInvalid={formik.touched.description && formik.errors.description}
                          onChange={formik.handleChange} name="description" as="textarea" rows={3} />
                        {formik.touched.description && formik.errors.description &&
                          <Form.Control.Feedback type="invalid">{formik.errors.description}</Form.Control.Feedback>}
                      </Form.Group>
                      <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label>Book Image</Form.Label>
                        <Form.Control name="imgFile"
                          isInvalid={formik.touched.imgFile && formik.errors.imgFile}
                          onBlur={formik.handleBlur}
                          onChange={(event) => {
                            formik.setFieldValue("imgFile", event.currentTarget.files[0]);
                          }} type="file" accept="image/*" />
                        {formik.touched.imgFile && formik.errors.imgFile &&
                          <Form.Control.Feedback type="invalid">{formik.errors.imgFile}</Form.Control.Feedback>}
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <h5>Image Preview:</h5>
                        <img src={formik.values.imgFile
                          ? URL.createObjectURL(formik.values.imgFile)
                          : formik.values.initialImgURL}
                        className="img-fluid" alt="..." />
                      </Form.Group>
                    </Col>
                  </Row>
                </Form>
              </Card>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" className="btn-lg" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" className="btn-lg" onClick={formik.handleReset}>Reset</Button>
            <Button form="updateBook" variant="primary" className="btn-lg" type="submit">Update</Button>
          </Modal.Footer>
        </FormikProvider>
      </Modal>
    </>
  );
}
