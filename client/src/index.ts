import {getData} from './api-helpers';

window.onload = async () => {
  const data = await getData();
  console.log(data);
};
