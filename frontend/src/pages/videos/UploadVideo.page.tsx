import React, { ChangeEvent, useState } from 'react';
import endpoints from '../../api/endpoints';
import { apiFetch } from '../../api/apiFetch';
import { Formik, Form } from 'formik';
import { EVideoState } from '../../enums/EVideoState';
import { useNavigate } from 'react-router-dom';
import LabelledFieldComponent from '../../components/LabelledFieldComponent';
import ButtonComponent from '../../components/ButtonComponent';
import LabelledTextAreaComponent from '../../components/LabelledTextAreaComponent';
import LabelledSelectComponent from '../../components/LabelledSelectComponent';
import * as Yup from 'yup';
import ErrorMessageComponent from '../../components/ErrorMessageComponent';

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
    title: '',
    description: '',
    state: EVideoState.PUBLIC,
  };
  const uploadValidationSchema = Yup.object().shape({
    title: Yup.string().required('Required'),
  });

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
        .catch(() => {
          setUploadStatus(EUploadStatus.ERROR);
        });
    }
  };

  return (
    <>
      <div className="w-full max-w-lg m-auto p-2 bg-white rounded-lg shadow-md">
        <h1 className="text-lg text-center">Upload video page</h1>
        <hr className="my-2" />
        <input
          name="file"
          type="file"
          id="file"
          accept=".mp4,.mov"
          onChange={handleUpload}
          disabled={uploadStatus != EUploadStatus.NOT_STARTED}
          className="my-2"
        ></input>

        <Formik
          initialValues={initialValues}
          validationSchema={uploadValidationSchema}
          onSubmit={async (values, actions) => {
            const fullUri = `${endpoints.videos.base}/${videoId}`;
            apiFetch(fullUri, 'PATCH', values)
              .then(() => {
                actions.setSubmitting(false);
                navigate('/');
              })
              .catch();
          }}
        >
          {({ errors, touched }) => (
            <Form>
              <LabelledFieldComponent name="title" placeholder="video title" />
              <LabelledTextAreaComponent name="description" placeholder="video description" />
              <LabelledSelectComponent name="state" label="visibility">
                {selectableStates.map((state, index) => {
                  return (
                    <option key={index} value={state}>
                      {state}
                    </option>
                  );
                })}
              </LabelledSelectComponent>
              <ButtonComponent
                type="submit"
                color="blue"
                disabled={uploadStatus !== EUploadStatus.SUCCESS}
                className="w-full"
              >
                Upload
              </ButtonComponent>
              <ErrorMessageComponent errors={errors} touched={touched} />
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}

export default UploadVideoPage;