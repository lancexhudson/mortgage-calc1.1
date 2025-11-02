// src/components/HomeFinder.js
import React, { useState } from 'react';
import { formatCurrency } from '../utils/currency';
import '../styles/HomeFinder.css';

const HomeFinder = ({ formData }) => {
  const [zipCode, setZipCode] = useState('');
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Calculate budget range (±10%)
  const affordableHome = formData.affordableHome || 0;
  const lowerBound = Math.round(affordableHome * 0.9);
  const upperBound = Math.round(affordableHome * 1.1);

  const searchHomes = async () => {
    if (!zipCode || zipCode.length < 5) {
      setError('Please enter a valid 5-digit ZIP code.');
      return;
    }

    if (affordableHome <= 0) {
      setError('Please complete the affordability calculation first.');
      return;
    }

    setLoading(true);
    setError('');
    setHomes([]);

    try {
      // Use API price filtering!
      const url = new URL('https://zillow56.p.rapidapi.com/search');
      url.searchParams.append('location', zipCode);
      url.searchParams.append('home_type', 'Houses');
      url.searchParams.append('price_min', lowerBound);
      url.searchParams.append('price_max', upperBound);
      url.searchParams.append('page', '1');
      url.searchParams.append('limit', '12');

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key':
            process.env.REACT_APP_RAPIDAPI_KEY || 'YOUR_FALLBACK_KEY',
          'X-RapidAPI-Host': 'zillow56.p.rapidapi.com',
        },
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();

      const mappedHomes = (data.results || []).map((home) => ({
        id: home.zpid || Math.random(),
        price: home.price || 0,
        address: `${home.streetAddress || ''}, ${home.city || ''}, ${
          home.state || ''
        } ${home.zipcode || ''}`.trim(),
        beds: home.bedrooms || 0,
        baths: home.bathrooms || 0,
        sqft: home.livingArea || 0,
        img:
          home.imageUrl ||
          home.imgSrc ||
          'https://via.placeholder.com/300x200?text=Home+Image',
      }));

      setHomes(mappedHomes);
    } catch (err) {
      setError(`Oops! Couldn't fetch homes. Try another ZIP. (${err.message})`);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchHomes();
  };

  const zillowUrl = zipCode
    ? `https://www.zillow.com/homes/${zipCode}_rb/`
    : 'https://www.zillow.com';

  return (
    <div>
      {/* Budget Banner */}
      <div className="affordability-banner">
        <h2>Your Budget Range</h2>
        <p className="big-price">
          {formatCurrency(lowerBound)} – {formatCurrency(upperBound)}
        </p>
        <p className="small">
          Homes within ±10% of {formatCurrency(affordableHome)}
        </p>
      </div>

      {/* Search Card */}
      <div className="card">
        <form onSubmit={handleSearch}>
          <label className="label">Search Homes by ZIP Code</label>
          <div className="search-bar">
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value.replace(/\D/g, ''))}
              placeholder="e.g., 78701"
              className="input"
              maxLength={5}
            />
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Searching...' : 'Search Homes'}
            </button>
          </div>
        </form>

        {error && <p className="error mt-3">{error}</p>}

        {/* Results Header */}
        {homes.length > 0 && (
          <div className="results-header">
            <h3 className="text-lg font-semibold mb-4">
              Homes in {zipCode} (Within Budget)
            </h3>
            <p className="text-sm text-gray-500">
              Showing {homes.length} homes in your range
            </p>
          </div>
        )}

        <div className="home-grid">
          {homes.map((home) => (
            <HomeCard key={home.id} home={home} maxPrice={affordableHome} />
          ))}
          {loading && (
            <div className="loading col-span-full">
              <p>Loading homes from Zillow...</p>
            </div>
          )}
          {homes.length === 0 && !loading && zipCode && (
            <p className="no-results col-span-full text-center text-gray-500">
              No homes found in {zipCode} within your budget range. Try another
              ZIP!
            </p>
          )}
        </div>

        {/* Zillow Link */}
        {homes.length > 0 && (
          <div className="zillow-link-container">
            <a
              href={zillowUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="zillow-link"
            >
              Go to Zillow.com
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

const HomeCard = ({ home, maxPrice }) => {
  const isAffordable = home.price <= maxPrice;

  return (
    <div className={`home-card ${!isAffordable ? 'over-budget' : ''}`}>
      <img src={home.img} alt={home.address} className="home-image" />
      <div className="home-info">
        <p className="price">{formatCurrency(home.price)}</p>
        <p className="address">{home.address}</p>
        <p className="details">
          {home.beds} bed • {home.baths} bath • {home.sqft} sqft
        </p>
        <span className={`tag ${isAffordable ? 'affordable' : 'over'}`}>
          {isAffordable ? 'Within Budget' : 'Over Budget'}
        </span>
      </div>
    </div>
  );
};

export default HomeFinder;
