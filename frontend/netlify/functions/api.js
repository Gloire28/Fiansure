const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const url = `https://fiansure.onrender.com/api${event.path.replace('/.netlify/functions/api', '')}`;
  const method = event.httpMethod;
  const body = event.body ? JSON.parse(event.body) : null;
  const headers = {
    'Content-Type': 'application/json',
    ...event.headers,
  };

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });

    const data = await response.text();
    return {
      statusCode: response.status,
      body: data,
      headers: {
        'Content-Type': 'application/json',
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erreur interne', details: error.message }),
    };
  }
};