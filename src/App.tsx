import { Board } from './components/Board/Board';
import { ThemeProvider } from './contexts/ThemeContext';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <h1>Buscaminas</h1>
        <Board />
      </div>
    </ThemeProvider>
  );
}

export default App;
