// src/App.tsx
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Layout } from '@/components/layout/Layout';

// Pages
import { Dashboard } from '@/pages/Dashboard';
import { CharacterList } from '@/pages/CharacterList';
import { CreateCharacter } from '@/pages/CreateCharacter';
import { ItemTemplates } from '@/pages/ItemTemplates';
import { SpellTemplates } from '@/pages/SpellTemplates';
import { Profile } from '@/pages/Profile';

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/characters" element={<CharacterList />} />
            <Route path="/characters/new" element={<CreateCharacter />} />
            <Route path="/items" element={<ItemTemplates />} />
            <Route path="/spells" element={<SpellTemplates />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Layout>
      </Router>
      
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#374151',
            boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;