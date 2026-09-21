import { useState, useEffect } from 'react';

function App() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('Avengers'); // Pencarian awal
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Mengambil API Key dari file .env
  const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

  const searchMovies = async (title) => {
    if (!title.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://www.omdbapi.com/?s=${title}&apikey=${API_KEY}`
      );
      const data = await response.json();

      if (data.Response === 'True') {
        setMovies(data.Search);
      } else {
        setMovies([]);
        setError(data.Error || 'Film tidak ditemukan!');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat mengambil data.');
    } finally {
      setLoading(false);
    }
  };

  // Efek samping: Jalankan pencarian default saat pertama kali aplikasi dibuka
  useEffect(() => {
    searchMovies(searchTerm);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    searchMovies(searchTerm);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#141414', color: '#fff', minHeight: '100vh', padding: '20px' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#E50914', margin: '0 0 10px 0' }}>🎬 Katalog Film (Franx)</h1>
        <p style={{ color: '#aaa' }}>Cari dan temukan film favoritmu</p>
        
        <form onSubmit={handleSearchSubmit} style={{ marginTop: '20px' }}>
          <input
            type="text"
            placeholder="Cari judul film... (misal: Batman, Naruto)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '12px 16px',
              width: '60%',
              maxWidth: '400px',
              borderRadius: '4px 0 0 4px',
              border: 'none',
              outline: 'none',
              fontSize: '1rem'
            }}
          />
          <button
            type="submit"
            style={{
              padding: '12px 20px',
              backgroundColor: '#E50914',
              color: 'white',
              border: 'none',
              borderRadius: '0 4px 4px 0',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            Cari
          </button>
        </form>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {loading && <p style={{ textAlign: 'center' }}>Memuat daftar film...</p>}

        {error && (
          <p style={{ textAlign: 'center', color: '#ff6b6b', backgroundColor: '#330000', padding: '10px', borderRadius: '5px' }}>
            ⚠️ {error}
          </p>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '20px',
          padding: '10px 0'
        }}>
          {!loading && movies.map((movie) => (
            <div
              key={movie.imdbID}
              style={{
                backgroundColor: '#1f1f1f',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                transition: 'transform 0.2s',
              }}
            >
              <img
                src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'}
                alt={movie.Title}
                style={{ width: '100%', height: '300px', objectFit: 'cover' }}
              />
              <div style={{ padding: '15px' }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {movie.Title}
                </h3>
                <p style={{ margin: 0, color: '#888', fontSize: '0.9rem' }}>Tahun: {movie.Year}</p>
                <span style={{
                  display: 'inline-block',
                  marginTop: '8px',
                  padding: '4px 8px',
                  backgroundColor: '#333',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  color: '#ffcc00'
                }}>
                  {movie.Type.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;