import { StyleSheet } from 'react-native'

// Style constants for consistent values
export const COLORS = {
  primary: '#196EB0',
  white: '#FFFFFF',
  black: '#000000',
  danger: '#FF6B6B',
  gray: {
    text: '#666666',
    border: '#E0E0E0',
    background: '#F7F8F9',
    placeholder: '#999999'
  }
}
  
const SPACING = {
  xs: 8,
  sm: 10,
  md: 16,
  lg: 20,
  xl: 28,
  xxl: 40
}

const BORDER = {
  radius: 8,
  width: 1
}

const INPUT = {
  height: 50,
  fontSize: 16
}

const styles = StyleSheet.create({
  // Layout containers
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: SPACING.sm
  },
  keyboardAvoidingView: {
    flex: 1
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: SPACING.xl,
  },
  content: {
    flex: 1,
    padding: SPACING.lg
  },
  formContainer: {
    width: '100%'
  },

  // Header styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md
  },
  backButton: {
    marginRight: SPACING.md
  },
  headerTextContainer: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.xxl
  },
  headerText: {
    fontSize: SPACING.xl,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'left'
  },

  // Input field styles
  inputContainer: {
    width: '100%',
    height: INPUT.height,
    borderColor: COLORS.gray.border,
    borderWidth: BORDER.width,
    borderRadius: BORDER.radius,
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: SPACING.sm,
    fontSize: INPUT.fontSize,
    color: COLORS.black
  },
  inputIcon: {
    padding: SPACING.sm
  },
  eyeIcon: {
    padding: SPACING.sm
  },

  // Medicine form specific containers
  medicineFormContainer: {
    flex: 1,
    justifyContent: 'space-between',
    height: '100%',
  },
  medicineListScrollContainer: {
    maxHeight: 500,
    marginBottom: SPACING.lg,
  },
  formContent: {
    flex: 1, 
  },
  buttonWrapper: {
    marginTop: 'auto', // Push button to bottom
    width: '100%',
  },

  // Input row layout
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    justifyContent: 'space-between',
  },
  inputLabel: {
    flex: 1,
    fontSize: INPUT.fontSize,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  inputWrapper: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Number input styles
  numberInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: BORDER.width,
    borderColor: COLORS.gray.border,
    borderRadius: BORDER.radius,
    flex: 2,
    backgroundColor: COLORS.gray.background,
  },
  numberInput: {
    flex: 1,
    padding: SPACING.sm,
    fontSize: INPUT.fontSize,
    textAlign: 'center',
    color: COLORS.black,
  },
  numberInputButton: {
    padding: SPACING.sm,
  },

  // Duration input styles
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
  },
  durationInput: {
    width: 80,
    borderWidth: BORDER.width,
    borderColor: COLORS.gray.border,
    borderRadius: BORDER.radius,
    padding: SPACING.sm,
    fontSize: INPUT.fontSize,
    marginRight: SPACING.sm,
    backgroundColor: COLORS.gray.background,
    textAlign:'center'
  },
  pickerContainer: {
    flex: 1,
    borderWidth: BORDER.width,
    borderColor: COLORS.gray.border,
    borderRadius: BORDER.radius,
    justifyContent: 'center',
    padding: 0 
  },
  durationPicker: {
    flex: 1,
    height: 40,
  },

  // Medicine list styles
  medicineListContainer: {
    width: '100%',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  medicineListItem: {
    width: '48%', // Slightly less than 50% to allow for spacing
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    borderWidth: BORDER.width,
    borderColor: COLORS.gray.border,
    borderRadius: BORDER.radius,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.white,
  },
  selectedMedicineItem: {
    borderColor: COLORS.primary,
    borderWidth: 2,
    backgroundColor: COLORS.gray.background,
  },
  medicineImage: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
    marginRight: SPACING.sm,
  },
  medicineText: {
    fontSize: 14,
    color: COLORS.black,
    flex: 1,
  },

  // Day selection styles
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: BORDER.width,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDayCircle: {
    backgroundColor: COLORS.primary,
  },
  dayText: {
    fontSize: INPUT.fontSize,
    color: COLORS.primary,
  },
  selectedDayText: {
    color: COLORS.white,
  },

  // Alarm styles
  alarmsScrollContainer: {
    maxHeight: 260,
  },
  alarmListContent: {
    paddingRight: SPACING.sm, 
  },
  alarmsSection: {
    marginBottom: SPACING.md,
  },
  alarmContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    width: '100%',
  },
  alarmButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: INPUT.height,
    borderColor: COLORS.gray.border,
    borderWidth: BORDER.width,
    borderRadius: BORDER.radius,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.gray.background,
    paddingHorizontal: SPACING.md,
  },
  removeAlarmButton: {
    marginLeft: SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
    height: INPUT.height,
  },
  addAlarmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  addAlarmText: {
    marginLeft: SPACING.sm,
    color: COLORS.primary,
    fontSize: INPUT.fontSize,
  },

  // Radio button styles
  radioGroup: {
    marginBottom: SPACING.md,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  radioBullet: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginRight: SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioBulletInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },

  // Date picker styles
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: INPUT.height,
    borderColor: COLORS.gray.border,
    borderWidth: BORDER.width,
    borderRadius: BORDER.radius,
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.gray.background,
  },
  dateButtonText: {
    flex: 1,
    fontSize: INPUT.fontSize,
    color: COLORS.black,
  },

  // Button styles
  button: {
    backgroundColor: COLORS.primary,
    width: '100%',
    height: INPUT.height,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BORDER.radius,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: INPUT.fontSize + 2,
    fontWeight: 'bold',
  },
  buttonContainer: {
    paddingTop: SPACING.lg,
  },

  // Text styles
  textBlack: {
    color: COLORS.black,
    fontSize: INPUT.fontSize,
    marginLeft: 8
  },
  detailLabel: {
    fontSize: INPUT.fontSize,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },

  // Homescreen
  medicineIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginRight: SPACING.sm,
  },
  medicineItemContainer: {
    marginBottom: SPACING.sm,
    borderRadius: BORDER.radius,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  medicineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
  },
  medicineDetails: {
    flex: 1,
  },
  medicineName: {
    fontSize: INPUT.fontSize,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: SPACING.xs,
  },
  medicineInfo: {
    fontSize: INPUT.fontSize - 2,
    color: COLORS.gray.text,
    marginBottom: SPACING.xs,
  },
  medicineCondition: {
    fontSize: INPUT.fontSize - 2,
    color: COLORS.primary,
    fontStyle: 'italic',
  },
  medicineList: {
    maxHeight: 400,
  },
  noMedicineText: {
    fontSize: INPUT.fontSize,
    color: COLORS.gray.text,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: SPACING.md,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: INPUT.fontSize,
    textAlign: 'center',
    marginHorizontal: SPACING.lg,
  },
  medicineContainer: {
    flex: 1,
    marginTop: SPACING.xxl,
  },
  medicineTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: SPACING.md,
  },

})

const authStyles = {
  // Fixed input container for auth screens
  authInputContainer: {
    width: '100%',
    height: 50,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  // Fixed text input for auth screens
  authInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#000000',
    paddingVertical: 0,
  },
  
  // Fixed eye icon position for password fields
  authEyeIcon: {
    padding: 10,
    alignSelf: 'center',
  },
  
  // Fixed picker container for gender selection
  authPickerContainer: {
    width: '100%',
    height: 50,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  // Fixed picker styling
  authPicker: {
    flex: 1,
    height: 50,
    color: '#000000',
  },
  
  // Fixed date button styling
  authDateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 50,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#F7F8F9',
  },
  
  authDateButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    paddingVertical: 0,
  },
  
  // Auth-specific link styles
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  
  forgotPasswordText: {
    color: '#196EB0',
    fontSize: 14,
  },
  
  registerLink: {
    marginTop: 10,
  },
  
  loginLink: {
    marginTop: 10,
  }
};

// Add authStyles to your existing styles export
export default {
  ...styles,
  ...authStyles
};