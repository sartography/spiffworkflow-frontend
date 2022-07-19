import React from 'react';

type Props = {
  children?: React.ReactNode;
};

type State = any;

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.log(error, errorInfo);
    if (error.constructor.name === 'AggregateError') {
      console.log(error.message);
      console.log(error.name);
      console.log(error.errors);
    }
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;

    if (hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return children;
  }
}

export default ErrorBoundary;
