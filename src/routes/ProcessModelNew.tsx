import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProcessBreadcrumb from '../components/ProcessBreadcrumb';
import { slugifyString } from '../helpers';
import HttpService from '../services/HttpService';

export default function ProcessModelNew() {
  const params = useParams();

  const [identifier, setIdentifier] = useState('');
  const [idHasBeenUpdatedByUser, setIdHasBeenUpdatedByUser] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const navigate = useNavigate();

  const navigateToNewProcessModel = (_result: any) => {
    navigate(`/admin/process-models/${params.process_group_id}/${identifier}`);
  };

  const addProcessModel = (event: any) => {
    event.preventDefault();
    HttpService.makeCallToBackend({
      path: `/process-models`,
      successCallback: navigateToNewProcessModel,
      httpMethod: 'POST',
      postBody: {
        id: identifier,
        display_name: displayName,
        description: displayName,
        process_group_id: params.process_group_id,
        is_master_spec: false,
        standalone: false,
        library: false,
      },
    });
  };

  const onDisplayNameChanged = (newDisplayName: any) => {
    setDisplayName(newDisplayName);
    if (!idHasBeenUpdatedByUser) {
      setIdentifier(slugifyString(newDisplayName));
    }
  };

  return (
    <main style={{ padding: '1rem 0' }}>
      <ProcessBreadcrumb />
      <h2>Add Process Model</h2>
      <form onSubmit={addProcessModel}>
        <label htmlFor="display_name">
          Display Name:
          <input
            name="display_name"
            id="display_name"
            type="text"
            value={displayName}
            onChange={(e) => onDisplayNameChanged(e.target.value)}
          />
        </label>
        <br />
        <label htmlFor="id">
          ID:
          <input
            name="id"
            id="id"
            type="text"
            value={identifier}
            onChange={(e) => {
              setIdentifier(e.target.value);
              setIdHasBeenUpdatedByUser(true);
            }}
          />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    </main>
  );
}
