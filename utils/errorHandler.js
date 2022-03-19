export default function catchErrors(handler) {
  return async (req, res) =>
    handler(req, res).catch((error) => {
      console.error(error);
      return res.status(500).send('There was a server error');
    });
}
