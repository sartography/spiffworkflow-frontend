import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BACKEND_BASE_URL } from '../config';
import { HOT_AUTH_TOKEN, STANDARD_HEADERS } from '../config';
import ProcessBreadcrumb from '../components/ProcessBreadcrumb'
import { Button, Stack } from 'react-bootstrap'

export default function ProcessGroupEdit() {
  const [displayName, setDisplayName] = useState("");
  const params = useParams();
  const navigate = useNavigate();
  const [processGroup, setProcessGroup] = useState(null);

  useEffect(() => {
    fetch(`${BACKEND_BASE_URL}/process-groups/${params.process_group_id}`, STANDARD_HEADERS)
      .then(res => res.json())
      .then(
        (result) => {
          setProcessGroup(result);
          setDisplayName(result.display_name);
        },
        (error) => {
          console.log(error);
        }
      )
  }, [params]);

  const updateProcessGroup = ((event) => {
    event.preventDefault()

    fetch(`${BACKEND_BASE_URL}/process-groups/${processGroup.id}`, {
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HOT_AUTH_TOKEN}`
      }),
      method: 'PUT',
      body: JSON.stringify({
        display_name: displayName,
        id: processGroup.id,
      }),
    })
      .then(res => res.json())
      .then(
        (result) => {
          navigate(`/process-groups/${processGroup.id}`)
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (newError) => {
          console.log(newError);
        }
      )

  });

  const deleteProcessGroup = (() => {
    fetch(`${BACKEND_BASE_URL}/process-groups/${processGroup.id}`, {
      headers: new Headers({
        'Authorization': `Bearer ${HOT_AUTH_TOKEN}`
      }),
      method: 'DELETE',
    })
      .then(res => res.json())
      .then(
        (result) => {
          navigate(`/process-groups`);
        },
        (error) => {
          console.log(error);
        }
      )
  });

  const onDisplayNameChanged = ((newDisplayName) => {
    setDisplayName(newDisplayName);
  });

  if (processGroup) {
    return (
      <main style={{ padding: "1rem 0" }}>
        <ProcessBreadcrumb processGroupId={processGroup.id} />
        <h2>Edit Process Group: {processGroup.id}</h2>
        <form onSubmit={updateProcessGroup}>
          <label>Display Name:</label>
          <input
            name='display_name'
            type='text'
            value={displayName}
            onChange={e => onDisplayNameChanged(e.target.value)}
          />
          <br />
          <br />
          <Stack direction="horizontal" gap={3}>
            <Button type="submit">Submit</Button>
            <Button variant="secondary" href={`/process-groups/${processGroup.id}`}>Cancel</Button>
            <Button onClick={deleteProcessGroup} variant="danger">Delete Process Group</Button>
          </Stack>
        </form>
      </main>
    );
  } else {
    return (<></>)
  }
}

