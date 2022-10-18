import { useContext, useEffect, useState } from 'react';
import ErrorContext from '../contexts/ErrorContext';
import HttpService from '../services/HttpService';

export default function AuthenticationList() {
  const setErrorMessage = (useContext as any)(ErrorContext)[1];
  const [authenticationList, setAuthenticationList] = useState({});

  useEffect(() => {
    HttpService.makeCallToBackend({
      path: `/authentications`,
      successCallback: setAuthenticationList,
      failureCallback: setErrorMessage,
    });
  }, [setErrorMessage]);

  return <main />;
}
