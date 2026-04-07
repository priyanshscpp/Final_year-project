
(async () => {
  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: 'service_t1s7fkk',
        template_id: 'template_e8p60xi',
        user_id: 'pX1LnRKITf-jTnpjQ',
        template_params: {
          to_name: 'Vineet',
          to_email: 'vineet@example.com',
          report_name: 'Test',
          message: 'Test message'
        }
      })
    });
    const text = await response.text();
    console.log('Status Base:', response.status);
    console.log('Response Base:', text);
  } catch (err) {
    console.error('Fetch error:', err);
  }
})();
