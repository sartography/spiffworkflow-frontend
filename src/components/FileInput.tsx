import React from 'react';
import axios from 'axios';
import { BACKEND_BASE_URL } from '../config';
import { HOT_AUTH_TOKEN } from '../services/UserService';

type Props = {
  processGroupId: string;
  processModelId: string;
  onUploadedCallback?: (..._args: any[]) => any;
};

export default class FileInput extends React.Component<Props> {
  fileInput: any;

  processGroupId: any;

  processModelId: any;

  onUploadedCallback: any;

  constructor({ processGroupId, processModelId, onUploadedCallback }: Props) {
    super({ processGroupId, processModelId, onUploadedCallback });
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fileInput = React.createRef();
    this.processGroupId = processGroupId;
    this.processModelId = processModelId;
    this.onUploadedCallback = onUploadedCallback;
  }

  handleSubmit(event: any) {
    event.preventDefault();
    const url = `${BACKEND_BASE_URL}/process-models/${this.processGroupId}/${this.processModelId}/file`;
    const formData = new FormData();
    formData.append('file', this.fileInput.current.files[0]);
    formData.append('fileName', this.fileInput.current.files[0].name);

    // this might work if we remove the content-type header
    // const headers = {
    //   'Authorization': `Bearer ${HOT_AUTH_TOKEN}`,
    //     'content-type': 'multipart/form-data',
    // };
    // fetch(url, {
    //   headers: new Headers(headers),
    //   method: 'POST',
    //   body: formData
    // })
    //   .then((response) => response.json())
    //   .then((result) => {
    //     console.log('Success:', result);
    //   })
    //   .catch((error) => {
    //     console.error('Error:', error);
    // });

    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        Authorization: `Bearer ${HOT_AUTH_TOKEN}`,
      },
    };
    axios.post(url, formData, config).then((_response) => {
      if (this.onUploadedCallback) {
        this.onUploadedCallback();
      }
    });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Upload file:
          <input type="file" ref={this.fileInput} />
        </label>
        <button type="submit">Submit</button>
      </form>
    );
  }
}
