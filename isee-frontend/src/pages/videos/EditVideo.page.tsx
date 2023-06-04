import React, { useEffect } from 'react';
import endpoints from '../../api/endpoints';
import { apiFetch } from '../../api/apiFetch';
import { Formik, Form } from 'formik';
import { EVideoState } from '../../enums/EVideoState';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { IVideo } from '../../interfaces/IVideo';
import LabelledFieldComponent from '../../components/LabelledFieldComponent';
import LabelledTextAreaComponent from '../../components/LabelledTextAreaComponent';
import LabelledSelectComponent from '../../components/LabelledSelectComponent';
import ButtonComponent from '../../components/ButtonComponent';

const selectableStates = [EVideoState.PUBLIC, EVideoState.PRIVATE, EVideoState.UNLISTED];

function EditVideoPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { videoId } = useParams();

  const { data } = useQuery<IVideo>({
    queryKey: ['video', videoId],
    queryFn: () => apiFetch(`${endpoints.videos.base}/${videoId}`, 'GET'),
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
      <div className="w-max m-auto p-2 bg-white rounded-lg shadow-md">
        <h1 className="text-lg text-center">Edit video page</h1>
        <hr className="my-2" />

        {data && (
          <Formik
            initialValues={data}
            onSubmit={async (values, actions) => {
              const fullUri = `${endpoints.videos.base}/${videoId}`;
              const req = {
                title: values.title,
                description: values.description,
                state: values.state,
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
              <ButtonComponent type="submit" color="blue" className="w-full">
                Upload
              </ButtonComponent>
            </Form>
          </Formik>
        )}
        <ButtonComponent onClick={handleDeleteVideo} type="button" color="red" className="w-full">
          Delete
        </ButtonComponent>
      </div>
    </>
  );
}

export default EditVideoPage;
