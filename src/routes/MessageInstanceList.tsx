import { useEffect, useState } from 'react';
// @ts-ignore
import { ErrorOutline } from '@carbon/icons-react';
// @ts-ignore
import { Table, Modal, Button } from '@carbon/react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import PaginationForTable from '../components/PaginationForTable';
import ProcessBreadcrumb from '../components/ProcessBreadcrumb';
import {
  convertSecondsToFormattedDateTime,
  getPageInfoFromSearchParams,
  modifyProcessIdentifierForPathParam,
} from '../helpers';
import HttpService from '../services/HttpService';
import { FormatProcessModelDisplayName } from '../components/MiniComponents';
import { MessageInstance } from '../interfaces';

export default function MessageInstanceList() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const [messageIntances, setMessageInstances] = useState([]);
  const [pagination, setPagination] = useState(null);

  const [messageInstanceForModal, setMessageInstanceForModal] =
    useState<MessageInstance | null>(null);

  useEffect(() => {
    const setMessageInstanceListFromResult = (result: any) => {
      setMessageInstances(result.results);
      setPagination(result.pagination);
    };
    const { page, perPage } = getPageInfoFromSearchParams(searchParams);
    let queryParamString = `per_page=${perPage}&page=${page}`;
    if (searchParams.get('process_instance_id')) {
      queryParamString += `&process_instance_id=${searchParams.get(
        'process_instance_id'
      )}`;
    }
    HttpService.makeCallToBackend({
      path: `/messages?${queryParamString}`,
      successCallback: setMessageInstanceListFromResult,
    });
  }, [searchParams, params]);

  const handleCorrelationDisplayClose = () => {
    setMessageInstanceForModal(null);
  };

  const correlationsDisplayModal = () => {
    if (messageInstanceForModal) {
      let failureCausePre = null;
      if (messageInstanceForModal.failure_cause) {
        failureCausePre = (
          <>
            <p className="failure-string">
              {messageInstanceForModal.failure_cause}
            </p>
            <br />
          </>
        );
      }
      return (
        <Modal
          open={!!messageInstanceForModal}
          passiveModal
          onRequestClose={handleCorrelationDisplayClose}
          modalHeading={`Message ${messageInstanceForModal.id} (${messageInstanceForModal.message_identifier}) ${messageInstanceForModal.message_type} data:`}
          modalLabel="Details"
        >
          {failureCausePre}
          <p>Correlations:</p>
          <pre>
            {JSON.stringify(
              messageInstanceForModal.message_correlations,
              null,
              2
            )}
          </pre>
        </Modal>
      );
    }
    return null;
  };

  const buildTable = () => {
    const rows = messageIntances.map((row: MessageInstance) => {
      let errorIcon = null;
      let errorTitle = null;
      if (row.failure_cause) {
        errorTitle = 'Instance has an error';
        errorIcon = (
          <>
            &nbsp;
            <ErrorOutline className="red-icon" />
          </>
        );
      }
      return (
        <tr key={row.id}>
          <td>{row.id}</td>
          <td>{FormatProcessModelDisplayName(row)}</td>
          <td>
            <Link
              data-qa="process-instance-show-link"
              to={`/admin/process-instances/${modifyProcessIdentifierForPathParam(
                row.process_model_identifier
              )}/${row.process_instance_id}`}
            >
              {row.process_instance_id}
            </Link>
          </td>
          <td>{row.message_identifier}</td>
          <td>{row.message_type}</td>
          <td>
            <Button
              kind="ghost"
              className="button-link"
              onClick={() => setMessageInstanceForModal(row)}
              title={errorTitle}
            >
              View
              {errorIcon}
            </Button>
          </td>
          <td>{row.status}</td>
          <td>
            {convertSecondsToFormattedDateTime(row.created_at_in_seconds)}
          </td>
        </tr>
      );
    });
    return (
      <Table striped bordered>
        <thead>
          <tr>
            <th>Id</th>
            <th>Process</th>
            <th>Process Instance</th>
            <th>Name</th>
            <th>Type</th>
            <th>Details</th>
            <th>Status</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    );
  };

  if (pagination) {
    const { page, perPage } = getPageInfoFromSearchParams(searchParams);
    let breadcrumbElement = null;
    if (searchParams.get('process_instance_id')) {
      breadcrumbElement = (
        <ProcessBreadcrumb
          hotCrumbs={[
            ['Process Groups', '/admin'],
            {
              entityToExplode: searchParams.get('process_model_id') || '',
              entityType: 'process-model-id',
              linkLastItem: true,
            },
            [
              `Process Instance: ${searchParams.get('process_instance_id')}`,
              `/admin/process-instances/${searchParams.get(
                'process_model_id'
              )}/${searchParams.get('process_instance_id')}`,
            ],
            ['Messages'],
          ]}
        />
      );
    }
    return (
      <>
        {breadcrumbElement}
        <h1>Messages</h1>
        {correlationsDisplayModal()}
        <PaginationForTable
          page={page}
          perPage={perPage}
          pagination={pagination}
          tableToDisplay={buildTable()}
        />
      </>
    );
  }
  return null;
}
