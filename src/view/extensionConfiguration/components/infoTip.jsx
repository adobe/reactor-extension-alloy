import React from 'react';
import classNames from 'classnames';
import Info from '@react/react-spectrum/Icon/Info';
import Tooltip from '@react/react-spectrum/Tooltip';
import Button from '@react/react-spectrum/Button';
import OverlayTrigger from '@react/react-spectrum/OverlayTrigger';

import './infoTip.styl';

export default props => {
  return (
    <div className={ classNames(props.className, 'InfoTip') }>
      <OverlayTrigger placement={ props.placement || 'right' } trigger="hover">
        <Button variant="tool" quiet icon={ <Info size="XS"/>} aria-label="info" />
        <Tooltip>
          { props.children }
        </Tooltip>

      </OverlayTrigger>
    </div>
  );
};
