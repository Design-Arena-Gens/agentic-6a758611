'use client';

import { useState } from 'react';
import { enhance80sPrompt } from '@/lib/animation-dna';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [prompts, setPrompts] = useState<string[]>([]);
  const [enhanced, setEnhanced] = useState<Array<{original: string, enhanced: string}>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
      setEnhanced([]);
    }
  };

  const extractPromptsFromText = (text: string): string[] => {
    const lines = text.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 10 && !line.match(/^(page|\d+|chapter|section)/i));

    return lines.filter(line => {
      const hasContentWords = line.split(' ').length >= 3;
      const notJustNumbers = !line.match(/^\d+$/);
      return hasContentWords && notJustNumbers;
    });
  };

  const handleProcess = async () => {
    if (!file) {
      setError('Please select a PDF file');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/extract-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process PDF');
      }

      const data = await response.json();
      const extractedPrompts = extractPromptsFromText(data.text);
      setPrompts(extractedPrompts);

      // Enhance all prompts with random 80s animation DNA
      const enhancedPrompts = extractedPrompts.map(prompt => ({
        original: prompt,
        enhanced: enhance80sPrompt(prompt)
      }));

      setEnhanced(enhancedPrompts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadAsText = () => {
    const content = enhanced.map((item, idx) =>
      `===== PROMPT ${idx + 1} =====\nORIGINAL:\n${item.original}\n\n80s ANIMATION VERSION:\n${item.enhanced}\n\n`
    ).join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '80s-animation-prompts.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
      }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: '900',
          background: 'linear-gradient(45deg, #f06, #48f)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '10px',
          textAlign: 'center',
          textTransform: 'uppercase',
          letterSpacing: '2px'
        }}>
          80s Animation DNA Generator
        </h1>
        <p style={{
          textAlign: 'center',
          color: '#666',
          marginBottom: '40px',
          fontSize: '18px'
        }}>
          Transform your image prompts with radical 1980s anime aesthetics
        </p>

        <div style={{
          background: '#f8f9fa',
          borderRadius: '15px',
          padding: '30px',
          marginBottom: '30px',
          border: '3px dashed #667eea'
        }}>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            style={{
              display: 'block',
              width: '100%',
              padding: '15px',
              marginBottom: '20px',
              borderRadius: '10px',
              border: '2px solid #667eea',
              fontSize: '16px'
            }}
          />

          <button
            onClick={handleProcess}
            disabled={!file || loading}
            style={{
              width: '100%',
              padding: '18px',
              fontSize: '20px',
              fontWeight: '700',
              color: 'white',
              background: loading ? '#999' : 'linear-gradient(45deg, #f06, #48f)',
              border: 'none',
              borderRadius: '10px',
              cursor: loading ? 'not-allowed' : 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              transition: 'transform 0.2s',
            }}
            onMouseOver={(e) => !loading && (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {loading ? '⚡ Processing...' : '🎬 Generate 80s Animation Prompts'}
          </button>
        </div>

        {error && (
          <div style={{
            background: '#fee',
            color: '#c33',
            padding: '15px',
            borderRadius: '10px',
            marginBottom: '20px',
            border: '2px solid #c33'
          }}>
            {error}
          </div>
        )}

        {enhanced.length > 0 && (
          <>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#333'
              }}>
                ✨ {enhanced.length} Prompts Enhanced
              </h2>
              <button
                onClick={downloadAsText}
                style={{
                  padding: '12px 24px',
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '16px'
                }}
              >
                💾 Download All
              </button>
            </div>

            <div style={{ display: 'grid', gap: '25px' }}>
              {enhanced.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
                    borderRadius: '15px',
                    padding: '25px',
                    border: '2px solid #667eea'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '15px'
                  }}>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: '700',
                      color: '#667eea',
                      margin: 0
                    }}>
                      Prompt #{idx + 1}
                    </h3>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <div style={{
                      fontSize: '12px',
                      fontWeight: '700',
                      color: '#999',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}>
                      Original:
                    </div>
                    <div style={{
                      background: 'white',
                      padding: '15px',
                      borderRadius: '8px',
                      color: '#555',
                      fontSize: '15px',
                      lineHeight: '1.6',
                      border: '1px solid #ddd'
                    }}>
                      {item.original}
                    </div>
                  </div>

                  <div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px'
                    }}>
                      <div style={{
                        fontSize: '12px',
                        fontWeight: '700',
                        color: '#f06',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                      }}>
                        🎌 80s Animation Version:
                      </div>
                      <button
                        onClick={() => copyToClipboard(item.enhanced)}
                        style={{
                          padding: '6px 12px',
                          background: '#667eea',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}
                      >
                        📋 Copy
                      </button>
                    </div>
                    <div style={{
                      background: 'linear-gradient(135deg, #f0f 0%, #48f 100%)',
                      padding: '18px',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '15px',
                      lineHeight: '1.7',
                      fontWeight: '500',
                      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
                    }}>
                      {item.enhanced}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div style={{
        textAlign: 'center',
        marginTop: '30px',
        color: 'white',
        fontSize: '14px'
      }}>
        <p>🎨 Powered by 1980s Animation DNA Technology</p>
      </div>
    </div>
  );
}
