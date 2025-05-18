/**
 * Utility functions for handling API errors
 */

/**
 * Extracts error message from various error response formats
 * @param {Error} error - The error object from axios
 * @returns {string} - Human-readable error message
 */
export const extractErrorMessage = async (error) => {
    // Handle timeout errors
    if (error.code === "ECONNABORTED") {
      return "Request timed out. Please try again."
    }
  
    // Handle network errors
    if (!error.response) {
      return error.message || "Network error. Please check your connection."
    }
  
    // Handle specific HTTP status codes
    switch (error.response.status) {
      case 400:
        return "Invalid request. Please check your information."
      case 401:
      case 403:
        return "Authentication error. Please log in again."
      case 404:
        return "Resource not found. Please try again later."
      case 413:
        return "File too large. Please use a smaller photo."
      case 429:
        return "Too many requests. Please try again later."
      case 500:
      case 502:
      case 503:
      case 504:
        return "Server error. Please try again later."
      default:
        // Try to parse error from response body
        try {
          if (error.response.data instanceof Blob) {
            // For blob responses (common in file downloads)
            const text = await blobToText(error.response.data)
            try {
              const json = JSON.parse(text)
              return json.message || json.error || "Unknown error occurred"
            } catch (e) {
              // Not JSON, return as is if it looks like a message
              return text.length < 100 ? text : "Unknown error occurred"
            }
          } else if (typeof error.response.data === "object") {
            // For JSON responses
            return error.response.data.message || error.response.data.error || "Unknown error occurred"
          }
        } catch (e) {
          console.error("Error parsing error response:", e)
        }
  
        return `Error: ${error.response.status}`
    }
  }
  
  /**
   * Converts a Blob to text
   * @param {Blob} blob - The blob to convert
   * @returns {Promise<string>} - The text content
   */
  const blobToText = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsText(blob)
    })
  }
  
  /**
   * Validates form data before submission
   * @param {Object} formData - The form data to validate
   * @returns {Object} - { isValid, message }
   */
  export const validateResumeForm = (formData, workExperiences, educations) => {
    if (!formData.fullName.trim()) {
      return { isValid: false, message: "Please enter your full name" }
    }
  
    if (!formData.email.trim()) {
      return { isValid: false, message: "Please enter your email" }
    }
  
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email.trim())) {
      return { isValid: false, message: "Please enter a valid email address" }
    }
  
    // Validate work experiences
    for (const exp of workExperiences) {
      if (!exp.company.trim() || !exp.position.trim() || !exp.startDate) {
        return {
          isValid: false,
          message: "Please complete all required fields in Work Experience",
        }
      }
  
      if (!exp.current && !exp.endDate) {
        return {
          isValid: false,
          message: "Please provide an end date or mark as current job",
        }
      }
    }
  
    // Validate education
    for (const edu of educations) {
      if (!edu.institution.trim() || !edu.degree.trim()) {
        return {
          isValid: false,
          message: "Please complete all required fields in Education",
        }
      }
    }
  
    return { isValid: true }
  }
  