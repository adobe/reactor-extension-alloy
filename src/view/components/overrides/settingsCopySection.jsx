import React from "react";
import { Button, Checkbox, Flex, View } from "@adobe/react-spectrum";
import PropTypes from "prop-types";
import HeaderContainer from "./headerContainer";
import FormElementContainer from "../formElementContainer";
import { capitialize } from "./utils";
import { ENVIRONMENTS as OVERRIDE_ENVIRONMENTS } from "../../configuration/constants/environmentType";

/**
 * A section of the form that allows the user to copy all the overrides from the
 * current environment to the other two environments. Users select the destination
 * environments with checkboxes, then click the "Copy" button.
 *
 * @param {Object} props
 * @param {string} props.currentEnv The current environment.
 * @param {(source: string, destinations: string[]) => void} props.onPress The
 * function to call when the user clicks the "Copy" button.
 *
 * @returns {React.Element}
 */
const SettingsCopySection = ({ currentEnv, onPress }) => {
  const [destinations, setDestinations] = React.useState([]);
  const availableDestinations = OVERRIDE_ENVIRONMENTS.filter(
    env => env !== currentEnv
  );

  const onCopy = () => {
    onPress(currentEnv, destinations);
    setDestinations([]);
  };

  return (
    <View>
      <HeaderContainer>Copy overrides to…</HeaderContainer>
      <FormElementContainer>
        <Flex direction="row">
          {availableDestinations.map(env => (
            <Checkbox
              key={env}
              data-test-id={`copyOverrides.${env}`}
              isSelected={destinations.includes(env)}
              onChange={isSelected => {
                if (isSelected) {
                  setDestinations([...destinations, env]);
                } else {
                  setDestinations(destinations.filter(d => d !== env));
                }
              }}
            >
              {capitialize(env)}
            </Checkbox>
          ))}
        </Flex>
      </FormElementContainer>
      <Button
        data-test-id="copyOverrides"
        variant="secondary"
        isDisabled={destinations.length === 0}
        marginTop="size-100"
        onPress={onCopy}
        UNSAFE_style={{ maxWidth: "fit-content" }}
      >
        Copy
      </Button>
    </View>
  );
};

SettingsCopySection.propTypes = {
  currentEnv: PropTypes.oneOf(OVERRIDE_ENVIRONMENTS).isRequired,
  onPress: PropTypes.func.isRequired
};

export default SettingsCopySection;
