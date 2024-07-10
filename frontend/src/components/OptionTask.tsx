import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Card, Radio, RadioChangeEvent, Select } from "antd";
import "antd/dist/reset.css";
import { ACTION_TASK } from "../constants/AppEnum";
import data from "src/languages.json";

const options = [
  { label: "Transcribe", value: ACTION_TASK.TRANSCRIBE },
  { label: "Translate", value: ACTION_TASK.TRANSLATE },
];

type LanguageType = {
  code: string;
  name: string;
};

const OptionTask = ({
  onChangeTask,
  onChangeOption,
}: {
  onChangeTask: (value: any) => void;
  onChangeOption: (value: any) => void;
}) => {
  const [optionTask, setOptionTask] = useState("transcribe");
  const [languages, setLanguages] = useState<LanguageType[]>([]);

  const onChange = ({ target: { value } }: RadioChangeEvent) => {
    onChangeTask(value);
    setOptionTask(value);
  };

  useEffect(() => {
    setLanguages(data.languages)
    // fetch("/languages.json")
    //   .then((response) => response.json())
    //   .then((data) => setLanguages(data.languages))
    //   .catch((error) => console.error("Error fetching the JSON data:", error));
  }, []);

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
        {optionTask === ACTION_TASK.TRANSLATE && (
          <Select
            className="min-w-36"
            showSearch
            placeholder="Select a language"
            optionFilterProp="label"
            onChange={onChangeOption}
            options={languages.map((lang: LanguageType) => ({
              label: lang.name,
              value: lang.code,
            }))}
            defaultValue={"en"}
          />
        )}
      </Card>
    </>
  );
};

OptionTask.propTypes = {
  onChangeTask: PropTypes.func.isRequired,
  onChangeOption: PropTypes.func,
};

export default OptionTask;
