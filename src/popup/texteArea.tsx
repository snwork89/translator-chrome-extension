import React, { useEffect } from "react";

const TextAreaComponent = ({ value, setValue, placeholder, type }) => {
  const setDefaultValue = async () => {
    let defautValue = await chrome.storage.local.get([`textarea_${type}`]);
    setValue(Object.values(defautValue)[0]);
  };
  useEffect(() => {
    setDefaultValue();
  }, []);
  return (
    <textarea
      rows={10}
      onChange={async (e) => {
        setValue(e.target.value);
        await chrome.storage.local.set({
          [`textarea_${type}`]: e.target.value,
        });
      }}
      placeholder={placeholder}
      value={value}
      className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      required
    />
  );
};

export default TextAreaComponent;
