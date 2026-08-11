import React, { createContext, useContext, useState, useEffect } from 'react';
import { admin } from '../lib/api';

const CMSContext = createContext();

export const CMSProvider = ({ children }) => {
  const [cmsContent, setCmsContent] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchContent = async () => {
    try {
      const { data } = await admin.getCmsContent();
      setCmsContent(data.content || {});
    } catch (err) {
      console.error('CMS Context Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  return (
    <CMSContext.Provider value={{ cmsContent, loading, refreshCMS: fetchContent }}>
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
};
