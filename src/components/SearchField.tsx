import { Input as SdkInput, InputClear, InputGroup } from "@ui-sdk/react/input"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

interface Props {
  placeholder: string
  clearLabel: string
}

export function SearchField({ placeholder, clearLabel }: Props) {
  return (
    <InputGroup className="bp-search__field">
      <SdkInput
        id="q"
        name="q"
        type="search"
        role="combobox"
        autoComplete="off"
        placeholder={placeholder}
        aria-controls="search-results"
        aria-autocomplete="list"
        aria-expanded="false"
        render={<Input />}
      />
      <InputClear
        aria-label={clearLabel}
        render={<Button type="button" variant="ghost" size="icon" />}
      >
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
          <path d="m6 6 12 12M18 6 6 18" />
        </svg>
      </InputClear>
    </InputGroup>
  )
}
