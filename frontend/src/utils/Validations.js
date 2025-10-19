/*
Validation rules:
- Email must be in a valid format (e.g., user@example.com)
- Password must be 6-15 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.
- Mobile number must be a 10-digit Indian phone number
- Name field is not mandatory but if provided, it should only contain alphabetic characters and spaces.
- Address field is optional and can contain alphanumeric characters, spaces, commas, and periods.
- All the fields after validations must be trimmed of leading and trailing whitespace.
*/

const SignUpValidations = (formData) => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,15}$/;
    const mobileNumberRegex = /^[6-9]\d{9}$/; // Indian mobile number: starts with 6-9, total 10 digits
    const nameRegex = /^[A-Za-z\s]+$/;
    const addressRegex = /^[A-Za-z0-9\s,.'-]*$/;

    // Email validation
    if (!formData.email || !emailRegex.test(formData.email.trim())) {
        errors.email = 'Invalid email format';
    }

    // Password validation
    if (!formData.password || !passwordRegex.test(formData.password.trim())) {
        errors.password = 'Password must be 6-15 characters long and include uppercase, lowercase, number, and special character';
    }

    // Mobile number validation (Indian format: 10 digits starting with 6-9)
    if (!formData.mobileNumber || !mobileNumberRegex.test(formData.mobileNumber.trim())) {
        errors.mobileNumber = 'Mobile number must be 10 digits starting with 6, 7, 8, or 9';
    }

    // Name validation (If provided)
    if (formData.firstName && !nameRegex.test(formData.firstName.trim())) {
        errors.firstName = 'First name can only contain alphabetic characters and spaces';
    }
    if (formData.middleName && !nameRegex.test(formData.middleName.trim())) {
        errors.middleName = 'Middle name can only contain alphabetic characters and spaces';
    }
    if (formData.lastName && !nameRegex.test(formData.lastName.trim())) {
        errors.lastName = 'Last name can only contain alphabetic characters and spaces';
    }

    // Address validation (If provided)
    if (formData.address && !addressRegex.test(formData.address.trim())) {
        errors.address = 'Address can only contain alphanumeric characters, spaces, commas, and periods';
    }

    // Trim all fields
    for (let key in formData) {
        if (formData[key] && typeof formData[key] === 'string') {
            formData[key] = formData[key].trim();
        }
    }

    return errors;
}

export { SignUpValidations };