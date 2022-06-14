import React, { useEffect, useState } from "react";
import { SimpleEntry, TextFieldEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel'

export default function AnonymousFunction(element) {
  // const modeling = useService('modeling');
  // const debounce = useService('debounceInput');
  //
  // const getValue = () => {
  //   return element.businessObject.spell || '';
  // }
  //
  // const setValue = value => {
  //   return modeling.updateProperties(element, {
  //     spell: value
  //   });
  // }
  return [
    // Spell({element: element, id: "HELLO"})
    {
      id: 'spell',
      element,
      component: Spell,
      isEdited: isTextFieldEntryEdited
    }
  ];
}

function Spell(props) {
  console.log("IN SPECLL");
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

  return <TextFieldEntry
  id={ id }
  element={ element }
  description={ translate('Apply a black magic spell') }
  label={ translate('Spell') }
  getValue={ getValue }
  setValue={ setValue }
  debounce={ debounce }
    />;
//   console.log("id", id)
//   console.log("element", element)
//   // debugger;
//   return React.createElement(
//   SimpleEntry,
//     {id: id,
//     getValue: getValue,
//     setValue: setValue,
//     debounce: debounce },
// )
  // return SimpleEntry({
  //   id: id,
  //   getValue: getValue,
  //   setValue: setValue,
  //   debounce: debounce
  // });
}
