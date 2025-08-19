export function capitalizeWords(str) {
    console.log(str)
  // Convert the entire string to lowercase to handle varying input cases
  const words = str.toLowerCase().split(' ');

  // Iterate through each word and capitalize its first letter
  const capitalizedWords = words.map(word => {
    if (word.length === 0) {
      return ''; // Handle empty strings or multiple spaces
    }
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  // Join the capitalized words back into a single string
  return capitalizedWords.join(' ');
}