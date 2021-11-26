export default function bugsnagInit() {
  if (typeof Bugsnag === 'undefined') {
    alert('Whitelist deze site in je blocking addons.')
    document.body.innerHTML = `<h1>Whitelist deze site om verder te gaan.</h1>`;
    debugger;
  }

  Bugsnag.start({
    apiKey: 'f7bdee3404519d41a40c5aaffb7b894f'
  })

}
