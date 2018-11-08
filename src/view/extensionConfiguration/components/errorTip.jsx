import React from 'react';
import classNames from 'classnames';
import Icon from '@coralui/react-coral/lib/Icon';
import Tooltip from '@coralui/react-coral/lib/Tooltip';

export default class ErrorTip extends React.Component {
  constructor() {
    super();
    this.state = {
      mouseOverIcon: false
    };
  }

  onMouseEnter = () => {
    this.setState({
      mouseOverIcon: true
    });
  };

  onMouseLeave = () => {
    this.setState({
      mouseOverIcon: false
    });
  };

  render() {
    return (
      <div className={ classNames(this.props.className, 'ErrorTip') }>
        <Tooltip
          placement="bottom"
          variant="error"
          content={ this.props.children }
          open={ this.props.openTooltip || this.state.mouseOverIcon }
        >
          <Icon
            className="ErrorTip-icon"
            size="S"
            icon="alert"
            onMouseEnter={ this.onMouseEnter }
            onMouseLeave={ this.onMouseLeave }
          />
        </Tooltip>
      </div>
    );
  }
}
