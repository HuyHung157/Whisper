import data from "../languages.json";

export function getSingleOption(languageCode: string) {
  if (!data || !data.languages || !languageCode) return;
  else return data.languages
  .filter((lang) => lang.code ===languageCode)
  .map((lang) => ({
    label: lang.name,
    value: lang.code,
    }));
}
