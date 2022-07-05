import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Stack } from 'react-bootstrap';
import { BACKEND_BASE_URL, HOT_AUTH_TOKEN, STANDARD_HEADERS } from '../config';
import ProcessBreadcrumb from '../components/ProcessBreadcrumb';

export default function ProcessGroupEdit() {
  const [displayName, setDisplayName] = useState('');
  const params = useParams();
  const navigate = useNavigate();
  const [processGroup, setProcessGroup] = useState(null);

  useEffect(() => {
    fetch(
      `${BACKEND_BASE_URL}/process-groups/${params.process_group_id}`,
      STANDARD_HEADERS
    )
      .then((res) => res.json())
      .then(
        (result) => {
          setProcessGroup(result);
          setDisplayName(result.display_name);
        },
        (error) => {
          console.log(error);
        }
      );
  }, [params]);

  const updateProcessGroup = (event: any) => {
    event.preventDefault();

    // @ts-expect-error TS(2531): Object is possibly 'null'.
    fetch(`${BACKEND_BASE_URL}/process-groups/${processGroup.id}`, {
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${HOT_AUTH_TOKEN}`,
      }),
      method: 'PUT',
      body: JSON.stringify({
        display_name: displayName,
        // @ts-expect-error TS(2531): Object is possibly 'null'.
        id: processGroup.id,
      }),
    }).then(
      () => {
        // @ts-expect-error TS(2531): Object is possibly 'null'.
        navigate(`/admin/process-groups/${processGroup.id}`);
      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      (newError) => {
        console.log(newError);
      }
    );
  };

  const deleteProcessGroup = () => {
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    fetch(`${BACKEND_BASE_URL}/process-groups/${processGroup.id}`, {
      headers: new Headers({
        Authorization: `Bearer ${HOT_AUTH_TOKEN}`,
      }),
      method: 'DELETE',
    }).then(
      () => {
        navigate(`/process-groups`);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  const onDisplayNameChanged = (newDisplayName: any) => {
    setDisplayName(newDisplayName);
  };

  if (processGroup) {
    return (
      <main style={{ padding: '1rem 0' }}>
        <ProcessBreadcrumb processGroupId={(processGroup as any).id} />
        <h2>Edit Process Group: {(processGroup as any).id}</h2>
        <form onSubmit={updateProcessGroup}>
          <label>Display Name:</label>
          <input
            name="display_name"
            type="text"
            value={displayName}
            onChange={(e) => onDisplayNameChanged(e.target.value)}
          />
          <br />
          <br />
          <Stack direction="horizontal" gap={3}>
            <Button type="submit">Submit</Button>
            <Button
              variant="secondary"
              href={`/admin/process-groups/${(processGroup as any).id}`}
            >
              Cancel
            </Button>
            <Button onClick={deleteProcessGroup} variant="danger">
              Delete Process Group
            </Button>
          </Stack>
        </form>
      </main>
    );
  }
}
