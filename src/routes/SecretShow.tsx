import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Stack, Table } from 'react-bootstrap';
import ProcessBreadcrumb from '../components/ProcessBreadcrumb';
import HttpService from '../services/HttpService';
import ButtonWithConfirmation from '../components/ButtonWithConfirmation';

export default function SecretShow() {
  const navigate = useNavigate();
  const params = useParams();

  const [secret, setSecret] = useState(null);

  const navigateToSecrets = (_result: any) => {
    navigate(`/admin/secrets`);
  };

  useEffect(() => {
    HttpService.makeCallToBackend({
      path: `/secrets/${params.key}`,
      successCallback: setSecret,
    });
  }, [params]);

  const deleteSecret = () => {
    HttpService.makeCallToBackend({
      path: `/process-models/${params.process_group_id}/${params.process_model_id}/process-instances/${params.process_instance_id}`,
      successCallback: navigateToSecrets,
      httpMethod: 'DELETE',
    });
  };

  if (secret) {
    console.log('secret: ', secret);
    const secretToUse = secret as any;

    return (
      <main style={{ padding: '1rem 0' }}>
        <Stack direction="horizontal" gap={3}>
          <h2>Secret Key: {secretToUse.key}</h2>
          <ButtonWithConfirmation
            description="Delete Secret?"
            onConfirmation={deleteSecret}
            buttonLabel="Delete"
          />
        </Stack>
        <div>
          <Table striped bordered>
            <thead>
              <tr>
                <th>Key</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{params.key}</td>
                <td>{secretToUse.value}</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </main>
    );
  }
  return null;
}
