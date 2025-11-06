/*
Copyright 2025 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

// Simple hardcoded React component for testing
const Counter = () => {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState("");

  const handleIncrement = () => {
    setCount(count + 1);
    if (count + 1 >= 5) {
      setMessage("You've clicked 5 or more times!");
    }
  };

  const handleDecrement = () => {
    setCount(count - 1);
    if (count - 1 < 5) {
      setMessage("");
    }
  };

  const handleReset = () => {
    setCount(0);
    setMessage("");
  };

  return (
    <div>
      <h1>Counter Example</h1>
      <p data-testid="count-display">Count: {count}</p>
      {message && (
        <p data-testid="message" role="alert">
          {message}
        </p>
      )}
      <button type="button" onClick={handleIncrement}>
        Increment
      </button>
      <button type="button" onClick={handleDecrement}>
        Decrement
      </button>
      <button type="button" onClick={handleReset}>
        Reset
      </button>
    </div>
  );
};

describe("Integration Test Example - Counter Component", () => {
  it("renders the counter with initial state", () => {
    render(<Counter />);

    expect(screen.getByText("Counter Example")).toBeInTheDocument();
    expect(screen.getByTestId("count-display")).toHaveTextContent("Count: 0");
    expect(screen.queryByTestId("message")).not.toBeInTheDocument();
  });

  it("increments and decrements the counter", async () => {
    const user = userEvent.setup();
    render(<Counter />);

    const incrementButton = screen.getByRole("button", { name: "Increment" });
    const decrementButton = screen.getByRole("button", { name: "Decrement" });

    // Increment twice
    await user.click(incrementButton);
    expect(screen.getByTestId("count-display")).toHaveTextContent("Count: 1");

    await user.click(incrementButton);
    expect(screen.getByTestId("count-display")).toHaveTextContent("Count: 2");

    // Decrement once
    await user.click(decrementButton);
    expect(screen.getByTestId("count-display")).toHaveTextContent("Count: 1");
  });

  it("shows message when count reaches 5", async () => {
    const user = userEvent.setup();
    render(<Counter />);

    const incrementButton = screen.getByRole("button", { name: "Increment" });

    // Message should not be visible initially
    expect(screen.queryByTestId("message")).not.toBeInTheDocument();

    // Click 5 times
    await user.click(incrementButton);
    await user.click(incrementButton);
    await user.click(incrementButton);
    await user.click(incrementButton);
    await user.click(incrementButton);

    // Message should now be visible
    expect(screen.getByTestId("message")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "You've clicked 5 or more times!",
    );
  });

  it("hides message when count drops below 5", async () => {
    const user = userEvent.setup();
    render(<Counter />);

    const incrementButton = screen.getByRole("button", { name: "Increment" });
    const decrementButton = screen.getByRole("button", { name: "Decrement" });

    // Click 5 times to show message
    await user.click(incrementButton);
    await user.click(incrementButton);
    await user.click(incrementButton);
    await user.click(incrementButton);
    await user.click(incrementButton);

    expect(screen.getByTestId("message")).toBeInTheDocument();

    // Decrement to hide message
    await user.click(decrementButton);

    expect(screen.queryByTestId("message")).not.toBeInTheDocument();
  });

  it("resets counter and message to initial state", async () => {
    const user = userEvent.setup();
    render(<Counter />);

    const incrementButton = screen.getByRole("button", { name: "Increment" });
    const resetButton = screen.getByRole("button", { name: "Reset" });

    // Increment several times
    await user.click(incrementButton);
    await user.click(incrementButton);
    await user.click(incrementButton);
    await user.click(incrementButton);
    await user.click(incrementButton);
    await user.click(incrementButton);
    await user.click(incrementButton);

    expect(screen.getByTestId("count-display")).toHaveTextContent("Count: 7");
    expect(screen.getByTestId("message")).toBeInTheDocument();

    // Reset
    await user.click(resetButton);

    expect(screen.getByTestId("count-display")).toHaveTextContent("Count: 0");
    expect(screen.queryByTestId("message")).not.toBeInTheDocument();
  });

  it("handles multiple button interactions correctly", async () => {
    const user = userEvent.setup();
    render(<Counter />);

    const incrementButton = screen.getByRole("button", { name: "Increment" });
    const decrementButton = screen.getByRole("button", { name: "Decrement" });

    // Complex interaction sequence
    await user.click(incrementButton); // 1
    await user.click(incrementButton); // 2
    await user.click(decrementButton); // 1
    await user.click(incrementButton); // 2
    await user.click(incrementButton); // 3

    expect(screen.getByTestId("count-display")).toHaveTextContent("Count: 3");
    expect(screen.queryByTestId("message")).not.toBeInTheDocument();
  });
});
