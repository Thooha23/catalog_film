import { useState, useEffect } from 'react';

function App() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Token Read Access dari file .env
  const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

  // Base URL untuk gambar dari TMDb
  const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${TMDB_TOKEN}`
    }
  };

  // Fungsi mengambil film populer (Default saat web dibuka)
  const fetchPopularMovies = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        'https://api.themoviedb.org/3/movie/popular?language=id-ID&page=1',
        options
      );
      const data = await response.json();
      if (data.results) {
        setMovies(data.results);
      } else {
        setError('Gagal memuat film populer.');
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi.');
    } finally {
      setLoading(false);
    }
  };

  // Fungsi mencari film berdasarkan kata kunci
  const searchMovies = async (query) => {
    if (!query.trim()) {
      fetchPopularMovies();
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=id-ID&page=1`,
        options
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        setMovies(data.results);
      } else {
        setMovies([]);
        setError('Film tidak ditemukan.');
      }
    } catch (err) {
      setError('Gagal mencari film.');
    } finally {
      setLoading(false);
    }
  };

  // Ambil film populer saat aplikasi pertama dibuka
  useEffect(() => {
    fetchPopularMovies();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    searchMovies(searchTerm);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#141414', color: '#fff', minHeight: '100vh', padding: '20px' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#E50914', margin: '0 0 10px 0' }}>🎬 Katalog Film TMDb (Franx)</h1>
        <p style={{ color: '#aaa' }}>Jelajahi film populer dan favoritmu</p>
        
        <form onSubmit={handleSearchSubmit} style={{ marginTop: '20px' }}>
          <input
            type="text"
            placeholder="Cari judul film..."
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
        {loading && <p style={{ textAlign: 'center' }}>Memuat data dari TMDb...</p>}

        {error && (
          <p style={{ textAlign: 'center', color: '#ff6b6b', backgroundColor: '#330000', padding: '10px', borderRadius: '5px' }}>
            ⚠️ {error}
          </p>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '20px',
          padding: '10px 0'
        }}>
          {!loading && movies.map((movie) => (
            <div
              key={movie.id}
              style={{
                backgroundColor: '#1f1f1f',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <img
                src={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster'}
                alt={movie.title}
                style={{ width: '100%', height: '330px', objectFit: 'cover' }}
              />
              <div style={{ padding: '15px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '1rem', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {movie.title}
                  </h3>
                  <p style={{ margin: '0 0 10px 0', color: '#888', fontSize: '0.85rem' }}>
                    {movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                  <span style={{
                    padding: '4px 8px',
                    backgroundColor: '#ffcc00',
                    color: '#000',
                    fontWeight: 'bold',
                    borderRadius: '4px',
                    fontSize: '0.8rem'
                  }}>
                    ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;