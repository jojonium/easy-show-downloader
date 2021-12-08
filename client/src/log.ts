export const log = (text: string, isError = false): void => {
  const logContainer = document.getElementById('log-container');
  if (logContainer === null) throw new Error('Failed to get log container!');
  const line = document.createElement('p');
  line.classList.add('log-line');
  if (isError) line.classList.add('error');
  line.innerText = text;
  logContainer.appendChild(line);
};
