/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { FULL, PARTIAL, EMPTY } from "../constants/populationAmount";
import "./populationAmountIndictor.styl";

const PopulationAmountIndicator = ({ className, populationAmount }) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 42 42"
      className={classNames("PopulationAmountIndicator", className)}
    >
      <circle
        className="PopulationAmountIndicator-baseRing"
        cx="21"
        cy="21"
        r="15.91549430918954"
        fill="transparent"
      />

      <circle
        className={classNames("PopulationAmountIndicator-emphasisRing", {
          "is-full": populationAmount === FULL,
          "is-partial": populationAmount === PARTIAL,
          "is-empty": populationAmount === EMPTY
        })}
        cx="21"
        cy="21"
        r="15.91549430918954"
        fill="transparent"
        strokeDashoffset="25"
        // strokeDasharray={`${100 * populationAmount} ${100 * (1 - populationAmount)}`}
      />
    </svg>
  );
};

PopulationAmountIndicator.propTypes = {
  className: PropTypes.string,
  populationAmount: PropTypes.oneOf([FULL, PARTIAL, EMPTY])
};

export default PopulationAmountIndicator;
