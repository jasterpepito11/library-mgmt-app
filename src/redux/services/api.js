import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { Book } from "../../models/Book";

export const bookApi = createApi({
  reducerPath: "bookApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Books"],
  endpoints: (builder) => ({
    fetchBooksList: builder.query({
      async queryFn () {
        try {
          const bookList = [];
          const bookRef = collection(db, "books");
          const querySnapshot = await getDocs(bookRef);
          querySnapshot?.forEach((docu) => {
            const newBook = new Book(
              docu.id,
              docu.data().name,
              docu.data().description,
              docu.data().authors,
              docu.data().imageUrl,
              new Date(docu.data().dateCreated * 1000).toUTCString());
            bookList.push(newBook);
          });
          return { data: bookList };
        } catch (e) {
          console.log("Error in query:", e);
          return { error: e };
        }
      },
      providesTags: ["Books"]
    }),
    addNewBook: builder.mutation({
      async queryFn (data) {
        try {
          await addDoc(collection(db, "books"), { ...data });
          return { data: "ok" };
        } catch (e) {
          return { error: e };
        }
      },
      invalidatesTags: ["Books"]
    }),
    updateBook: builder.mutation({
      async queryFn (book) {
        try {
          await updateDoc(doc(db, "books", book.id), { ...book });
          return { data: "ok" };
        } catch (e) {
          return { error: e };
        }
      },
      invalidatesTags: ["Books"]
    }),
    deleteBook: builder.mutation({
      async queryFn (id) {
        try {
          await deleteDoc(doc(db, "books", id));
          return { data: "ok" };
        } catch (e) {
          return { error: e };
        }
      },
      invalidatesTags: ["Books"]
    })
  })
});

export const {
  useFetchBooksListQuery,
  useAddNewBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation
} = bookApi;
