import React, { useState, useEffect } from "react";
import { API } from "aws-amplify";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import "./Home.css";
const Home = () => {
  const [notes, setNotes] = useState([]);
  const { isAuthenticated, setLoader } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  function renderNotesList(notes) {
    return [{}].concat(notes).map((note, i) =>
      i !== 0 ? (
        <Link key={note.noteId} to={`/notes/${note.noteId}`}>
          <ListGroupItem header={note.content.trim().split("\n")[0]}>
            {"Created: " + new Date(note.createdAt).toLocaleString()}
          </ListGroupItem>
        </Link>
      ) : (
        <Link key="new" to="/notes/new">
          <ListGroupItem>
            <h4>
              <b>{"\uFF0B"}</b> Create a new note
            </h4>
          </ListGroupItem>
        </Link>
      )
    );
  }
  function renderLander() {
    return (
      <div className="lander">
        <h1>Notes</h1>
        <p>A simple note taking app</p>
      </div>
    );
  }

  function renderNotes() {
    return (
      <div className="notes">
        <h1>Your Notes</h1>
        <ListGroup>{!isLoading && renderNotesList(notes)}</ListGroup>
      </div>
    );
  }

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }
      try {
        setLoader(true);
        const notes = await loadNotes();
        setNotes(notes);
      } catch (e) {
        setLoader(false);
        onError(e);
      }
      setLoader(false);
      setIsLoading(false);
    }
    onLoad();
  }, [isAuthenticated]);
  function loadNotes() {
    return API.get("notes", "/notes");
  }
  return (
    <div className="Home">
      {isAuthenticated ? renderNotes() : renderLander()}
    </div>
  );
};

export default Home;
