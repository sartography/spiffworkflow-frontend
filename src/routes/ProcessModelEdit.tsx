import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Stack } from 'react-bootstrap';
import { BACKEND_BASE_URL, HOT_AUTH_TOKEN, STANDARD_HEADERS } from '../config';
import ProcessBreadcrumb from '../components/ProcessBreadcrumb';

export default function ProcessModelEdit() {
  const [displayName, setDisplayName] = useState('');
  const params = useParams();
  const navigate = useNavigate();
  const [processModel, setProcessModel] = useState(null);

  const processModelPath = `process-models/${params.process_group_id}/${params.process_model_id}`;

  useEffect(() => {
    fetch(`${BACKEND_BASE_URL}/${processModelPath}`, STANDARD_HEADERS)
      .then((res) => res.json())
      .then(
        (result) => {
          setProcessModel(result);
          setDisplayName(result.display_name);
        },
        (error) => {
          console.log(error);
        }
      );
  }, [processModelPath]);

  const updateProcessModel = (event: any) => {
    event.preventDefault();

    fetch(`${BACKEND_BASE_URL}/${processModelPath}`, {
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${HOT_AUTH_TOKEN}`,
      }),
      method: 'PUT',
      body: JSON.stringify({
        // @ts-expect-error TS(2531) FIXME: Object is possibly 'null'.
        id: processModel.id,
        display_name: displayName,
        // @ts-expect-error TS(2531) FIXME: Object is possibly 'null'.
        description: processModel.description,
        // @ts-expect-error TS(2531) FIXME: Object is possibly 'null'.
        process_group_id: processModel.process_group_id,
        // @ts-expect-error TS(2531) FIXME: Object is possibly 'null'.
        is_master_spec: processModel.is_master_spec,
        // @ts-expect-error TS(2531) FIXME: Object is possibly 'null'.
        standalone: processModel.standalone,
        // @ts-expect-error TS(2531) FIXME: Object is possibly 'null'.
        library: processModel.library,
      }),
    }).then(
      () => {
        navigate(`/admin/${processModelPath}`);
      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      (newError) => {
        console.log(newError);
      }
    );
  };

  const deleteProcessModel = () => {
    // @ts-expect-error TS(2531) FIXME: Object is possibly 'null'.
    const processModelShowPath = `${BACKEND_BASE_URL}/process-models/${processModel.process_group_id}/${processModel.id}`;
    fetch(processModelShowPath, {
      headers: new Headers({
        Authorization: `Bearer ${HOT_AUTH_TOKEN}`,
      }),
      method: 'DELETE',
    }).then(
      () => {
        navigate(`/admin/process-groups/${params.process_group_id}`);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  const onDisplayNameChanged = (newDisplayName: any) => {
    setDisplayName(newDisplayName);
  };

  if (processModel) {
    return (
      <main style={{ padding: '1rem 0' }}>
        <ProcessBreadcrumb processGroupId={(processModel as any).id} />
        <h2>Edit Process Group: {(processModel as any).id}</h2>
        <form onSubmit={updateProcessModel}>
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
            <Button variant="secondary" href={`/${processModelPath}`}>
              Cancel
            </Button>
            <Button onClick={deleteProcessModel} variant="danger">
              Delete process model
            </Button>
          </Stack>
        </form>
      </main>
    );
  }
}
