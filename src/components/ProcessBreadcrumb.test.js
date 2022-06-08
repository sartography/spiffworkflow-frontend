import { render, screen } from '@testing-library/react';
import ProcessBreadcrumb from './ProcessBreadcrumb';
import {
  BrowserRouter,
} from "react-router-dom";

test('renders home link', () => {
  render(<BrowserRouter><ProcessBreadcrumb /></BrowserRouter>);
  const homeElement = screen.getByText(/Home/);
  expect(homeElement).toBeInTheDocument();
});

test('renders process group link when processGroupId', () => {
  const { container } = render(<BrowserRouter><ProcessBreadcrumb processGroupId='group-a'/></BrowserRouter>);
  const processGroupElement = screen.getByText(/group-a/);
  expect(processGroupElement).toBeInTheDocument();
  const activeBreadcrumbElements = container.getElementsByClassName('breadcrumb-item active')
  expect(activeBreadcrumbElements.length).toBe(1);
  expect(activeBreadcrumbElements[0].innerHTML).toEqual("Process Group: group-a");
});

test('renders processmodelgroup link when processModelId', () => {
  const { container } = render(<BrowserRouter><ProcessBreadcrumb processGroupId='group-b' processModelId='model-c'/></BrowserRouter>);
  const processGroupElement = screen.getByText(/group-b/);
  expect(processGroupElement).toBeInTheDocument();
  const activeBreadcrumbElements = container.getElementsByClassName('breadcrumb-item active')
  expect(activeBreadcrumbElements.length).toBe(1);
  expect(activeBreadcrumbElements[0].innerHTML).toEqual("Process Model: model-c");
  const processModelElement = screen.getByText(/model-c/);
  expect(processModelElement).toBeInTheDocument();
});
