import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/layout/Layout';
import Home_Page from './pages/Home_Page.tsx';
import Quiz_Page from './pages/Quiz_Page.tsx';
import Results_Pages from './pages/Results_Pages.tsx';
import Subjects_Pages from './pages/Subjects_Pages.tsx';
import debug from 'debug';
import SimpleChoiceSample from './pages/dev/SimpleChoiceSample';
import MultipleChoiceSample from './pages/dev/MultipleChoiceSample';
const log = debug('app:main');

const queryClient = new QueryClient();

function App() {
  log('Starting application...');
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home_Page />} />
            <Route path="/subjects" element={<Subjects_Pages />} />
            <Route path="/quiz/:seriesId" element={<Quiz_Page />} />
            <Route path="/results" element={<Results_Pages />} />
            <Route path="/dev/simple-choice-sample" element={<SimpleChoiceSample />} />
            <Route path="/dev/multiple-choice-sample" element={<MultipleChoiceSample />} />
          </Routes>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}

export default App; 