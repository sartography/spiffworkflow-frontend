import { Routes, Route } from 'react-router-dom';

import ProcessGroups from './ProcessGroups';
import ProcessGroupShow from './ProcessGroupShow';
import ProcessGroupNew from './ProcessGroupNew';
import ProcessGroupEdit from './ProcessGroupEdit';
import ProcessModelShow from './ProcessModelShow';
import ProcessModelEditDiagram from './ProcessModelEditDiagram';
import ProcessInstanceList from './ProcessInstanceList';
import ProcessInstanceReport from './ProcessInstanceReport';
import ProcessModelNew from './ProcessModelNew';
import ProcessModelEdit from './ProcessModelEdit';
import ProcessInstanceShow from './ProcessInstanceShow';
import UserService from '../services/UserService';

export default function AdminRoutes() {
  if (UserService.hasRole(['admin'])) {
    return (
      // @ts-expect-error TS(2686): 'React' refers to a UMD global, but the current fi... Remove this comment to see the full error message
      <Routes>
        {/* @ts-expect-error TS(2686): 'React' refers to a UMD global, but the current fi... Remove this comment to see the full error message */}
        <Route path="/" element={<ProcessGroups />} />

        {/* @ts-expect-error TS(2686): 'React' refers to a UMD global, but the current fi... Remove this comment to see the full error message */}
        <Route path="process-groups" element={<ProcessGroups />} />
        {/* @ts-expect-error TS(2686): 'React' refers to a UMD global, but the current fi... Remove this comment to see the full error message */}
        <Route
          path="process-groups/:process_group_id"
          // @ts-expect-error TS(2686): 'React' refers to a UMD global, but the current fi... Remove this comment to see the full error message
          element={<ProcessGroupShow />}
        />
        {/* @ts-expect-error TS(2686): 'React' refers to a UMD global, but the current fi... Remove this comment to see the full error message */}
        <Route path="process-groups/new" element={<ProcessGroupNew />} />
        {/* @ts-expect-error TS(2686): 'React' refers to a UMD global, but the current fi... Remove this comment to see the full error message */}
        <Route
          path="process-groups/:process_group_id/edit"
          // @ts-expect-error TS(2686): 'React' refers to a UMD global, but the current fi... Remove this comment to see the full error message
          element={<ProcessGroupEdit />}
        />

        {/* @ts-expect-error TS(2686): 'React' refers to a UMD global, but the current fi... Remove this comment to see the full error message */}
        <Route
          path="process-models/:process_group_id/new"
          // @ts-expect-error TS(2686): 'React' refers to a UMD global, but the current fi... Remove this comment to see the full error message
          element={<ProcessModelNew />}
        />
        {/* @ts-expect-error TS(2686): 'React' refers to a UMD global, but the current fi... Remove this comment to see the full error message */}
        <Route
          path="process-models/:process_group_id/:process_model_id"
          // @ts-expect-error TS(2686): 'React' refers to a UMD global, but the current fi... Remove this comment to see the full error message
          element={<ProcessModelShow />}
        />
        {/* @ts-expect-error TS(2686): 'React' refers to a UMD global, but the current fi... Remove this comment to see the full error message */}
        <Route
          path="process-models/:process_group_id/:process_model_id/file"
          // @ts-expect-error TS(2686): 'React' refers to a UMD global, but the current fi... Remove this comment to see the full error message
          element={<ProcessModelEditDiagram />}
        />
        {/* @ts-expect-error TS(2686): 'React' refers to a UMD global, but the current fi... Remove this comment to see the full error message */}
        <Route
          path="process-models/:process_group_id/:process_model_id/file/:file_name"
          // @ts-expect-error TS(2686): 'React' refers to a UMD global, but the current fi... Remove this comment to see the full error message
          element={<ProcessModelEditDiagram />}
        />
        {/* @ts-expect-error TS(2686): 'React' refers to a UMD global, but the current fi... Remove this comment to see the full error message */}
        <Route
          path="process-models/:process_group_id/:process_model_id/process-instances"
          // @ts-expect-error TS(2686): 'React' refers to a UMD global, but the current fi... Remove this comment to see the full error message
          element={<ProcessInstanceList />}
        />
        {/* @ts-expect-error TS(2686): 'React' refers to a UMD global, but the current fi... Remove this comment to see the full error message */}
        <Route
          path="process-models/:process_group_id/:process_model_id/process-instances/report"
          // @ts-expect-error TS(2686): 'React' refers to a UMD global, but the current fi... Remove this comment to see the full error message
          element={<ProcessInstanceReport />}
        />
        {/* @ts-expect-error TS(2686): 'React' refers to a UMD global, but the current fi... Remove this comment to see the full error message */}
        <Route
          path="process-models/:process_group_id/:process_model_id/edit"
          // @ts-expect-error TS(2686): 'React' refers to a UMD global, but the current fi... Remove this comment to see the full error message
          element={<ProcessModelEdit />}
        />
        {/* @ts-expect-error TS(2686): 'React' refers to a UMD global, but the current fi... Remove this comment to see the full error message */}
        <Route
          path="process-models/:process_group_id/:process_model_id/process-instances/:process_instance_id"
          // @ts-expect-error TS(2686): 'React' refers to a UMD global, but the current fi... Remove this comment to see the full error message
          element={<ProcessInstanceShow />}
        />
      </Routes>
    );
  }
  return (
    <main>
      <h1>"404"</h1>
    </main>
  );
}
