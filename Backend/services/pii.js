export function detectAndRedactPII(text) {
  const patterns = {
    email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
    phone: /\b(\+?\d{1,3}[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?)?\d{6,10}\b/g,
    name: /\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)\b/g
  };

  const found = [];
  let redactedText = text;

  for (const type in patterns) {
    const matches = text.match(patterns[type]);
    if (matches) {
      matches.forEach((value) => {
        found.push({ type, value });
        const blackBox = "█".repeat(value.length);
        redactedText = redactedText.replace(value, blackBox);
      });
    }
  }

  return { found, redactedText };
}
