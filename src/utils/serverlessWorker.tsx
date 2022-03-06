const WORKER_LINK = 'https://presale.alps-finance.workers.dev';

const recordPresale = (address: string, amount: string) => {
  const raw = JSON.stringify({
    address,
    amount: Number(amount),
  });
  const requestOptions: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: raw
  };
  fetch(`${WORKER_LINK}/record`, requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log(error));
};

export default recordPresale;
