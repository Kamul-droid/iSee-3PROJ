import React, { ChangeEvent, useState } from "react";
import endpoints from "../../api/endpoints";
import { apiFetch } from "../../api/apiFetch";
import { Field, Formik, Form } from "formik";

enum EUploadStatus {
    NOT_STARTED = "notStarted",
    IN_PROGRESS = "inProgress",
    SUCCESS = "success",
    ERROR = "error",
}

interface IVideoData {
    title: string;
    description: string;
  }

function UploadVideoPage() {

    const [uploadStatus, setUploadStatus] = useState(EUploadStatus.NOT_STARTED)
    const [videoId, setVideoId] = useState()

    const initialValues: IVideoData = {
        title       : "",
        description : ""
    } 

    const handleUpload = async (e: ChangeEvent) => {
        const target = e.target as HTMLInputElement
        const file = target.files?.[0]
        console.log(file)

        setUploadStatus(EUploadStatus.IN_PROGRESS)

        if (file) {
            const formData = new FormData();

            formData.append('file', file)

            apiFetch(
                endpoints.videos.base + '/upload',
                'POST',
                formData
            ).then((data) => {
                setVideoId(data._id)
                setUploadStatus(EUploadStatus.SUCCESS)
            })
            .catch((e) => {
                console.log(e);
                setUploadStatus(EUploadStatus.ERROR)
            })
        }
    }

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
        const fullUri = `${endpoints.videos.base}/${videoId}/upload-data`
            console.log(values, fullUri);
            apiFetch(fullUri, 'PATCH', values)
            .then(data => {
                console.log(data)
                actions.setSubmitting(false)
            })
            .catch(e => {
                console.log(e)
            })
        }}
        >
            <Form>
                <label htmlFor="title">Title</label>
                <Field id="title" name="title" placeholder="title" />
                <br />
                <label htmlFor="description">Description</label>
                <Field id="description" name="description" placeholder="description" />
                <br />

                <button type="submit" disabled={uploadStatus != EUploadStatus.SUCCESS}>Submit</button>
            </Form>
        </Formik>
        </>
    )
}

export default UploadVideoPage