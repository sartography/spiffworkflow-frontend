import { useContext, useEffect, useMemo, useState } from 'react';
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';

import { Button, Table, Stack, Dropdown } from 'react-bootstrap';
// @ts-expect-error TS(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import DatePicker from 'react-datepicker';
import { PROCESS_STATUSES, DATE_FORMAT } from '../config';
import ProcessBreadcrumb from '../components/ProcessBreadcrumb';
import {
  convertDateToSeconds,
  convertSecondsToFormattedDate,
} from '../helpers';

import PaginationForTable, {
  DEFAULT_PER_PAGE,
  DEFAULT_PAGE,
} from '../components/PaginationForTable';
import 'react-datepicker/dist/react-datepicker.css';

import ErrorContext from '../contexts/ErrorContext';
import HttpService from '../services/HttpService';

export default function ProcessInstanceList() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [processInstances, setProcessInstances] = useState([]);
  const [pagination, setPagination] = useState(null);

  const oneHourInSeconds = 3600;
  const oneMonthInSeconds = oneHourInSeconds * 24 * 30;
  const [startFrom, setStartFrom] = useState(null);
  const [startTill, setStartTill] = useState(null);
  const [endFrom, setEndFrom] = useState(null);
  const [endTill, setEndTill] = useState(null);

  const setErrorMessage = (useContext as any)(ErrorContext)[1];

  const [processStatus, setProcessStatus] = useState(PROCESS_STATUSES[0]);
  const parametersToAlwaysFilterBy = useMemo(() => {
    return {
      start_from: setStartFrom,
      start_till: setStartTill,
      end_from: setEndFrom,
      end_till: setEndTill,
    };
  }, [setStartFrom, setStartTill, setEndFrom, setEndTill]);

  useEffect(() => {
    function setProcessInstancesFromResult(result: any) {
      const processInstancesFromApi = result.results;
      setProcessInstances(processInstancesFromApi);
      setPagination(result.pagination);
    }
    function getProcessInstances() {
      const page = searchParams.get('page') || DEFAULT_PAGE;
      const perPage = parseInt(
        // @ts-expect-error TS(2345) FIXME: Argument of type 'string | 50' is not assignable t... Remove this comment to see the full error message
        searchParams.get('per_page') || DEFAULT_PER_PAGE,
        10
      );
      let queryParamString = `per_page=${perPage}&page=${page}`;

      Object.keys(parametersToAlwaysFilterBy).forEach((paramName) => {
        // @ts-expect-error TS(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        const functionToCall = parametersToAlwaysFilterBy[paramName];
        const searchParamValue = searchParams.get(paramName);
        if (searchParamValue) {
          queryParamString += `&${paramName}=${searchParamValue}`;
          functionToCall(searchParamValue);
        }
      });

      if (searchParams.get('process_status')) {
        queryParamString += `&process_status=${searchParams.get(
          'process_status'
        )}`;
        // @ts-expect-error TS(2345) FIXME: Argument of type 'string | null' is not assignable... Remove this comment to see the full error message
        setProcessStatus(searchParams.get('process_status'));
      }

      HttpService.makeCallToBackend({
        path: `/process-models/${params.process_group_id}/${params.process_model_id}/process-instances?${queryParamString}`,
        successCallback: setProcessInstancesFromResult,
      });
    }

    getProcessInstances();
  }, [
    searchParams,
    params,
    oneMonthInSeconds,
    oneHourInSeconds,
    parametersToAlwaysFilterBy,
  ]);

  // does the comparison, but also returns false if either argument
  // is not truthy and therefore not comparable.
  const isTrueComparison = (param1: any, operation: any, param2: any) => {
    if (param1 && param2) {
      switch (operation) {
        case '<':
          return param1 < param2;
        case '>':
          return param1 > param2;
        default:
          return false;
      }
    } else {
      return false;
    }
  };

  const handleFilter = (event: any) => {
    event.preventDefault();
    const page = searchParams.get('page') || DEFAULT_PAGE;
    const perPage = parseInt(
      // @ts-expect-error TS(2345) FIXME: Argument of type 'string | 50' is not assignable t... Remove this comment to see the full error message
      searchParams.get('per_page') || DEFAULT_PER_PAGE,
      10
    );
    let queryParamString = `per_page=${perPage}&page=${page}`;

    if (isTrueComparison(startFrom, '>', startTill)) {
      setErrorMessage('startFrom cannot be after startTill');
      return;
    }
    if (isTrueComparison(endFrom, '>', endTill)) {
      setErrorMessage('endFrom cannot be after endTill');
      return;
    }
    if (isTrueComparison(startFrom, '>', endFrom)) {
      setErrorMessage('startFrom cannot be after endFrom');
      return;
    }
    if (isTrueComparison(startTill, '>', endTill)) {
      setErrorMessage('startTill cannot be after endTill');
      return;
    }

    if (startFrom) {
      queryParamString += `&start_from=${startFrom}`;
    }
    if (startTill) {
      queryParamString += `&start_till=${startTill}`;
    }
    if (endFrom) {
      queryParamString += `&end_from=${endFrom}`;
    }
    if (endTill) {
      queryParamString += `&end_till=${endTill}`;
    }
    if (processStatus && processStatus !== 'all') {
      queryParamString += `&process_status=${processStatus}`;
    }

    setErrorMessage('');
    navigate(
      `/admin/process-models/${params.process_group_id}/${params.process_model_id}/process-instances?${queryParamString}`
    );
  };

  const dateComponent = (
    labelString: any,
    name: any,
    initialDate: any,
    onChangeFunction: any
  ) => {
    let selectedDate = null;
    if (initialDate) {
      selectedDate = new Date(initialDate * 1000);
    }
    return (
      <Stack className="ms-auto" direction="horizontal" gap={3}>
        <label className="text-nowrap">{labelString}</label>
        <DatePicker
          id={`date-picker-${name}`}
          selected={selectedDate}
          onChange={(date: any) => convertDateToSeconds(date, onChangeFunction)}
          showTimeSelect
          dateFormat={DATE_FORMAT}
        />
      </Stack>
    );
  };

  const getSearchParamsAsQueryString = () => {
    let queryParamString = '';
    Object.keys(parametersToAlwaysFilterBy).forEach((paramName) => {
      const searchParamValue = searchParams.get(paramName);
      if (searchParamValue) {
        queryParamString += `&${paramName}=${searchParamValue}`;
      }
    });
    return queryParamString;
  };

  const filterOptions = () => {
    const processStatusesRows = PROCESS_STATUSES.map((processStatusOption) => {
      if (processStatusOption === processStatus) {
        return (
          <Dropdown.Item key={processStatusOption} active>
            {processStatusOption}
          </Dropdown.Item>
        );
      }
      return (
        <Dropdown.Item
          key={processStatusOption}
          onClick={() => setProcessStatus(processStatusOption)}
        >
          {processStatusOption}
        </Dropdown.Item>
      );
    });

    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <form onSubmit={handleFilter}>
              <Stack direction="horizontal" gap={3}>
                {dateComponent(
                  'Start Range: ',
                  'start-from',
                  startFrom,
                  setStartFrom
                )}
                {dateComponent('-', 'start-till', startTill, setStartTill)}
              </Stack>
              <br />
              <Stack direction="horizontal" gap={3}>
                {dateComponent('End Range: ', 'end-from', endFrom, setEndFrom)}
                {dateComponent('-', 'end-till', endTill, setEndTill)}
              </Stack>
              <br />
              <Stack direction="horizontal" gap={3}>
                <Dropdown
                  data-qa="process-status-dropdown"
                  id="process-status-dropdown"
                >
                  <Dropdown.Toggle id="process-status" variant="light border">
                    Process Statuses: {processStatus}
                  </Dropdown.Toggle>

                  <Dropdown.Menu variant="light">
                    {processStatusesRows}
                  </Dropdown.Menu>
                </Dropdown>
                <Button className="ms-auto" variant="secondary" type="submit">
                  Filter
                </Button>
              </Stack>
            </form>
          </div>
          <div className="col" />
        </div>
      </div>
    );
  };

  const buildTable = () => {
    const rows = processInstances.map((row) => {
      const formattedStartDate =
        convertSecondsToFormattedDate((row as any).start_in_seconds) || '-';
      const formattedEndDate =
        convertSecondsToFormattedDate((row as any).end_in_seconds) || '-';

      return (
        <tr key={(row as any).id}>
          <td>
            <Link
              data-qa="process-instance-show-link"
              to={`/admin/process-models/${params.process_group_id}/${
                params.process_model_id
              }/process-instances/${(row as any).id}`}
            >
              {(row as any).id}
            </Link>
          </td>
          <td>{(row as any).process_model_identifier}</td>
          <td>{(row as any).process_group_identifier}</td>
          <td>{formattedStartDate}</td>
          <td>{formattedEndDate}</td>
          <td data-qa={`process-instance-status-${(row as any).status}`}>
            {(row as any).status}
          </td>
        </tr>
      );
    });
    return (
      <Table striped bordered>
        <thead>
          <tr>
            <th>Process Instance Id</th>
            <th>Process Model Id</th>
            <th>Process Group Id</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Status</th>
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
        <ProcessBreadcrumb
          processModelId={params.process_model_id}
          processGroupId={params.process_group_id}
          // @ts-expect-error TS(2322) FIXME: Type 'string' is not assignable to type 'boolean |... Remove this comment to see the full error message
          linkProcessModel="true"
        />
        <h2>Process Instances for {params.process_model_id}</h2>
        {filterOptions()}
        <PaginationForTable
          page={page}
          perPage={perPage}
          pagination={pagination}
          // @ts-expect-error TS(2322) FIXME: Type 'Element' is not assignable to type 'string'.
          tableToDisplay={buildTable()}
          queryParamString={getSearchParamsAsQueryString()}
          path={`/admin/process-models/${params.process_group_id}/${params.process_model_id}/process-instances`}
        />
      </main>
    );
  }
}
