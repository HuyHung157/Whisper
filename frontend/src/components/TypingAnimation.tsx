// TypingAnimation.js
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Input } from "antd";

const { TextArea } = Input;

const TypingAnimation = ({
  message,
  speed,
  ...textAreaProps
}: {
  message: string;
  speed?: number;
}) => {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < message.length) {
      const timeout = setTimeout(() => {
        setText((prev) => prev + message[index]);
        setIndex((prev) => prev + 1);
      }, speed || 5);
      return () => clearTimeout(timeout);
    }
  }, [index, message, speed]);

  return (
    <TextArea
      // rows={4}
      autoSize={{ minRows: 4 }}
      value={text}
      {...textAreaProps}
      readOnly
    />
  );
};

TypingAnimation.propTypes = {
  message: PropTypes.string.isRequired,
  speed: PropTypes.number,
};

TypingAnimation.defaultProps = {
  speed: 5,
};

export default TypingAnimation;
