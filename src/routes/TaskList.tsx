import { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import PaginationForTable, {
  DEFAULT_PER_PAGE,
  DEFAULT_PAGE,
} from '../components/PaginationForTable';
import HttpService from '../services/HttpService';

export default function TaskList() {
  const [searchParams] = useSearchParams();
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    const page = parseInt(
      searchParams.get('page') || DEFAULT_PAGE.toString(),
      10
    );
    const perPage = parseInt(
      searchParams.get('per_page') || DEFAULT_PER_PAGE.toString(),
      10
    );
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
              Start
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
    const perPage = parseInt(
      searchParams.get('per_page') || DEFAULT_PER_PAGE.toString(),
      10
    );
    const page = parseInt(
      searchParams.get('page') || DEFAULT_PAGE.toString(),
      10
    );
    return (
      <main>
        <h2>Tasks</h2>
        <PaginationForTable
          page={page}
          perPage={perPage}
          pagination={pagination}
          // @ts-expect-error TS(2322) FIXME: Type 'Element' is not assignable to type 'string'.
          tableToDisplay={buildTable()}
          path="/tasks"
        />
      </main>
    );
  }
  return null;
}
