import React from 'react'
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

// Color palette
const COLORS = {
  primary: '#196EB0',
  secondary: '#6C757D',
  success: '#28A745',
  danger: '#FF6B6B',
  warning: '#FFC107',
  info: '#17A2B8',
  light: '#F8F9FA',
  dark: '#343A40',
  white: '#FFFFFF',
  transparent: 'transparent'
}

// Button size configurations
const SIZES = {
  small: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 12,
    iconSize: 16
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    iconSize: 20
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontSize: 18,
    iconSize: 24
  }
}

// Border configurations
const BORDER = {
  radius: 8,
  width: 2
}

const CustomButton = ({
  onPress,
  title,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  icon,
  disabled = false,
  loading = false,
  style,
  textStyle,
  ...props
}) => {
  // Function to get variant-specific styles
  const getVariantStyles = (colorName) => {
    const styles = {
      // Contained variant
      contained: {
        backgroundColor: COLORS[colorName],
        borderWidth: 0
      },
      containedText: {
        color: colorName === 'light' ? COLORS.dark : COLORS.white
      },

      // Outlined variant
      outlined: {
        backgroundColor: COLORS.transparent,
        borderWidth: BORDER.width,
        borderColor: COLORS[colorName]
      },
      outlinedText: {
        color: COLORS[colorName]
      },

      // Text variant
      text: {
        backgroundColor: COLORS.transparent,
        borderWidth: 0
      },
      textText: {
        color: COLORS[colorName]
      }
    }
    return styles
  }

  // Get variant-specific styles
  const variantStyles = getVariantStyles(color)
  
  // Get size configuration
  const sizeConfig = SIZES[size]

  // Combine all button styles
  const buttonStyle = [
    styles.button,
    styles[size],
    variantStyles[variant],
    disabled && styles.disabled,
    style
  ]

  // Combine all text styles
  const combinedTextStyle = [
    styles.buttonText,
    styles[`${size}Text`],
    variantStyles[`${variant}Text`],
    textStyle
  ]

  // Render loading spinner if loading
  if (loading) {
    return (
      <TouchableOpacity
        style={buttonStyle}
        disabled={true}
        {...props}
      >
        <ActivityIndicator 
          color={variant === 'contained' ? COLORS.white : COLORS[color]} 
          size={sizeConfig.iconSize}
        />
      </TouchableOpacity>
    )
  }

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled}
      {...props}
    >
      {icon && (
        <Icon
          name={icon}
          size={sizeConfig.iconSize}
          color={variant === 'contained' ? COLORS.white : COLORS[color]}
          style={styles.iconSpacing}
        />
      )}
      <Text style={combinedTextStyle}>{title}</Text>
    </TouchableOpacity>
  )
}

// Styles
const styles = StyleSheet.create({
  // Base button styles
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER.radius
  },

  // Disabled state
  disabled: {
    opacity: 0.6
  },

  // Size variations
  small: {
    paddingVertical: SIZES.small.paddingVertical,
    paddingHorizontal: SIZES.small.paddingHorizontal
  },
  medium: {
    paddingVertical: SIZES.medium.paddingVertical,
    paddingHorizontal: SIZES.medium.paddingHorizontal
  },
  large: {
    paddingVertical: SIZES.large.paddingVertical,
    paddingHorizontal: SIZES.large.paddingHorizontal
  },

  // Text base styles
  buttonText: {
    fontWeight: '600',
    textAlign: 'center'
  },
  
  // Text sizes
  smallText: {
    fontSize: SIZES.small.fontSize
  },
  mediumText: {
    fontSize: SIZES.medium.fontSize
  },
  largeText: {
    fontSize: SIZES.large.fontSize
  },

  // Icon spacing
  iconSpacing: {
    marginRight: 8
  }
})

export default CustomButton