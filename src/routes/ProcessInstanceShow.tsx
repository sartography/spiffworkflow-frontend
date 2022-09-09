import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button, Modal, Stack } from 'react-bootstrap';
import ProcessBreadcrumb from '../components/ProcessBreadcrumb';
import HttpService from '../services/HttpService';
import ReactDiagramEditor from '../components/ReactDiagramEditor';
import { convertSecondsToFormattedDate } from '../helpers';
import ButtonWithConfirmation from '../components/ButtonWithConfirmation';

export default function ProcessInstanceShow() {
  const navigate = useNavigate();
  const params = useParams();

  const [processInstance, setProcessInstance] = useState(null);
  const [tasks, setTasks] = useState(null);
  const [taskToDisplay, setTaskToDisplay] = useState(null);

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

  // to force update the diagram since it could have changed
  const refreshPage = () => {
    window.location.reload();
  };

  const terminateProcessInstance = () => {
    HttpService.makeCallToBackend({
      path: `/process-models/${params.process_group_id}/${params.process_model_id}/process-instances/${params.process_instance_id}/terminate`,
      successCallback: refreshPage,
      httpMethod: 'POST',
    });
  };

  const getTaskIds = () => {
    const taskIds = { completed: [], active: [] };
    if (tasks) {
      (tasks as any).forEach(function getUserTasksElement(task: any) {
        if (task.state === 'COMPLETED') {
          (taskIds.completed as any).push(task.name);
        }
        if (task.state === 'READY' || task.state === 'WAITING') {
          (taskIds.active as any).push(task.name);
        }
      });
    }
    return taskIds;
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
        <li>
          <Link data-qa='process-instance-log-list-link'
            to={`/admin/process-models/${params.process_group_id}/${params.process_model_id}/process-instances/${params.process_instance_id}/logs`}
          >
            Logs
          </Link>
        </li>
      </ul>
    );
  };

  const terminateButton = (processInstanceToUse: any) => {
    if (
      ['complete', 'terminated', 'faulted'].indexOf(
        processInstanceToUse.status
      ) === -1
    ) {
      return (
        <Button onClick={terminateProcessInstance} variant="warning">
          Terminate
        </Button>
      );
    }
    return <div />;
  };

  const handleClickedDiagramTask = (shapeElement: any) => {
    if (tasks) {
      const matchingTask = (tasks as any).find(
        (task: any) => task.name === shapeElement.id
      );
      if (matchingTask) {
        setTaskToDisplay(matchingTask);
      }
    }
  };

  const handleTaskDataDisplayClose = () => {
    setTaskToDisplay(null);
  };

  const taskDataDisplayArea = () => {
    if (taskToDisplay) {
      return (
        <Modal show={taskToDisplay} onHide={handleTaskDataDisplayClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              {(taskToDisplay as any).name}: {(taskToDisplay as any).state}
            </Modal.Title>
          </Modal.Header>
          <pre>{JSON.stringify((taskToDisplay as any).data, null, 2)}</pre>
        </Modal>
      );
    }
    return null;
  };

  if (processInstance && tasks) {
    const processInstanceToUse = processInstance as any;
    const taskIds = getTaskIds();

    return (
      <main style={{ padding: '1rem 0' }}>
        <ProcessBreadcrumb
          processModelId={params.process_model_id}
          processGroupId={params.process_group_id}
          linkProcessModel
        />
        <Stack direction="horizontal" gap={3}>
          <h2>Process Instance Id: {processInstanceToUse.id}</h2>
          <ButtonWithConfirmation
            description="Delete Process Instance?"
            onConfirmation={deleteProcessInstance}
            buttonLabel="Delete"
          />
          {terminateButton(processInstanceToUse)}
        </Stack>
        {getInfoTag(processInstanceToUse)}
        {taskDataDisplayArea()}
        <ReactDiagramEditor
          processModelId={params.process_model_id || ''}
          processGroupId={params.process_group_id || ''}
          diagramXML={processInstanceToUse.bpmn_xml_file_contents || ''}
          fileName={processInstanceToUse.bpmn_xml_file_contents || ''}
          activeTaskBpmnIds={taskIds.active}
          completedTasksBpmnIds={taskIds.completed}
          diagramType="readonly"
          onElementClick={handleClickedDiagramTask}
        />

        <div id="diagram-container" />
      </main>
    );
  }
  return null;
}
