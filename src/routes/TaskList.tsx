import { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import PaginationForTable from '../components/PaginationForTable';
import { getPageInfoFromSearchParams } from '../helpers';
import HttpService from '../services/HttpService';

export default function TaskList() {
  const [searchParams] = useSearchParams();
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    const { page, perPage } = getPageInfoFromSearchParams(searchParams);
    const setTasksFromResult = (result: any) => {
      setTasks(result.results);
      setPagination(result.pagination);
    };
    HttpService.makeCallToBackend({
      path: `/tasks?per_page=${perPage}&page=${page}`,
      successCallback: setTasksFromResult,
    });
  }, [searchParams]);

  const buildTable = () => {
    const rows = tasks.map((row) => {
      const rowToUse = row as any;
      const taskUrl = `/tasks/${rowToUse.process_instance_id}/${rowToUse.id}`;
      return (
        <tr key={rowToUse.id}>
          <td>
            <Link to={taskUrl}>{rowToUse.id}</Link>
          </td>
          <td>{rowToUse.process_instance_id}</td>
          <td>{rowToUse.state}</td>
          <td>
            <Button variant="primary" href={taskUrl}>
              Complete {rowToUse.name}
            </Button>
          </td>
        </tr>
      );
    });
    return (
      <Table striped bordered>
        <thead>
          <tr>
            <th>Id</th>
            <th>Process Instance Id</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    );
  };

  if (pagination) {
    const { page, perPage } = getPageInfoFromSearchParams(searchParams);
    return (
      <main>
        <h2>Tasks</h2>
        <PaginationForTable
          page={page}
          perPage={perPage}
          pagination={pagination}
          tableToDisplay={buildTable()}
          path="/tasks"
        />
      </main>
    );
  }
  return null;
}
