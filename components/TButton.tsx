import {
  Text,
  type TextProps,
  StyleSheet,
  Pressable,
  type PressableProps,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Platform,
  View,
  ViewStyle,
} from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ButtonType =
  | 'pressable'
  | 'opacity'
  | 'highlight'
  | 'withoutFeedback'
  | 'text';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
  buttonType?: ButtonType;
  onPress?: PressableProps['onPress'];
  activeOpacity?: number;
  underlayColor?: string;
  background?: any;
  useForeground?: boolean;
  disabled?: boolean;
  testID?: string;
  style?: ViewStyle; // ViewStyle olarak değiştirildi
  containerStyle?: ViewStyle; // Container için yeni style prop
};

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});

export function TButton({
  style,
  containerStyle,
  lightColor,
  darkColor,
  type = 'default',
  buttonType = 'opacity',
  onPress,
  activeOpacity = 0.7,
  underlayColor = '#DDDDDD',
  background,
  useForeground = true,
  disabled = false,
  testID,
  children,
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  const textStyles = [
    { color },
    styles[type],
  ];

  const buttonStyles = [
    styles.button,
    style, // Custom style'ı direkt burada uyguluyoruz
    disabled && styles.disabled,
  ];

  const TextComponent = (
    <Text
      style={textStyles}
      {...rest}
    >
      {children}
    </Text>
  );

  if (disabled) {
    return (
      <View style={buttonStyles}>
        {TextComponent}
      </View>
    );
  }

  switch (buttonType) {
    case 'pressable':
      return (
        <Pressable
          onPress={onPress}
          style={buttonStyles}
          disabled={disabled}
          testID={testID}
        >
          {TextComponent}
        </Pressable>
      );

    case 'opacity':
      return (
        <TouchableOpacity
          onPress={onPress}
          style={buttonStyles}
          activeOpacity={activeOpacity}
          disabled={disabled}
          testID={testID}
        >
          {TextComponent}
        </TouchableOpacity>
      );

    case 'highlight':
      return (
        <TouchableHighlight
          onPress={onPress}
          style={buttonStyles}
          underlayColor={underlayColor}
          disabled={disabled}
          testID={testID}
        >
          {TextComponent}
        </TouchableHighlight>
      );

    case 'withoutFeedback':
      return (
        <TouchableWithoutFeedback
          onPress={onPress}
          disabled={disabled}
          testID={testID}
        >
          <View style={buttonStyles}>
            {TextComponent}
          </View>
        </TouchableWithoutFeedback>
      );

    case 'text':
    default:
      return TextComponent;
  }
}