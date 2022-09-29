import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Stack, Table, Button } from 'react-bootstrap';
import { MdDelete } from 'react-icons/md';
import HttpService from '../services/HttpService';
import { Secret } from '../interfaces';
import ButtonWithConfirmation from '../components/ButtonWithConfirmation';

export default function SecretShow() {
  const navigate = useNavigate();
  const params = useParams();

  const [secret, setSecret] = useState<Secret | null>(null);

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
    if (secret === null) {
      return;
    }
    HttpService.makeCallToBackend({
      path: `/secrets/${secret.key}`,
      successCallback: navigateToSecrets,
      httpMethod: 'DELETE',
    });
  };

  const deleteAllowedProcess = (id: any) => {
    alert(id);
  };

  const addAllowedProcess = (secretToUse: any) => {
    alert(secretToUse.id);
    // console.log(secretToUse);
  };

  const buildAllowedProcessesTable = (secretToUse: any) => {
    const rows = secretToUse.allowed_processes.map((row: any) => {
      return (
        <tr key={(row as any).key}>
          <td>{(row as any).id}</td>
          <td>{(row as any).allowed_relative_path}</td>
          <td>
            <MdDelete onClick={() => deleteAllowedProcess(secretToUse.id)} />
          </td>
        </tr>
      );
    });
    if (secretToUse.allowed_processes.length > 0) {
      return (
        <Table striped bordered>
          <thead>
            <tr>
              <th>ID</th>
              <th>Allowed Process Path</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      );
    }
    return <p>No Allowed Processes</p>;
  };

  if (secret) {
    const secretToUse = secret as any;

    return (
      <>
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
        <Stack direction="horizontal" gap={3}>
          <h3>Allowed Processes</h3>
          <Button onClick={() => addAllowedProcess(secretToUse)}>
            Add Process
          </Button>
        </Stack>
        <div>{buildAllowedProcessesTable(secretToUse)}</div>
      </>
    );
  }
  return null;
}
