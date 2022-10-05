import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import HttpService from '../services/HttpService';
import { SecretAllowedProcessModel } from '../interfaces';

export default function SecretAllowedModelEdit() {
  const [secretAllowedModel, setSecretAllowedModel] =
    useState<SecretAllowedProcessModel | null>(null);
  const [allowedRelativePath, setPath] = useState(
    secretAllowedModel?.allowed_relative_path
  );
  const navigate = useNavigate();
  const params = useParams();

  const navigateToSecrets = (_result: any) => {
    navigate(`/admin/secrets`);
  };

  // const navigateToSecret = (_result: any) => {
  //   if (secretAllowedModel && secretAllowedModel.secret_id) {
  //     navigate(`/admin/secrets/${secretAllowedModel.secret_id}`);
  //   }
  // };

  useEffect(() => {
    HttpService.makeCallToBackend({
      path: `/secrets/allowed_process_paths/${params.id}`,
      successCallback: setSecretAllowedModel,
    });
  }, [params]);

  const updateAllowedModel = (event: any) => {
    event.preventDefault();
    if (secretAllowedModel) {
      HttpService.makeCallToBackend({
        path: `/secrets/allowed_process_paths/${params.id}`,
        successCallback: navigateToSecrets,
        httpMethod: 'PUT',
        postBody: {
          secret_id: secretAllowedModel.secret_id,
          allowed_relative_path: allowedRelativePath,
        },
      });
    }
  };

  if (secretAllowedModel) {
    return (
      <main style={{ padding: '1rem 0' }}>
        <h2>Edit Allowed Model: {params.id}</h2>
        <Form onSubmit={updateAllowedModel}>
          <Form.Group className="mb-3" controlId="formEditAllowedModel">
            <Form.Label>Relative Path to Model:</Form.Label>
            <Form.Control
              type="text"
              value={
                allowedRelativePath || secretAllowedModel.allowed_relative_path
              }
              onChange={(e) => setPath(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
          <Button variant="danger" type="button" onClick={navigateToSecrets}>
            Cancel
          </Button>
        </Form>
      </main>
    );
  }
  return null;
}
