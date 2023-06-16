import { Form, Formik } from 'formik';
import React from 'react';
import { apiFetch } from '../api/apiFetch';
import endpoints from '../api/endpoints';
import buildQueryParams from '../helpers/buildQueryParams';
import { IComment } from '../interfaces/IComment';
import LabelledTextAreaComponent from './LabelledTextAreaComponent';
import ButtonComponent from './ButtonComponent';

function CommentFormComponent(props: { comment?: IComment; videoId: string; onPostComment: () => void }) {
  const { comment, onPostComment, videoId } = props;

  const initialValues = {
    content: comment?.content || '',
  };

  const handleSubmit = async (values: any, actions: any) => {
    const url = comment?._id
      ? `${endpoints.comments.base}/${comment._id}`
      : endpoints.comments.base + buildQueryParams({ videoId });

    const method = comment?._id ? 'PATCH' : 'POST';

    apiFetch(url, method, values)
      .then(() => {
        actions.setSubmitting(false);
        onPostComment();
      })
      .catch();

    actions.resetForm();
  };

  return (
    <div>
      <h1>Comments</h1>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ values }) => (
          <Form>
            <label htmlFor="content">Write a new comment</label>
            <LabelledTextAreaComponent
              name="content"
              label="comment"
              placeholder="Write a comment to say how you feel about this video"
            />
            <ButtonComponent type="submit" disabled={!values.content}>
              Post a comment
            </ButtonComponent>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default CommentFormComponent;
