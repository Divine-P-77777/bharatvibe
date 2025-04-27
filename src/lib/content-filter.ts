
// List of abuse words in English and Hindi to filter out
const abuseWordsList = [
    // English words
    'fuck', 'shit', 'asshole', 'bitch', 'cunt', 'dick', 'pussy', 'slut', 
    'bastard', 'whore', 'retard', 'nigger', 'faggot',
    
    // Hindi words
    'chutiya', 'bhenchod', 'madarchod', 'bhosdike', 'gaand', 'lund', 'randi',
    'chutiye', 'behenchod', 'bsdk', 'mc', 'bc', 'lodu', 'chodu',
  ];
  
  /**
   * Check if text contains any abuse words from our list
   * @param text Text to check for abuse words
   * @returns boolean indicating if text contains abuse words
   */
  export const containsAbuseWords = (text: string): boolean => {
    if (!text) return false;
    
    const lowerText = text.toLowerCase();
    
    // Check for exact matches (with word boundaries)
    for (const word of abuseWordsList) {
      // Use regex with word boundaries to match whole words only
      const regex = new RegExp(`\\b${word}\\b`, 'i');
      if (regex.test(lowerText)) {
        return true;
      }
    }
    
    return false;
  };
  
  /**
   * Filter out abuse words from text by replacing them with asterisks
   * @param text Text to filter abuse words from
   * @returns Filtered text with abuse words replaced by asterisks
   */
  export const filterAbuseWords = (text: string): string => {
    if (!text) return '';
    
    let filteredText = text;
    
    for (const word of abuseWordsList) {
      // Create a regex with word boundaries
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      
      // Replace the word with asterisks
      filteredText = filteredText.replace(regex, '*'.repeat(word.length));
    }
    
    return filteredText;
  };
  