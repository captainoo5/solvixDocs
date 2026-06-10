import classic from './classic.js';
import modern from './modern.js';
import bold from './bold.js';
import minimal from './minimal.js';

const templates = { classic, modern, bold, minimal };

export const getTemplate = (name, data) => {
  const fn = templates[name] || templates.classic;
  return fn(data);
};
