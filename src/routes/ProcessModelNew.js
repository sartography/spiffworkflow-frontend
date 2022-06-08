import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BACKEND_BASE_URL } from '../config';
import { HOT_AUTH_TOKEN } from '../config';
import ProcessBreadcrumb from '../components/ProcessBreadcrumb'
import { slugifyString } from '../helpers'

export default function ProcessModelNew(props) {
  let params = useParams();

  const [error, setError] = useState(null);
  const [identifier, setIdentifier] = useState("");
  const [idHasBeenUpdatedByUser, setIdHasBeenUpdatedByUser] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const navigate = useNavigate();

  const addProcessModel = ((event) => {
    event.preventDefault()

    fetch(`${BACKEND_BASE_URL}/process-models`, {
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HOT_AUTH_TOKEN}`
      }),
      method: 'POST',
      body: JSON.stringify({
        id: identifier,
        display_name: displayName,
        description: displayName,
        process_group_id: params.process_group_id,
        is_master_spec: false,
        standalone: false,
        library: false,
      }),
    })
      .then(res => res.json())
      .then(
        (result) => {
          navigate(`/process-models/${identifier}`)
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
      setIdentifier(slugifyString(newDisplayName));
    }
  });

  return (
    <main style={{ padding: "1rem 0" }}>
      <ProcessBreadcrumb />
      <h2>Add Process Model</h2>
      <form onSubmit={addProcessModel}>
        <label>Display Name:</label>
        <input
          name='display_name'
          type='text'
          value={displayName}
          onChange={e => onDisplayNameChanged(e.target.value)}
        />
        <br />
        <label>ID:</label>
        <input
          name='id'
          type='text'
          value={identifier}
          onChange={e => { setIdentifier(e.target.value); setIdHasBeenUpdatedByUser(true)} }
        />
        <br />
        <button type="submit">Submit</button>
      </form>
    </main>
  );
}
