import React from 'react';
import Button from '@react/react-spectrum/Button';
import IconData from '@react/react-spectrum/Icon/Data';

export default function DataElementSelectorButton(props) {
  return (<Button
    variant="secondary"
    icon={ <IconData /> }
    iconSize="small"
    className={ props.className }
    onClick={ props.onClick }
  />);
}
