import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProcessBreadcrumb from '../components/ProcessBreadcrumb';
import { slugifyString } from '../helpers';
import HttpService from '../services/HttpService';

export default function ProcessGroupNew() {
  const [identifier, setIdentifier] = useState('');
  const [idHasBeenUpdatedByUser, setIdHasBeenUpdatedByUser] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const navigate = useNavigate();

  const navigateToProcessGroup = (_result: any) => {
    navigate(`/admin/process-groups/${identifier}`);
  };

  const addProcessGroup = (event: any) => {
    event.preventDefault();
    HttpService.makeCallToBackend({
      path: `/process-groups`,
      successCallback: navigateToProcessGroup,
      httpMethod: 'POST',
      postBody: {
        id: identifier,
        display_name: displayName,
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
