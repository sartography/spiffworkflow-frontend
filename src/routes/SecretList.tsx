import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Table } from 'react-bootstrap';
import { MdDelete } from 'react-icons/md';
import PaginationForTable from '../components/PaginationForTable';
import HttpService from '../services/HttpService';
import { getPageInfoFromSearchParams } from '../helpers';

export default function SecretList() {
  const [searchParams] = useSearchParams();

  const [secrets, setSecrets] = useState([]);
  const navigate = useNavigate();
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    const setSecretsFromResult = (result: any) => {
      setSecrets(result.results);
      setPagination(result.pagination);
    };
    const { page, perPage } = getPageInfoFromSearchParams(searchParams);
    HttpService.makeCallToBackend({
      path: `/secrets?per_page=${perPage}&page=${page}`,
      successCallback: setSecretsFromResult,
    });
  }, [searchParams]);

  const navigateToSecrets = () => {
    console.log('navigateToSecrets');
    navigate(`/admin/secrets`);
  };

  const handleDeleteSecret = (key: any) => {
    HttpService.makeCallToBackend({
      path: `/secrets/${key}`,
      successCallback: navigateToSecrets,
      httpMethod: 'DELETE',
    });
  };

  const buildTable = () => {
    const rows = secrets.map((row) => {
      return (
        <tr key={(row as any).key}>
          <td>
            <Link to={`/admin/secrets/${(row as any).key}`}>
              {(row as any).id}
            </Link>
          </td>
          <td>
            <Link to={`/admin/secrets/${(row as any).key}`}>
              {(row as any).key}
            </Link>
          </td>
          <td>{(row as any).value}</td>
          <td>{(row as any).username}</td>
          <td>
            <MdDelete onClick={() => handleDeleteSecret((row as any).key)} />
          </td>
        </tr>
      );
    });
    return (
      <Table striped bordered>
        <thead>
          <tr>
            <th>ID</th>
            <th>Secret Key</th>
            <th>Secret Value</th>
            <th>Creator</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    );
  };

  const SecretsDisplayArea = () => {
    const { page, perPage } = getPageInfoFromSearchParams(searchParams);
    let displayText = null;
    if (secrets?.length > 0) {
      displayText = (
        <PaginationForTable
          page={page}
          perPage={perPage}
          pagination={pagination as any}
          tableToDisplay={buildTable()}
          path="/admin/secrets"
        />
      );
    } else {
      displayText = <p>No Secrets to Display</p>;
    }
    return displayText;
  };

  if (pagination) {
    return (
      <main style={{ padding: '1rem 0' }}>
        <Button href="/admin/secrets/new">Add a secret</Button>
        <br />
        <br />
        {SecretsDisplayArea()}
      </main>
    );
  }
  return null;
}