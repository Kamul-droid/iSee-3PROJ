import React, { ChangeEvent, useEffect, useState } from 'react';
import endpoints from '../../api/endpoints';
import { apiFetch } from '../../api/apiFetch';
import { Field, Formik, Form } from 'formik';
import { EVideoState } from '../../enums/EVideoState';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { IVideo } from '../../interfaces/IVideo';

const selectableStates = [EVideoState.PUBLIC, EVideoState.PRIVATE, EVideoState.UNLISTED];

interface IVideoData {
  title: string;
  description: string;
  state: EVideoState;
}

function EditVideoPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { videoId } = useParams();

  const { isLoading, error, data } = useQuery<IVideo>({
    queryKey : ['video', videoId],
    queryFn  : () => apiFetch(`${endpoints.videos.base}/${videoId}`, 'GET'),
  });

  useEffect(() => {
    console.log(data);
  }, [data]);

  const handleDeleteVideo = () => {
    if (confirm('Are you sure you want to delete this video')) {
      apiFetch(`${endpoints.videos.base}/${videoId}/file`, 'DELETE')
        .then(() => {
          navigate('/');
        })
        .catch();
    }
  };

  return (
    <>
      <p>Edit video page</p>

      {data && (
        <Formik
          initialValues={data}
          onSubmit={async (values, actions) => {
            const fullUri = `${endpoints.videos.base}/${videoId}`;
            const req = {
              title       : values.title,
              description : values.description,
              state       : values.state,
            };
            apiFetch(fullUri, 'PATCH', req)
              .then(() => {
                queryClient.invalidateQueries(['video', videoId]);
                actions.setSubmitting(false);
                navigate('/');
              })
              .catch();
          }}
        >
          <Form>
            <label htmlFor="title">Title</label>
            <img src={`${endpoints.thumbnails.base}/${data?.thumbnail}`} alt={data?.thumbnail} width="150px" />
            <br />
            <Field id="title" name="title" placeholder="title" />
            <br />
            <label htmlFor="description">Description</label>
            <Field id="description" name="description" placeholder="description" />
            <br />
            <Field as="select" name="state">
              {selectableStates.map((state, index) => {
                return (
                  <option key={index} value={state}>
                    {state}
                  </option>
                );
              })}
            </Field>
            <button type="submit">Submit</button>
          </Form>
        </Formik>
      )}
      <button onClick={handleDeleteVideo}>Delete</button>
    </>
  );
}

export default EditVideoPage;
