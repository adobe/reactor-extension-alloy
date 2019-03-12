/*************************************************************************
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 *  Copyright 2016 Adobe Systems Incorporated
 *  All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe Systems Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Adobe Systems Incorporated and its
 * suppliers and are protected by all applicable intellectual property
 * laws, including trade secret and copyright laws.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe Systems Incorporated.
 **************************************************************************/

import React from 'react';
import Button from '@react/react-spectrum/Button';
import Close from '@react/react-spectrum/Icon/Close';
import Textfield from '@react/react-spectrum/Textfield';

import WrappedField from './wrappedField';
import RestrictedComboBox from './restrictedComboBox';

const ReportSuiteEditor = ({ fieldName, showRemoveButton, onRemove, getRsidCompletions }) => (
  <div data-row className="u-gapBottom">
    { getRsidCompletions ? (
      <WrappedField
        name={ fieldName }
        component={ RestrictedComboBox }
        getCompletions={ getRsidCompletions }
        supportDataElement
        allowCreate
      />
    ) : (
      <WrappedField
        name={ fieldName }
        component={ Textfield }
        supportDataElement
      />
    )}
    {
      showRemoveButton ?
        <Button
          variant="action"
          quiet
          icon={ <Close /> }
          iconSize="XS"
          onClick={ onRemove }
        /> : null
    }
  </div>
);

export default class ReportSuitesEditor extends React.Component {
  /* eslint-disable no-undef */
  onAddReportSuite = () => {
    this.props.fields.push('');
  };
  /* eslint-enable no-undef */

  render() {
    const {
      className,
      fields,
      getRsidCompletions
    } = this.props;

    const rows = fields.map((fieldName, index) => (
      <ReportSuiteEditor
        key={ index }
        fieldName={ fieldName }
        onRemove={ () => fields.remove(index) }
        showRemoveButton={ fields.length > 1 }
        getRsidCompletions={ getRsidCompletions }
      />
    ));

    return (
      <div className={ className }>
        {rows}
        <Button variant="action" onClick={ this.onAddReportSuite } >
          Add Another
        </Button>
      </div>
    );
  }
}
