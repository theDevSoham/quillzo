const responseSender = (
  responseObject: {
    message: string;
    [key: string]: any;
  },
  status: number,
  headers?: Record<string, string>
): Response => {
  return new Response(JSON.stringify(responseObject), {
    headers: headers || {
      "Content-Type": "application/json",
    },
    status,
  });
};

export default responseSender;
