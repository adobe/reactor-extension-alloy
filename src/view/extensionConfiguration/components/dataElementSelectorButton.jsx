import React from 'react';
import Button from '@react/react-spectrum/Button';
import IconData from '@react/react-spectrum/Icon/Data';

export default function DataElementSelectorButton(props) {
  return (<Button
    variant="tool"
    icon={ <IconData /> }
    className={ props.className }
    onClick={ props.onClick }
  />);
}
