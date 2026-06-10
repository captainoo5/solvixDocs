export const generateDocNumber = (businessName, type, sequence) => {
  if (!businessName) businessName = 'SD';
  const words = businessName.trim().split(/\s+/);
  let prefix = '';
  
  if (words.length === 1) {
    prefix = words[0].slice(0, 3).toUpperCase();
  } else {
    prefix = words
      .map(w => (w[0] ? w[0].toUpperCase() : ''))
      .join('')
      .slice(0, 3);
  }
  
  if (prefix.length < 2) {
    prefix = (prefix + 'SD').slice(0, 3);
  }

  const typeMap = {
    quotation: 'QUO',
    proforma:  'PI',
    receipt:   'RCP',
  };

  const padded = String(sequence).padStart(4, '0');
  return `${prefix}-${typeMap[type] || 'DOC'}-${padded}`;
};
