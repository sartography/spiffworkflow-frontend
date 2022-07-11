import { Routes, Route } from 'react-router-dom';

import ProcessGroups from './ProcessGroups';
import ProcessGroupShow from './ProcessGroupShow';
import ProcessGroupNew from './ProcessGroupNew';
import ProcessGroupEdit from './ProcessGroupEdit';
import ProcessModelShow from './ProcessModelShow';
import ProcessModelEditDiagram from './ProcessModelEditDiagram';
import ProcessInstanceList from './ProcessInstanceList';
import ProcessInstanceReportShow from './ProcessInstanceReportShow';
import ProcessModelNew from './ProcessModelNew';
import ProcessModelEdit from './ProcessModelEdit';
import ProcessInstanceShow from './ProcessInstanceShow';
import UserService from '../services/UserService';
import ProcessInstanceReportList from './ProcessInstanceReportList';
import ProcessInstanceReportNew from './ProcessInstanceReportNew';
import ProcessInstanceReportEdit from './ProcessInstanceReportEdit';

export default function AdminRoutes() {
  if (UserService.hasRole(['admin'])) {
    return (
      <Routes>
        {/* @ts-expect-error TS(2786) FIXME: 'ProcessGroups' cannot be used as a JSX component. */}
        <Route path="/" element={<ProcessGroups />} />

        {/* @ts-expect-error TS(2786) FIXME: 'ProcessGroups' cannot be used as a JSX component. */}
        <Route path="process-groups" element={<ProcessGroups />} />
        <Route
          path="process-groups/:process_group_id"
          // @ts-expect-error TS(2786) FIXME: 'ProcessGroupShow' cannot be used as a JSX compone... Remove this comment to see the full error message
          element={<ProcessGroupShow />}
        />
        <Route path="process-groups/new" element={<ProcessGroupNew />} />
        <Route
          path="process-groups/:process_group_id/edit"
          // @ts-expect-error TS(2786) FIXME: 'ProcessGroupEdit' cannot be used as a JSX compone... Remove this comment to see the full error message
          element={<ProcessGroupEdit />}
        />

        <Route
          path="process-models/:process_group_id/new"
          element={<ProcessModelNew />}
        />
        <Route
          path="process-models/:process_group_id/:process_model_id"
          // @ts-expect-error TS(2786) FIXME: 'ProcessModelShow' cannot be used as a JSX compone... Remove this comment to see the full error message
          element={<ProcessModelShow />}
        />
        <Route
          path="process-models/:process_group_id/:process_model_id/file"
          // @ts-expect-error TS(2786) FIXME: 'ProcessModelEditDiagram' cannot be used as a JSX ... Remove this comment to see the full error message
          element={<ProcessModelEditDiagram />}
        />
        <Route
          path="process-models/:process_group_id/:process_model_id/file/:file_name"
          // @ts-expect-error TS(2786) FIXME: 'ProcessModelEditDiagram' cannot be used as a JSX ... Remove this comment to see the full error message
          element={<ProcessModelEditDiagram />}
        />
        <Route
          path="process-models/:process_group_id/:process_model_id/process-instances"
          // @ts-expect-error TS(2786) FIXME: 'ProcessInstanceList' cannot be used as a JSX comp... Remove this comment to see the full error message
          element={<ProcessInstanceList />}
        />
        <Route
          path="process-models/:process_group_id/:process_model_id/edit"
          // @ts-expect-error TS(2786) FIXME: 'ProcessModelEdit' cannot be used as a JSX compone... Remove this comment to see the full error message
          element={<ProcessModelEdit />}
        />
        <Route
          path="process-models/:process_group_id/:process_model_id/process-instances/:process_instance_id"
          // @ts-expect-error TS(2786) FIXME: 'ProcessInstanceShow' cannot be used as a JSX comp... Remove this comment to see the full error message
          element={<ProcessInstanceShow />}
        />
        <Route
          path="process-models/:process_group_id/:process_model_id/process-instances/reports"
          element={<ProcessInstanceReportList />}
        />
        <Route
          path="process-models/:process_group_id/:process_model_id/process-instances/reports/:report_identifier"
          // @ts-expect-error TS(2786) FIXME: 'ProcessInstanceReport' cannot be used as a JSX co... Remove this comment to see the full error message
          element={<ProcessInstanceReportShow />}
        />
        <Route
          path="process-models/:process_group_id/:process_model_id/process-instances/reports/new"
          element={<ProcessInstanceReportNew />}
        />
        <Route
          path="process-models/:process_group_id/:process_model_id/process-instances/reports/:report_identifier/edit"
          element={<ProcessInstanceReportEdit />}
        />
      </Routes>
    );
  }
  return (
    <main>
      <h1>404</h1>
    </main>
  );
}
