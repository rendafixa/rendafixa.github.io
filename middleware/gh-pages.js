export default function (context) {
  const path = context.route.hash.replace('#!', '')
  if (path.length) {
    context.redirect(path)
  }
}
