export const log = (text: string, isError = false): void => {
  const logContainer = document.getElementById('log-container');
  if (logContainer === null) throw new Error('Failed to get log container!');
  const line = document.createElement('p');
  line.classList.add('log-line');
  if (isError) {
    line.classList.add('error');
  } else {
    setTimeout(() => line.style.opacity = '0%', 3000);
    setTimeout(() => line.style.height = '0', 4000);
    setTimeout(() => logContainer.removeChild(line), 4500);
  }
  line.innerText = text;
  logContainer.appendChild(line);
};
