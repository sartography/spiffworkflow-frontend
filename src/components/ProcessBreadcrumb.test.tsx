import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProcessBreadcrumb from './ProcessBreadcrumb';

test('renders home link', () => {
  render(
    // @ts-expect-error TS(2686): 'React' refers to a UMD global, but the current fi... Remove this comment to see the full error message
    <BrowserRouter>
      {/* @ts-expect-error TS(2322): Type '{}' is not assignable to type 'never'. */}
      <ProcessBreadcrumb />
    </BrowserRouter>
  );
  const homeElement = screen.getByText(/Home/);
  expect(homeElement).toBeInTheDocument();
});

test('renders process group when given processGroupId', async () => {
  render(
    // @ts-expect-error TS(2686): 'React' refers to a UMD global, but the current fi... Remove this comment to see the full error message
    <BrowserRouter>
      {/* @ts-expect-error TS(2686): 'React' refers to a UMD global, but the current fi... Remove this comment to see the full error message */}
      <ProcessBreadcrumb processGroupId="group-a" />
    </BrowserRouter>
  );
  const processGroupElement = screen.getByText(/group-a/);
  expect(processGroupElement).toBeInTheDocument();
  const processGroupBreadcrumbs = await screen.findAllByText(
    /Process Group: group-a/
  );
  expect(processGroupBreadcrumbs[0]).toHaveClass('breadcrumb-item active');
});

test('renders process model when given processModelId', async () => {
  render(
    // @ts-expect-error TS(2686): 'React' refers to a UMD global, but the current fi... Remove this comment to see the full error message
    <BrowserRouter>
      {/* @ts-expect-error TS(2686): 'React' refers to a UMD global, but the current fi... Remove this comment to see the full error message */}
      <ProcessBreadcrumb processGroupId="group-b" processModelId="model-c" />
    </BrowserRouter>
  );
  const processGroupElement = screen.getByText(/group-b/);
  expect(processGroupElement).toBeInTheDocument();
  const processModelBreadcrumbs = await screen.findAllByText(
    /Process Model: model-c/
  );
  expect(processModelBreadcrumbs[0]).toHaveClass('breadcrumb-item active');
  const processGroupBreadcrumbs = await screen.findAllByText(
    /Process Group: group-b/
  );
  expect(processGroupBreadcrumbs[0]).toBeInTheDocument();
});
