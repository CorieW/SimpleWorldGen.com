import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.scss';
import Worlds from './views/Worlds/Worlds';
import Editor from './views/Editor/Editor';
import Editor2 from './views/Editor2/Editor2';
import Editor3 from './views/Editor3/Editor3';
import { ReactElement } from 'react';

function App(): ReactElement {
  return (
    <div id='app-container'>
      <Router>
        <Routes>
          <Route path='/' element={<Worlds />} />
          <Route path='/editor' element={<Editor />} />
          <Route path='/editor2' element={<Editor2 />} />
          <Route path='/editor3' element={<Editor3 />} />
          <Route path='*' element={<Worlds />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
