export default function bugsnagInit() {
  if (typeof Bugsnag === 'undefined') {
    alert('Whitelist deze site in je blocking addons.')
    debugger;
  }

  Bugsnag.start({
    apiKey: 'f7bdee3404519d41a40c5aaffb7b894f'
  })

}
