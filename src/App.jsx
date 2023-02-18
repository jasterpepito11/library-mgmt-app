import React from "react";
import "./App.css";
import { ThemeProvider } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Login from "./pages/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomeLayout from "./pages/HomeLayout";
import ErrorPage from "./pages/ErrorPage";
import BookList from "./components/BookList";
import AddBook from "./components/AddBook";
import BookDetails from "./components/BookDetails";
import AuthProvider from "./context/AuthProvider";

function App () {
  return (
    <BrowserRouter >
      <ThemeProvider
        breakpoints={["xxxl", "xxl", "xl", "lg", "md", "sm", "xs", "xxs"]}
        minBreakpoint="xxs"
      >
        <Container fluid className="h-100">
          <AuthProvider>
            <Routes>
              <Route path="/">
                <Route index element={<Login />} />
                <Route path="login" element={<Login />} />
                <Route path="books" element={<HomeLayout />}>
                  <Route index element={<BookList />} />
                  <Route path="new" element={<AddBook />} />
                  <Route path=":bookId" element={<BookDetails />} />
                </Route>
                <Route path="*" element={<ErrorPage />} />
              </Route>
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </AuthProvider>
        </Container>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
