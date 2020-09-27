import React, { useRef, useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { API, Storage } from "aws-amplify";
import { onError } from "../libs/errorLib";
import { s3Upload } from "../libs/awsLib";
import { Form } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./Notes.css";


export default function Notes() {
  const file = useRef(null);
  const { id } = useParams();
  const history = useHistory();
  const [note, setNote] = useState(null);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  function loadNote() {
    return API.get("notes", `/notes/${id}`);
  }
  function validateForm() {
    return content.length > 0;
  }
  function formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }
  function handleFileChange(event) {
    file.current = event.target.files[0];
  }

  async function handleSubmit(event) {
    let attachment;
    event.preventDefault();
    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(`Please pick a file smaller than
      ${config.MAX_ATTACHMENT_SIZE / 1000000} MB.`);
      return;
    }
    setIsLoading(true);
    try {
      if (file.current) {
        attachment = await s3Upload(file.current);
      }
      await saveNote({
        content,
        attachment: attachment || note.attachment
      });
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  async function handleDelete(event) {
    event.preventDefault();
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );
    if (!confirmed) {
      return;
    }
    setIsDeleting(true);
    try {
      await deleteNote();
      //TODO: on delete success
      //if delete the attached file
      history.push("/");
    } catch (e) {
      onError(e);
      setIsDeleting(false);
    }
  }

  function deleteNote() {
    return API.del("notes", `/notes/${id}`);
  }

  function saveNote(note) {
    return API.put("notes", `/notes/${id}`, {
      body: note
    });
  }

  useEffect(() => {

    async function onLoad() {
      try {
        const note = await loadNote();
        const { content, attachment } = note;
        debugger
        if (attachment) {
          note.attachmentURL = await Storage.vault.get(attachment);
        }

        setContent(content);
        setNote(note);
      } catch (e) {
        onError(e);
      }
    }
    onLoad();
  }, [id]);

  return (
    <div className="Notes">
      {note && (
        <form onSubmit={handleSubmit}>
          <Form.Group controlId="content">
            <Form.Control
              value={content}
              as="textarea"
              row={3}
              onChange={(e) => setContent(e.target.value)}
            />
          </Form.Group>
          {note.attachment && (
            <Form.Group>
              <Form.Label>Attachment</Form.Label>
              <p>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={note.attachmentURL}
                >
                  {formatFilename(note.attachment)}
                </a>
              </p>

              {/* </Form.Control> */}
            </Form.Group>
          )}
          <Form.Group controlId="file">
            {!note.attachment && <Form.Label>Attachment</Form.Label>}
            <Form.Control onChange={handleFileChange} type="file" />
          </Form.Group>
          <LoaderButton
            block
            type="submit"
            bsSize="large"
            bsStyle="primary"
            isLoading={isLoading}
            disabled={!validateForm()}
          >
            Save
          </LoaderButton>
          <LoaderButton
            block
            bsSize="large"
            bsStyle="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            Delete
          </LoaderButton>
        </form>
      )}
    </div>
  );
}
