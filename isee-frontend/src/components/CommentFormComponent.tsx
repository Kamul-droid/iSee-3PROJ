import { Field, Form, Formik } from "formik";
import React from "react";
import { apiFetch } from "../api/apiFetch";
import endpoints from "../api/endpoints";
import buildQueryParams from "../helpers/buildQueryParams";
import { IComment } from "../interfaces/IComment";

function CommentFormComponent(props: {comment?: IComment, videoId: string, onPostComment: () => void}) {

  const {comment, onPostComment, videoId} = props
    
  const initialValues = {
    content : comment?.content || '',
  };

  const handleSubmit = async(values: any, actions: any) => {
    const url = comment?._id 
    ? `${endpoints.comments.base}/${comment._id}` 
    : endpoints.comments.base + buildQueryParams({videoId})

    const method = comment?._id ? 'PATCH' : 'POST'

    apiFetch(url, method, values)
        .then(() => {
            actions.setSubmitting(false);
            onPostComment();
        })
        .catch()
    
    actions.resetForm()
  }

  return (
    <div>
      <h1>My Example</h1>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
      >
        <Form>
          <label htmlFor="content">Comment</label>
          <Field id="content" name="content" placeholder="content" />
          <br />

          <button type="submit">Submit</button>
        </Form>
      </Formik>
    </div>
  );
}

export default CommentFormComponent;