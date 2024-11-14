import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

import { Presets } from "../constants";

import { useSchemes } from "../hooks/useSchemes";
import { usePresets } from "../hooks/usePresets";

import { savePresetCustomValue, restorePresetCustomValue } from "../utils/memo";

const PresetButton = ({
  preset,
  onClick,
  w,
  h,
}: {
  preset: Presets;
  onClick: () => void;
  w: number;
  h: number;
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { left, right } = useSchemes();
  const [value, setValue] = useState(
    restorePresetCustomValue({ preset, sl: left, sr: right, w, h })
  );
  const [isEditing, setEditing] = useState(false);

  const { current: currentPreset } = usePresets();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        right &&
        left &&
        h &&
        w
      ) {
        inputRef.current.blur();
        savePresetCustomValue({
          preset: preset,
          w,
          h,
          sr: right,
          sl: left,
          value: value || preset,
        });
        if (!value.trim()) {
          setValue(preset);
        }

        setEditing(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [h, w, left, right, preset, value]);

  return (
    <button
      className={clsx([
        "preset-button",
        preset === currentPreset && "preset-button-active",
      ])}
      onClick={onClick}
      onDoubleClick={() => setEditing(true)}
    >
      {isEditing ? (
        <form
          className="preset-form"
          onSubmit={(e) => {
            e.preventDefault();
            setEditing(false);

            if (w && h) {
              savePresetCustomValue({
                preset: preset,
                w,
                h,
                sr: right,
                sl: left,
                value: value || preset,
              });
            }

            if (!value.trim()) {
              setValue(preset);
            }
          }}
        >
          <input
            ref={inputRef}
            className="preset-input"
            value={value}
            autoFocus={true}
            onFocus={(e) => e.target.select()}
            onChange={(e) => {
              const updValue = e.target.value;
              if (updValue.length > 12) {
                return;
              }
              setValue(e.target.value);
            }}
          />
        </form>
      ) : (
        value
      )}
    </button>
  );
};

export default PresetButton;
