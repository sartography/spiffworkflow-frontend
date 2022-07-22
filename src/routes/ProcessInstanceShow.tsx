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
  }, [params]);

  const deleteProcessInstance = () => {
    HttpService.makeCallToBackend({
      path: `/process-models/${params.process_group_id}/${params.process_model_id}/process-instances/${params.process_instance_id}`,
      successCallback: navigateToProcessInstances,
      httpMethod: 'DELETE',
    });
  };

  const getActiveTask = (processInstanceToUse: any): any | null => {
    if (
      processInstanceToUse.bpmn_json &&
      processInstanceToUse.spiffworkflow_active_task_id
    ) {
      const activeTask = JSON.parse(processInstanceToUse.bpmn_json).tasks[
        processInstanceToUse.spiffworkflow_active_task_id
      ];

      if (activeTask) {
        return activeTask;
      }
    }
    return null;
  };

  const getCompletedTasksBpmnIds = (
    processInstanceToUse: any
  ): string[] | null => {
    const taskSpecsThatCannotBeHighlighted = ['Root', 'Start', 'End'];

    if (processInstanceToUse.bpmn_json) {
      const { tasks } = JSON.parse(processInstanceToUse.bpmn_json);
      return Object.keys(tasks)
        .map((spiffworkflowTaskId: any) => {
          const taskProps = tasks[spiffworkflowTaskId];
          if (
            taskProps.state === 32 &&
            !taskSpecsThatCannotBeHighlighted.includes(taskProps.task_spec) &&
            !taskProps.task_spec.match(/EndJoin/)
          ) {
            return taskProps.task_spec;
          }
          return null;
        })
        .filter((n) => n);
    }
    return null;
  };

  const getInfoTag = (processInstanceToUse: any, activeTask: any) => {
    let activeTaskBpmnId;
    if (activeTask) {
      activeTaskBpmnId = activeTask.task_spec;
    }

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

    let currentTaskTag;
    if (activeTaskBpmnId) {
      currentTaskTag = <li>Current Task: {activeTaskBpmnId}</li>;
    }

    return (
      <ul>
        <li>
          Started:{' '}
          {convertSecondsToFormattedDate(processInstanceToUse.start_in_seconds)}
        </li>
        {currentEndDateTag}
        {currentTaskTag}
        <li>Status: {processInstanceToUse.status}</li>
      </ul>
    );
  };

  if (processInstance) {
    const processInstanceToUse = processInstance as any;
    const activeTask = getActiveTask(processInstanceToUse);
    let activeTaskBpmnId;
    let activeTaskData;
    if (activeTask) {
      activeTaskBpmnId = activeTask.task_spec;
      activeTaskData = activeTask.data;
    }

    const completedTasksBpmnIds =
      getCompletedTasksBpmnIds(processInstanceToUse);

    const taskData = activeTaskData || processInstanceToUse.data;

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
        {getInfoTag(processInstanceToUse, activeTask)}
        <h2>Data</h2>
        <div>
          <pre>{JSON.stringify(taskData, null, 2)}</pre>
        </div>
        <ReactDiagramEditor
          processModelId={params.process_model_id || ''}
          processGroupId={params.process_group_id || ''}
          diagramXML={processInstanceToUse.bpmn_xml_file_contents || ''}
          fileName={processInstanceToUse.bpmn_xml_file_contents || ''}
          activeTaskBpmnId={activeTaskBpmnId}
          completedTasksBpmnIds={completedTasksBpmnIds}
          diagramType="readonly"
        />

        <div id="diagram-container" />
      </main>
    );
  }
}
