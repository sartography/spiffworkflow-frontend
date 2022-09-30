import { useState } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import HttpService from '../services/HttpService';

export default function SecretAllowedModelNew() {
  const [allowedRelativePath, setPath] = useState('');
  const [key, setKey] = useState('');
  const navigate = useNavigate();
  const params = useParams();

  const navigateToSecret = (_result: any) => {
    alert(`/admin/secrets/${params.secret}`);
    navigate(`/admin/secrets/${params.secret}`);
  };

  const navigateToSecrets = () => {
    navigate(`/admin/secrets`);
  };

  const addAllowedModel = (event: any) => {
    event.preventDefault();
    HttpService.makeCallToBackend({
      path: `/secrets/allowed_process_paths`,
      successCallback: navigateToSecret,
      httpMethod: 'POST',
      postBody: {
        secret_key: params.secret,
        allowed_relative_path: allowedRelativePath,
      },
    });
  };

  return (
    <main style={{ padding: '1rem 0' }}>
      <h2>Secret: {params.secret}</h2>
      <br />
      <h3>Add Allowed Model</h3>
      <Form onSubmit={addAllowedModel}>
        <Form.Group className="mb-3" controlId="formDisplayName">
          <Form.Label>Relative path to model:</Form.Label>
          <Form.Control
            type="text"
            value={allowedRelativePath}
            onChange={(e) => setPath(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
        <Button variant="danger" type="button" onClick={navigateToSecret}>
          Cancel
        </Button>
      </Form>
    </main>
  );
}
