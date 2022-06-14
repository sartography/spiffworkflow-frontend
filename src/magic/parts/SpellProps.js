import { HeaderButton, TextFieldEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel';
import Button from 'react-bootstrap/Button';

export default function(element) {

  return [
    {
      id: 'spell',
      element,
      component: Spell,
      isEdited: isTextFieldEntryEdited
    }
  ];
}

function Spell(props) {
  const { element, id } = props;

  const modeling = useService('modeling');
  const translate = useService('translate');
  const debounce = useService('debounceInput');

  const getValue = () => {
    return element.businessObject.spell || '';
  }

  const setValue = value => {
    return modeling.updateProperties(element, {
      spell: value
    });
  }

  // return <TextFieldEntry
  //   id={ id }
  //   element={ element }
  //   description={ translate('Apply a black magic spell') }
  //   label={ translate('Spell') }
  //   getValue={ getValue }
  //   setValue={ setValue }
  //   debounce={ debounce }
  // />

  // const provider = {
  //     getElementLabel: () => 'name',
  //     getTypeLabel: () => 'type',
  //     getElementIcon: () => 'icon'
  //   };
  //
  // // return <Header headerProvider={ provider } />
  return <HeaderButton onClick={() => {console.log("HELLO")}}>blah</HeaderButton>
  // return "<p>HELLO</p>" //<Button variant="danger">Save</Button>
}
