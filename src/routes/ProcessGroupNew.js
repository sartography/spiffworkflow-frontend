import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_BASE_URL } from '../config';
import { HOT_AUTH_TOKEN } from '../config';
import ProcessBreadcrumb from '../components/ProcessBreadcrumb'
import { slugifyString } from '../helpers'

export default function ProcessGroupNew() {
  const [error, setError] = useState(null);
  const [id, setId] = useState("");
  const [idHasBeenUpdatedByUser, setIdHasBeenUpdatedByUser] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const navigate = useNavigate();

  const addProcessGroup = ((event) => {
    event.preventDefault()

    fetch(`${BACKEND_BASE_URL}/process-groups`, {
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HOT_AUTH_TOKEN}`
      }),
      method: 'POST',
      body: JSON.stringify({
        id: id,
        display_name: displayName,
      }),
    })
      .then(res => res.json())
      .then(
        (result) => {
          navigate(`/process-groups/${id}`)
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (newError) => {
          console.log(newError);
          setError(newError);
        }
      )

  });

  const onDisplayNameChanged = ((newDisplayName) => {
    setDisplayName(newDisplayName);
    if (!idHasBeenUpdatedByUser) {
      setId(slugifyString(newDisplayName));
    }
  });

  return (
    <main style={{ padding: "1rem 0" }}>
      <ProcessBreadcrumb />
      <h2>Add Process Group</h2>
      <form onSubmit={addProcessGroup}>
        <label>ID:</label>
        <input
          name='id'
          type='text'
          value={id}
          onChange={e => { setId(e.target.value); setIdHasBeenUpdatedByUser(true)} }
        />
        <br />
        <label>Display Name:</label>
        <input
          name='display_name'
          type='text'
          value={displayName}
          onChange={e => onDisplayNameChanged(e.target.value)}
        />
        <br />
        <button type="submit">Submit</button>
      </form>
    </main>
  );
}
