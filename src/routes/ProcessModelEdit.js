import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BACKEND_BASE_URL } from '../config';
import { HOT_AUTH_TOKEN, STANDARD_HEADERS } from '../config';
import ProcessBreadcrumb from '../components/ProcessBreadcrumb'
import { slugifyString } from '../helpers'
import { Button, Stack } from 'react-bootstrap'

export default function ProcessModelEdit() {
  const [displayName, setDisplayName] = useState("");
  const params = useParams();
  const navigate = useNavigate();
  const [processModel, setProcessModel] = useState(null);

  const processModelPath = `process-models/${params.process_group_id}/${params.process_model_id}`

  useEffect(() => {
    fetch(`${BACKEND_BASE_URL}/${processModelPath}`, STANDARD_HEADERS)
      .then(res => res.json())
      .then(
        (result) => {
          setProcessModel(result);
          setDisplayName(result.display_name);
        },
        (error) => {
          console.log(error);
        }
      )
  }, [processModelPath]);

  const updateProcessModel = ((event) => {
    event.preventDefault()

    fetch(`${BACKEND_BASE_URL}/${processModelPath}`, {
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HOT_AUTH_TOKEN}`
      }),
      method: 'PUT',
      body: JSON.stringify({
        id: processModel.id,
        display_name: displayName,
        description: processModel.description,
        process_group_id: processModel.process_group_id,
        is_master_spec: processModel.is_master_spec,
        standalone: processModel.standalone,
        library: processModel.library,
      }),
    })
      .then(res => res.json())
      .then(
        (result) => {
          navigate(`/${processModelPath}`)
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (newError) => {
          console.log(newError);
        }
      )

  });

  const onDisplayNameChanged = ((newDisplayName) => {
    setDisplayName(newDisplayName);
  });

  if (processModel) {
    return (
      <main style={{ padding: "1rem 0" }}>
        <ProcessBreadcrumb processGroupId={processModel.id} />
        <h2>Edit Process Group: {processModel.id}</h2>
        <form onSubmit={updateProcessModel}>
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
            <Button variant="secondary" href={`/${processModelPath}`}>Cancel</Button>
          </Stack>
        </form>
      </main>
    );
  } else {
    return (<></>)
  }
}

