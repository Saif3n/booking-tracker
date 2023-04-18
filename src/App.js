import './App.css';
import Input from './components/Input'
require('react-dom');
window.React2 = require('react');
console.log(window.React1 === window.React2);
function App() {
  return (
    <Input/>
  );
}

export default App;
