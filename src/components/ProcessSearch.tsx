import {
  ComboBox,
  // @ts-ignore
} from '@carbon/react';
import { truncateString } from '../helpers';
import { ProcessReference } from '../interfaces';

type OwnProps = {
  onChange: (..._args: any[]) => any;
  processes: ProcessReference[];
  selectedItem?: ProcessReference | null;
  titleText?: string;
  height?: string;
};

export default function ProcessSearch({
  processes,
  selectedItem,
  onChange,
  titleText = 'Process model',
  height = '50px',
}: OwnProps) {
  const shouldFilter = (options: any) => {
    const process: ProcessReference = options.item;
    const { inputValue } = options;
    return `${process.identifier} (${process.display_name})`.includes(
      inputValue
    );
  };
  return (
    <div style={{ width: '100%', height }}>
      <ComboBox
        onChange={onChange}
        id="process-model-select"
        data-qa="process-model-selection"
        items={processes}
        itemToString={(process: ProcessReference) => {
          if (process) {
            return `${process.identifier} (${truncateString(
              process.display_name,
              20
            )})`;
          }
          return null;
        }}
        shouldFilterItem={shouldFilter}
        placeholder="Choose a process"
        titleText={titleText}
        selectedItem={selectedItem}
      />
    </div>
  );
}
