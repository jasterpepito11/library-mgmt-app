import React, { useState } from "react";
import { useFormik, Field, FieldArray, FormikProvider } from "formik";
import * as Yup from "yup";
import { storage } from "../firebase/config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Row, Col, Form, Button, InputGroup, Card } from "react-bootstrap";
import { useAddNewBookMutation } from "../redux/services/api";
import { useNavigate } from "react-router-dom";

const addBookSchema = Yup.object().shape({
  name: Yup.string().required("Book title is required.").max(100),
  description: Yup.string().required("Book description is required.").max(100),
  author: Yup.string().matches(/^[a-zA-Z0-9-., ]*$/, "Must contain alphanumeric with special characters `.` and `,` only."),
  authors: Yup.array().min(1, "You need to cite atleast 1 author.").required("You need to add an author"),
  imgFile: Yup.mixed().required("Book image is required.")
});
export default function AddBook () {
  const [formState, setFormState] = useState(true);
  const [addBookHook] = useAddNewBookMutation();
  const navigate = useNavigate();
  const handleUploadImg = (values) => {
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
          const newBook = {
            name: values.name,
            description: values.description,
            authors: values.authors,
            imageUrl: downloadURL,
            dateCreated: Math.floor(Date.now() / 1000)
          };
          console.log(newBook);
          addBookHook(newBook).then(() => {
            formik.setFieldValue("imgFile", downloadURL);
            setFormState(values);
            navigate("/books");
          });
        });
      });
  };
  const formik = useFormik({
    initialValues: { name: "", description: "", author: "", authors: [], imgFile: null },
    validationSchema: addBookSchema,
    onSubmit: (values) => {
      console.log(formState);
      handleUploadImg(values);
    }
  });
  return (
    <>
      <Col lg="12" md="12" xs="12" xxs="12" className="my-3">
        <Col lg="4" md="12" xs="12" xxs="12" className="text-start"><h3 className="ps-3">Add New Book</h3></Col>
      </Col>
      <Row className="justify-content-center">
        <FormikProvider value={formik}>
          <Card border="warning" className="col-xl-9 col-lg-9 col-md-10 col-sm-12 col-xs-12 col-12 mb-5" >
          <Form noValidate onSubmit={formik.handleSubmit} className="p-5 bg-gray-100">
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
                <img src={formik.values.imgFile ? URL.createObjectURL(formik.values.imgFile) : "https://via.placeholder.com/150"} className="img-fluid" alt="..." />
              </Form.Group>
            </Col>
            </Row>
            <Button variant="primary" type="submit" className="btn-lg float-end">
              Add
            </Button>
          </Form>
          </Card>
        </FormikProvider>
      </Row>
    </>
  );
}
