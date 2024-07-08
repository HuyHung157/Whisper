// TypingAnimation.js
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Input, Skeleton } from "antd";

const { TextArea } = Input;

const TypingAnimation = ({
  message,
  speed,
  isLoading,
  ...textAreaProps
}: {
  message: string;
  isLoading: boolean;
  speed?: number;
}) => {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (isLoading) {
      setText("");
      setIndex(0);
    }
    if (index < message.length) {
      const timeout = setTimeout(() => {
        setText((prev) => prev + message[index]);
        setIndex((prev) => prev + 1);
      }, speed || 1);
      return () => clearTimeout(timeout);
    }
  }, [index, message, speed, isLoading]);

  return (
    <>
      {!isLoading && (
        <TextArea
          // rows={4}
          autoSize={{ minRows: 4 }}
          value={text}
          {...textAreaProps}
          readOnly
        />
      )}
      {isLoading && <Skeleton active paragraph={{ rows: 4 }} />}
    </>
  );
};

TypingAnimation.propTypes = {
  message: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  speed: PropTypes.number,
};

TypingAnimation.defaultProps = {
  speed: 1,
  isLoading: false,
};

export default TypingAnimation;
