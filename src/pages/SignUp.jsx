/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Card } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useFormik } from "formik";
import * as Yup from "yup";
import libraLogo from "@/assets/libra_logo.png";
import { useNavigate } from "react-router-dom";

const signupSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Email is required."),
  password: Yup.string().required("Password is required.")
});
export default function SignUp() {
  const navigate = useNavigate();
  const [formState, setFormState] = useState(true);
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: signupSchema,
    onSubmit: values => {
      alert(JSON.stringify(values, null, 2));
      setFormState(values);
      console.log(formState);
      navigate("/books");
    }
  });
  return (
        <Row className="justify-content-center login-bg">
            <Col xs sm="10" md="6" lg="5" xl="4" xxl="4" xxxl="5" className="align-self-center">
                <Card className="opacity-75 login" border="primary">
                    <Card.Img variant="top" className="libra-logo" src={libraLogo} width="80" height="150" />
                    <Card.Body className="px-5 pb-5">
                        <Form className="text-left" noValidate onSubmit={formik.handleSubmit}>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control required type="email" placeholder="Enter email"
                                    name="email" value={formik.values.email}
                                    onChange={formik.handleChange} onBlur={formik.handleBlur}
                                    isInvalid={formik.touched.email && !!formik.errors.email} />
                                <Form.Control.Feedback type="invalid">{formik.errors.email}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control required type="password" placeholder="Password"
                                    name="password" value={formik.values.password}
                                    onChange={formik.handleChange} onBlur={formik.handleBlur}
                                    isInvalid={formik.touched.password && !!formik.errors.password} />
                                <Form.Control.Feedback type="invalid">{formik.errors.password}</Form.Control.Feedback>
                            </Form.Group>
                            <Button className="w-100 mt-2" variant="primary" type="submit" onClick={values => setFormState(values)}>
                                Sign Up
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
  );
}
