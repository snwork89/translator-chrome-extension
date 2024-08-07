import React, { useEffect } from "react";

const TextAreaComponent = ({ value, setValue, placeholder, type,rows=10 }) => {
  const setDefaultValue = async () => {
    let defautValue = await chrome.storage.local.get([`textarea_${type}`]);
    setValue(Object.values(defautValue)[0]);
  };
  useEffect(() => {
    setDefaultValue();
  }, []);

  const saveToLocal = async()=>{
    await chrome.storage.local.set({
      [`textarea_${type}`]: value
    });
  }

  useEffect(()=>{
   saveToLocal()
  },[value])
  return (
    <textarea
      rows={rows}
      onChange={async (e) => {
        setValue(e.target.value);
       
      }}
      placeholder={placeholder}
      value={value}
      className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      required
    />
  );
};

export default TextAreaComponent;
