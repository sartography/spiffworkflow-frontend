import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Stack } from 'react-bootstrap';
import ProcessBreadcrumb from '../components/ProcessBreadcrumb';
import HttpService from '../services/HttpService';

export default function ProcessModelEdit() {
  const [displayName, setDisplayName] = useState('');
  const params = useParams();
  const navigate = useNavigate();
  const [processModel, setProcessModel] = useState(null);

  const processModelPath = `process-models/${params.process_group_id}/${params.process_model_id}`;

  useEffect(() => {
    const processResult = (result: any) => {
      setProcessModel(result);
      setDisplayName(result.display_name);
    };
    HttpService.makeCallToBackend({
      path: `/${processModelPath}`,
      successCallback: processResult,
    });
  }, [processModelPath]);

  const navigateToProcessModel = (_result: any) => {
    navigate(`/admin/${processModelPath}`);
  };

  const navigateToProcessModels = (_result: any) => {
    navigate(`/admin/process-groups/${params.process_group_id}`);
  };

  const updateProcessModel = (event: any) => {
    const processModelToUse = processModel as any;
    event.preventDefault();
    HttpService.makeCallToBackend({
      path: `/${processModelPath}`,
      successCallback: navigateToProcessModel,
      httpMethod: 'PUT',
      postBody: {
        id: processModelToUse.id,
        display_name: displayName,
        description: processModelToUse.description,
        process_group_id: processModelToUse.process_group_id,
        is_master_spec: processModelToUse.is_master_spec,
        standalone: processModelToUse.standalone,
        library: processModelToUse.library,
      },
    });
  };

  const deleteProcessModel = () => {
    const processModelToUse = processModel as any;
    const processModelShowPath = `/process-models/${processModelToUse.process_group_id}/${processModelToUse.id}`;
    HttpService.makeCallToBackend({
      path: `${processModelShowPath}`,
      successCallback: navigateToProcessModels,
      httpMethod: 'DELETE',
    });
  };

  const onDisplayNameChanged = (newDisplayName: any) => {
    setDisplayName(newDisplayName);
  };

  if (processModel) {
    return (
      <main style={{ padding: '1rem 0' }}>
        <ProcessBreadcrumb processGroupId={(processModel as any).id} />
        <h2>Edit Process Group: {(processModel as any).id}</h2>
        <form onSubmit={updateProcessModel}>
          <label>Display Name:</label>
          <input
            name="display_name"
            type="text"
            value={displayName}
            onChange={(e) => onDisplayNameChanged(e.target.value)}
          />
          <br />
          <br />
          <Stack direction="horizontal" gap={3}>
            <Button type="submit">Submit</Button>
            <Button variant="secondary" href={`/admin/${processModelPath}`}>
              Cancel
            </Button>
            <Button onClick={deleteProcessModel} variant="danger">
              Delete process model
            </Button>
          </Stack>
        </form>
      </main>
    );
  }
  return null;
}
