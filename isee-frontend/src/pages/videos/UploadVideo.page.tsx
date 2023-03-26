import React, { ChangeEvent, useState } from "react";
import endpoints from "../../api/endpoints";
import { apiFetch } from "../../api/apiFetch";
import { Field, Formik, Form } from "formik";
import { EVideoVisibility } from "../../enums/EVideoVisibility";

enum EUploadStatus {
    NOT_STARTED = "notStarted",
    IN_PROGRESS = "inProgress",
    SUCCESS = "success",
    ERROR = "error",
}

interface IVideoData {
    title: string;
    description: string;
    visibility: EVideoVisibility;
  }

function UploadVideoPage() {

    const [uploadStatus, setUploadStatus] = useState(EUploadStatus.NOT_STARTED)
    const [videoId, setVideoId] = useState()

    const initialValues: IVideoData = {
        title       : "",
        description : "",
        visibility  : EVideoVisibility.PUBLIC,
    } 

    const handleUpload = async (e: ChangeEvent) => {
        const target = e.target as HTMLInputElement
        const file = target.files?.[0]

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
        const fullUri = `${endpoints.videos.base}/${videoId}`
            apiFetch(fullUri, 'PATCH', values)
            .then(data => {
                actions.setSubmitting(false)
            })
            .catch()
        }}
        >
            <Form>
                <label htmlFor="title">Title</label>
                <Field id="title" name="title" placeholder="title" />
                <br />
                <label htmlFor="description">Description</label>
                <Field id="description" name="description" placeholder="description" />
                <br />
                <Field as="select" name="visibility">
                    {
                        Object.values(EVideoVisibility).map((visibility, index) => {
                            return <option key={index} value={visibility}>{visibility}</option>
                        })
                    }
                </Field>
                <button type="submit" disabled={uploadStatus != EUploadStatus.SUCCESS}>Submit</button>
            </Form>
        </Formik>
        </>
    )
}

export default UploadVideoPage