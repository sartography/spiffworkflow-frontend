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

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ProcessGroups />} />

      <Route path="process-groups" element={<ProcessGroups />} />
      <Route
        path="process-groups/:process_group_id"
        element={<ProcessGroupShow />}
      />
      <Route path="process-groups/new" element={<ProcessGroupNew />} />
      <Route
        path="process-groups/:process_group_id/edit"
        element={<ProcessGroupEdit />}
      />

      <Route
        path="process-models/:process_group_id/new"
        element={<ProcessModelNew />}
      />
      <Route
        path="process-models/:process_group_id/:process_model_id"
        element={<ProcessModelShow />}
      />
      <Route
        path="process-models/:process_group_id/:process_model_id/file"
        element={<ProcessModelEditDiagram />}
      />
      <Route
        path="process-models/:process_group_id/:process_model_id/file/:file_name"
        element={<ProcessModelEditDiagram />}
      />
      <Route
        path="process-models/:process_group_id/:process_model_id/process-instances"
        element={<ProcessInstanceList />}
      />
      <Route
        path="process-models/:process_group_id/:process_model_id/process-instances/report"
        element={<ProcessInstanceReport />}
      />
      <Route
        path="process-models/:process_group_id/:process_model_id/edit"
        element={<ProcessModelEdit />}
      />
      <Route
        path="process-models/:process_group_id/:process_model_id/process-instances/:process_instance_id"
        element={<ProcessInstanceShow />}
      />
    </Routes>
  );
}
