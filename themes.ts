import { createTheme } from 'tamagui'
import { BaseTheme } from './@types/global'
import { tokens } from "@tamagui/theme-base";

const light: BaseTheme = createTheme({
  background: '#fff',
  backgroundHover: tokens.color.gray3Light,
  backgroundPress: tokens.color.gray4Light,
  backgroundFocus: tokens.color.gray5Light,
  borderColor: tokens.color.gray4Light,
  borderColorHover: tokens.color.gray6Light,
  borderColorHoverFocus: tokens.color.gray6Light,
  color: tokens.color.gray12Light,
  colorHover: tokens.color.gray11Light,
  colorPress: tokens.color.gray10Light,
  colorFocus: tokens.color.gray6Light,
  shadowColor: tokens.color.gray6Light,
  shadowColorHover: tokens.color.gray6Light,
})

const light_translucent: BaseTheme = createTheme({
  ...light,
  background: 'rgba(255,255,255,0.85)',
  backgroundHover: 'rgba(250,250,250,0.85)',
  backgroundPress: 'rgba(240,240,240,0.85)',
  backgroundFocus: 'rgba(240,240,240,0.7)',
})

// note the steps here
// we recommend doing this because it avoids a category of confusing type errors

// 1. to get ThemeNames/Theme, first create an object with all themes
const themes = {
  light,
  light_translucent
}

// 2. then get the name type
type ThemeName = keyof typeof themes

// 3. then, create a Themes type that explicitly maps ThemeName => BaseTheme
type Themes = {
  [key in ThemeName]: BaseTheme
}

// 4. finally, export it with the stricter type
export const customThemes: Themes = themes