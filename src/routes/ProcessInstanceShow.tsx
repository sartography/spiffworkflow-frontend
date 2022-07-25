import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Stack } from 'react-bootstrap';
import ProcessBreadcrumb from '../components/ProcessBreadcrumb';
import HttpService from '../services/HttpService';
import ReactDiagramEditor from '../components/ReactDiagramEditor';
import { convertSecondsToFormattedDate } from '../helpers';

export default function ProcessInstanceShow() {
  const navigate = useNavigate();
  const params = useParams();

  const [processInstance, setProcessInstance] = useState(null);
  const [tasks, setTasks] = useState(null);

  const navigateToProcessInstances = (_result: any) => {
    navigate(
      `/admin/process-models/${params.process_group_id}/${params.process_model_id}/process-instances`
    );
  };

  useEffect(() => {
    HttpService.makeCallToBackend({
      path: `/process-models/${params.process_group_id}/${params.process_model_id}/process-instances/${params.process_instance_id}`,
      successCallback: setProcessInstance,
    });
    HttpService.makeCallToBackend({
      path: `/process-instance/${params.process_instance_id}/tasks?all_tasks=true`,
      successCallback: setTasks,
    });
  }, [params]);

  const deleteProcessInstance = () => {
    HttpService.makeCallToBackend({
      path: `/process-models/${params.process_group_id}/${params.process_model_id}/process-instances/${params.process_instance_id}`,
      successCallback: navigateToProcessInstances,
      httpMethod: 'DELETE',
    });
  };

  const getTaskIds = () => {
    const taskIds = { completed: [], active: [] };
    if (tasks) {
      (tasks as any).forEach(function getUserTasksElement(task: any) {
        if (task.state === 'COMPLETED') {
          (taskIds.completed as any).push(task.name);
        }
        if (task.state === 'READY') {
          (taskIds.active as any).push(task.name);
        }
      });
    }
    return taskIds;
  };

  const getTaskData = () => {
    let taskData = null;
    if (tasks) {
      (tasks as any).forEach(function getUserTasksElement(task: any) {
        if (task.state === 'COMPLETED') {
          taskData = task.data;
        }
        if (task.state === 'READY') {
          taskData = task.data;
        }
      });
    }
    return taskData;
  };

  const getInfoTag = (processInstanceToUse: any) => {
    const currentEndDate = convertSecondsToFormattedDate(
      processInstanceToUse.end_in_seconds
    );
    let currentEndDateTag;
    if (currentEndDate) {
      currentEndDateTag = (
        <li>
          Completed:{' '}
          {convertSecondsToFormattedDate(processInstanceToUse.end_in_seconds) ||
            'N/A'}
        </li>
      );
    }

    return (
      <ul>
        <li>
          Started:{' '}
          {convertSecondsToFormattedDate(processInstanceToUse.start_in_seconds)}
        </li>
        {currentEndDateTag}
        <li>Status: {processInstanceToUse.status}</li>
      </ul>
    );
  };

  if (processInstance) {
    const processInstanceToUse = processInstance as any;
    const taskData = getTaskData();
    const taskIds = getTaskIds();

    return (
      <main style={{ padding: '1rem 0' }}>
        <ProcessBreadcrumb
          processModelId={params.process_model_id}
          processGroupId={params.process_group_id}
          // @ts-expect-error TS(2322) FIXME: Type 'string' is not assignable to type 'boolean |... Remove this comment to see the full error message
          linkProcessModel="true"
        />
        <Stack direction="horizontal" gap={3}>
          <h2>Process Instance Id: {processInstanceToUse.id}</h2>
          <Button onClick={deleteProcessInstance} variant="danger">
            Delete process instance
          </Button>
        </Stack>
        {getInfoTag(processInstanceToUse)}
        <h2>Data</h2>
        <div>
          <pre>{JSON.stringify(taskData, null, 2)}</pre>
        </div>
        <ReactDiagramEditor
          processModelId={params.process_model_id || ''}
          processGroupId={params.process_group_id || ''}
          diagramXML={processInstanceToUse.bpmn_xml_file_contents || ''}
          fileName={processInstanceToUse.bpmn_xml_file_contents || ''}
          activeTaskBpmnIds={taskIds.active}
          completedTasksBpmnIds={taskIds.completed}
          diagramType="readonly"
        />

        <div id="diagram-container" />
      </main>
    );
  }
}
