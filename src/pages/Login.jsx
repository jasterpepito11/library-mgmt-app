/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import { Col, Row, Card, Button, Form } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import libraLogo from "@/assets/libra_logo.png";
import { Navigate, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import { login } from "../redux/slices/user";
import { useDispatch } from "react-redux";
import { useAuth } from "../context/AuthProvider";
import {
  ERROR_EMAIL_REQUIRED, ERROR_INVALID_AUTH_CREDS, ERROR_INVALID_EMAIL_FORMAT,
  ERROR_INVALID_PASSWORD_FORMAT, ERROR_PASSWORD_REQUIRED, STANDARD_ERROR_MSG
} from "../constants/responseMessages";

const loginSchema = Yup.object().shape({
  email: Yup.string().email(ERROR_INVALID_EMAIL_FORMAT).required(ERROR_EMAIL_REQUIRED),
  password: Yup.string().required(ERROR_PASSWORD_REQUIRED)
});

export default function Login () {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formState, setFormState] = useState(true);
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: (values, actions) => {
      setFormState(values);
      signInWithEmailAndPassword(auth, values.email, values.password).then((authUser) => {
        dispatch(login({
          uid: authUser.uid,
          photoUrl: authUser.photoUrl,
          displayName: authUser.displayName
        }));
        navigate("/books");
      }).catch((error) => {
        switch (error.message) {
          case "auth/invalid-email":
            actions.setErrors({ email: ERROR_INVALID_EMAIL_FORMAT });
            break;
          case "auth/wrong-password":
            actions.setErrors({ password: ERROR_INVALID_PASSWORD_FORMAT });
            break;
          case "auth/user-not-found":
            actions.setErrors({ email: ERROR_INVALID_AUTH_CREDS },
              { password: ERROR_INVALID_AUTH_CREDS });
            break;
          default:
            this.errorObj.errorMsg = STANDARD_ERROR_MSG;
        }
      });
    }
  });

  return (currentUser
    ? <Navigate to="/books" replace />
    : (<Row className="justify-content-center login-bg">
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
                              Login
                          </Button>
                      </Form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>)
  );
}
