import path from 'path'

const __filename = new URL(import.meta.url).pathname
const __dirname = path.dirname(__filename)

export default {
  entry: './src/public/javascript/index.js',
  output: {
    path: path.resolve(__dirname, 'src/public/javascript'),
    filename: 'bundle.js',
  },
}
