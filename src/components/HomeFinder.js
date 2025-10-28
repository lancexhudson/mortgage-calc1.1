// src/components/HomeFinder.js
import React, { useState } from 'react';
import { formatCurrency } from '../utils/currency';
import '../styles/HomeFinder.css';

const HomeFinder = ({ formData }) => {
  const [zipCode, setZipCode] = useState('');
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchHomes = async () => {
    if (!zipCode || zipCode.length < 5) {
      setError('Please enter a valid 5-digit ZIP code.');
      return;
    }

    setLoading(true);
    setError('');
    setHomes([]); // Clear previous results

    try {
      const response = await fetch(
        `https://zillow56.p.rapidapi.com/search?location=${zipCode}&home_type=Houses`,
        {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key':
              process.env.REACT_APP_RAPIDAPI_KEY ||
              'YOUR_PUBLIC_FALLBACK_KEY_HERE', // Fallback for prod
            'X-RapidAPI-Host': 'zillow56.p.rapidapi.com',
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      // Map API response to our home structure (adapt based on actual fields)
      const mappedHomes = (data.results || []).slice(0, 6).map((home) => ({
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

  return (
    <div>
      <div className="affordability-banner">
        <h2>Your Budget</h2>
        <p className="big-price">{formatCurrency(formData.affordableHome)}</p>
        <p>Max home price</p>
      </div>

      <div className="card">
        <form onSubmit={handleSearch}>
          <label className="label">Search Homes by ZIP Code</label>
          <div className="search-bar">
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value.replace(/\D/g, ''))} // Only digits
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

        {homes.length > 0 && (
          <div className="results-header">
            <h3 className="text-lg font-semibold mb-4">
              Homes for Sale in {zipCode}
            </h3>
            <p className="text-sm text-gray-500">
              Showing {homes.length} homes (filtered to your budget)
            </p>
          </div>
        )}

        <div className="home-grid">
          {homes.map((home) => (
            <HomeCard
              key={home.id}
              home={home}
              maxPrice={formData.affordableHome}
            />
          ))}
          {loading && (
            <div className="loading col-span-full">
              <p>Loading homes... (Real data from Zillow)</p>
            </div>
          )}
          {homes.length === 0 && !loading && zipCode && (
            <p className="no-results col-span-full text-center text-gray-500">
              No homes found in {zipCode}. Try another ZIP!
            </p>
          )}
        </div>
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
