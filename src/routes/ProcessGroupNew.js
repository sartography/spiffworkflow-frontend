import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BACKEND_BASE_URL, HOT_AUTH_TOKEN } from '../config';
import ProcessBreadcrumb from '../components/ProcessBreadcrumb';
import { slugifyString } from '../helpers';

export default function ProcessGroupNew() {
  const [identifier, setIdentifier] = useState('');
  const [idHasBeenUpdatedByUser, setIdHasBeenUpdatedByUser] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const navigate = useNavigate();

  const addProcessGroup = (event) => {
    event.preventDefault();

    fetch(`${BACKEND_BASE_URL}/process-groups`, {
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${HOT_AUTH_TOKEN}`,
      }),
      method: 'POST',
      body: JSON.stringify({
        id: identifier,
        display_name: displayName,
      }),
    }).then(
      () => {
        navigate(`/process-groups/${identifier}`);
      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      (newError) => {
        console.log(newError);
      }
    );
  };

  const onDisplayNameChanged = (newDisplayName) => {
    setDisplayName(newDisplayName);
    if (!idHasBeenUpdatedByUser) {
      setIdentifier(slugifyString(newDisplayName));
    }
  };

  return (
    <main style={{ padding: '1rem 0' }}>
      <ProcessBreadcrumb />
      <h2>Add Process Group</h2>
      <form onSubmit={addProcessGroup}>
        <label>Display Name:</label>
        <input
          name="display_name"
          type="text"
          value={displayName}
          onChange={(e) => onDisplayNameChanged(e.target.value)}
        />
        <br />
        <label>ID:</label>
        <input
          name="id"
          type="text"
          value={identifier}
          onChange={(e) => {
            setIdentifier(e.target.value);
            setIdHasBeenUpdatedByUser(true);
          }}
        />
        <br />
        <button type="submit">Submit</button>
      </form>
    </main>
  );
}
