import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Results from './pages/Results';  
import Subjects from './pages/Subjects';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/quiz/:seriesId" element={<Quiz />} />
            <Route path="/results" element={<Results />} />
          </Routes>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}

export default App; 