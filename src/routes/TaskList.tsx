import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import PaginationForTable, {
  DEFAULT_PER_PAGE,
  DEFAULT_PAGE,
} from '../components/PaginationForTable';
import { BACKEND_BASE_URL, HOT_AUTH_TOKEN } from '../config';

export default function TaskList() {
  const [searchParams] = useSearchParams();
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    // @ts-expect-error TS(2345) FIXME: Argument of type 'string | 1' is not assignable to... Remove this comment to see the full error message
    const page = parseInt(searchParams.get('page') || DEFAULT_PAGE, 10);
    const perPage = parseInt(
      // @ts-expect-error TS(2345) FIXME: Argument of type 'string | 50' is not assignable t... Remove this comment to see the full error message
      searchParams.get('per_page') || DEFAULT_PER_PAGE,
      10
    );
    fetch(
      `${BACKEND_BASE_URL}/tasks/my-tasks?per_page=${perPage}&page=${page}`,
      {
        headers: new Headers({
          Authorization: `Bearer ${HOT_AUTH_TOKEN}`,
        }),
      }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          setTasks(result.results);
          setPagination(result.pagination);
        },
        (newError) => {
          console.log(newError);
        }
      );
  }, [searchParams]);

  const buildTable = () => {
    const rows = tasks.map((row) => {
      return (
        <tr key={(row as any).id}>
          <td>
            <Link to={`/tasks/${(row as any).id}`}>{(row as any).id}</Link>
          </td>
          <td>{(row as any).process_instance_id}</td>
          <td>{(row as any).status}</td>
          <td>
            <Button variant="primary" href={`/tasks/${(row as any).id}`}>
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
      // @ts-expect-error TS(2345) FIXME: Argument of type 'string | 50' is not assignable t... Remove this comment to see the full error message
      searchParams.get('per_page') || DEFAULT_PER_PAGE,
      10
    );
    // @ts-expect-error TS(2345) FIXME: Argument of type 'string | 1' is not assignable to... Remove this comment to see the full error message
    const page = parseInt(searchParams.get('page') || DEFAULT_PAGE, 10);
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
