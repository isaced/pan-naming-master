import { AddingMode } from "../types";

export function replace(
  { orgText, searchText, replaceText }: {
    orgText: string;
    searchText: string;
    replaceText: string;
  },
) {
  if (!searchText) {
    return orgText;
  }
  return orgText.replace(searchText, replaceText);
}

export function adding({
  orgText,
  addingText,
  addingMode,
}: {
  orgText: string;
  addingText: string;
  addingMode: AddingMode;
}) {
  if (!addingText) {
    return orgText;
  }
  if (addingMode === AddingMode.Before) {
    return addingText + orgText;
  }
  if (addingMode === AddingMode.After) {
    return orgText + addingText;
  }
  return orgText;
}
