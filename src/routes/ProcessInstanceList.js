import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";

import { BACKEND_BASE_URL } from '../config';
import { HOT_AUTH_TOKEN } from '../config';
import ProcessBreadcrumb from '../components/ProcessBreadcrumb';
import { Button, Table, Stack, Dropdown }  from 'react-bootstrap';
import DatePicker from "react-datepicker";
import { convertDateToSeconds } from "../helpers";

import PaginationForTable, { DEFAULT_PER_PAGE, DEFAULT_PAGE } from '../components/PaginationForTable'
import "react-datepicker/dist/react-datepicker.css";

export default function ProcessInstanceList() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [processInstances, setProcessInstances] = useState([]);
  const [pagination, setPagination] = useState(null);

  const oneHourInSeconds = 3600;
  const oneMonthInSeconds = oneHourInSeconds * 24 * 30;
  const [startFrom, setStartFrom] = useState(convertDateToSeconds(new Date()) - oneMonthInSeconds);
  const [startTill, setStartTill] = useState(convertDateToSeconds(new Date()) + oneHourInSeconds);
  const [endFrom, setEndFrom] = useState(convertDateToSeconds(new Date()) - oneMonthInSeconds);
  const [endTill, setEndTill] = useState(convertDateToSeconds(new Date()) + oneHourInSeconds);

  const PROCESS_STATUSES = [
    "all",
    "not_started",
    "user_input_required",
    "waiting",
    "complete",
    "erroring",
  ]
  const [processStatus, setProcessStatus] = useState(PROCESS_STATUSES[0]);
  const parametersToAlwaysFilterBy = useMemo(() => {
    return {
      'start_from': setStartFrom,
      'start_till': setStartTill,
      'end_from': setEndFrom,
      'end_till': setEndTill,
    }
  }, [setStartFrom, setStartTill, setEndFrom, setEndTill]);

  useEffect(() => {
    getProcessInstances();

    function getProcessInstances() {
      const page = searchParams.get('page') || DEFAULT_PAGE;
      const perPage = parseInt(searchParams.get('per_page') || DEFAULT_PER_PAGE);
      let queryParamString = `per_page=${perPage}&page=${page}`;

      for (const paramName in parametersToAlwaysFilterBy) {
        const functionToCall = parametersToAlwaysFilterBy[paramName]
        let defaultValue = null;
        if (paramName.endsWith("_from")) {
          defaultValue = convertDateToSeconds(new Date()) - oneMonthInSeconds;
        } else if (paramName.endsWith("_till")) {
          defaultValue = convertDateToSeconds(new Date()) + oneHourInSeconds;
        }
        let searchParamValue = searchParams.get(paramName);
        if (searchParamValue) {
          queryParamString += `&${paramName}=${searchParamValue}`;
          functionToCall(searchParamValue);
        } else if (defaultValue) {
          queryParamString += `&${paramName}=${defaultValue}`;
        }
      }
      if (searchParams.get('process_status')) {
        queryParamString += `&process_status=${searchParams.get('process_status')}`;
        setProcessStatus(searchParams.get('process_status'));
      }

      fetch(`${BACKEND_BASE_URL}/process-models/${params.process_group_id}/${params.process_model_id}/process-instances?${queryParamString}`, {
        headers: new Headers({
          'Authorization': `Bearer ${HOT_AUTH_TOKEN}`
        })
      })
        .then(res => res.json())
        .then(
          (result) => {
            const processInstancesFromApi = result.results;
            setProcessInstances(processInstancesFromApi);
            setPagination(result.pagination);
          },
          (error) => {
            console.log(error);
          }
        )
    }
  }, [searchParams, params, oneMonthInSeconds, oneHourInSeconds, parametersToAlwaysFilterBy]);

  const handleFilter = ((event) => {
    event.preventDefault();
    const page = searchParams.get('page') || DEFAULT_PAGE;
    const perPage = parseInt(searchParams.get('per_page') || DEFAULT_PER_PAGE);
    let queryParamString = `per_page=${perPage}&page=${page}`;

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
    if (processStatus && processStatus !== "all") {
      queryParamString += `&process_status=${processStatus}`;
    }

    navigate(`/process-models/${params.process_group_id}/${params.process_model_id}/process-instances?${queryParamString}`)
  });

  const dateComponent = ((labelString, initialDate, onChangeFunction) => {
    return (
      <Stack className="ms-auto" direction="horizontal" gap={3}>
        <label className="text-nowrap">{labelString}</label>
        <DatePicker
          selected={new Date(initialDate * 1000)}
          onChange={(date) => convertDateToSeconds(date, onChangeFunction)}
          showTimeSelect
          dateFormat="MMMM d, yyyy h:mm aa"
        />
      </Stack>
    )
  });

  const getSearchParamsAsQueryString = (() => {
    let queryParamString = "";
    for (const paramName in parametersToAlwaysFilterBy) {
      let searchParamValue = searchParams.get(paramName);
      if (searchParamValue) {
        queryParamString += `&${paramName}=${searchParamValue}`;
      }
    }
    return queryParamString;
  });

  const filterOptions = (() => {
    const processStatusesRows = PROCESS_STATUSES.map(processStatusOption => {
      if (processStatusOption === processStatus) {
        return <Dropdown.Item key={processStatusOption} active>{processStatusOption}</Dropdown.Item>
      } else {
        return <Dropdown.Item key={processStatusOption} onClick={(e) => setProcessStatus(processStatusOption)}>{processStatusOption}</Dropdown.Item>
      }
    });

    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <form onSubmit={handleFilter}>
              <Stack direction="horizontal" gap={3}>
                {dateComponent("Start Range: ", startFrom, setStartFrom)}
                {dateComponent("-", startTill, setStartTill)}
              </Stack>
              <br />
              <Stack direction="horizontal" gap={3}>
                {dateComponent("End Range: ", endFrom, setEndFrom)}
                {dateComponent("-", endTill, setEndTill)}
              </Stack>
              <br />
              <Stack direction="horizontal" gap={3}>
                <Dropdown data-qa="process-status-dropdown" id="process-status-dropdown">
                  <Dropdown.Toggle id="process-status" variant="light border">
                    Process Statuses: {processStatus}
                  </Dropdown.Toggle>

                  <Dropdown.Menu variant="light">
                    {processStatusesRows}
                  </Dropdown.Menu>
                </Dropdown>
                <Button className="ms-auto" variant="secondary" type="submit">Filter</Button>
              </Stack>
            </form>
          </div>
          <div className="col">
          </div>
        </div>
      </div>
    )
  });

  const buildTable = (() => {
      const rows = processInstances.map((row,i) => {
        let start_date = 'N/A'
        if (row.start_in_seconds) {
          start_date = new Date(row.start_in_seconds * 1000);
        }
        let end_date = 'N/A'
        if (row.end_in_seconds) {
          end_date = new Date(row.end_in_seconds * 1000);
        }
        return (
          <tr key={i}>
          <td>
            <Link data-qa="process-instance-show-link" to={`/process-models/${params.process_group_id}/${params.process_model_id}/process-instances/${row.id}`}>{row.id}</Link>
          </td>
          <td>{row.process_model_identifier}</td>
          <td>{row.process_group_id}</td>
          <td>{start_date.toString()}</td>
          <td>{end_date.toString()}</td>
          <td data-qa="process-instance-status">{row.status}</td>
          </tr>
        )
      })
    return(
      <Table striped bordered >
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
        <tbody>
          {rows}
        </tbody>
      </Table>
    )
  });

  if (pagination) {
    const perPage = parseInt(searchParams.get('per_page') || DEFAULT_PER_PAGE);
    const page = parseInt(searchParams.get('page') || DEFAULT_PAGE);
    return(
      <main>
      <ProcessBreadcrumb
        processModelId={params.process_model_id}
        processGroupId={params.process_group_id}
        linkProcessModel="true"
      />
      <h2>Process Instances for {params.process_model_id}</h2>
      {filterOptions()}
      <PaginationForTable
        page={page}
        perPage={perPage}
        pagination={pagination}
        tableToDisplay={buildTable()}
        queryParamString={getSearchParamsAsQueryString()}
        path={`/process-models/${params.process_group_id}/${params.process_model_id}/process-instances`}
      />
   	  </main>
    )
  } else {
    return(<></>)
  }
}
