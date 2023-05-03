import React, { ChangeEvent, useState } from 'react';
import endpoints from '../../api/endpoints';
import { apiFetch } from '../../api/apiFetch';
import { Field, Formik, Form } from 'formik';
import { EVideoState } from '../../enums/EVideoState';
import { useNavigate } from 'react-router-dom';

enum EUploadStatus {
  NOT_STARTED = 'notStarted',
  IN_PROGRESS = 'inProgress',
  SUCCESS = 'success',
  ERROR = 'error',
}

const selectableStates = [EVideoState.PUBLIC, EVideoState.PRIVATE, EVideoState.UNLISTED];

interface IVideoData {
  title: string;
  description: string;
  state: EVideoState;
}

function UploadVideoPage() {
  const [uploadStatus, setUploadStatus] = useState(EUploadStatus.NOT_STARTED);
  const [videoId, setVideoId] = useState();
  const navigate = useNavigate();

  const initialValues: IVideoData = {
    title       : '',
    description : '',
    state       : EVideoState.PUBLIC,
  };

  const handleUpload = async (e: ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];

    setUploadStatus(EUploadStatus.IN_PROGRESS);

    if (file) {
      const formData = new FormData();

      formData.append('file', file);

      apiFetch(endpoints.videos.base + '/upload', 'POST', formData)
        .then((data) => {
          setVideoId(data._id);
          setUploadStatus(EUploadStatus.SUCCESS);
        })
        .catch((e) => {
          setUploadStatus(EUploadStatus.ERROR);
        });
    }
  };

  return (
    <>
      <p>Upload video page</p>
      <input
        name="file"
        type="file"
        id="file"
        accept=".mp4,.mov"
        onChange={handleUpload}
        disabled={uploadStatus != EUploadStatus.NOT_STARTED}
      ></input>

      <Formik
        initialValues={initialValues}
        onSubmit={async (values, actions) => {
          const fullUri = `${endpoints.videos.base}/${videoId}`;
          console.log(values);
          apiFetch(fullUri, 'PATCH', values)
            .then((data) => {
              actions.setSubmitting(false);
              navigate('/');
            })
            .catch();
        }}
      >
        <Form>
          <label htmlFor="title">Title</label>
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
          <button type="submit" disabled={uploadStatus != EUploadStatus.SUCCESS}>
            Submit
          </button>
        </Form>
      </Formik>
    </>
  );
}

export default UploadVideoPage;
