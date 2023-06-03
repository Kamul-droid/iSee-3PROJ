import React, { useState } from 'react';
import getUser from '../helpers/getUser';
import ButtonComponent from './ButtonComponent';
import { Form, Formik } from 'formik';
import LabelledFieldComponent from './LabelledFieldComponent';

export function ChatFormComponent(props: any) {
  const [isLoading, setIsLoading] = useState(false);

  const { socket, videoId } = props;

  const initialValues = {
    message: '',
  };

  const handlesubmit = (values: any, actions: any) => {
    setIsLoading(true);

    socket.timeout(2000).emit('chat', { message: values.message, user: getUser(), videoId }, () => {
      setIsLoading(false);
      actions.resetForm();
    });
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handlesubmit}>
      <Form className="flex items-center mt-2">
        <LabelledFieldComponent
          name="message"
          label=""
          placeholder="Send a message to the chat"
          className="grow shrink min-w-0"
          hideLabel={true}
        />

        <ButtonComponent type="submit" text="send" disabled={isLoading} className="ml-2 px-5 shrink" />
      </Form>
    </Formik>
  );
}
