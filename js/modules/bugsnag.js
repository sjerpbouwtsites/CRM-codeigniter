export default function bugsnagInit() {
  if (!Bugsnag) {
    alert('Whitelist deze site in je blocking addons.')
  }

  Bugsnag.start({
    apiKey: 'f7bdee3404519d41a40c5aaffb7b894f'
  })

  throw new Error('random error');
}
