import React, { useState } from "react";
import PropTypes from "prop-types";
import { Card, Radio, RadioChangeEvent } from "antd";
import "antd/dist/reset.css";

const options = [
  { label: "Transcribe", value: "transcribe" },
  { label: "Translate", value: "translate" },
];

const OptionTask = ({
  onChangeTask,
}: {
  onChangeTask: (value: any) => void;
}) => {
  const [optionTask, setOptionTask] = useState("transcribe");

  const onChange = ({ target: { value } }: RadioChangeEvent) => {
    onChangeTask(value);
    setOptionTask(value);
  };

  return (
    <>
      <Card>
        <Radio.Group
          options={options}
          onChange={onChange}
          value={optionTask}
          // optionType="button"
          // buttonStyle="solid"
        />
      </Card>
    </>
  );
};

OptionTask.propTypes = {
  onChangeTask: PropTypes.func.isRequired,
};

export default OptionTask;
