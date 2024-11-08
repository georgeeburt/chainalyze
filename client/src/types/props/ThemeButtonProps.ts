import { Dispatch, SetStateAction } from "react";

export default interface ThemeButtonProps {
  isDarkMode: boolean;
  setIsDarkMode: Dispatch<SetStateAction<boolean>>;
}